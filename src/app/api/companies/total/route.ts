import { supabase } from "@/lib/supabase/client";
import { NextResponse } from "next/server";

export async function GET() {
	try {
		const { data, error } = await supabase
			.from("company_stats")
			.select("*")
			.single();

		if (error) {
			console.error("Error fetching total companies:", error);
			throw error;
		}
		return NextResponse.json({
			totalCompanies: data.total_companies || 0,
		});
	} catch (error) {
		console.error("Stats API error:", error);
		return NextResponse.json(
			{
				error: "Failed to fetch company statistics",
				details: error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 },
		);
	}
}
