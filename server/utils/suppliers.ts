import { decode } from 'html-entities';
import supplierData from '../../public/assets/suppliers.json';
import type { Supplier } from '../../types/suppliers';
export const suppliers: Supplier[] = supplierData.map((supplier, index) => ({
    id: 'id' in supplier ? String(supplier.id) : String(index + 1),
    name: decode(supplier.Title),
    imageUrl: supplier['Image URL'].split('|').map((url) => url.trim()).find(Boolean) || '',
    description: decode(supplier.Description
        .replace(/<script\b[^>]*>[\s\S]*?<\/script\s*>/gi, ' ')
        .replace(/<style\b[^>]*>[\s\S]*?<\/style\s*>/gi, ' ')
        .replace(/<[^>]*>/g, ' '))
        .replace(/\s+/g, ' ').trim(),
    commission: supplier.Commission.trim(),
    contactName: decode(supplier['Contact Name']).trim(),
    phoneNumber: supplier.Telephone.trim(),
    emailAddress: supplier.Email.trim(),
    url: supplier.Web.trim(),
    address: [
        supplier['Address Line 1'],
        supplier['Address Line 2'],
        supplier.City,
        supplier.County,
        supplier.Postcode,
    ].map((part) => decode(part).trim()).filter(Boolean).join(', '),
    supplierTypes: supplier['Supplier Types'].split('|').map((type) => type.trim()).filter(Boolean),
    date: 'Date' in supplier ? String(supplier.Date) : '',
}));
