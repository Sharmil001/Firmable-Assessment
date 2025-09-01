"use client";
import CompanyLists from "@/components/business/company-lists";
import StatsCards from "@/components/business/stats-cards";

export default function Home() {
	return (
		<div className="container mx-auto mb-4 px-6">
			<StatsCards />
			<CompanyLists />
		</div>
	);
}
