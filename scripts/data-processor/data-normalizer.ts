// import {
// 	ABNRecord,
// 	NormalizedCompany,
// 	BusinessName,
// 	Address,
// 	BusinessNameRaw,
// 	AddressRaw,
// 	EntityType,
// 	GSTStatus,
// 	ABNStatus,
// 	BusinessLocation,
// 	ValidationResult,
// 	ENTITY_TYPE_MAPPING,
// 	BUSINESS_NAME_TYPE_MAPPING,
// 	ADDRESS_TYPE_MAPPING,
// 	AUSTRALIAN_STATES,
// 	BusinessNameType,
// 	AddressType,
// } from "./type";
//
// export class DataNormalizer {
// 	static normalizeCompany(record: ABNRecord): NormalizedCompany {
// 		return {
// 			abn: this.cleanABN(record.abn),
// 			abn_status: this.normalizeABNStatus(record.abnStatus),
// 			entity_type: this.normalizeEntityType(record.entityType),
// 			entity_name: this.cleanText(record.entityName),
// 			trading_name: record.tradingName
// 				? this.cleanText(record.tradingName)
// 				: undefined,
// 			registration_date: this.parseDate(record.registrationDate),
// 			last_updated_date: this.parseDate(record.lastUpdatedDate),
// 			gst_status: this.normalizeGSTStatus(record.gstStatus),
// 			main_business_location: this.extractMainBusinessLocation(
// 				record.addresses,
// 			),
// 			created_at: new Date(),
// 			updated_at: new Date(),
// 		};
// 	}
//
// 	static normalizeBusinessNames(record: ABNRecord): BusinessName[] {
// 		const businessNames: BusinessName[] = [];
//
// 		for (const rawName of record.businessNames || []) {
// 			const normalized = this.normalizeBusinessName(record.abn, rawName);
// 			if (normalized) {
// 				businessNames.push(normalized);
// 			}
// 		}
//
// 		return businessNames;
// 	}
//
// 	static normalizeAddresses(record: ABNRecord): Address[] {
// 		const addresses: Address[] = [];
//
// 		for (const rawAddress of record.addresses || []) {
// 			const normalized = this.normalizeAddress(record.abn, rawAddress);
// 			if (normalized) {
// 				addresses.push(normalized);
// 			}
// 		}
//
// 		return addresses;
// 	}
//
// 	static validateCompany(company: NormalizedCompany): ValidationResult {
// 		const errors: string[] = [];
// 		const warnings: string[] = [];
//
// 		if (!company.abn || company.abn.length !== 11) {
// 			errors.push("Invalid ABN: must be 11 digits");
// 		}
//
// 		if (!company.entity_name || company.entity_name.trim().length === 0) {
// 			errors.push("Entity name is required");
// 		}
//
// 		if (!company.entity_type) {
// 			errors.push("Entity type is required");
// 		}
//
// 		// Business logic validations
// 		if (company.abn && !this.isValidABN(company.abn)) {
// 			errors.push("ABN fails checksum validation");
// 		}
//
// 		if (company.entity_name && company.entity_name.length > 200) {
// 			warnings.push("Entity name exceeds recommended length (200 characters)");
// 		}
//
// 		if (company.trading_name && company.trading_name.length > 200) {
// 			warnings.push("Trading name exceeds recommended length (200 characters)");
// 		}
//
// 		return {
// 			isValid: errors.length === 0,
// 			errors,
// 			warnings,
// 		};
// 	}
//
// 	private static cleanABN(abn: string): string {
// 		if (!abn) return "";
//
// 		const cleaned = abn.replace(/\D/g, "");
//
// 		return cleaned.padStart(11, "0");
// 	}
//
// 	private static normalizeABNStatus(status?: string): ABNStatus {
// 		if (!status) return "Unknown";
//
// 		const statusUpper = status.toUpperCase();
//
// 		if (statusUpper.includes("ACTIVE") || statusUpper === "A") {
// 			return "Active";
// 		}
//
// 		if (statusUpper.includes("CANCELLED") || statusUpper === "C") {
// 			return "Cancelled";
// 		}
//
// 		return "Unknown";
// 	}
//
// 	private static normalizeEntityType(type: string): EntityType {
// 		if (!type) return "Other";
//
// 		const mappedType = ENTITY_TYPE_MAPPING[type.toUpperCase()];
// 		return mappedType || "Other";
// 	}
//
// 	private static normalizeGSTStatus(status: string): GSTStatus {
// 		if (!status) return "Unknown";
//
// 		const statusUpper = status.toUpperCase();
//
// 		if (
// 			statusUpper.includes("ACTIVE") ||
// 			statusUpper === "Y" ||
// 			statusUpper === "YES"
// 		) {
// 			return "Active";
// 		}
//
// 		if (
// 			statusUpper.includes("INACTIVE") ||
// 			statusUpper === "N" ||
// 			statusUpper === "NO"
// 		) {
// 			return "Inactive";
// 		}
//
// 		return "Unknown";
// 	}
//
// 	private static cleanText(text: string): string {
// 		if (!text) return "";
//
// 		return text
// 			.trim()
// 			.replace(/\s+/g, " ")
// 			.replace(/[^\x20-\x7E\u00A0-\uFFFF]/g, "")
// 			.substring(0, 200);
// 	}
//
// 	private static parseDate(dateStr?: string): Date | null {
// 		if (!dateStr) return null;
//
// 		try {
// 			const cleanedDate = dateStr.replace(/[^\d-\/]/g, "");
// 			const date = new Date(cleanedDate);
//
// 			const currentYear = new Date().getFullYear();
// 			if (date.getFullYear() < 1900 || date.getFullYear() > currentYear + 10) {
// 				return null;
// 			}
//
// 			return isNaN(date.getTime()) ? null : date;
// 		} catch {
// 			return null;
// 		}
// 	}
//
// 	private static extractMainBusinessLocation(
// 		addresses: AddressRaw[],
// 	): BusinessLocation | null {
// 		if (!addresses || addresses.length === 0) return null;
//
// 		const prioritizedAddress =
// 			addresses.find(
// 				(addr) => addr.addressType === "Main Business Physical Address",
// 			) ||
// 			addresses.find(
// 				(addr) => addr.addressType === "Main Business Postal Address",
// 			) ||
// 			addresses[0];
//
// 		if (!prioritizedAddress) return null;
//
// 		return {
// 			state: this.normalizeStateCode(prioritizedAddress.stateCode),
// 			postcode: this.normalizePostcode(prioritizedAddress.postcode),
// 			country: prioritizedAddress.countryCode || "AU",
// 			address_type: prioritizedAddress.addressType,
// 		};
// 	}
//
// 	private static normalizeBusinessName(
// 		companyABN: string,
// 		rawName: BusinessNameRaw,
// 	): BusinessName | null {
// 		if (!rawName.organisationName) return null;
//
// 		const nameType =
// 			BUSINESS_NAME_TYPE_MAPPING[rawName.nameType] ||
// 			("OTN" as BusinessNameType);
//
// 		return {
// 			company_abn: companyABN,
// 			name_type: nameType,
// 			organisation_name: this.cleanText(rawName.organisationName),
// 			effective_from: this.parseDate(rawName.effectiveFrom),
// 			effective_to: this.parseDate(rawName.effectiveTo),
// 			created_at: new Date(),
// 		};
// 	}
//
// 	private static normalizeAddress(
// 		companyABN: string,
// 		rawAddress: AddressRaw,
// 	): Address | null {
// 		if (!rawAddress.addressType) return null;
//
// 		const addressType =
// 			ADDRESS_TYPE_MAPPING[rawAddress.addressType] || ("OTHER" as AddressType);
//
// 		return {
// 			company_abn: companyABN,
// 			address_type: addressType,
// 			state_code: this.normalizeStateCode(rawAddress.stateCode),
// 			postcode: this.normalizePostcode(rawAddress.postcode),
// 			country_code: rawAddress.countryCode || "AU",
// 			effective_from: this.parseDate(rawAddress.effectiveFrom),
// 			effective_to: this.parseDate(rawAddress.effectiveTo),
// 			created_at: new Date(),
// 		};
// 	}
//
// 	private static normalizeStateCode(state?: string): string | undefined {
// 		if (!state) return undefined;
//
// 		const stateUpper = state.toUpperCase();
//
// 		if (AUSTRALIAN_STATES.includes(stateUpper as any)) {
// 			return stateUpper;
// 		}
//
// 		const stateMapping: Record<string, string> = {
// 			"NEW SOUTH WALES": "NSW",
// 			VICTORIA: "VIC",
// 			QUEENSLAND: "QLD",
// 			"WESTERN AUSTRALIA": "WA",
// 			"SOUTH AUSTRALIA": "SA",
// 			TASMANIA: "TAS",
// 			"AUSTRALIAN CAPITAL TERRITORY": "ACT",
// 			"NORTHERN TERRITORY": "NT",
// 		};
//
// 		return stateMapping[state.toUpperCase()] || state.toUpperCase();
// 	}
//
// 	private static normalizePostcode(postcode?: string): string | undefined {
// 		if (!postcode) return undefined;
//
// 		const cleaned = postcode.replace(/\D/g, "");
//
// 		if (cleaned.length === 4) {
// 			return cleaned;
// 		}
//
// 		if (cleaned.length === 3) {
// 			return "0" + cleaned;
// 		}
//
// 		return cleaned.length > 0 ? cleaned : undefined;
// 	}
//
// 	private static isValidABN(abn: string): boolean {
// 		if (!abn || abn.length !== 11) return false;
//
// 		const weights = [10, 1, 3, 5, 7, 9, 11, 13, 15, 17, 19];
// 		const digits = abn.split("").map(Number);
//
// 		digits[0] = digits[0] - 1;
//
// 		const sum = digits.reduce((total, digit, index) => {
// 			return total + digit * weights[index];
// 		}, 0);
//
// 		return sum % 89 === 0;
// 	}
//
// 	static normalizeRecordBatch(records: ABNRecord[]): {
// 		companies: NormalizedCompany[];
// 		businessNames: BusinessName[];
// 		addresses: Address[];
// 		errors: { record: ABNRecord; error: string }[];
// 	} {
// 		const companies: NormalizedCompany[] = [];
// 		const businessNames: BusinessName[] = [];
// 		const addresses: Address[] = [];
// 		const errors: { record: ABNRecord; error: string }[] = [];
//
// 		for (const record of records) {
// 			try {
// 				const normalizedCompany = this.normalizeCompany(record);
// 				const validation = this.validateCompany(normalizedCompany);
//
// 				if (validation.isValid) {
// 					companies.push(normalizedCompany);
//
// 					const recordBusinessNames = this.normalizeBusinessNames(record);
// 					const recordAddresses = this.normalizeAddresses(record);
//
// 					businessNames.push(...recordBusinessNames);
// 					addresses.push(...recordAddresses);
// 				} else {
// 					errors.push({
// 						record,
// 						error: validation.errors.join("; "),
// 					});
// 				}
// 			} catch (error) {
// 				errors.push({
// 					record,
// 					error:
// 						error instanceof Error
// 							? error.message
// 							: "Unknown normalization error",
// 				});
// 			}
// 		}
//
// 		return {
// 			companies,
// 			businessNames,
// 			addresses,
// 			errors,
// 		};
// 	}
// }
