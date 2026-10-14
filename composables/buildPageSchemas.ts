import type { Page } from '@bloomreach/spa-sdk';

import type {
    WithContext,
    FAQPage,
    Question,
    BlogPosting,
    Thing,
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

type DocumentData = {
    title?: string;
    blog?: { publishDate?: number | string } | null;
    heroImage?: { $ref?: Parameters<Page['getContent']>[0] };
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

const buildBlogPostingSchema = (
    documentData: DocumentData | undefined,
    page: Page,
    canonicalUrl: string,
): WithContext<BlogPosting> | undefined => {
    if (!documentData?.blog) {
        return undefined;
    }

    const organizationId = 'https://www.visitscotland.com/#organization';
    const schema: WithContext<BlogPosting> = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        '@id': `${canonicalUrl.split('#')[0]}#blogposting`,
        headline: documentData.title,
        author: {
            '@type': 'Organization',
            '@id': organizationId,
        },
        publisher: {
            '@id': organizationId,
        },
    };

    const { publishDate } = documentData.blog;
    if (publishDate !== undefined && publishDate !== null) {
        const published = new Date(publishDate);
        if (!Number.isNaN(published.getTime())) {
            schema.datePublished = published.toISOString();
        }
    }

    if (documentData.heroImage?.$ref) {
        const image = page.getContent<{ getOriginal: () => { getUrl: () => string } }>(documentData.heroImage.$ref);
        const imageSrc = image?.getOriginal()?.getUrl();
        if (imageSrc) {
            schema.image = [imageSrc];
        }
    }

    return schema;
};

/** Build page schemas together to account for multiple of the same module type. */
const buildPageSchemas = (
    pageItems: PageItem[] | undefined,
    page: Page,
    canonicalUrl: string,
    documentData?: DocumentData,
): WithContext<Thing>[] => {
    const schemas: WithContext<Thing>[] = [];
    const faqSchema = buildFaqSchema(pageItems ?? [], page, canonicalUrl);
    const blogSchema = buildBlogPostingSchema(documentData, page, canonicalUrl);

    if (faqSchema) {
        schemas.push(faqSchema);
    }
    if (blogSchema) {
        schemas.push(blogSchema);
    }

    return schemas;
};

export default buildPageSchemas;
