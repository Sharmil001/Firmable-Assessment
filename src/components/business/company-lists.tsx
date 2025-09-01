"use client";
import { useCallback, useState } from "react";
import DataTable from "./data-table";
import { DataTablePagination } from "./pagination";
import { DataTableSorting } from "./sorting";
import { SearchForm, SearchFormData } from "../search/search-form";
import { useCompanies } from "@/hooks/useCompanies";
import Loader from "../common/loader";
import { CompanyDetailsSidebar } from "./company-details-sidebar";
import type { ABNRecord } from "../../../scripts/data-processor/type";

const CompanyLists = () => {
	const [page, setPage] = useState(1);
	const [perPage, setPerPage] = useState(10);
	const [company, setCompany] = useState<ABNRecord | null>(null);
	const [searchFilters, setSearchFilters] = useState<SearchFormData>({
		query: "",
		entityType: [],
		state: [],
		gstStatus: [],
		abn: "",
		postcode: "",
	});
	const [sorting, setSorting] = useState({
		sortBy: "entity_name",
		sortOrder: "asc",
	});

	const apiFilters = {
		query: searchFilters.query || "",
		entityType:
			searchFilters.entityType && searchFilters.entityType.length > 0
				? searchFilters.entityType[0]
				: "",
		state:
			searchFilters.state && searchFilters.state.length > 0
				? searchFilters.state[0]
				: "",
		gstStatus:
			searchFilters.gstStatus && searchFilters.gstStatus.length > 0
				? searchFilters.gstStatus[0]
				: "",
		abn: searchFilters.abn || "",
		postcode: searchFilters.postcode || "",
	};

	const {
		data: companies,
		total,
		isLoading,
	} = useCompanies({
		page,
		perPage,
		query: apiFilters.query,
		entityType: apiFilters.entityType,
		state: apiFilters.state,
		gstStatus: apiFilters.gstStatus,
		abn: apiFilters.abn,
		postcode: apiFilters.postcode,
		sortBy: sorting.sortBy,
		sortOrder: sorting.sortOrder as "asc" | "desc",
	});

	const handleSearch = useCallback((filters: SearchFormData) => {
		setSearchFilters(filters);
		setPage(1);
	}, []);

	const handleSortingChange = (newSorting: {
		sortBy: string;
		sortOrder: string;
	}) => {
		setSorting(newSorting);
		setPage(1);
	};

	const handlePaginationChange = ({
		currentPage,
		itemsPerPage,
	}: {
		currentPage: number;
		itemsPerPage: number;
	}) => {
		setPage(currentPage);
		setPerPage(itemsPerPage);
	};

	if (isLoading) return <Loader />;

	return (
		<div className="flex flex-wrap gap-4">
			<div className="transition-all duration-300 w-full sm:w-fit">
				<SearchForm
					searchFilters={searchFilters}
					onSearch={handleSearch}
					isLoading={isLoading}
				/>
			</div>

			<div className="bg-white shadow p-6 rounded-lg flex-1 flex flex-col">
				<div className="pb-4 border-b border-gray-200 flex flex-wrap items-center justify-between">
					<h1 className="text-xl font-bold">Businesses</h1>
					{total > 0 && (
						<DataTableSorting
							sorting={sorting}
							setSorting={handleSortingChange}
						/>
					)}
				</div>
				{total > 0 && (
					<DataTablePagination
						pagination={{
							currentPage: page,
							itemsPerPage: perPage,
							totalPages: Math.ceil(total / perPage),
						}}
						setPagination={handlePaginationChange}
					/>
				)}

				<div className="flex-1">
					<DataTable data={companies} setCompany={setCompany} />
				</div>

				{total > 0 && (
					<DataTablePagination
						pagination={{
							currentPage: page,
							itemsPerPage: perPage,
							totalPages: Math.ceil(total / perPage),
						}}
						setPagination={handlePaginationChange}
					/>
				)}
			</div>
			{company && (
				<CompanyDetailsSidebar
					company={company}
					closeSidebar={() => setCompany(null)}
				/>
			)}
		</div>
	);
};

export default CompanyLists;
