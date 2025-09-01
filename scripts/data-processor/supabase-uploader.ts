import { createClient } from "@supabase/supabase-js";
import { Address } from "cluster";
import { ABNRecord, BusinessName } from "./type";

export class SupabaseUploader {
	private supabase;

	constructor() {
		this.supabase = createClient(
			process.env.NEXT_PUBLIC_SUPABASE_URL!,
			process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
		);
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
				console.error(`Error uploading batch ${i / batchSize + 1}:`, error);
				throw error;
			}
			console.log(
				`Uploaded ${Math.min(i + batchSize, companies.length)}/${companies.length} records`,
			);
		}
	}
}
