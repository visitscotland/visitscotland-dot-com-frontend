<template>
    <svg
        class="vs-illustrated-map"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 147 259"
        fill="none"
        :aria-label="ariaLabel"
        :width="width"
    >
        <title>{{ title }}</title>
        <!-- Each path uses dynamic class binding -->
        <!-- eslint-disable max-len -->
        <path
            id="region-borders"
            d="M94.8908 215.531L93.0078 228.835L107.675 235.709V243.242L113.032 241.534L128.139 211.014L120.114 207.334L105.422 215.196L94.8908 215.531Z"
            :class="{ 'is-highlighted': isHighlighted('borders') }"
        />
        <path
            id="region-dumfries"
            d="M107.678 243.242V235.709L93.0105 228.835L82.3684 227.947L56.8945 246.364L61.8447 258.049L107.678 243.242Z"
            :class="{ 'is-highlighted': isHighlighted('dumfries') }"
        />
        <path
            id="region-highlands"
            d="M76.3875 143.097L95.2198 133.991L113.324 133.608L97.0838 160.469L75.7941 169.254L55.0816 173.951L39.152 171.715L42.8855 166.308L22.8906 149.472L26.9695 134.771L40.5413 142.884L40.5683 128.034L58.977 94.2952L75.2383 98.8575L103.725 94.2952L103.831 105.06L76.3875 143.097Z"
            :class="{ 'is-highlighted': isHighlighted('highlands') }"
        />
        <path
            id="region-outerhebs"
            d="M32.2773 100.625L28.2335 123.863L12.5575 138.325L6.67127 161.517L0 166.276L2.87299 130.376L15.7839 111.868L32.2773 100.625Z"
            :class="{ 'is-highlighted': isHighlighted('outerhebs') }"
        />
        <path
            id="region-shetland"
            d="M137.044 28.8822L146.094 6.08942L143.526 0L123.234 20.1191L130.38 32.3789L137.044 28.8822Z"
            :class="{ 'is-highlighted': isHighlighted('shetland') }"
        />
        <path
            id="region-orkney"
            d="M122.546 56.7442L104.383 67.0074L102.082 77.7078L110.938 85.416L123.687 65.4372L122.546 56.7442Z"
            :class="{ 'is-highlighted': isHighlighted('orkney') }"
        />
        <path
            id="region-edinburgh"
            d="M91.4266 205.144L85.8047 209.876L88.6156 214.643L94.893 215.531L105.425 215.196L120.116 207.334L109.493 202.467L96.7193 207.453L91.4266 205.144Z"
            :class="{ 'is-highlighted': isHighlighted('edinburgh') }"
        />
        <path
            id="region-glasgow"
            d="M82.3716 227.947L61.3516 207.458L69.5119 201.782L85.8084 209.876L88.6193 214.643L94.8967 215.531L93.0138 228.835L82.3716 227.947Z"
            :class="{ 'is-highlighted': isHighlighted('glasgow') }"
        />
        <path
            id="region-fife"
            d="M87.6797 202.205L92.2306 196.904L96.9973 195.69L98.0602 189.406L110.434 188.702L114.378 195.922L98.7427 203.034L87.6797 202.205Z"
            :class="{ 'is-highlighted': isHighlighted('fife') }"
        />
        <path
            id="region-dundee"
            d="M104.384 186.969L95.3438 167.854L109.865 163.084L113.858 171.955L120.915 172.433L116.269 182.388L104.384 186.969Z"
            :class="{ 'is-highlighted': isHighlighted('dundee') }"
        />
        <path
            id="region-aberdeen"
            d="M113.318 133.608L126.213 133.333L135.806 140.523L120.907 172.433L113.85 171.955L109.857 163.084L95.336 167.854L83.0078 166.276L97.0787 160.47L113.318 133.608Z"
            :class="{ 'is-highlighted': isHighlighted('aberdeen') }"
        />
        <path
            id="region-perth"
            d="M75.7936 169.255L69.8615 170.601L65.6289 186.368L73.8324 183.044L78.7125 185.704L76.1605 192.023L92.2357 196.904L97.0025 195.69L98.0653 189.406L104.381 186.97L95.3407 167.854L83.0125 166.276L75.7936 169.255Z"
            :class="{ 'is-highlighted': isHighlighted('perth') }"
        />
        <path
            id="region-lomond"
            d="M62.4171 188.701L65.63 186.368L73.8335 183.044L78.7136 185.704L76.1616 192.023L92.2368 196.903L87.6859 202.205H85.0072L91.4303 205.143L85.8084 209.875L69.5119 201.781L61.3516 207.458L61.5296 202.467L63.1914 194.13L62.4171 188.701Z"
            :class="{ 'is-highlighted': isHighlighted('lomond') }"
        />
        <path
            id="region-arran"
            d="M51.7287 220.725L49.1875 231.015C49.1875 231.015 54.9712 233.435 55.1709 233.168C55.3732 232.898 61.1542 222.611 60.9546 222.543C60.755 222.476 51.7287 220.728 51.7287 220.728V220.725Z"
            :class="{ 'is-highlighted': isHighlighted('arranayr') }"
        />
        <path
            id="region-ayrshire"
            d="M61.3483 207.458L60.9653 218.253L66.8434 223.663L56.8945 246.364L82.3684 227.947L61.3483 207.458Z"
            :class="{ 'is-highlighted': isHighlighted('arranayr') }"
        />
        <path
            id="region-argyll"
            d="M42.2625 231.565L48.5831 221.483L52.2519 210.237L60.9598 218.253L61.521 202.467L63.1827 194.13L62.4085 188.702L65.6214 186.368L69.854 170.601L55.0736 173.952L39.144 171.715L27.6386 179.013L26.6485 193.901L39.2061 192.377L52.0981 177.832L42.8937 196.909L25.9768 208.276L23.9023 213.801L28.5207 221.82L43.2148 204.755L44.364 206.684L37.396 224.232L42.2625 231.565Z"
            :class="{ 'is-highlighted': isHighlighted('argyll') }"
        />
        <g
            v-for="(pin, index) in mapPins"
            :key="`${pin.x}-${pin.y}-${index}`"
            :transform="`translate(${pin.x}, ${pin.y})`"
            class="vs-illustrated-map__pin"
        >
            <circle r="4" />
        </g>
    </svg>
