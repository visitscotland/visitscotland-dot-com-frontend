import type { Page } from '@bloomreach/spa-sdk';
import useConfigStore from '~/stores/configStore.ts';
import { useFavourites } from '~/stores/favouritesStore.ts';

/** Apply the SDK's loaded page before any page sections render. */
export default function useBrPageConfiguration() {
    const configStore = useConfigStore();
    const favourites = useFavourites();

    return (page: Page) => {
        const models = page.getComponent('main')?.getModels() ?? {
        };

        const configuration = models.pageConfiguration ?? {
        };

        const rootModels = page.getComponent().getModels();

        const locale = configuration.language ?? 'en';

        const languages: Record<string, string> = {
            en: 'en-gb',
            fr: 'fr-fr',
            nl: 'nl-nl',
            de: 'de-de',
            it: 'it-it',
            es: 'es-es',
        };

        configStore.$patch((state) => Object.assign(state, {
            activeSite: models['site-id'] ?? '',
            otyml: models.otyml ?? null,
            pageItems: models.pageItems ?? [],
            heroImage: models.heroImage ?? null,
            labels: models.labels ?? {
            },
            newsletterSignpost: models.newsletterSignpost ?? {
            },
            pageIntro: models.pageIntro ?? {
            },
            gtm: models.gtm ?? null,
            pageMetaData: models.metadata ?? {
            },
            globalSearchPath: configuration['global-search.path'] ?? '',
            cludoCustomerId: configuration['cludo.customer-id'] ?? '',
            cludoExperienceId: configuration['cludo.experience-id'] ?? '',
            cludoEngineId: configuration['cludo.engine-id'] ?? '',
            cludoLanguage: locale,
            eventsApiUrl: configuration['events-endpoint'] ?? '',
            cludoApiOperator: configuration.cludoApiOperator ?? 'or',
            googleMapApiKey: configuration.mapsAPI ?? '',
            isMainMapPageFlag: configuration.mainMapPage ?? false,
            enableHeroSection: configuration['feature.hero-section.enable'] ?? false,
            mainMapPath: configuration['main-map-path'] ?? '',
            heroVideo: models.heroVideo ?? null,
            isLocalVideoheader: configuration['hero-ambient-video'] ?? false,
            searchDmsBased: configuration['dms-based'] ?? false,
            showSearchWidget: configuration.searchWidget ?? false,
            searchFilters: configuration.filters ?? {
            },
            pageDocument: rootModels.document ?? null,
            locale,
            langString: languages[locale] ?? 'en-gb',
            isHome: rootModels.isHome ?? false,
        }));

        favourites.$patch({
            isDisplayPage: configuration['is-favourites-page'] ?? false,
            isSharePage: configuration['is-favourites-share-page'] ?? false,
            pageEnabled: configuration['allow-favourite'] ?? false,
            featureEnabled: configuration['feature.favourites.enable'] ?? false,
            displaySavedUrl: configuration['feature.favourites.url'] ?? '',
            brGetPagesEndpoint: configuration['feature.favourites.endpoint'] ?? '',
            serviceUrl: configuration['feature.favourites.share-service-base-url'] ?? '',
            displaySharedUrl: configuration['feature.favourites.share-url'] ?? '',
        });
    };
}

