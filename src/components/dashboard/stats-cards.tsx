import {
	CheckCircle,
	XCircle,
	Building2,
	Users,
	TrendingUp,
	Activity,
} from "lucide-react";

const StatsCards = () => {
	const stats = [
		{
			title: "Active ABNs",
			value: "800",
			change: "+12.5%",
			changeType: "increase",
			icon: CheckCircle,
			gradient: "from-emerald-500 to-teal-600",
			bgGradient: "from-emerald-50 to-teal-50",
			textColor: "text-emerald-700",
			iconBg: "bg-emerald-100",
		},
		{
			title: "Cancelled ABNs",
			value: "100",
			change: "-5.2%",
			changeType: "decrease",
			icon: XCircle,
			gradient: "from-red-500 to-rose-600",
			bgGradient: "from-red-50 to-rose-50",
			textColor: "text-red-700",
			iconBg: "bg-red-100",
		},
		{
			title: "Public Companies",
			value: "50",
			change: "+8.1%",
			changeType: "increase",
			icon: Building2,
			gradient: "from-blue-500 to-cyan-600",
			bgGradient: "from-blue-50 to-cyan-50",
			textColor: "text-blue-700",
			iconBg: "bg-blue-100",
		},
		{
			title: "Private Companies",
			value: "950",
			change: "+15.3%",
			changeType: "increase",
			icon: Users,
			gradient: "from-amber-500 to-orange-600",
			bgGradient: "from-amber-50 to-orange-50",
			textColor: "text-amber-700",
			iconBg: "bg-amber-100",
		},
	];

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 my-8">
			{stats.map((stat, index) => {
				const IconComponent = stat.icon;
				return (
					<div
						key={index}
						className={`relative overflow-hidden bg-gradient-to-br ${stat.bgGradient} rounded-2xl shadow-sm border border-white/60 hover:shadow-xl hover:scale-105 transition-all duration-300 group`}
					>
						{/* Background Pattern */}
						<div className="absolute top-0 right-0 w-32 h-32 opacity-5">
							<div
								className={`w-full h-full bg-gradient-to-br ${stat.gradient} rounded-full blur-2xl`}
							/>
						</div>

						{/* Card Content */}
						<div className="relative p-6">
							<div className="flex items-start justify-between mb-4">
								<div className="flex-1">
									<p className="text-sm font-medium text-gray-600 mb-1">
										{stat.title}
									</p>
									<div className="flex items-baseline gap-2">
										<h3 className={`text-3xl font-bold ${stat.textColor}`}>
											{stat.value}
										</h3>
									</div>
								</div>

								<div
									className={`p-3 ${stat.iconBg} rounded-xl group-hover:scale-110 transition-transform duration-300`}
								>
									<IconComponent className={`h-6 w-6 ${stat.textColor}`} />
								</div>
							</div>

							<div className="mt-4">
								<div className="flex items-center justify-between mb-2">
									<span className="text-xs text-gray-500">
										{Math.min(90, (parseInt(stat.value) / 1000) * 100)}%{" "}
										{stat.title}
									</span>
									<Activity className="h-3 w-3 text-gray-400" />
								</div>
								<div className="w-full bg-white/60 rounded-full h-1.5">
									<div
										className={`bg-gradient-to-r ${stat.gradient} h-1.5 rounded-full transition-all duration-700 ease-out`}
										style={{
											width: `${Math.min(90, (parseInt(stat.value) / 1000) * 100)}%`,
										}}
									/>
								</div>
							</div>
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

export default StatsCards;
