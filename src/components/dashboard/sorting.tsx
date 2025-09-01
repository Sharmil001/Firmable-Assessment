import { sortOptions } from "@/lib/constants";
import { ChevronDown, ArrowUpDown } from "lucide-react";

export function DataTableSorting({
	sorting,
	setSorting,
}: {
	sorting: {
		sortBy: string;
		sortOrder: string;
	};
	setSorting: (order: { sortBy: string; sortOrder: string }) => void;
}) {
	return (
		<div className="flex items-center gap-3">
			<div className="relative">
				<select
					value={sorting.sortBy}
					onChange={(e) => setSorting({ ...sorting, sortBy: e.target.value })}
					className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2.5 pr-10 text-sm font-medium text-gray-700 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 cursor-pointer"
				>
					{sortOptions?.map((option) => (
						<option key={option.value} value={option.value}>
							{option.label}
						</option>
					))}
				</select>
				<ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
			</div>
			<div
				className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-sm text-xs font-medium cursor-pointer h-10"
				onClick={() =>
					setSorting({
						...sorting,
						sortOrder: sorting.sortOrder === "asc" ? "desc" : "asc",
					})
				}
			>
				<ArrowUpDown className="h-3 w-3" />
				<span>{sorting.sortOrder === "asc" ? "ASC" : "DESC"}</span>
			</div>
		</div>
	);
}
