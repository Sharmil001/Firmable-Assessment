import * as fs from "fs";
import * as xml2js from "xml2js";
import {
	ABNRecord,
	BusinessNameRaw,
	AddressRaw,
	XMLParserConfig,
	ProcessingError,
} from "./type";

export class XMLParser {
	private parser: xml2js.Parser;
	private config: XMLParserConfig;
	private errors: ProcessingError[] = [];

	constructor(config: Partial<XMLParserConfig> = {}) {
		this.config = {
			batchSize: config.batchSize || 1000,
			skipMalformed: config.skipMalformed ?? true,
			logErrors: config.logErrors ?? true,
			...config,
		};

		this.parser = new xml2js.Parser({
			explicitArray: false,
			mergeAttrs: true,
			ignoreAttrs: false,
			trim: true,
			explicitRoot: false,
		});
	}

	async parseXMLFile(filePath: string): Promise<ABNRecord[]> {
		try {
			const xmlData = fs.readFileSync(filePath, "utf8");
			const result = await this.parser.parseStringPromise(xmlData);
			console.dir(result, { depth: null });
			return this.extractCompaniesFromParsedXML(result);
		} catch (error) {
			const processingError: ProcessingError = {
				type: "PARSE_ERROR",
				message: `Failed to parse XML file: ${error instanceof Error ? error.message : "Unknown error"}`,
				originalError: error instanceof Error ? error : undefined,
				timestamp: new Date(),
			};
			this.errors.push(processingError);
			throw processingError;
		}
	}

