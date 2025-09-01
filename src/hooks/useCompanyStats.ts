import { useState, useEffect } from "react";

interface CompanyStats {
	activeAbns: number;
	cancelledAbns: number;
	gstActiveRate: number;
	gstInactiveRate: number;
	entityTypes: { [key: string]: number };
	// publicCompanies: number;
	// privateCompanies: number;
	totalCompanies: number;
	isLoading: boolean;
	error: string | null;
}

export const useCompanyStats = () => {
	const [stats, setStats] = useState<CompanyStats>({
		activeAbns: 0,
		cancelledAbns: 0,
		gstActiveRate: 0,
		gstInactiveRate: 0,
		entityTypes: {},
		// publicCompanies: 0,
		// privateCompanies: 0,
		totalCompanies: 0,
		isLoading: true,
		error: null,
	});

	useEffect(() => {
		const fetchStats = async () => {
			try {
				setStats((prev) => ({ ...prev, isLoading: true, error: null }));

				const response = await fetch("/api/companies/stats");

				if (!response.ok) {
					throw new Error("Failed to fetch company statistics");
				}

				const data = await response.json();

				setStats({
					activeAbns: data.active_abns || 0,
					cancelledAbns: data.cancelled_abns || 0,
					gstActiveRate: data.gst_active || 0,
					gstInactiveRate: data.gst_inactive || 0,
					entityTypes: data.entity_types || [],
					// publicCompanies: data.public_companies || 0,
					// privateCompanies: data.private_companies || 0,
					totalCompanies: data.total_companies || 0,
					isLoading: false,
					error: null,
				});
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
