const iconMap: Record<string, string> = {
    'active-adventures':    'fa-regular fa-person-hiking',
    'archaeological':       'fa-regular fa-landmark',
    'art-culture':          'fa-regular fa-palette',
    'cities-towns':         'fa-regular fa-location-dot',
    'events':               'fa-regular fa-calendar-range',
    'film-tv':              'fa-regular fa-camera-movie',
    'food-drink':           'fa-regular fa-utensils',
    'history-heritage':     'fa-regular fa-chess-rook',
    'music':                'fa-regular fa-music',
    'nature-outdoor':       'fa-regular fa-mountain',
    'night-sky-wonders':    'fa-regular fa-stars',
    'snowsports':           'fa-regular fa-person-skiing',
    'towns-village':        'fa-regular fa-house',
    'wildlife':             'fa-regular fa-paw',
};

function getIconName(iconKey: string = ''): string {
    return iconMap[iconKey] ?? `fa-regular fa-${iconKey}`;
}

export default getIconName;
