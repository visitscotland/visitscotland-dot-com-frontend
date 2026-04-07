export function useEventBus() {
    return useNuxtApp().$eventBus;
}
