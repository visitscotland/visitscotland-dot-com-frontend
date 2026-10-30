import { suppliers } from '../../../utils/suppliers.ts';

export default defineEventHandler((event) => {
    const id = getRouterParam(event, 'id');
    const supplier = suppliers.find((entry) => entry.id === id);

    if (!supplier) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Supplier not found',
        });
    }

    return supplier;
});
