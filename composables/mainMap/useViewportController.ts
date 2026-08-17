import type { MapContext, Viewport } from '~/types/main-map-types.ts';
import { VIEWPORT_ZOOM_THRESHOLD } from '~/main-map-constants.ts';

export default function useViewportController(context: MapContext) {
    // Get the current viewport
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

    // Check if the viewport has moved passed the distance or zoom thresholds.
    function hasViewportChanged(newViewPort: Viewport) {
        const previous = context.lastSearchViewport.value;

        if (!previous?.center || !newViewPort.center) {
            return false;
        }

        if (previous.zoom == null || newViewPort.zoom == null) {
            return false;
        }

        if (previous.zoom === undefined || 
            newViewPort.zoom === undefined) return false;

        const oldCenter = {
            lat: previous.center.lat(),
            lng: previous.center.lng(),
        };
        const newCenter = {
            lat: newViewPort.center.lat(),
            lng: newViewPort.center.lng(),
        };

        const distanceDiff = google.maps.geometry.spherical.computeDistanceBetween(
            oldCenter,
            newCenter,
        );
        const distanceThreshold = distanceThresholdByZoom(newViewPort.zoom);
        const zoomDiff = Math.abs(previous.zoom - newViewPort.zoom);

        return distanceDiff > distanceThreshold || zoomDiff >= VIEWPORT_ZOOM_THRESHOLD;
    }

    /**
     * Wrapper for programmatic map move to prevent the "Search the area" button from showing.
     * Functions such as gMap.setCenter(), gMap.setBounds(), and gMap.setZoom()
     */
    function runProgrammaticMove(fn: () => void) {
        context.moveSource.value = 'programmatic';
        fn();
    }

    return {
        getViewport,
        hasViewportChanged,
        runProgrammaticMove,
    };
}
