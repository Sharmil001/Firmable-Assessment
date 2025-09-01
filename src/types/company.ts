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

interface EntityType {
	code: string;
	name: string;
	count: number;
	description: string;
}

interface CategoryData {
	name: string;
	icon: React.ElementType;
	color: string;
	bgColor: string;
	entities: EntityType[];
}

interface Categories {
	major: CategoryData;
	investment: CategoryData;
	public: CategoryData;
	specialized: CategoryData;
}

interface MarketAnalysis {
	privateCompanies: number;
	trusts: number;
	partnerships: number;
	publicCompanies: number;
}

interface CategoryCardProps {
	category: string;
	data: CategoryData;
	totalEntities: number;
	onToggleExpanded: (category: string) => void;
	isExpanded: boolean;
}

interface TopEntityCardProps {
	code: string;
	count: number;
	index: number;
	totalEntities: number;
}

interface LoadingStateProps {
	message?: string;
}

interface ErrorStateProps {
	error: string;
	onRetry?: () => void;
}
