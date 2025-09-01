import {
	formatDate,
	formatEffectiveFrom,
	getCompanyInitials,
} from "@/lib/utils";
import { Badge } from "../ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import {
	Briefcase,
	Building2,
	Calendar,
	CheckCircle,
	Clock,
	FileText,
	Globe,
	Hash,
	MapPin,
	Shield,
	Users,
	XCircle,
} from "lucide-react";
import { Separator } from "@radix-ui/react-select";
import type { ABNRecord } from "../../../scripts/data-processor/type";

export const CompanyDetailsSidebar = ({
	company,
	closeSidebar,
}: {
	company: ABNRecord;
	closeSidebar: () => void;
}) => {
	const initials = getCompanyInitials(company.entity_name);

	return (
		<Sheet
			open={company !== null}
			onOpenChange={(open) => !open && closeSidebar()}
		>
			<SheetContent className="w-full sm:w-[540px] sm:max-w-[540px] overflow-y-auto p-4">
				<SheetHeader className="space-y-4 pb-4 border-b">
					<div className="flex items-start gap-4">
						<div className="relative flex-shrink-0">
							<div className="flex items-center justify-center h-16 w-16 rounded-xl bg-gradient-to-br from-slate-600 to-slate-700 text-white font-bold text-xl shadow-lg">
								{initials}
							</div>
							<div className="absolute -bottom-1 -right-1 h-6 w-6 bg-white rounded-full flex items-center justify-center shadow-md">
								{company.abn_status === "A" ? (
									<CheckCircle className="h-4 w-4 text-green-500" />
								) : (
									<XCircle className="h-4 w-4 text-red-500" />
								)}
							</div>
						</div>

						<div className="flex-1 min-w-0">
							<SheetTitle className="text-xl font-bold text-gray-900 leading-tight mb-2">
								{company.entity_name}
							</SheetTitle>
							<div className="flex flex-wrap gap-2">
								<Badge
									variant={
										company.abn_status === "A" ? "success" : "destructive"
									}
									className="flex items-center gap-1"
								>
									{company.abn_status === "A" ? (
										<CheckCircle className="h-3 w-3" />
									) : (
										<XCircle className="h-3 w-3" />
									)}
									{company.abn_status === "A" ? "Active" : "Cancelled"}
								</Badge>
								<Badge variant="secondary" className="flex items-center gap-1">
									<Building2 className="h-3 w-3" />
									{company.entity_type}
								</Badge>
							</div>
						</div>
					</div>
				</SheetHeader>

				<div className="space-y-6">
					<div className="space-y-2">
						<h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
							<Shield className="h-5 w-5 text-blue-600" />
							Business Registration
						</h3>
						<div className="grid gap-4">
							<div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
								<div className="flex items-center gap-3">
									<Hash className="h-4 w-4 text-blue-600" />
									<div>
										<p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
											ABN
										</p>
										<p className="text-sm font-semibold text-gray-900">
											{company.abn}
										</p>
									</div>
								</div>
								<Badge
									variant={
										company.abn_status === "A" ? "success" : "destructive"
									}
								>
									{company.abn_status === "A" ? "Active" : "Cancelled"}
								</Badge>
							</div>

							<div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
								<Calendar className="h-4 w-4 text-purple-600" />
								<div>
									<p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
										Registration Date
									</p>
									<p className="text-sm font-semibold text-gray-900">
										{formatDate(company.registration_date)}
									</p>
								</div>
							</div>

							<div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
								<Globe className="h-4 w-4 text-green-600" />
								<div className="flex-1">
									<p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
										GST Status
									</p>
									<div className="flex items-center justify-between">
										<p className="text-sm font-semibold text-gray-900">
											{company.gst_status}
										</p>
										<Badge
											variant={
												company.gst_status === "Active"
													? "default"
													: "secondary"
											}
										>
											{company.gst_status}
										</Badge>
									</div>
									{company.gst_registration_date && (
										<p className="text-xs text-gray-500 mt-1">
											Registered: {formatDate(company.gst_registration_date)}
										</p>
									)}
								</div>
							</div>
						</div>
					</div>

					<Separator />

					<div className="space-y-2">
						<h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
							<MapPin className="h-5 w-5 text-green-600" />
							Location Details
						</h3>
						<div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-100">
							<div className="space-y-2">
								<div className="flex items-center gap-2">
									<Badge variant="outline" className="text-xs">
										{company?.address?.address_type}
									</Badge>
								</div>
								<p className="text-sm font-semibold text-gray-900">
									{company?.address?.state} {company?.address?.postcode},{" "}
									{company?.address?.country}
								</p>
							</div>
						</div>
					</div>

					<Separator />

					{company.business_names && company.business_names.length > 0 && (
						<>
							<div className="space-y-2">
								<h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
									<Briefcase className="h-5 w-5 text-orange-600" />
									Business Names
								</h3>
								<div className="space-y-3">
									{company.business_names.map((name, index) => (
										<div
											key={index}
											className="p-3 bg-orange-50 rounded-lg border border-orange-100"
										>
											<div className="flex items-start justify-between">
												<div className="flex-1">
													<p className="text-sm font-semibold text-gray-900 mb-1">
														{name.organisationName}
													</p>
													<div className="flex items-center gap-2 text-xs text-gray-600">
														<span>Type: {name.nameType}</span>
														<span>•</span>
														<span>
															Effective:{" "}
															{formatEffectiveFrom(name.effectiveFrom)}
														</span>
													</div>
												</div>
												<Badge variant="outline" className="text-xs">
													{name.nameType}
												</Badge>
											</div>
										</div>
									))}
								</div>
							</div>
							<Separator />
						</>
					)}

					{company.trading_name && (
						<>
							<div className="space-y-2">
								<h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
									<Users className="h-5 w-5 text-indigo-600" />
									Trading Information
								</h3>
								<div className="p-3 bg-indigo-50 rounded-lg border border-indigo-100">
									<p className="text-sm font-semibold text-gray-900">
										{company.trading_name}
									</p>
									<p className="text-xs text-gray-600 mt-1">Trading Name</p>
								</div>
							</div>
							<Separator />
						</>
					)}

					<div className="space-y-4">
						<h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
							<Clock className="h-5 w-5 text-gray-600" />
							System Information
						</h3>
						<div className="space-y-3">
							<div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
								<FileText className="h-4 w-4 text-gray-600" />
								<div>
									<p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
										Last Updated
									</p>
									<p className="text-sm font-semibold text-gray-900">
										{formatDate(company?.last_updated_date || "")}
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</SheetContent>
		</Sheet>
	);
};
