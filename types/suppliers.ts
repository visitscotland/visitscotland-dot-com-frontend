export interface Supplier {
    id: string;
    name: string;
    description: string;
    commission: string;
    contactName: string;
    phoneNumber: string;
    emailAddress: string;
    url: string;
    address: string;
    supplierTypes: string[];
    date: string;
}

export interface SupplierListingResponse {
    results: Supplier[];
    total: number;
    page: number;
    pageSize: number;
    supplierTypes: string[];
}
