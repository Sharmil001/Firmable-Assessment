"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Search,
	Building2,
	MapPin,
	FileCheck,
	Filter,
	X,
	Hash,
	Info,
} from "lucide-react";
import { useEffect, useState } from "react";
import { states, gstStatuses } from "@/lib/constants";
import { ComplexSelector } from "../common/complex-selector";

type EntityType = string;

const searchSchema = z.object({
	query: z.string().optional(),
	entityType: z.array(z.string()).optional(),
	state: z.array(z.string()).optional(),
	gstStatus: z.array(z.string()).optional(),
	registrationFrom: z.date().optional(),
	registrationTo: z.date().optional(),
	abn: z.string().optional(),
	postcode: z.string().optional(),
});

export type SearchFormData = z.infer<typeof searchSchema>;

interface SearchFormProps {
	searchFilters: SearchFormData;
	onSearch: (filters: SearchFormData) => void;
	isLoading?: boolean;
}

export function SearchForm({
	searchFilters,
	onSearch,
	isLoading = false,
}: SearchFormProps) {
	const [activeFiltersCount, setActiveFiltersCount] = useState<number>(0);
	const [isEntityTypeDropdownOpen, setIsEntityTypeDropdownOpen] =
		useState<boolean>(false);

	const {
		register,
		handleSubmit,
		setValue,
		watch,
		reset,
		formState: { errors },
	} = useForm<SearchFormData>({
		resolver: zodResolver(searchSchema),
		defaultValues: {
			entityType: [],
			state: [],
			gstStatus: [],
		},
	});

	const selectedEntityTypes = watch("entityType") || [];
	const selectedStates = watch("state") || [];
	const selectedGstStatuses = watch("gstStatus") || [];
	const query = watch("query") || "";
	const abn = watch("abn") || "";
	const postcode = watch("postcode") || "";

	useEffect(() => {
		if (searchFilters) {
			reset({
				query: searchFilters.query || "",
				entityType: searchFilters.entityType || [],
				state: searchFilters.state || [],
				gstStatus: searchFilters.gstStatus || [],
				registrationFrom: searchFilters.registrationFrom,
				registrationTo: searchFilters.registrationTo,
				abn: searchFilters.abn || "",
				postcode: searchFilters.postcode || "",
			});
		}
	}, [searchFilters, reset]);

	useEffect(() => {
		const count = [
			query.length > 0,
			selectedEntityTypes.length > 0,
			selectedStates.length > 0,
			selectedGstStatuses.length > 0,
			abn.length > 0,
			postcode.length > 0,
		].filter(Boolean).length;

		setActiveFiltersCount(count);
	}, [
		query,
		selectedEntityTypes,
		selectedStates,
		selectedGstStatuses,
		watch("abn"),
		watch("postcode"),
	]);

	useEffect(() => {
		const handler = setTimeout(() => {
			const filters = {
				query,
				abn,
				postcode,
				entityType: selectedEntityTypes,
				state: selectedStates,
				gstStatus: selectedGstStatuses,
			};
			onSearch(filters);
		}, 1000);

		return () => clearTimeout(handler);
	}, [
		query,
		abn,
		postcode,
		selectedEntityTypes,
		selectedStates,
		selectedGstStatuses,
		onSearch,
	]);

	const toggleCheckbox = (
		field: "state" | "gstStatus",
		value: string,
	): void => {
		const current = watch(field) || [];
		const newValue = current.includes(value)
			? current.filter((v) => v !== value)
			: [value];
		setValue(field, newValue);
	};

	const clearAllFilters = (): void => {
		const cleaned = {
			query: "",
			entityType: [],
			state: [],
			gstStatus: [],
			abn: "",
			postcode: "",
		};
		reset(cleaned);
		setIsEntityTypeDropdownOpen(false);
		onSearch(cleaned);
	};

	const handleEntityTypeToggle = (): void => {
		setIsEntityTypeDropdownOpen(!isEntityTypeDropdownOpen);
	};

	const handleEntityTypeClose = (): void => {
		setIsEntityTypeDropdownOpen(false);
	};

	const handleEntityTypeChange = (types: EntityType[]): void => {
		setValue("entityType", [types[types.length - 1]]);
	};

	// const onSubmit = (data: SearchFormData): void => {
	// 	onSearch(data);
	// 	setIsEntityTypeDropdownOpen(false);
	// };

	return (
		<div className="bg-gradient-to-br from-white to-gray-50 rounded-lg shadow-lg border border-gray-100 overflow-hidden">
			<div className="px-6 py-4 border-b border-gray-200">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<div className="p-2 bg-blue-400/20 rounded-lg">
							<Filter className="h-5 w-5 text-blue-600" />
						</div>
						<div>
							<h1 className="font-bold text-base text-gray-900">
								Search & Filter
							</h1>
							<p className="text-xs text-gray-600">
								Find companies with advanced filters
							</p>
						</div>
					</div>
				</div>

				{activeFiltersCount > 0 && (
					<div className="flex items-center gap-2 mt-3">
						<div className="flex items-center gap-1 bg-blue-400/20 text-blue-600 text-xs px-2 py-1 rounded-full font-medium">
							<span>
								{activeFiltersCount} active filter
								{activeFiltersCount !== 1 ? "s" : ""}
							</span>
							<button
								onClick={clearAllFilters}
								title="Clear all filters"
								className="hover:bg-blue-500/20 rounded-full p-0.5 transition-colors focus:outline-none focus:ring-1 focus:ring-blue-500"
								aria-label="Clear all filters"
							>
								<X className="h-3 w-3 text-blue-600" />
							</button>
						</div>
					</div>
				)}
			</div>

			<div className="p-6 space-y-4">
				<div className="space-y-2 border-b border-gray-100 pb-4">
					<div className="space-y-2">
						<label
							htmlFor="search-query"
							className="flex items-center gap-2 text-sm font-semibold text-gray-700"
						>
							<Search className="h-4 w-4 text-gray-500" />
							Companies Name
							<span className="relative group">
								<Info className="h-3 w-3 text-gray-500 ml-1" />
								<p className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 bg-gray-700 text-white text-xs rounded-md px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
									Enter the exact company name for accurate results
								</p>
							</span>
						</label>
						<div className="relative">
							<Input
								{...register("query")}
								id="search-query"
								placeholder="Search by company name..."
								className="pl-10 py-5 text-base border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
								aria-describedby={errors.query ? "query-error" : undefined}
							/>
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
						</div>
						{errors.query && (
							<p id="query-error" className="text-xs text-red-600">
								{errors.query.message}
							</p>
						)}
					</div>

					<div className="space-y-2">
						<label
							htmlFor="search-abn"
							className="flex items-center gap-2 text-sm font-semibold text-gray-700"
						>
							<Hash className="h-4 w-4 text-gray-500" />
							ABN
							<span className="relative group">
								<Info className="h-3 w-3 text-gray-500 ml-1" />
								<p className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 bg-gray-700 text-white text-xs rounded-md px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
									Enter the full ABN number for accurate results
								</p>
							</span>
						</label>

						<div className="relative">
							<Input
								{...register("abn")}
								id="search-abn"
								placeholder="Search by ABN..."
								className="pl-10 py-5 text-base border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all w-full"
							/>
							<Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
						</div>
					</div>

					<div className="space-y-2">
						<label
							htmlFor="search-postcode"
							className="flex items-center gap-2 text-sm font-semibold text-gray-700"
						>
							<MapPin className="h-4 w-4 text-gray-500" />
							Postcode
							<span className="relative group">
								<Info className="h-3 w-3 text-gray-500 ml-1" />
								<p className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 bg-gray-700 text-white text-xs rounded-md px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
									Enter the full postcode for accurate results
								</p>
							</span>
						</label>
						<div className="relative">
							<Input
								{...register("postcode")}
								id="search-postcode"
								placeholder="Search by postcode..."
								className="pl-10 py-5 text-base border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all w-full"
							/>
							<MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
						</div>
					</div>
				</div>

				<div className="space-y-2 border-b border-gray-100 pb-4">
					<label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
						<Building2 className="h-4 w-4 text-gray-500" />
						Entity Type
						{selectedEntityTypes.length > 0 && (
							<span className="bg-pink-100 text-pink-700 text-xs px-2 py-0.5 rounded-full font-medium">
								{selectedEntityTypes.length}
							</span>
						)}
					</label>
					<ComplexSelector
						selectedTypes={selectedEntityTypes}
						onSelectionChange={handleEntityTypeChange}
						isOpen={isEntityTypeDropdownOpen}
						onToggle={handleEntityTypeToggle}
						onClose={handleEntityTypeClose}
					/>
				</div>

				<div className="space-y-2">
					<label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
						<FileCheck className="h-4 w-4 text-gray-500" />
						GST Status
						{selectedGstStatuses.length > 0 && (
							<span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-medium">
								{selectedGstStatuses.length}
							</span>
						)}
					</label>
					<div className="grid gap-1">
						{gstStatuses.map((status) => (
							<div
								key={status}
								className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
							>
								<Checkbox
									checked={selectedGstStatuses.includes(status)}
									onCheckedChange={() => toggleCheckbox("gstStatus", status)}
									className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
									aria-describedby={`gst-status-${status.toLowerCase()}`}
								/>
								<label
									htmlFor={`gst-status-${status.toLowerCase()}`}
									className="text-sm font-medium text-gray-700 cursor-pointer flex-1"
								>
									{status}
								</label>
								<div
									className={`w-2 h-2 rounded-full ${
										status === "Active" ? "bg-green-500" : "bg-gray-400"
									}`}
									aria-hidden="true"
								/>
							</div>
						))}
					</div>
				</div>

				<div className="space-y-2">
					<label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
						<MapPin className="h-4 w-4 text-gray-500" />
						Location
						{selectedStates.length > 0 && (
							<span className="bg-purple-100 text-purple-700 text-xs px-2 py-0.5 rounded-full font-medium">
								{selectedStates.length}
							</span>
						)}
					</label>
					<div className="grid grid-cols-2 gap-2">
						{states.map((state) => (
							<div
								key={state}
								className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 transition-colors"
							>
								<Checkbox
									checked={selectedStates.includes(state)}
									onCheckedChange={() => toggleCheckbox("state", state)}
									className="data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
									aria-describedby={`state-${state.toLowerCase()}`}
								/>
								<label
									htmlFor={`state-${state.toLowerCase()}`}
									className="text-sm font-medium text-gray-700 cursor-pointer"
								>
									{state}
								</label>
							</div>
						))}
					</div>
				</div>

				{/* <div className="pt-4 border-t border-gray-100"> */}
				{/* 	<button */}
				{/* 		onClick={handleSubmit(onSubmit)} */}
				{/* 		disabled={isLoading} */}
				{/* 		className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-2 px-6 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2" */}
				{/* 		aria-label={ */}
				{/* 			isLoading */}
				{/* 				? "Searching companies..." */}
				{/* 				: "Search companies with current filters" */}
				{/* 		} */}
				{/* 	> */}
				{/* 		{isLoading ? ( */}
				{/* 			<span className="flex items-center justify-center gap-2"> */}
				{/* 				<div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> */}
				{/* 				Searching... */}
				{/* 			</span> */}
				{/* 		) : ( */}
				{/* 			"Search Companies" */}
				{/* 		)} */}
				{/* 	</button> */}
				{/* </div> */}
			</div>
		</div>
	);
}
