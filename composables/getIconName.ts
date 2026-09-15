const iconMap: Record<string, string> = {
    'active-adventures':    'fa-regular fa-person-hiking', 
    'archaeological':       'fa-regular fa-landmark', 
    'art-culture':          'fa-regular fa-images',
    'cities-towns':         'fa-solid fa-location-dot',
    'events':               'fa-regular fa-calendar-range',
    'film-tv':              'fa-regular fa-camera-movie', 
    'food-drink':           'fa-regular fa-utensils',
    'history-heritage':     'fa-regular fa-chess-rook',
    'music':                'fa-regular fa-play',                   // fa-music icon missing @visitscotland/component-library": "5.78.0". Using to fa-play for now.
    'nature-outdoor':       'fa-regular fa-mountain',
    'night-sky-wonders':    'fa-regular fa-star',
    'snowsports':           'fa-regular fa-person-ski-lift',
    'towns-village':        'fa-regular fa-house-chimney-window',
    'wildlife':             'fa-regular fa-squirrel',
};

function getIconName(iconKey: string = ''): string {
    return iconMap[iconKey] ?? `fa-regular fa-${iconKey}`;
}

export default getIconName;
