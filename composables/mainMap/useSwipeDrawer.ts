import type { Ref } from 'vue';
import {
    computed,
    onMounted,
    onUnmounted,
    ref,
    watchEffect,
} from 'vue';

export default function useSwipeDrawer(isOpen: Ref<boolean>, sidebar: Ref<HTMLElement | null>) {
    const currentY = ref(0);
    const startY = ref(0);
    const startTranslate = ref(0);
    const sidebarHeight = ref(0);
    const isDragging = ref(false);
    const isMobile = ref(false);
    const peekHeight = ref(0);

    const OPEN_POSITION = 0;
    const SWIPE_THRESHOLD = 30;
    const HEADER_HEIGHT = 81;

    // Set the how much of the sidebar is visible when it's closed.
    const closedPosition = computed(() =>
        Math.max(0, sidebarHeight.value - peekHeight.value),
    );

    // Set the sidebar style, depending on
    // - if it's being dragged or not.
    // - if it's open or closed.
    const sidebarStyle = computed(() => { 
        // Only set the style if on mobile.
        if (!isMobile.value) return undefined;

        return {
            height: `calc(100vh - ${HEADER_HEIGHT}px)`,
            top: `${HEADER_HEIGHT}px`,
            transform: `translateY(${currentY.value}px)`,
            transition: isDragging.value
                ? 'none'
                : 'transform 0.5s ease',
        };
    });

    /**
     * Calculate the position of the drawer base on the amount swiped.
     * This allows the drawer to move as the user drags it.
     * 
     * @param {PointerEvent} event: - pointer move event.
     */
    function onDrag(event: PointerEvent) {
        if (!isDragging.value) return;

        const delta = event.clientY - startY.value;
        let nextPosition = startTranslate.value + delta;
        nextPosition = Math.max(OPEN_POSITION, Math.min(closedPosition.value, nextPosition));
        currentY.value = nextPosition;
    }

    /**
     * Determine if the drawer should be open or closed base on the swipe direction.
     * 
     * @param {PointerEvent} event: - pointer up event.
     */
    function endDrag(event: PointerEvent) {
        isDragging.value = false;

        // Calculate the change in drawer position.
        const totalDelta = event.clientY - startY.value;

        /**
         * SWIPE_THRESHOLD is used to prevent the drawer from opening/closing
         * due to an accidental small swipe.
         */

        //  Close the drawer if swiping down, open if swiping up.
        if (totalDelta > SWIPE_THRESHOLD) {
            isOpen.value = false;
        } else if (totalDelta < -SWIPE_THRESHOLD) {
            isOpen.value = true;
        } else {
            // If the user doesn't swipe passed the threshold then return to the 
            // previous state.
            if (isOpen.value) {
                isOpen.value = true;
            } else {
                isOpen.value = false;
            }
        }
    }

    /**
     * Add event listeners when the user clicks/touches the drawer.
     * 
     * @param {PointerEvent} event: - pointer move event.
     */
    function startDrag(event: PointerEvent) {
        // Only allow users to drag the sidebar when on small screen size.
        if (window.innerWidth >= 768) return;

        const element = event.currentTarget as HTMLElement;
        element.setPointerCapture(event.pointerId);

        isDragging.value = true;

        startY.value = event.clientY;
        startTranslate.value = currentY.value;
    }

    /**
     * Check if the screen has resized to a mobile device.
     */
    function onResize() {
        isMobile.value = window.innerWidth < 768;
        peekHeight.value = Math.min(250, window.innerHeight * 0.3);
        sidebarHeight.value = sidebar.value
            ? sidebar.value.getBoundingClientRect().height
            : 500;
    }

    watchEffect(() => {
        currentY.value = isOpen.value
            ? OPEN_POSITION
            : closedPosition.value;
    });

    onMounted(() => {
        // Prevent the body from scrolling on mobile.
        if (isMobile.value) {
            document.documentElement.classList.add('map-page');
            document.body.classList.add('map-page');
        }
    
        // Set the position of the drawer when the component is mounted.
        sidebarHeight.value = sidebar.value
            ? sidebar.value.getBoundingClientRect().height
            : 500;
        
        peekHeight.value = Math.min(250, window.innerHeight * 0.3);

        currentY.value = closedPosition.value;
        isMobile.value = window.innerWidth < 768;
        
        // Set the sidebar position when the screen size changes.
        window.addEventListener('resize', onResize);
    });

    onUnmounted(() => {
        document.documentElement.classList.remove('map-page');
        document.body.classList.remove('map-page');

        window.removeEventListener('resize', onResize);
    });

    return {
        endDrag,
        onDrag,
        sidebarStyle,
        startDrag,
    };
}