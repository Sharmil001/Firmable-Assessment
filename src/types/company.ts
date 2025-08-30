export interface Company {
	id: string;
	abn: string;
	entity_name: string;
	trading_name?: string;
	entity_type: string;
	registration_date: string;
	gst_status: string;
	main_business_location?: {
		state: string;
		postcode: string;
	};
	created_at: string;
}

export interface SearchFilters {
	query?: string;
	entityType?: string;
	state?: string;
	gstStatus?: string;
	registrationDateFrom?: string;
	registrationDateTo?: string;
}

export interface SearchResponse {
	data: Company[];
	total: number;
	page: number;
	per_page: number;
}
