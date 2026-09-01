export default function useVerifyCookies() { 
    const cookieManagerLoaded = ref(false);
    const requiredCookies = ref<(0 | 1)[]>([]);
    const requiredCookiesAllowed = ref(false);

    const cookiesAllowed = computed(() => {
        if ((typeof window !== 'undefined' && window.bypassCookiesRequired)
            || import.meta.dev
        ) {
            return true;
        };

        return requiredCookiesAllowed.value;
    });

    const cookiesLoaded = computed(() => {
        if ((typeof window !== 'undefined' && window.bypassCookiesLoaded)
            || import.meta.dev
        ) {
            return true;
        }

        return {
            cookieManagerLoaded,
        };
    });

    const managerLoaded = () => cookieManagerLoaded.value = true;

    function cookiesUpdated() {
        let allowed = false;

        if (typeof CookieControl !== 'undefined' && requiredCookies.value) {
            allowed = requiredCookies.value.every(
                (category) => CookieControl.getCategoryConsent(category) === true,
            );
        };

        requiredCookiesAllowed.value = allowed;
    }

    onMounted(() => {
        window.addEventListener('cookieManagerLoaded', managerLoaded);
        window.addEventListener('cookiesUpdated', cookiesUpdated);
    });

    return {
        requiredCookies,
        cookiesAllowed,
        cookiesLoaded,
    };
}