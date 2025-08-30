export interface ABNRecord {
	abn: string;
	abn_status?: string;
	entity_type: string;
	entity_name: string;
	trading_name?: string;
	gst_status: string;
	registration_date: string;
	lastUpdated_date?: string;
	business_names: BusinessNameRaw[];
	addresses: AddressRaw | null;
	created_at: Date;
	updated_at: Date;
	entityStatus?: {
		effectiveFrom: string;
		effectiveTo?: string;
	};
}

export interface BusinessNameRaw {
	nameType: string; // 'BN', 'TRD', 'OTN', 'MN'
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

export interface NormalizedCompany {
	abn: string;
	abn_status: string;
	entity_type: string;
	entity_name: string;
	trading_name?: string;
	registration_date: Date | null;
	last_updated_date: Date | null;
	gst_status: string;
	main_business_location: BusinessLocation | null;
	created_at?: Date;
	updated_at?: Date;
}

export interface BusinessName {
	company_abn: string; // Foreign key reference
	name_type: BusinessNameType;
	organisation_name: string;
	effective_from: Date | null;
	effective_to: Date | null;
	created_at?: Date;
}

export interface Address {
	company_abn: string; // Foreign key reference
	address_type: AddressType;
	state_code?: string;
	postcode?: string;
	country_code?: string;
	effective_from: Date | null;
	effective_to: Date | null;
	created_at?: Date;
}

export interface BusinessLocation {
	state?: string;
	postcode?: string;
	country?: string;
	address_type?: string;
}

export type BusinessNameType = "BN" | "TRD" | "OTN" | "MN";

export type AddressType = "MAIN_PHYSICAL" | "MAIN_POSTAL" | "OTHER";

export type EntityType =
	| "Individual"
	| "Private Company"
	| "Public Company"
	| "Partnership"
	| "Trust"
	| "Superannuation Fund"
	| "Other";

export type GSTStatus = "Active" | "Inactive" | "Unknown";

export type ABNStatus = "Active" | "Cancelled" | "Unknown";

export interface XMLParserConfig {
	batchSize: number;
	skipMalformed: boolean;
	logErrors: boolean;
}

export interface ProcessingStats {
	totalRecords: number;
	successfulRecords: number;
	skippedRecords: number;
	errorRecords: number;
	processingTime: number;
	startTime: Date;
	endTime: Date;
}

export interface ValidationResult {
	isValid: boolean;
	errors: string[];
	warnings: string[];
}

export interface UploadBatchResult {
	success: boolean;
	recordsProcessed: number;
	errors: string[];
	batchId: string;
}

export const ENTITY_TYPE_MAPPING: Record<string, EntityType> = {
	IND: "Individual",
	PRV: "Private Company",
	PUB: "Public Company",
	PTR: "Partnership",
	TRT: "Trust",
	SUP: "Superannuation Fund",
	GOV: "Other",
	NPF: "Other",
	OTH: "Other",
};

export const BUSINESS_NAME_TYPE_MAPPING: Record<string, BusinessNameType> = {
	BN: "BN", // Business Name
	TRD: "TRD", // Trading Name
	OTN: "OTN", // Other Trading Name
	MN: "MN", // Main Name
};

export const ADDRESS_TYPE_MAPPING: Record<string, AddressType> = {
	"Main Business Physical Address": "MAIN_PHYSICAL",
	"Main Business Postal Address": "MAIN_POSTAL",
	"Physical Address": "MAIN_PHYSICAL",
	"Postal Address": "MAIN_POSTAL",
};

export const AUSTRALIAN_STATES = [
	"NSW",
	"VIC",
	"QLD",
	"WA",
	"SA",
	"TAS",
	"ACT",
	"NT",
] as const;

export type AustralianState = (typeof AUSTRALIAN_STATES)[number];

export type DatabaseInsert<T> = Omit<T, "id" | "created_at" | "updated_at">;

export type DatabaseUpdate<T> = Partial<Omit<T, "id" | "created_at">>;

export interface ProcessingError {
	type: "PARSE_ERROR" | "VALIDATION_ERROR" | "DATABASE_ERROR" | "NETWORK_ERROR";
	message: string;
	record?: Partial<ABNRecord>;
	originalError?: Error;
	timestamp: Date;
}

export interface DataProcessorConfig {
	input: {
		xmlFilePath: string;
		encoding?: string;
	};
	processing: {
		batchSize: number;
		maxConcurrency: number;
		skipInvalidRecords: boolean;
		validateBeforeInsert: boolean;
	};
	database: {
		connectionString?: string;
		tableName?: string;
		upsertOnConflict: boolean;
	};
	logging: {
		logLevel: "debug" | "info" | "warn" | "error";
		logFilePath?: string;
		enableProgressBar: boolean;
	};
}

export interface CompanySearchFilters {
	query?: string;
	entityTypes?: EntityType[];
	states?: AustralianState[];
	gstStatus?: GSTStatus[];
	abnStatus?: ABNStatus[];
	registrationDateFrom?: Date;
	registrationDateTo?: Date;
	hasBusinessNames?: boolean;
}

export interface PaginationParams {
	page: number;
	perPage: number;
	sortBy?: keyof NormalizedCompany;
	sortOrder?: "asc" | "desc";
}

export interface CompanySearchResponse {
	data: NormalizedCompany[];
	pagination: {
		total: number;
		page: number;
		perPage: number;
		totalPages: number;
	};
	filters: CompanySearchFilters;
	executionTime: number;
}

export interface CompanyAnalytics {
	totalCompanies: number;
	entityTypeDistribution: Record<EntityType, number>;
	stateDistribution: Record<AustralianState, number>;
	gstStatusDistribution: Record<GSTStatus, number>;
	registrationTrends: Array<{
		period: string;
		count: number;
	}>;
	topBusinessNames: Array<{
		name: string;
		count: number;
	}>;
}

export interface ExportConfig {
	format: "csv" | "json" | "xlsx";
	fields?: (keyof NormalizedCompany)[];
	includeBusinessNames?: boolean;
	includeAddresses?: boolean;
	filters?: CompanySearchFilters;
	maxRecords?: number;
}
