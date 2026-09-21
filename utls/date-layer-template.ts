const siteSearchOpenTemplate = [
    'event',
    'referrer_page',
];

const siteSearchUsageTemplate = [
    'event',
    'search_query',
    'query_input',
    'search_category',
    'results_count',
    'search_usage_index',
    'search_type',
    'interaction_type',
    'search_origin',
];

const siteSearchClickTemplate = [
    'event',
    'interaction_type',
    'search_query',
    'search_category',
    'query_input',
    'page_number',
    'page_navigation_direction',
    'click_text',
    'click_url',
    'click_category',
    'search_usage_index',
    'results_count',
    'facet_status',
    'search_type',
    'search_origin',
];

const siteSearchCloseTemplate = [
    'event',
    'search_usage_index',
    'search_query',
    'query_input',
    'page_number',
    'results_count',
];

const favouriteAddTemplate = [
    'event',
    'content_title',
    'total_favourites',
    'interaction_timestamp_ms',
];

const favouriteRemoveTemplate = [
    'event',
    'content_title',
    'total_favourites',
    'interaction_timestamp_ms',
];

const favouritesPageViewTemplate = [
    'event',
    'favourite_owner',
    'total_favourites',
    'shared_list_id',
];

const favouritesClickTemplate = [
    'event',
    'list_position',
    'total_favourites',
    'interaction_timestamp_ms',
];

const favouritesShareTemplate = [
    'event',
    'favourite_owner',
    'total_favourites',
    'shared_list_id',
];

const googleMapSearchTemplate = [
    'event',
    'search_query',
    'search_map_location',
    'search_results_count',
    'search_usage_index',
];

const googleMapFilterInteractionTemplate = [
    'event',
    'filter_type',
    'search_map_location',
    'filter_selection',
    'results_count',
    'filter_usage_index',
];

const googleMapTimeToFirstInteractionTemplate = [
    'event',
    'time_to_first_interaction_ms',
    'first_interaction_type',
];

const googleMapInteractionTemplate = [
    'event',
    'interaction_type',
    'search_query',
    'map_location',
    'visible_attractions_count',
    'card_attraction_name',
    'card_attraction_category',
    'card_attraction_rating',
    'card_attraction_url',
    'interaction_timestamp_ms',
];

export {
    siteSearchOpenTemplate,
    siteSearchUsageTemplate,
    siteSearchClickTemplate,
    siteSearchCloseTemplate,
    favouriteAddTemplate,
    favouriteRemoveTemplate,
    favouritesPageViewTemplate,
    favouritesClickTemplate,
    favouritesShareTemplate,
    googleMapSearchTemplate,
    googleMapFilterInteractionTemplate,
    googleMapTimeToFirstInteractionTemplate,
    googleMapInteractionTemplate,
};
