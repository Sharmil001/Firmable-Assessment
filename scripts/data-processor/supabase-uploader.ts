import { createClient } from "@supabase/supabase-js";
import { Address } from "cluster";
import { BusinessName, NormalizedCompany } from "./type";

export class SupabaseUploader {
	private supabase;

	constructor() {
		this.supabase = createClient(
			process.env.SUPABASE_URL!,
			process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
		);
	}

	async uploadCompanies(companies: NormalizedCompany[]): Promise<void> {
		const batchSize = 1000;

		for (let i = 0; i < companies.length; i += batchSize) {
			const batch = companies.slice(i, i + batchSize);

			const { error } = await this.supabase
				.from("companies")
				.upsert(batch, { onConflict: "abn" });

			if (error) {
				console.error(`Error uploading batch ${i}:`, error);
				throw error;
			}

			console.log(
				`Uploaded batch ${i + 1}/${Math.ceil(companies.length / batchSize)}`,
			);
		}
	}

	async uploadBusinessNames(businessNames: BusinessName[]): Promise<void> {
		const { error } = await this.supabase
			.from("business_names")
			.upsert(businessNames);

		if (error) throw error;
	}

	async uploadAddresses(addresses: Address[]): Promise<void> {
		const { error } = await this.supabase.from("addresses").upsert(addresses);

		if (error) throw error;
	}
}
