import { ref, computed } from 'vue';
import useDataLayerNuxtStore from '~/stores/dataLayerNuxt.ts';
import checkVendorLibrary from '~/utls/check-vendor-library.ts';

import {
    siteSearchOpenTemplate,
    siteSearchUsageTemplate,
    siteSearchClickTemplate,
    siteSearchCloseTemplate,
} from '~/utls/date-layer-template.ts';

/**
 * Vue Composable for Data Layer interactions (e.g., Google Tag Manager).
 * Replaces the dataLayerMixin for custom components. This will be removed to a wrapper
 * project along with the components.
 */
export default function dataLayerComposable() {
    const dataLayerStore = useDataLayerNuxtStore();

    const dataLayerLoadConfirmed = ref(false);

    const pageUrl = computed(() => dataLayerStore.pageUrl);

    /**
     * Matches values to a given template, filling missing fields with undefined.
     * @param {Array<string>} template - The array of keys the data layer event requires.
     * @param {Object} values - The object of values to match against the template.
     * @returns {Object} An object ready to be pushed to the data-layer.
     */
    function templateFiller(template: string[], values: any) {
        const obj: any = {
        };

        template.forEach((element) => {
            obj[element] = values[element] || undefined;

            if (element === 'language' && obj[element] === undefined) {
                obj[element] = values.site_language || undefined;
            }
        });

        return obj;
    }

    /**
     * Returns the current ISO 8601 formatted timestamp.
     * @returns {string} ISO date string.
     */
    function returnIsoDate() {
        const date = new Date(Date.now());
        return date.toISOString();
    }

    /**
     * Compiles the full data layer object by merging GTMData from the store
     * and the specific event values, and adds the hit_timestamp.
     * @param {Object} templateValues - Event-specific values.
     * @returns {Object} The complete data layer object for the event.
     */
    function compileFullTemplate(templateValues: any) {
        const storeValues = dataLayerStore.GTMData;
        const fullTemplate = {
            ...storeValues,
            ...templateValues,
        };

        fullTemplate.hit_timestamp = returnIsoDate();

        return fullTemplate;
    }

    /**
     * Pushes an object to the global window.dataLayer array, ensuring the library is loaded.
     * @param {Object} object - The data layer object to push.
     */
    function pushToDataLayer(object: any) {
        if (!dataLayerLoadConfirmed.value) {
            checkVendorLibrary('dataLayer', () => {
                // Mutate the ref's value
                dataLayerLoadConfirmed.value = true;
                window.dataLayer.push(object);
            });
        } else {
            window.dataLayer.push(object);
        }
    }

    /**
     * Creates and pushes a specific data layer event object.
     * @param {string} type - The type of event (e.g., 'siteSearchOpenEvent').
     * @param {Object} event - The event data specific to the type.
     */
    function createDataLayerObject(type: string, event: any) {
        let eventName;
        let templateValues;
        let fullTemplate;
        let dataLayerData;

        switch (type) {
        case 'siteSearchOpenEvent':
            eventName = 'site_search_open';
            templateValues = {
                event: eventName,
                referrer_page: event.referrer_page,
            };
            fullTemplate = compileFullTemplate(templateValues);
            dataLayerData = templateFiller(siteSearchOpenTemplate, fullTemplate);
            break;

        case 'siteSearchUsageEvent':
            eventName = 'site_search_event';
            templateValues = {
                event: eventName,
                search_query: event.search_query,
                query_input: event.query_input,
                results_count: event.results_count,
                search_usage_index: event.search_usage_index,
                search_type: event.search_type,
                search_origin: event.search_origin || 'results_page',
                interaction_type: 'search_input',
            };
            fullTemplate = compileFullTemplate(templateValues);
            dataLayerData = templateFiller(siteSearchUsageTemplate, fullTemplate);
            break;

        case 'siteSearchClickEvent':
            eventName = 'site_search_click';
            templateValues = {
                event: eventName,
                interaction_type: event.interaction_type,
                search_query: event.search_query,
                query_input: event.query_input,
                page_number: event.page_number,
                page_navigation_direction: event.page_navigation_direction,
                click_text: event.click_text,
                click_url: event.click_url,
                click_category: event.click_category,
                search_usage_index: event.search_usage_index,
                results_count: event.results_count,
                facet_status: event.facet_status,
                search_type: event.search_type,
                search_origin: event.search_origin || 'results_page',
            };
            fullTemplate = compileFullTemplate(templateValues);
            dataLayerData = templateFiller(siteSearchClickTemplate, fullTemplate);
            break;

        case 'siteSearchCloseEvent':
            eventName = 'site_search_close';
            templateValues = {
                event: eventName,
                search_usage_index: event.search_usage_index,
                search_query: event.search_query,
                query_input: event.query_input,
                page_number: event.page_number,
                results_count: event.results_count,
            };
            fullTemplate = compileFullTemplate(templateValues);
            dataLayerData = templateFiller(siteSearchCloseTemplate, fullTemplate);
            break;

        default:
        }

        if (dataLayerData) {
            pushToDataLayer(dataLayerData);
        }
    }

    return {
        pageUrl,
        createDataLayerObject,
        templateFiller,
        compileFullTemplate,
        returnIsoDate,
        pushToDataLayer,
        dataLayerStore,
    };
}
