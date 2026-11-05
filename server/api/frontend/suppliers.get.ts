import { suppliers } from '../../utils/suppliers.ts';
import type { SupplierListingResponse } from '../../../types/suppliers';

const pageSize = 8;

const collator = new Intl.Collator('en', {
    sensitivity: 'base',
});

const supplierTypes = [...new Set(suppliers.flatMap((supplier) => supplier.supplierTypes))]
    .sort(collator.compare);

export default defineEventHandler((event): SupplierListingResponse => {
    const query = getQuery(event);
    const q = typeof query.q === 'string' ? query.q.trim().toLowerCase() : '';
    const types = (Array.isArray(query.type) ? query.type : [query.type])
        .filter((type): type is string => typeof type === 'string' && type.length > 0);
    const sort = query.sort === 'name' ? 'name' : 'date';
    const requestedPage = typeof query.page === 'string' && /^\d+$/.test(query.page)
        ? Number(query.page) : 1;

    const matches = suppliers.filter((supplier) => (
        (!q || supplier.name.toLowerCase().includes(q))
        && (!types.length || types.some((type) => supplier.supplierTypes.includes(type)))
    ));

    matches.sort((a, b) => (
        (sort === 'date' ? b.date.localeCompare(a.date) : 0)
        || collator.compare(a.name, b.name)
        || collator.compare(a.id, b.id)
    ));

    const total = matches.length;
    const lastPage = Math.max(1, Math.ceil(total / pageSize));
    const page = Number.isSafeInteger(requestedPage)
        ? Math.min(Math.max(1, requestedPage), lastPage) : 1;

    return {
        results: matches.slice((page - 1) * pageSize, page * pageSize),
        total,
        page,
        pageSize,
        supplierTypes,
    };
});
