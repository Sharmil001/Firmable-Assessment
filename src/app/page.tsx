"use client";
import { useState, useEffect, useRef } from "react";
import Loader from "@/components/common/loader";
import DataTable from "@/components/dashboard/data-table";
import { DataTablePagination } from "@/components/dashboard/pagination";
import { DataTableSorting } from "@/components/dashboard/sorting";
import StatsCards from "@/components/dashboard/stats-cards";
import { useCompanies } from "@/hooks/useCompanies";
import { SearchForm } from "@/components/search/search-form";
import { SearchParams } from "next/dist/server/request/search-params";

export default function Home() {
	const [page, setPage] = useState(1);
	const [perPage, setPerPage] = useState(10);
	const [query, setQuery] = useState("");
	const [entityType, setEntityType] = useState("");
	const [gstStatus, setGstStatus] = useState("");
	const [isSearchSticky, setIsSearchSticky] = useState(false);

	const [sorting, setSorting] = useState({
		sortBy: "entity_name",
		sortOrder: "asc",
	});

	const {
		data: companies,
		total,
		isLoading,
	} = useCompanies({
		page,
		perPage,
		query,
		entityType,
		gstStatus,
		sortBy: sorting.sortBy,
		sortOrder: sorting.sortOrder as "asc" | "desc",
	});

	if (isLoading) return <Loader />;

	const onSearch = (filters: SearchParams) => {
		console.log(filters);
		// setQuery(filters.query || "");
		// setEntityType(filters.entityType || "");
		// setGstStatus(filters.gstStatus || "");
		setPage(1);
	};

	return (
		<div className="container mx-auto">
			<StatsCards />
			<div className="flex gap-4">
				<div
					className={`transition-all duration-300 ${
						isSearchSticky ? "fixed top-4 left-4 z-50 w-80" : "relative"
					}`}
				>
					<SearchForm onSearch={onSearch} isLoading={isLoading} />
				</div>

				<div
					className={`bg-white shadow p-6 rounded-lg flex-1 ${
						isSearchSticky ? "ml-84" : ""
					}`}
				>
					<div className="pb-6 border-b border-gray-200 flex items-center justify-between">
						<h2 className="text-xl font-semibold text-gray-900">
							Company List
						</h2>
						<DataTableSorting sorting={sorting} setSorting={setSorting} />
					</div>
					<DataTable data={companies} />
					<DataTablePagination
						pagination={{
							currentPage: page,
							itemsPerPage: perPage,
							totalPages: Math.ceil(total / perPage),
						}}
						setPagination={({ currentPage, itemsPerPage }) => {
							setPage(currentPage);
							setPerPage(itemsPerPage);
						}}
					/>
				</div>
			</div>
		</div>
	);
}
