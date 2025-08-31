export interface Company {
	abn: string;
	abn_status?: string;
	entity_type: string;
	entity_name: string;
	trading_name?: string;
	gst_status: string;
	gst_registration_date: string;
	registration_date: string;
	last_updated_date?: string;
	business_names: BusinessNameRaw[];
	address: AddressRaw | null;
	created_at: Date;
	updated_at: Date;
	entityStatus?: {
		effectiveFrom: string;
		effectiveTo?: string;
	};
}

export interface BusinessNameRaw {
	nameType: string;
	organisationName: string;
	effectiveFrom: string;
	effectiveTo?: string;
}

export interface AddressRaw {
	address_type?: string;
	state?: string;
	country?: string;
	state_code?: string;
	postcode?: string;
	country_code?: string;
	effective_from?: string;
	effective_to?: string;
}
export interface SearchFilters {
	query?: string;
	entityType?: string;
	state?: string;
	gstStatus?: string;
	registrationDate?: string;
}

export interface SearchResponse {
	data: Company[];
	total: number;
	current_page: number;
	items_per_page: number;
}
