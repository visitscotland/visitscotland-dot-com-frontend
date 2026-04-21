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
    // 'usage_index',
    'interaction_timestamp_ms',
];

const favouriteRemoveTemplate = [
    'event',
    'content_title',
    'total_favourites',
    // 'usage_index',
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

export {
    siteSearchOpenTemplate,
    siteSearchUsageTemplate,
    siteSearchClickTemplate,
    siteSearchCloseTemplate,
    favouriteAddTemplate,
    favouriteRemoveTemplate,
    favouritesPageViewTemplate,
    favouritesClickTemplate,
};
