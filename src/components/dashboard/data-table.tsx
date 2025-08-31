import { getCompanyInitials } from "@/lib/utils";
import { Company } from "@/types/company";
import {
	Building2,
	Calendar,
	CheckCircle,
	Eye,
	MapPin,
	XCircle,
	ArrowUpRight,
	Hash,
	Globe,
} from "lucide-react";

const DataTable = ({ data }: { data: Company[] }) => {
	return (
		<div className="space-y-4 mt-6">
			{data?.map((business, index) => {
				const initials = getCompanyInitials(business.entity_name);

				return (
					<div
						key={business.abn}
						className="group relative bg-white rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all duration-300 overflow-hidden"
						style={{
							animationDelay: `${index * 50}ms`,
							animation: "slideIn 0.5s ease-out forwards",
						}}
					>
						<div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

						<div className="p-6">
							<div className="flex items-start justify-between">
								<div className="flex-1">
									<div className="flex items-center gap-4 mb-5">
										<div className="relative">
											<div className="flex items-center justify-center h-14 w-14 rounded-2xl bg-gradient-to-br from-slate-600 to-slate-700 text-white font-bold text-lg shadow-md group-hover:scale-110 transition-transform duration-300">
												{initials}
											</div>
											<div className="absolute -bottom-1 -right-1 h-5 w-5 bg-white rounded-full flex items-center justify-center shadow-md">
												{business.abn_status === "A" ? (
													<CheckCircle className="h-3 w-3 text-green-500" />
												) : (
													<XCircle className="h-3 w-3 text-red-500" />
												)}
											</div>
										</div>

										<div className="flex-1 min-w-0">
											<div className="flex items-center gap-3 mb-2">
												<h3 className="text-xl font-bold text-gray-900 truncate group-hover:text-blue-700 transition-colors">
													{business.entity_name}
												</h3>
												<div
													className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
														business.abn_status === "A"
															? "bg-green-50 text-green-700 border border-green-200"
															: "bg-red-50 text-red-700 border border-red-200"
													}`}
												>
													{business.abn_status === "A" ? (
														<CheckCircle className="h-3 w-3" />
													) : (
														<XCircle className="h-3 w-3" />
													)}
													{business.abn_status === "A" ? "Active" : "Cancelled"}
												</div>
											</div>

											<div className="flex flex-wrap gap-2">
												<span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-xs font-medium px-3 py-1 rounded-full border border-blue-200">
													<Building2 className="h-3 w-3" />
													{business.entity_type}
												</span>
												<span
													className={`inline-flex items-center gap-1 text-xs font-medium px-3 py-1 rounded-full border ${
														business.gst_status === "Active"
															? "bg-emerald-50 text-emerald-700 border-emerald-200"
															: "bg-gray-50 text-gray-600 border-gray-200"
													}`}
												>
													<Globe className="h-3 w-3" />
													{business.gst_status} GST
												</span>
											</div>
										</div>
									</div>

									<div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 rounded-xl p-4">
										<div className="flex items-center gap-3">
											<div className="p-2 bg-white rounded-lg shadow-sm">
												<Hash className="h-4 w-4 text-blue-600" />
											</div>
											<div>
												<p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
													ABN
												</p>
												<p className="text-sm font-semibold text-gray-900">
													{business.abn}
												</p>
											</div>
										</div>

										<div className="flex items-center gap-3">
											<div className="p-2 bg-white rounded-lg shadow-sm">
												<MapPin className="h-4 w-4 text-green-600" />
											</div>
											<div>
												<p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
													Location
												</p>
												<p className="text-sm font-semibold text-gray-900">
													{business?.address?.state}{" "}
													{business?.address?.postcode}
												</p>
											</div>
										</div>

										<div className="flex items-center gap-3">
											<div className="p-2 bg-white rounded-lg shadow-sm">
												<Calendar className="h-4 w-4 text-purple-600" />
											</div>
											<div>
												<p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
													Registered
												</p>
												<p className="text-sm font-semibold text-gray-900">
													{business?.registration_date}
												</p>
											</div>
										</div>
									</div>
								</div>

								<div className="ml-6 flex-shrink-0">
									<button className="group/btn flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 hover:text-gray-900 transition-all duration-200 cursor-pointer">
										<Eye className="h-4 w-4" />
										<span>View</span>
									</button>
								</div>
							</div>
						</div>
					</div>
				);
			})}
		</div>
	);
};

export default DataTable;