</template>

<script lang="ts">
import { type PropType, computed } from 'vue';
// Defined in a separate script block so it is available at module scope,
// allowing defineProps to reference it in the validator without hoisting issues
export const VALID_REGIONS = [
    'borders', 'dumfries', 'highlands', 'outerhebs', 'shetland',
    'orkney', 'edinburgh', 'glasgow', 'fife', 'dundee', 'aberdeen',
    'perth', 'lomond', 'arranayr', 'argyll',
] as const;

export type Region = typeof VALID_REGIONS[number];

export interface MapPin {
    lat: number;
    lng: number;
}

// The bounding box for Scotland, used to project lat/lng into SVG coordinate space
export const SCOTLAND_BOUNDS = {
    north: 60.847,
    south: 54.695,
    east: -0.766,
    west: -8.623,
};

const VIEW_BOX = {
    width: 147,
    height: 259,
};
</script>

<script lang="ts" setup>
const props = defineProps({
    /**
     * Array of region IDs to highlight
     */
    highlightedRegions: {
        type: Array as PropType<Region[]>,
        default: () => [],
        validator: (value: string[]) => value.every(
            (region) => VALID_REGIONS.includes(region as Region),
        ),
    },
    /**
     * ARIA label for the map
     */
    ariaLabel: {
        type: String,
        default: 'Illustrated map of Scotland showing regions and/or pins',
    },
    /**
     * Title for the map
     */
    title: {
        type: String,
        default: 'Map of Scotland',
    },
    /**
     * The width attribute of the SVG
     */
    width: {
        type: String,
        default: null,
    },
    /**
     * An array of pin objects containing lat/lng coordinates
     * to be displayed on the map
     */
    pins: {
        type: Array as PropType<MapPin[]>,
        default: () => [],
    },
});

const isHighlighted = (regionId: Region): boolean => props.highlightedRegions.includes(regionId);

const mapPins = computed(() => {
    const pins = Array.isArray(props.pins) ? props.pins : [];

    return pins.map((pin) => ({
        x: (
            (pin.lng - SCOTLAND_BOUNDS.west)
            / (SCOTLAND_BOUNDS.east - SCOTLAND_BOUNDS.west)
        ) * VIEW_BOX.width,
        y: (
            1
            - (pin.lat - SCOTLAND_BOUNDS.south)
            / (SCOTLAND_BOUNDS.north - SCOTLAND_BOUNDS.south)
        ) * VIEW_BOX.height,
    }));
});
</script>

<style lang="scss" scoped>
    .vs-illustrated-map {
        height: auto;

        path {
            fill: #8382BA;
        }

        .is-highlighted {
            fill: #23014A;
        }
    }

    .vs-illustrated-map__pin {
        circle {
            fill: #23014A;
        }
    }

    .vs-illustrated-map__pin-label {
        font-size: 4px;
        fill: #23014A;
    }
</style>