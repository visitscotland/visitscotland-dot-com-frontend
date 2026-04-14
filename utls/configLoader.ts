import useConfigStore from '~/stores/configStore.ts';

function loadPageConfig(pageModel: any): void {
    const configStore = useConfigStore() as any;

    const getContent = (ref: any) => {
        if (!ref?.$ref) return ref;
        return pageModel.page?.[ref.$ref.split('/').pop()];
    };

    const rootComponent = getContent(pageModel.root);
    const rootChildren = (rootComponent?.children || []).map(getContent);
    const mainComponent = rootChildren.find((c: any) => c?.name === 'main');

    if (!mainComponent?.models) {
        return;
    }

    const models = mainComponent.models;
    const pageConfig = models.pageConfiguration || {
    };

    const modelFieldMap = {
        labels: 'labels',
        'site-id': 'activeSite',
        psrWidget: 'productSearch',
        otyml: 'otyml',
        pageItems: 'pageItems',
        heroImage: 'heroImage',
        newsletterSignpost: 'newsletterSignpost',
        pageIntro: 'pageIntro',
        gtm: 'gtm',
        metadata: 'pageMetaData',
        'main-map-path': 'mainMapPath',
        heroVideo: 'heroVideo',
    };

    const modelBoolFlags = {
        videoHeader: 'isLocalVideoheader',
    };

    const pageConfigFieldMap = {
        'global-search.path': 'globalSearchPath',
        'cludo.customer-id': 'cludoCustomerId',
        'cludo.experience-id': 'cludoExperienceId',
        'cludo.engine-id': 'cludoEngineId',
        language: 'cludoLanguage',
        'events-endpoint': 'eventsApiUrl',
        cludoApiOperator: 'cludoApiOperator',
        mapsAPI: 'googleMapApiKey',
        'feature.favourites.url': 'featureFavouritesUrl',
        'feature.favourites.endpoint': 'featureFavouritesEndpoint',
    };

    const pageConfigBoolFlags = {
        mainMapPage: 'isMainMapPageFlag',
        'feature.hero-section.enable': 'enableHeroSection',
        'allow-favourite': 'allowFavourite',
        'feature.favourites.enable': 'featureFavouritesEnabled',
        'dms-based': 'searchDmsBased',
        'is-favourites-page': 'isFavouritesPage',
        searchWidget: 'showSearchWidget',
    };

    for (const [src, target] of Object.entries(modelFieldMap)) {
        if (models[src] !== undefined) {
            configStore[target] = models[src];
        }
    }

    for (const [src, target] of Object.entries(modelBoolFlags)) {
        if (models[src] !== undefined) {
            configStore[target] = models[src];
        }
    }

    for (const [src, target] of Object.entries(pageConfigFieldMap)) {
        if (pageConfig[src] !== undefined) {
            configStore[target] = pageConfig[src];
        }
    }

    for (const [src, target] of Object.entries(pageConfigBoolFlags)) {
        if (pageConfig[src] !== undefined) {
            configStore[target] = models[src];
        }
    }

    if (pageConfig.language) {
        configStore.locale = pageConfig.language;
        configStore.langString = pageConfig.language;
    }
}

export default loadPageConfig;