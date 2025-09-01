"use client";
import { useCompanyTotal } from "@/hooks/useCompaniesTotal";
import { BarChart3, Building, Shell } from "lucide-react";
import Link from "next/link";

const Navbar = () => {
	const { totalCompanies } = useCompanyTotal();

	return (
		<div className="relative bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 overflow-hidden">
			<div className="relative max-w-7xl mx-auto px-4 py-2">
				<div className="flex items-center justify-between">
					<Link href="/" className="flex items-center space-x-4">
						<div className="relative">
							<div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg shadow-blue-500/25 group-hover:shadow-blue-500/40 transition-all duration-300">
								<Shell className="h-8 w-8 text-white" />
							</div>
							<div className="absolute -inset-1 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl blur opacity-20 group-hover:opacity-50 transition-opacity duration-300"></div>
						</div>

						<div>
							<h1 className="text-2xl font-black bg-gradient-to-r from-white via-blue-100 to-blue-200 bg-clip-text text-transparent">
								ABN Explorer
							</h1>
							<div className="flex items-center gap-2">
								<p className="text-blue-200 text-sm font-medium">
									Australian Business Register
								</p>
							</div>
						</div>
					</Link>

					<div className="flex gap-4 items-center">
						<div className="flex items-center space-x-8">
							<div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-xl p-2 border border-white/20">
								<div className="p-2 bg-blue-500/20 rounded-lg">
									<Building className="h-4 w-4 text-blue-300" />
								</div>
								<div>
									<p className="text-blue-100 text-xs font-medium uppercase tracking-wide">
										Total Businesses
									</p>
									<p className="text-white text-base font-bold">
										{totalCompanies ?? "--"}
									</p>
								</div>
							</div>
						</div>

						<Link
							href="/insights"
							className="group flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 px-4 py-2 rounded-xl text-white font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform transform-gpu  hover:scale-105"
						>
							<BarChart3 className="h-4 w-4 group-hover:rotate-12 transition-transform duration-300" />
							<span className="text-sm">Insights</span>
							<div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-xl opacity-0 transition-opacity duration-300" />
						</Link>
					</div>
				</div>
			</div>

			<div className="h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent"></div>
		</div>
	);
};

export default Navbar;
