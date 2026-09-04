import type { MapContext, Viewport } from '~/types/main-map-types.ts';
import { VIEWPORT_ZOOM_THRESHOLD } from '~/main-map-constants.ts';

export default function useViewportController(context: MapContext) {
    /**
     * Get the current map viewport.
     */
    function getViewport(): Viewport | null {
        const map = context.gMap.value;
        if (!map) return null;

        return {
            bounds: map.getBounds(),
            center: map.getCenter(),
            zoom: map.getZoom(),
        };
    }

    /**
     * Set distance threshold based on zoom level.
     * Distances are in meters.
     */
    function distanceThresholdByZoom(zoom: number) {
        if (zoom < 6) return 10000;
        if (zoom < 10) return 2500;
        if (zoom < 14) return 800;
        return 300;
    }

    /**
     * Check if the viewport has moved passed the distance or zoom thresholds.
     * 
     * @param newViewPort - The viewport after the map as been moved or zoomed.
     */
    function hasViewportChanged(newViewPort: Viewport) {
        const previous = context.lastSearchViewport.value;

        // Return `false` if there isn't a previous or new viewport.
        if (!previous?.center || !newViewPort.center) return false;
        if (previous.zoom == null || newViewPort.zoom == null) return false;
        if (previous.zoom === undefined || 
            newViewPort.zoom === undefined) return false;

        // Set the old and new centres.
        const oldCenter = {
            lat: previous.center.lat(),
            lng: previous.center.lng(),
        };
        const newCenter = {
            lat: newViewPort.center.lat(),
            lng: newViewPort.center.lng(),
        };

        // Calculate the difference between the old and new centres.
        const distanceDiff = google.maps.geometry.spherical.computeDistanceBetween(
            oldCenter,
            newCenter,
        );

        // Check if the distance or zoom thresholds have been breached.
        const distanceThreshold = distanceThresholdByZoom(newViewPort.zoom);
        const zoomDiff = Math.abs(previous.zoom - newViewPort.zoom);

        return distanceDiff > distanceThreshold || zoomDiff >= VIEWPORT_ZOOM_THRESHOLD;
    }

    /**
     * Wrapper for programmatic map move to prevent the "Search the area" button from showing.
     * Functions such as map.setCenter(), map.setBounds(), and map.setZoom().
     */
    function runProgrammaticMove(fn: () => void) {
        // Set the `moveSource` to 'programmatic' to prevent some of the event
        // handler functions from operating.
        context.moveSource.value = 'programmatic';
        fn();
    }

    return {
        getViewport,
        hasViewportChanged,
        runProgrammaticMove,
    };
}
