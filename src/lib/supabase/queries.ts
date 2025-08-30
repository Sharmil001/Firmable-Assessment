import { supabase } from "./client";
import type { Company, SearchFilters, SearchResponse } from "@/types/company";

export class CompanyQueries {
	static async searchCompanies(
		filters: SearchFilters,
		page = 1,
		perPage = 20,
	): Promise<SearchResponse> {
		let query = supabase.from("companies").select("*", { count: "exact" });

		// Apply filters
		if (filters.query) {
			query = query.or(
				`entity_name.ilike.%${filters.query}%,trading_name.ilike.%${filters.query}%,abn.ilike.%${filters.query}%`,
			);
		}

		if (filters.entityType) {
			query = query.eq("entity_type", filters.entityType);
		}

		if (filters.gstStatus) {
			query = query.eq("gst_status", filters.gstStatus);
		}

		// Pagination
		const from = (page - 1) * perPage;
		const to = from + perPage - 1;
		query = query.range(from, to);

		const { data, error, count } = await query;

		if (error) throw error;

		return {
			data: data || [],
			total: count || 0,
			page,
			per_page: perPage,
		};
	}

	static async getCompanyById(id: string): Promise<Company | null> {
		const { data, error } = await supabase
			.from("companies")
			.select("*")
			.eq("id", id)
			.single();

		if (error) throw error;
		return data;
	}

	static async getAnalytics() {
		const { data: totalCompanies } = await supabase
			.from("companies")
			.select("id", { count: "exact", head: true });

		const { data: stateDistribution } = await supabase
			.from("addresses")
			.select("state_code, count()")
			.group("state_code");

		return {
			totalCompanies: totalCompanies?.length || 0,
			stateDistribution: stateDistribution || [],
		};
	}
}
