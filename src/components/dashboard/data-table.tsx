import { getCompanyInitials } from "@/lib/utils";
import type { ABNRecord } from "../../../scripts/data-processor/type";
import {
	Building2,
	Calendar,
	CheckCircle,
	Eye,
	MapPin,
	XCircle,
	Hash,
	Globe,
} from "lucide-react";
import { Button } from "../ui/button";

const DataTable = ({
	data,
	setCompany,
}: {
	data: ABNRecord[];
	setCompany: (data: ABNRecord) => void;
}) => {
	return (
		<div className="space-y-3 sm:space-y-4 mt-4 sm:mt-6 px-2 sm:px-0 h-full">
			{data?.map((business, index) => {
				const initials = getCompanyInitials(business.entity_name);

				return (
					<div
						key={business.abn}
						className="group relative bg-white rounded-xl sm:rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all duration-300 overflow-hidden"
						style={{
							animationDelay: `${index * 50}ms`,
							animation: "slideIn 0.5s ease-out forwards",
						}}
					>
						<div className="p-4 sm:p-6">
							<div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
								<div className="flex-1 min-w-0">
									<div className="flex items-start gap-3 sm:gap-4 mb-4 sm:mb-5">
										<div className="relative flex-shrink-0">
											<div className="flex items-center justify-center h-12 w-12 rounded-lg bg-gradient-to-br from-slate-600 to-slate-700 text-white font-bold text-sm sm:text-lg shadow-md group-hover:scale-110 transition-transform duration-300">
												{initials}
											</div>
											<div className="absolute -bottom-1 -right-1 h-4 w-4 sm:h-5 sm:w-5 bg-white rounded-full flex items-center justify-center shadow-md">
												{business.abn_status === "A" ? (
													<CheckCircle className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-green-500" />
												) : (
													<XCircle className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-red-500" />
												)}
											</div>
										</div>

										<div className="flex-1 min-w-0">
											<div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
												<h3
													className="text-base sm:text-lg lg:text-lg font-bold text-gray-900 group-hover:text-blue-700 transition-colors leading-tight"
													title={business.entity_name}
												>
													<span className="block sm:hidden">
														{business.entity_name.length > 10
															? `${business.entity_name.substring(0, 10)}...`
															: business.entity_name}
													</span>
													<span className="hidden sm:block lg:hidden">
														{business.entity_name.length > 20
															? `${business.entity_name.substring(0, 20)}...`
															: business.entity_name}
													</span>
													<span className="hidden lg:block">
														{business.entity_name.length > 30
															? `${business.entity_name.substring(0, 30)}...`
															: business.entity_name}
													</span>
												</h3>
												<div
													className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-semibold flex-shrink-0 ${
														business.abn_status === "A"
															? "bg-green-50 text-green-700 border border-green-200"
															: "bg-red-50 text-red-700 border border-red-200"
													}`}
												>
													{business.abn_status === "A" ? (
														<CheckCircle className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
													) : (
														<XCircle className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
													)}
													<span className="hidden sm:inline">
														{business.abn_status === "A"
															? "Active"
															: "Cancelled"}
													</span>
													<span className="sm:hidden">
														{business.abn_status === "A" ? "A" : "C"}
													</span>
												</div>
											</div>

											<div className="flex flex-wrap gap-1.5 sm:gap-2">
												<span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-xs font-medium px-2 sm:px-3 py-0.5 sm:py-1 rounded-full border border-blue-200">
													<Building2 className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
													<span className="hidden sm:inline">
														{business.entity_type}
													</span>
													<span className="sm:hidden">
														{business.entity_type === "Private Company"
															? "Private"
															: business.entity_type === "Public Company"
																? "Public"
																: business.entity_type}
													</span>
												</span>
												<span
													className={`inline-flex items-center gap-1 text-xs font-medium px-2 sm:px-3 py-0.5 sm:py-1 rounded-full border ${
														business.gst_status === "Active"
															? "bg-emerald-50 text-emerald-700 border-emerald-200"
															: "bg-gray-50 text-gray-600 border-gray-200"
													}`}
												>
													<Globe className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
													<span className="hidden sm:inline">
														{business.gst_status} GST
													</span>
													<span className="sm:hidden">GST</span>
												</span>
											</div>
										</div>
									</div>

									<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 bg-gray-50 rounded-lg sm:rounded-xl p-3 sm:p-4">
										<div className="flex items-center gap-2 sm:gap-3">
											<div className="p-1.5 sm:p-2 bg-white rounded-md sm:rounded-lg shadow-sm flex-shrink-0">
												<Hash className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-600" />
											</div>
											<div className="min-w-0 flex-1">
												<p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
													ABN
												</p>
												<p className="text-xs sm:text-sm font-semibold text-gray-900 truncate">
													{business.abn}
												</p>
											</div>
										</div>

										<div className="flex items-center gap-2 sm:gap-3">
											<div className="p-1.5 sm:p-2 bg-white rounded-md sm:rounded-lg shadow-sm flex-shrink-0">
												<MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-600" />
											</div>
											<div className="min-w-0 flex-1">
												<p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
													Location
												</p>
												<p className="text-xs sm:text-sm font-semibold text-gray-900 truncate">
													{business?.address?.state}{" "}
													{business?.address?.postcode}
												</p>
											</div>
										</div>

										<div className="flex items-center gap-2 sm:gap-3 sm:col-span-2 lg:col-span-1">
											<div className="p-1.5 sm:p-2 bg-white rounded-md sm:rounded-lg shadow-sm flex-shrink-0">
												<Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-purple-600" />
											</div>
											<div className="min-w-0 flex-1">
												<p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
													Registered
												</p>
												<p className="text-xs sm:text-sm font-semibold text-gray-900 truncate">
													{business?.registration_date}
												</p>
											</div>
										</div>
									</div>
								</div>

								<div className="flex-shrink-0 self-start">
									<Button
										variant="outline"
										className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-md sm:rounded-lg hover:bg-gray-50 hover:border-gray-300 hover:text-gray-900 transition-all duration-200 cursor-pointer"
										onClick={() => setCompany(business)}
									>
										<Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
										<span>View</span>
									</Button>
								</div>
							</div>
						</div>
					</div>
				);
			})}
			{data?.length === 0 ||
				(!data && (
					<div className="flex flex-col gap-2 items-center justify-center text-center h-full">
						<Building2 className="h-16 w-16 text-gray-500" />
						<h2 className="text-xl font-semibold text-gray-500">
							No companies found
						</h2>
					</div>
				))}
		</div>
	);
};

export default DataTable;
