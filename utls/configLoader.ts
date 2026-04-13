import useConfigStore from '~/stores/configStore.ts';

function loadPageConfig(pageModel: any): void {
    const configStore = useConfigStore();

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

    if (models.labels) {
        configStore.labels = models.labels;
    }

    if (models['site-id']) {
        configStore.activeSite = models['site-id'];
    }

    if (models.psrWidget) {
        configStore.productSearch = models.psrWidget;
    }

    if (models.otyml) {
        configStore.otyml = models.otyml;
    }

    if (models.pageItems) {
        configStore.pageItems = models.pageItems;
    }

    if (models.heroImage) {
        configStore.heroImage = models.heroImage;
    }

    if (models.newsletterSignpost) {
        configStore.newsletterSignpost = models.newsletterSignpost;
    }

    if (models.pageIntro) {
        configStore.pageIntro = models.pageIntro;
    }

    if (models.gtm) {
        configStore.gtm = models.gtm;
    }

    if (models.metadata) {
        configStore.pageMetaData = models.metadata;
    }

    if (models['main-map-path']) {
        configStore.mainMapPath = models['main-map-path'];
    }

    if (models.heroVideo) {
        configStore.heroVideo = models.heroVideo;
    }

    if (models.videoHeader) {
        configStore.isLocalVideoheader = true;
    }

    if (models.pageConfiguration) {
        const pageConfig = models.pageConfiguration;

        if (pageConfig['global-search.path']) {
            configStore.globalSearchPath = pageConfig['global-search.path'];
        }

        if (pageConfig['cludo.customer-id']) {
            configStore.cludoCustomerId = pageConfig['cludo.customer-id'];
        }

        if (pageConfig['cludo.experience-id']) {
            configStore.cludoExperienceId = pageConfig['cludo.experience-id'];
        }

        if (pageConfig['cludo.engine-id']) {
            configStore.cludoEngineId = pageConfig['cludo.engine-id'];
        }

        if (pageConfig.language) {
            configStore.cludoLanguage = pageConfig.language;
            configStore.locale = pageConfig.language;
        }

        if (pageConfig['events-endpoint']) {
            configStore.eventsApiUrl = pageConfig['events-endpoint'];
        }

        if (pageConfig.cludoApiOperator) {
            configStore.cludoApiOperator = pageConfig.cludoApiOperator;
        }

        if (pageConfig.mapsAPI) {
            configStore.googleMapApiKey = pageConfig.mapsAPI;
        }

        if (pageConfig.mainMapPage) {
            configStore.isMainMapPageFlag = true;
        }

        if (pageConfig['feature.hero-section.enable']) {
            configStore.enableHeroSection = true;
        }

        if (pageConfig['allow-favourite']) {
            configStore.allowFavourite = true;
        }

        if (pageConfig['feature.favourites.enable']) {
            configStore.featureFavouritesEnabled = true;
        }

        if (pageConfig['feature.favourites.url']) {
            configStore.featureFavouritesUrl = pageConfig['feature.favourites.url'];
        }

        if (pageConfig['feature.favourites.endpoint']) {
            configStore.featureFavouritesEndpoint = pageConfig['feature.favourites.endpoint'];
        }

        if (pageConfig['dms-based']) {
            configStore.searchDmsBased = true;
        }

        if (pageConfig['is-favourites-page']) {
            configStore.isFavouritesPage = true;
        }

        if (pageConfig.searchWidget) {
            configStore.showSearchWidget = true;
        }
    }
}

export default loadPageConfig;