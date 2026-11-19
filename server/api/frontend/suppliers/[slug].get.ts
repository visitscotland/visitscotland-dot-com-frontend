import { suppliers } from '../../../utils/suppliers.ts';

export default defineEventHandler((event) => {
    const slug = getRouterParam(event, 'slug', {
        decode: true,
    });
    const supplier = suppliers.find((entry) => entry.slug === slug);

    if (!supplier) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Supplier not found',
        });
    }

    return supplier;
});
