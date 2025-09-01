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

export interface EntityType {
	code: string;
	name: string;
	count: number;
	description: string;
}

export interface CategoryData {
	name: string;
	icon: React.ElementType;
	color: string;
	bgColor: string;
	entities: EntityType[];
}

export interface Categories {
	major: CategoryData;
	investment: CategoryData;
	public: CategoryData;
	specialized: CategoryData;
}

export interface MarketAnalysis {
	privateCompanies: number;
	trusts: number;
	partnerships: number;
	publicCompanies: number;
}

export interface CategoryCardProps {
	category: string;
	data: CategoryData;
	totalEntities: number;
	onToggleExpanded: (category: string) => void;
	isExpanded: boolean;
}

export interface TopEntityCardProps {
	code: string;
	count: number;
	index: number;
	totalEntities: number;
}

export interface LoadingStateProps {
	message?: string;
}

export interface ErrorStateProps {
	error: string;
	onRetry?: () => void;
}
