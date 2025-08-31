import { ChevronDown, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

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
	const sortOptions = [
		{ value: "entity_name", label: "Company Name" },
		{ value: "abn", label: "ABN" },
		{ value: "registration_date", label: "Registration Date" },
	];

	const currentOption = sortOptions.find(
		(option) => option.value === sorting.sortBy,
	);

	return (
		<div className="flex items-center gap-3">
			<div className="relative">
				<select
					value={sorting.sortBy}
					onChange={(e) => setSorting({ ...sorting, sortBy: e.target.value })}
					className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2.5 pr-10 text-sm font-medium text-gray-700 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 cursor-pointer"
				>
					{sortOptions.map((option) => (
						<option key={option.value} value={option.value}>
							{option.label}
						</option>
					))}
				</select>
				<ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
			</div>

			<button
				onClick={() =>
					setSorting({
						...sorting,
						sortOrder: sorting.sortOrder === "asc" ? "desc" : "asc",
					})
				}
				className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm font-medium text-gray-700 group"
				title={`Sort ${sorting.sortOrder === "asc" ? "descending" : "ascending"}`}
			>
				{sorting.sortOrder === "asc" ? (
					<ArrowUp className="h-4 w-4 text-blue-600" />
				) : (
					<ArrowDown className="h-4 w-4 text-blue-600" />
				)}
				<span className="hidden sm:inline">
					{sorting.sortBy === "entity_name"
						? sorting.sortOrder === "asc"
							? "A-Z"
							: "Z-A"
						: sorting.sortBy === "registration_date"
							? sorting.sortOrder === "asc"
								? "O-N"
								: "N-O"
							: sorting.sortOrder === "asc"
								? "L-H"
								: "H-L"}
				</span>
			</button>

			<div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
				<ArrowUpDown className="h-3 w-3" />
				<span>
					{currentOption?.label} •{" "}
					{sorting.sortOrder === "asc" ? "Ascending" : "Descending"}
				</span>
			</div>
		</div>
	);
}
