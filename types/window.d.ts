export { };

declare global {
    interface Window {
        bypassCookiesRequired?: boolean;
        bypassCookiesLoaded?: boolean;
        dataLayer?: array;
    };

    const CookieControl: {
        getCategoryConsent: (category) => boolean;
    };
};
