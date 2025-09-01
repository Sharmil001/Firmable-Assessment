import { supabase } from "@/lib/supabase/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
	const { searchParams } = new URL(req.url);

	const page = Number(searchParams.get("page") || 1);
	const perPage = Number(searchParams.get("perPage") || 10);
	const sortBy = searchParams.get("sortBy") || "entity_name";
	const sortOrder = (searchParams.get("sortOrder") as "asc" | "desc") || "asc";

	const queryText = searchParams.get("query") || "";
	const entityType = searchParams.get("entityType") || "";
	const gstStatus = searchParams.get("gstStatus") || "";
	const state = searchParams.get("state") || "";

	let query = supabase
		.from("companies")
		.select(
			"id, abn, abn_status, entity_name, entity_type, trading_name, gst_status, address, business_names, registration_date",
			{
				count: "estimated",
			},
		)
		.order(sortBy, { ascending: sortOrder === "asc" })
		.limit(perPage);

	if (queryText.trim()) {
		let searchField = "entity_name";
		if (/^\d+$/.test(queryText.trim())) {
			searchField = "abn";
		}
		query = query.textSearch(searchField, queryText, {
			config: "english",
			type: "plain",
		});
	}

	if (entityType.trim()) {
		query = query.eq("entity_type", entityType);
	}

	if (state.trim()) {
		query = query.eq("address->>state", state);
	}

	if (gstStatus.trim()) {
		query = query.eq("gst_status", gstStatus);
	}

	query = query.order(sortBy, { ascending: sortOrder === "asc" });

	const from = (page - 1) * perPage;
	const to = from + perPage - 1;
	query = query.range(from, to);

	const { data, count, error } = await query;

	if (error) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}

	return NextResponse.json({
		data: data || [],
		total: count || 0,
		currentPage: page,
		itemsPerPage: perPage,
	});
}
