import type { Page } from '@bloomreach/spa-sdk';

import type {
    WithContext,
    FAQPage,
    Question,
} from 'schema-dts';

import { decode } from 'html-entities';

type PageItem = {
    type?: string;
    hippoBean?: Parameters<Page['getContent']>[0];
    sections?: {
        heading?: string;
        copy?: { value?: string };
    }[];
};

const plainText = (html: string): string => decode(html
    .replace(/<\s*br\b[^>]*>|<\/\s*(?:p|div|li|h[1-6]|tr)\s*>/gi, ' ')
    .replace(/<[^>]*>/g, ''))
    .replace(/\s+/g, ' ')
    .trim();

const buildFaqSchema = (
    pageItems: PageItem[],
    page: Page,
    canonicalUrl: string,
): WithContext<FAQPage> | undefined => {
    const questions: Question[] = [];

    for (const module of pageItems) {
        if (module.type !== 'ArticleModule' || !module.hippoBean) {
            continue;
        }

        const content = page.getContent<{ model?: { data?: { theme?: string } } }>(module.hippoBean);
        if (content?.model?.data?.theme !== 'accordion') {
            continue;
        }

        for (const item of module.sections ?? []) {
            const name = item.heading?.trim();
            const text = plainText(item.copy?.value ?? '');
            if (!name || !text) {
                continue;
            }

            questions.push({
                '@type': 'Question',
                name,
                acceptedAnswer: {
                    '@type': 'Answer',
                    text,
                },
            });
        }
    }

    if (!questions.length) {
        return undefined;
    }

    return {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        '@id': `${canonicalUrl.split('#')[0]}#faq`,
        mainEntity: questions,
    };
};

/** Build module-dependent schemas together to account for multiple of the same module type. */
const buildPageSchemas = (pageItems: PageItem[] | undefined, page: Page, canonicalUrl: string) => {
    const faqSchema = buildFaqSchema(pageItems ?? [], page, canonicalUrl);

    return faqSchema ? [faqSchema] : [];
};

export default buildPageSchemas;
