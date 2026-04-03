import mitt from 'mitt';

export default defineNuxtPlugin(() => {
export default defineNuxtPlugin(() => {
    const EVENT_BUS = mitt();

    return {
        provide: {
            eventBus: EVENT_BUS,
        },
    };
});
        },
    };
});
