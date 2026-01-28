const siteSearchOpenTemplate = [
    'event',
    'referrer_page',
];

const siteSearchUsageTemplate = [
    'event',
    'search_query',
    'query_input',
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
    'query_input',
    'page_number',
    'page_navigation_direction',
    'click_text',
    'click_url',
    'click_category',
    'search_usage_index',
    'results_count',
];

const siteSearchCloseTemplate = [
    'event',
    'search_usage_index',
    'search_query',
    'query_input',
    'page_number',
    'results_count',
];

export {
    siteSearchOpenTemplate,
    siteSearchUsageTemplate,
    siteSearchClickTemplate,
    siteSearchCloseTemplate,
};
