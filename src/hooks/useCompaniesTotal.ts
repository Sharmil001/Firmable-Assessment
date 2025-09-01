import { useState, useEffect } from "react";

interface CompanyStats {
	totalCompanies: number;
	isLoading: boolean;
	error: string | null;
}

export const useCompanyTotal = () => {
	const [stats, setStats] = useState<CompanyStats>({
		totalCompanies: 0,
		isLoading: true,
		error: null,
	});

	useEffect(() => {
		const fetchStats = async () => {
			try {
				setStats((prev) => ({ ...prev, isLoading: true, error: null }));

				const response = await fetch("/api/companies/total");

				if (!response.ok) {
					throw new Error("Failed to fetch company statistics");
				}

				const data = await response.json();

				setStats({
					totalCompanies: data.totalCompanies || 0,
					isLoading: false,
					error: null,
				});
				sessionStorage.setItem(
					"totalCompanies",
					(data.totalCompanies || 0).toString(),
				);
			} catch (error) {
				console.error("Error fetching company stats:", error);
				setStats((prev) => ({
					...prev,
					isLoading: false,
					error:
						error instanceof Error ? error.message : "Unknown error occurred",
				}));
			}
		};

		fetchStats();
	}, []);

	return stats;
};
