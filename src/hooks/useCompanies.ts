import { useState, useEffect } from "react";
import type { Company } from "@/types/company";

interface UseCompaniesProps {
	page?: number;
	perPage?: number;
	query?: string;
	entityType?: string;
	gstStatus?: string;
	sortBy?: string;
	sortOrder?: "asc" | "desc";
}

export function useCompanies({
	page = 1,
	perPage = 10,
	query = "",
	entityType = "",
	gstStatus = "",
	sortBy = "entity_name",
	sortOrder = "asc",
}: UseCompaniesProps) {
	const [data, setData] = useState<Company[]>([]);
	const [total, setTotal] = useState(0);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		setIsLoading(true);
		const params = new URLSearchParams({
			page: page.toString(),
			perPage: perPage.toString(),
			query,
			entityType,
			gstStatus,
			sortBy,
			sortOrder,
		});

		fetch(`/api/companies?${params.toString()}`)
			.then((res) => res.json())
			.then((result) => {
				setData(result.data);
				setTotal(result.total);
				setIsLoading(false);
			})
			.catch((err) => {
				setError(err.message);
				setIsLoading(false);
			});
	}, [page, perPage, query, entityType, gstStatus, sortBy, sortOrder]);

	return { data, total, isLoading, error };
}
