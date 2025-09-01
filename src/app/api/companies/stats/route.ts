import { supabase } from "@/lib/supabase/client";
import { NextResponse } from "next/server";

export async function GET() {
	try {
		const { data, error } = await supabase
			.from("company_graphs")
			.select("*")
			.single();

		if (error) {
			console.error("Error fetching company stats:", error);
			throw error;
		}

		return NextResponse.json(data);
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
