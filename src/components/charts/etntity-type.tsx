import { PieChart } from "lucide-react";
import { useMemo } from "react";

export const EntityTypeChart = () => {
	const rawData = {
		total_companies: 459411,
		active_abns: 231674,
		cancelled_abns: 227737,
		gst_active: 120860,
		gst_inactive: 338551,
		entity_types: {
			ADF: 2,
			CCN: 2,
			CGA: 5,
			CGE: 56,
			CMT: 67,
			COP: 187,
			CSS: 1,
			CTD: 1,
			CUT: 268,
			DES: 1682,
			DIT: 35679,
			DST: 4010,
			DTT: 31999,
			FPT: 47205,
			FUT: 14532,
			FXT: 1446,
			HYT: 1312,
			LGE: 47,
			LPT: 544,
			LSS: 2,
			NPF: 173,
			NRF: 71,
			OIE: 10050,
			PDF: 1,
			POF: 24,
			PQT: 474,
			PRV: 206539,
			PST: 7,
			PTR: 31419,
			PTT: 87,
			PUB: 2972,
			PUT: 56,
			SAF: 428,
			SCN: 4,
			SCO: 5,
			SCR: 2,
			SGA: 32,
			SGE: 600,
			SGT: 1,
			SMF: 47715,
			SSS: 4,
			STI: 1,
			STR: 8302,
			STU: 1,
			SUP: 1,
			TGA: 3,
			TGE: 29,
			TRT: 7020,
			TTF: 1,
			TTI: 1,
			UIE: 4341,
		},
	};

	// Calculate insights
	const insights = useMemo(() => {
		const activeRate = (rawData.active_abns / rawData.total_companies) * 100;
		const gstActiveRate = (rawData.gst_active / rawData.total_companies) * 100;
		const topEntityTypes = Object.entries(rawData.entity_types)
			.sort(([, a], [, b]) => b - a)
			.slice(0, 8);

		const businessHealth =
			activeRate > 60
				? "excellent"
				: activeRate > 45
					? "good"
					: "needs-attention";

		return {
			activeRate,
			gstActiveRate,
			topEntityTypes,
			businessHealth,
			dormantCompanies: rawData.cancelled_abns,
			taxCompliantRate: (rawData.gst_active / rawData.active_abns) * 100,
			diversityIndex: Object.keys(rawData.entity_types).length,
		};
	}, [rawData]);
	return (
		<div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-all duration-300">
			<div className="flex items-center justify-between mb-8">
				<div>
					<h3 className="text-2xl font-bold text-gray-900 mb-2">
						Entity Type Distribution
					</h3>
					<p className="text-gray-600">Top performing business structures</p>
				</div>
				<div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl">
					<PieChart className="h-6 w-6 text-white" />
				</div>
			</div>

			<div className="space-y-4">
				{insights.topEntityTypes.map(([type, count], index) => {
					const percentage = (count / rawData.total_companies) * 100;
					const colors = [
						"from-blue-500 to-cyan-500",
						"from-purple-500 to-pink-500",
						"from-green-500 to-emerald-500",
						"from-orange-500 to-red-500",
						"from-indigo-500 to-purple-500",
						"from-teal-500 to-green-500",
						"from-rose-500 to-pink-500",
						"from-amber-500 to-orange-500",
					];

					return (
						<div key={type} className="group">
							<div className="flex items-center justify-between mb-2">
								<span className="font-semibold text-gray-800">{type}</span>
								<div className="flex items-center gap-2">
									<span className="text-sm text-gray-600">
										{count.toLocaleString()}
									</span>
									<span className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600">
										{percentage.toFixed(2)}%
									</span>
								</div>
							</div>
							<div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
								<div
									className={`bg-gradient-to-r ${colors[index]} h-3 rounded-full transition-all duration-1000 ease-out group-hover:opacity-90`}
									style={{ width: `${Math.max(percentage * 4, 2)}%` }}
								/>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
};
