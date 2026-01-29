// This should only be used specifically for canonical links. If they are just generated raw on
// ssr layer they initially have http when the page loads, and seo tools crawl them before the
// js layer has a chance to hydrate them with https on the actual page. This forces them to be
// https when tools encounter them

const forceHttps = (input: string): string => {
    if (input) {
        return input.replace('http://', 'https://');
    }

    return '';
};

export default forceHttps;
