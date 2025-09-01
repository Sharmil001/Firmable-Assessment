import { NormalizedCompany } from "../../scripts/data-processor/type";

export interface SearchFilters {
	query?: string;
	entityType?: string;
	state?: string;
	gstStatus?: string;
	registrationDate?: string;
}

export interface SearchResponse {
	data: NormalizedCompany[];
	total: number;
	current_page: number;
	items_per_page: number;
}
