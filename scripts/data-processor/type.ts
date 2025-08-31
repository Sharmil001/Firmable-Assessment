export interface ABNRecord {
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

export interface ProcessingError {
	type: "PARSE_ERROR" | "VALIDATION_ERROR" | "DATABASE_ERROR" | "NETWORK_ERROR";
	message: string;
	record?: Partial<ABNRecord>;
	originalError?: Error;
	timestamp: Date;
}
