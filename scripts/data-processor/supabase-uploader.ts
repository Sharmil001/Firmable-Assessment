import { createClient } from "@supabase/supabase-js";
import { Address } from "cluster";
import { ABNRecord, BusinessName } from "./type";

export class SupabaseUploader {
	private supabase;

	constructor() {
		console.log(process.env.NEXT_PUBLIC_SUPABASE_URL);
		this.supabase = createClient(
			process.env.NEXT_PUBLIC_SUPABASE_URL!,
			process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
		);
	}

	async getCompanies() {
		try {
			console.log("Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);

			const { data, error } = await this.supabase.from("companies").select("*");

			if (error) {
				console.error("Error fetching companies:", error);
				return;
			}

			console.log("Companies:", data);
		} catch (error) {
			console.error("Unexpected error:", error);
		}
	}

	async uploadCompanies(
		companies: ABNRecord[],
		batchSize = 1000,
	): Promise<void> {
		for (let i = 0; i < companies.length; i += batchSize) {
			const batch = companies.slice(i, i + batchSize);
			const { error } = await this.supabase
				.from("companies")
				.upsert(batch, { onConflict: "abn" });

			if (error) {
				console.error(`❌ Error uploading batch ${i / batchSize + 1}:`, error);
				throw error;
			}
			console.log(
				`✅ Uploaded ${Math.min(i + batchSize, companies.length)}/${companies.length} records`,
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
