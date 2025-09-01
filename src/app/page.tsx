"use client";
import CompanyDetails from "@/components/dashboard/company-lists";
import StatsCards from "@/components/dashboard/stats-cards";

export default function Home() {
	return (
		<div className="container mx-auto mb-4 px-6">
			<StatsCards />
			<CompanyDetails />
		</div>
	);
}
