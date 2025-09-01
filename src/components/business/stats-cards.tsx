import {
	CheckCircle,
	Activity,
	AlertCircle,
	Target,
	Shield,
	Clock,
} from "lucide-react";
import { useCompanyStats } from "@/hooks/useCompanyStats";
import React from "react";

const StatsCards = () => {
	const {
		activeAbns,
		cancelledAbns,
		gstActiveRate,
		gstInactiveRate,
		// entityTypes,
		totalCompanies,
		isLoading,
		error,
	} = useCompanyStats();

	const stats = [
		{
			title: "BUSINESS HEALTH",
			value: activeAbns,
			icon: CheckCircle,
			gradient: "from-emerald-500 to-teal-600",
			bgGradient: "from-emerald-50 to-teal-50",
			textColor: "text-emerald-700",
			iconBg: "bg-emerald-100",
			percentage: totalCompanies > 0 ? (activeAbns / totalCompanies) * 100 : 0,
			subTitle: "Active ABNs",
		},
		{
			title: "DORMANT COMPANIES",
			value: cancelledAbns,
			icon: Clock,
			gradient: "from-red-500 to-rose-600",
			bgGradient: "from-red-50 to-rose-50",
			textColor: "text-red-700",
			iconBg: "bg-red-100",
			percentage:
				totalCompanies > 0 ? (cancelledAbns / totalCompanies) * 100 : 0,
			subTitle: "Cancelled ABNs",
		},
		{
			title: "TAX COMPLIANCE",
			value: gstActiveRate,
			icon: Shield,
			gradient: "from-blue-500 to-cyan-600",
			bgGradient: "from-blue-50 to-cyan-50",
			textColor: "text-blue-700",
			iconBg: "bg-blue-100",
			percentage:
				totalCompanies > 0 ? (gstActiveRate / totalCompanies) * 100 : 0,
			subTitle: "GST Active",
		},
		{
			title: "GROWTH OPPORTUNITY",
			value: gstInactiveRate,
			icon: Target,
			gradient: "from-amber-500 to-orange-600",
			bgGradient: "from-amber-50 to-orange-50",
			textColor: "text-amber-700",
			iconBg: "bg-amber-100",
			percentage:
				totalCompanies > 0 ? (gstInactiveRate / totalCompanies) * 100 : 0,
			subTitle: "GST Inactive",
		},
	];

	if (error) {
		return (
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 my-8">
				<div className="col-span-full">
					<div className="bg-red-50 border border-red-200 rounded-2xl p-6">
						<div className="flex items-center gap-3">
							<AlertCircle className="h-6 w-6 text-red-600" />
							<div>
								<h3 className="text-red-800 font-semibold">
									Failed to load statistics
								</h3>
								<p className="text-red-600 text-sm mt-1">{error}</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 py-6">
			{stats.map((stat, index) => {
				const IconComponent = stat.icon;
				return (
					<div
						key={index}
						className={`relative overflow-hidden bg-gradient-to-br ${stat.bgGradient} rounded-2xl shadow-sm border border-white/60 hover:shadow-xl hover:scale-105 transition-all duration-300 group`}
					>
						<div className="absolute top-0 right-0 w-32 h-32 opacity-5">
							<div
								className={`w-full h-full bg-gradient-to-br ${stat.gradient} rounded-full blur-2xl`}
							/>
						</div>

						<div className="relative p-6">
							<div className="flex items-start justify-between mb-4">
								<div className="flex-1">
									<p className="text-sm font-medium text-gray-600 mb-1">
										{stat.title}
									</p>
									<div className="flex items-baseline gap-2">
										{isLoading ? (
											<div className="flex items-center gap-2">
												<div className="w-8 h-8 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
												<span className="text-gray-500 text-sm">
													Loading...
												</span>
											</div>
										) : (
											<h3 className={`text-2xl font-bold ${stat.textColor}`}>
												{stat.value.toLocaleString()}
											</h3>
										)}
									</div>
								</div>
								<div
									className={`p-3 ${stat.iconBg} rounded-xl group-hover:scale-110 transition-transform duration-300 ${
										isLoading ? "opacity-50" : ""
									}`}
								>
									<IconComponent className={`h-6 w-6 ${stat.textColor}`} />
								</div>
							</div>

							{!isLoading && (
								<div className="mt-4">
									<div className="flex items-center justify-between mb-2">
										<span className="text-xs text-gray-500">
											{stat.percentage.toFixed(1)}% {stat.subTitle}
										</span>
										<Activity className="h-3 w-3 text-gray-400" />
									</div>
									<div className="w-full bg-white/60 rounded-full h-1.5">
										<div
											className={`bg-gradient-to-r ${stat.gradient} h-1.5 rounded-full transition-all duration-700 ease-out`}
											style={{
												width: `${Math.min(100, stat.percentage)}%`,
											}}
										/>
									</div>
								</div>
							)}

							<div
								className={`absolute inset-0 bg-gradient-to-r ${stat.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-2xl`}
							/>
						</div>
					</div>
				);
			})}
		</div>
	);
};

export default React.memo(StatsCards);