	async parseXMLFileInChunks(
		filePath: string,
		chunkSize: number = 1000,
	): Promise<ABNRecord[]> {
		console.log(`Processing large XML file in chunks: ${filePath}`);
		try {
			const stats = fs.statSync(filePath);
			console.log(`File size: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);
			if (stats.size > 100 * 1024 * 1024) {
				return await this.parseXMLFileInMemoryChunks(filePath, chunkSize);
			} else {
				return await this.parseXMLFile(filePath);
			}
		} catch (error) {
			console.error("❌ Error in chunk parsing:", error);
			throw error;
		}
	}

	private async parseXMLFileInMemoryChunks(
		filePath: string,
		chunkSize: number,
	): Promise<ABNRecord[]> {
		const companies: ABNRecord[] = [];
		let processedRecords = 0;

		const xmlData = fs.readFileSync(filePath, "utf8");
		const result = await this.parser.parseStringPromise(xmlData);
		const records = result.ABR || [];
		const recordsArray = Array.isArray(records) ? records : [records];
		console.log(
			`🔍 Processing ${recordsArray.length} records in memory chunks...`,
		);
		for (let i = 0; i < recordsArray.length; i += chunkSize) {
			const chunk = recordsArray.slice(i, i + chunkSize);

			for (const record of chunk) {
				try {
					const company = this.mapXMLToCompany(record);
					if (company) {
						companies.push(company);
						processedRecords++;

						if (processedRecords % (chunkSize * 10) === 0) {
							console.log(`📊 Processed ${processedRecords} records...`);
						}
					}
				} catch (error) {
					if (!this.config.skipMalformed) {
						throw error;
					}

					if (this.config.logErrors) {
						this.errors.push({
							type: "PARSE_ERROR",
							message: `Failed to parse record: ${error instanceof Error ? error.message : "Unknown error"}`,
							originalError: error instanceof Error ? error : undefined,
							timestamp: new Date(),
						});
					}
				}
			}

			if (global.gc) {
				global.gc();
			}
		}

		console.log(
			`✅ Completed chunk processing. Total valid records: ${companies.length}`,
		);
		return companies;
	}

	private extractCompaniesFromParsedXML(xmlData: any): ABNRecord[] {
		const companies: ABNRecord[] = [];

		try {
			const abrRecords = xmlData.ABR || [];

			const recordsArray = Array.isArray(abrRecords)
				? abrRecords
				: [abrRecords];

			console.log(`🔍 Found ${recordsArray.length} ABR records in XML`);

			for (const [index, record] of recordsArray.entries()) {
				try {
					const company = this.mapXMLToCompany(record);
					if (company) {
						companies.push(company);
					}
				} catch (error) {
					if (this.config.logErrors) {
						this.errors.push({
							type: "PARSE_ERROR",
							message: `Failed to parse record at index ${index}: ${error instanceof Error ? error.message : "Unknown error"}`,
							originalError: error instanceof Error ? error : undefined,
							timestamp: new Date(),
						});
					}

					if (!this.config.skipMalformed) {
						throw error;
					}
				}

				if ((index + 1) % 10000 === 0) {
					console.log(
						`📊 Processed ${index + 1} records, found ${companies.length} valid companies...`,
					);
				}
			}

			console.log(
				`✅ Successfully extracted ${companies.length} valid companies`,
			);
			return companies;
		} catch (error) {
			console.error("❌ Error extracting companies from XML:", error);
			throw error;
		}
	}

	private mapXMLToCompany(record: any): ABNRecord | null {
		try {
			const abn = this.extractABN(record);
			const entityName = this.extractEntityName(record);

			if (!abn || !entityName) {
				return null;
			}

			return {
				abn,
				abn_status: this.extractABNStatus(record),
				entity_type: this.extractEntityType(record),
				entity_name: entityName,
				trading_name: this.extractTradingName(record),
				gst_status: this.extractGSTStatus(record),
				registration_date: this.extractRegistrationDate(record),
				lastUpdated_date: this.extractLastUpdatedDate(record),
				business_names: this.extractBusinessNames(record),
				addresses: this.extractAddresses(record),
				created_at: new Date(),
				updated_at: new Date(),
				// entityStatus: this.extractEntityStatus(record),
			};
		} catch (error) {
			if (this.config.logErrors) {
				console.warn(`!  Failed to map XML record:`, error);
			}
			return null;
		}
	}

	private extractABN(record: any): string {
		return record.ABN?._ || record.ABN || "";
	}

	private extractABNStatus(record: any): string {
		return record.ABN?.status || record.ABN?.$?.status || "Unknown";
	}

	private extractEntityType(record: any): string {
		return (
			record.EntityType?.EntityTypeInd ||
			record.EntityType?.EntityTypeInd?._ ||
			"Unknown"
		);
	}

	private extractEntityName(record: any): string {
		return (
			record.MainEntity?.NonIndividualName?.NonIndividualNameText ||
			record.MainEntity?.NonIndividualName?._ ||
			record.MainEntity?.IndividualName?.GivenName ||
			""
		);
	}

	private extractTradingName(record: any): string | undefined {
		const otherEntities = record.OtherEntity || [];
		const entitiesArray = Array.isArray(otherEntities)
			? otherEntities
			: [otherEntities];

		for (const entity of entitiesArray) {
			if (
				entity?.NonIndividualName?.type === "TRD" ||
				entity?.NonIndividualName?.$?.type === "TRD"
			) {
				const tradingName =
					entity.NonIndividualName.NonIndividualNameText ||
					entity.NonIndividualName._;
				if (tradingName) return tradingName;
			}
		}

		return undefined;
	}

	private extractGSTStatus(record: any): string {
		const gstStatus = record.GST?.status || record.GST?.$?.status;
		return gstStatus === "ACT" ? "Active" : "Inactive";
	}

	private extractRegistrationDate(record: any): string {
		return (
			record.ABN?.ABNStatusFromDate || record.ABN?.$?.ABNStatusFromDate || ""
		);
	}

	private extractLastUpdatedDate(record: any): string | undefined {
		return (
			record.recordLastUpdatedDate ||
			record.$?.recordLastUpdatedDate ||
			undefined
		);
	}

	private extractBusinessNames(record: any): BusinessNameRaw[] {
		const businessNames: BusinessNameRaw[] = [];

		try {
			const mainEntity = record.MainEntity?.NonIndividualName;
			if (mainEntity?.NonIndividualNameText) {
				businessNames.push({
					nameType: mainEntity.type || mainEntity.$?.type || "MN",
					organisationName: mainEntity.NonIndividualNameText,
					effectiveFrom: record.ABN?.ABNStatusFromDate || "",
					effectiveTo: undefined,
				});
			}

			const otherEntities = record.OtherEntity || [];
			const entitiesArray = Array.isArray(otherEntities)
				? otherEntities
				: [otherEntities];

			for (const entity of entitiesArray) {
				const name = entity?.NonIndividualName;
				if (name?.NonIndividualNameText) {
					businessNames.push({
						nameType: name.type || name.$?.type || "OTN",
						organisationName: name.NonIndividualNameText,
						effectiveFrom: record.ABN?.ABNStatusFromDate || "",
						effectiveTo: undefined,
					});
				}
			}
		} catch (error) {
			if (this.config.logErrors) {
				console.warn("!  Error extracting business names:", error);
			}
		}

		return businessNames;
	}

	private extractAddresses(record: any): AddressRaw | null {
		const addresses: AddressRaw[] = [];

		try {
			const businessAddress =
				record.MainEntity?.BusinessAddress?.AddressDetails;
			if (businessAddress) {
				addresses.push({
					address_type: "Main Business Physical Address",
					state_code: businessAddress.State,
					postcode: businessAddress.Postcode,
					country_code: "AU",
					effective_from: record.ABN?.ABNStatusFromDate || "",
					effective_to: undefined,
				});
			}

			const postalAddress = record.MainEntity?.PostalAddress?.AddressDetails;
			if (postalAddress && postalAddress !== businessAddress) {
				addresses.push({
					address_type: "Main Business Postal Address",
					state_code: postalAddress.State,
					postcode: postalAddress.Postcode,
					country_code: "AU",
					effective_from: record.ABN?.ABNStatusFromDate || "",
					effective_to: undefined,
				});
			}
		} catch (error) {
			if (this.config.logErrors) {
				console.warn("!  Error extracting addresses:", error);
			}
		}

		if (!addresses || addresses.length === 0) return null;

		const prioritizedAddress =
			addresses.find(
				(addr) => addr.address_type === "Main Business Physical Address",
			) ||
			addresses.find(
				(addr) => addr.address_type === "Main Business Postal Address",
			) ||
			addresses[0];

		if (!prioritizedAddress) return null;

		return {
			state: prioritizedAddress.state_code,
			postcode: prioritizedAddress.postcode,
			country: prioritizedAddress.country_code || "AU",
			address_type: prioritizedAddress.address_type,
		};
	}

	async validateXMLStructure(
		filePath: string,
	): Promise<{ isValid: boolean; errors: string[] }> {
		const errors: string[] = [];

		try {
			if (!fs.existsSync(filePath)) {
				errors.push("XML file does not exist");
				return { isValid: false, errors };
			}

			const stats = fs.statSync(filePath);
			if (stats.size === 0) {
				errors.push("XML file is empty");
				return { isValid: false, errors };
			}

			// Read first few KB to validate XML structure
			const buffer = Buffer.alloc(Math.min(8192, stats.size));
			const fd = fs.openSync(filePath, "r");
			fs.readSync(fd, buffer, 0, buffer.length, 0);
			fs.closeSync(fd);

			const sampleData = buffer.toString("utf8");

			if (!sampleData.includes("<?xml")) {
				errors.push(
					"File does not appear to be valid XML (missing XML declaration)",
				);
			}

			if (
				!sampleData.includes("ABR") &&
				!sampleData.includes("searchResults")
			) {
				errors.push(
					"File does not appear to be an ABN bulk extract (missing expected root elements)",
				);
			}

			return { isValid: errors.length === 0, errors };
		} catch (error) {
			errors.push(
				`Error validating XML file: ${error instanceof Error ? error.message : "Unknown error"}`,
			);
			return { isValid: false, errors };
		}
	}
}
