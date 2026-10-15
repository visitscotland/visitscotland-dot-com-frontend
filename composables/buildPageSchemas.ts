import type { Page } from '@bloomreach/spa-sdk';

import type {
    WithContext,
    FAQPage,
    Question,
    BlogPosting,
    Thing,
    ImageObject,
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
    theme?: string;
    title?: string;
    blog?: { publishDate?: number | string } | null;
    heroImage?: { $ref?: Parameters<Page['getContent']>[0] };
};

type HeroContext = {
    pageName: string;
    isMainMapPage?: boolean;
    isFavouritesPage?: boolean;
    isSearchResultsPage?: boolean;
};

type HeroImage = {
    contentUrl: string;
    credit?: string;
};

export const hasVisibleHeroImage = (documentData: DocumentData | undefined, context?: HeroContext): boolean => {
    if (context?.pageName === 'destination-page') {
        return true;
    }
    if (!context || !['general-page', 'pagenotfound'].includes(context.pageName)) {
        return false;
    }
    if (context.isMainMapPage || context.isFavouritesPage || documentData?.theme === 'Simple') {
        return false;
    }
    return documentData?.theme === 'Top-Level' || !context.isSearchResultsPage;
};

const resolveHeroImage = (documentData: DocumentData | undefined, page: Page): HeroImage | undefined => {
    if (!documentData?.heroImage?.$ref) {
        return undefined;
    }
    const image = page.getContent<{
        model?: { data?: { credit?: string } };
        getOriginal: () => { getUrl: () => string };
            }>(documentData.heroImage.$ref);
    const contentUrl = image?.getOriginal()?.getUrl();
    return contentUrl ? {
        contentUrl,
        credit: image?.model?.data?.credit?.trim(),
    } : undefined;
};

const buildHeroImageSchema = (image: HeroImage | undefined): WithContext<ImageObject> | undefined => {
    if (!image) {
        return undefined;
    }
    const schema: WithContext<ImageObject> = {
        '@context': 'https://schema.org',
        '@type': 'ImageObject',
        contentUrl: image.contentUrl,
    };
    if (image.credit) {
        schema.creditText = image.credit;
        schema.creator = {
            '@type': 'Organization',
            name: image.credit,
        };
        schema.copyrightNotice = image.credit;
    }
    return schema;
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
    heroImage: HeroImage | undefined,
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

    if (heroImage) {
        schema.image = [heroImage.contentUrl];
    }

    return schema;
};

/** Build page schemas together to account for multiple of the same module type. */
const buildPageSchemas = (
    pageItems: PageItem[] | undefined,
    page: Page,
    canonicalUrl: string,
    documentData?: DocumentData,
    heroContext?: HeroContext,
): WithContext<Thing>[] => {
    const schemas: WithContext<Thing>[] = [];
    const faqSchema = buildFaqSchema(pageItems ?? [], page, canonicalUrl);
    const heroImage = resolveHeroImage(documentData, page);
    const blogSchema = buildBlogPostingSchema(documentData, heroImage, canonicalUrl);
    const imageSchema = hasVisibleHeroImage(documentData, heroContext) ? buildHeroImageSchema(heroImage) : undefined;

    if (faqSchema) {
        schemas.push(faqSchema);
    }
    if (blogSchema) {
        schemas.push(blogSchema);
    }
    if (imageSchema) {
        schemas.push(imageSchema);
    }

    return schemas;
};

export default buildPageSchemas;
