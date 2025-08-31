"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Search,
	Building2,
	MapPin,
	FileCheck,
	Calendar,
	Filter,
	X,
} from "lucide-react";
import { useEffect, useState } from "react";

const entityTypes = ["Private Company", "Public Company", "Individual"];
const gstStatuses = ["Active", "Inactive"];
const states = ["NSW", "VIC", "QLD", "WA", "SA", "TAS", "ACT", "NT"];

const searchSchema = z.object({
	query: z.string().optional(),
	entityType: z.array(z.string()).optional(),
	state: z.array(z.string()).optional(),
	gstStatus: z.array(z.string()).optional(),
	registrationFrom: z.date().optional(),
	registrationTo: z.date().optional(),
});

export type SearchFormData = z.infer<typeof searchSchema>;

interface SearchFormProps {
	onSearch: (filters: SearchFormData) => void;
	isLoading?: boolean;
}

export function SearchForm({ onSearch, isLoading }: SearchFormProps) {
	const [activeFiltersCount, setActiveFiltersCount] = useState(0);

	const { register, handleSubmit, setValue, watch, reset } =
		useForm<SearchFormData>({
			resolver: zodResolver(searchSchema),
			defaultValues: {
				entityType: [],
				state: [],
				gstStatus: [],
			},
		});

	const selectedEntityTypes = watch("entityType");
	const selectedStates = watch("state");
	const selectedGstStatuses = watch("gstStatus");
	const query = watch("query");

	// Calculate active filters count
	useEffect(() => {
		const count = [
			query?.length > 0 ? 1 : 0,
			selectedEntityTypes?.length > 0 ? 1 : 0,
			selectedStates?.length > 0 ? 1 : 0,
			selectedGstStatuses?.length > 0 ? 1 : 0,
		].reduce((sum, val) => sum + val, 0);
		setActiveFiltersCount(count);
	}, [query, selectedEntityTypes, selectedStates, selectedGstStatuses]);

	const toggleCheckbox = (
		field: "entityType" | "state" | "gstStatus",
		value: string,
	) => {
		const current = watch(field) || [];
		if (current.includes(value)) {
			setValue(
				field,
				current.filter((v) => v !== value),
			);
		} else {
			setValue(field, [...current, value]);
		}
	};

	const clearAllFilters = () => {
		reset({
			query: "",
			entityType: [],
			state: [],
			gstStatus: [],
		});
	};

	return (
		<div className="bg-gradient-to-br from-white to-gray-50 rounded-lg shadow-lg border border-gray-100 overflow-hidden">
			<div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<div className="p-2 bg-white/20 rounded-lg">
							<Filter className="h-5 w-5 text-white" />
						</div>
						<div>
							<h1 className="font-bold text-lg text-white">Search & Filter</h1>
							<p className="text-blue-100 text-xs">
								Find companies with advanced filters
							</p>
						</div>
					</div>
				</div>

				{activeFiltersCount > 0 && (
					<div className="flex items-center gap-2 mt-2">
						<span className="flex gap-1 bg-white/20 text-white text-xs px-2 py-1 rounded-full font-medium">
							<span>{activeFiltersCount} active</span>
							<button onClick={clearAllFilters} title="Clear all filters">
								<X className="h-4 w-4 text-white" />
							</button>
						</span>
					</div>
				)}
			</div>

			{/* Form Content */}
			<form onSubmit={handleSubmit(onSearch)} className="p-6 space-y-6">
				{/* Search Input */}
				<div className="space-y-2">
					<label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
						<Search className="h-4 w-4 text-gray-500" />
						Search Companies
					</label>
					<div className="relative">
						<Input
							{...register("query")}
							placeholder="Search by company name, ABN, or trading name..."
							className="pl-10 py-3 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
						/>
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
					</div>
				</div>

				{/* Entity Type */}
				<div className="space-y-2">
					<label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
						<Building2 className="h-4 w-4 text-gray-500" />
						Entity Type
						{selectedEntityTypes?.length > 0 && (
							<span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full font-medium">
								{selectedEntityTypes.length}
							</span>
						)}
					</label>
					<div className="grid gap-1">
						{entityTypes.map((type) => (
							<div
								key={type}
								className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
							>
								<Checkbox
									checked={selectedEntityTypes?.includes(type)}
									onCheckedChange={() => toggleCheckbox("entityType", type)}
									className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
								/>
								<label className="text-sm font-medium text-gray-700 cursor-pointer flex-1">
									{type}
								</label>
							</div>
						))}
					</div>
				</div>

				{/* GST Status */}
				<div className="space-y-2">
					<label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
						<FileCheck className="h-4 w-4 text-gray-500" />
						GST Status
						{selectedGstStatuses?.length > 0 && (
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
									checked={selectedGstStatuses?.includes(status)}
									onCheckedChange={() => toggleCheckbox("gstStatus", status)}
									className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
								/>
								<label className="text-sm font-medium text-gray-700 cursor-pointer flex-1">
									{status}
								</label>
								<div
									className={`w-2 h-2 rounded-full ${status === "Active" ? "bg-green-500" : "bg-gray-400"}`}
								/>
							</div>
						))}
					</div>
				</div>

				{/* States */}
				<div className="space-y-2">
					<label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
						<MapPin className="h-4 w-4 text-gray-500" />
						Location
						{selectedStates?.length > 0 && (
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
									checked={selectedStates?.includes(state)}
									onCheckedChange={() => toggleCheckbox("state", state)}
									className="data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
								/>
								<label className="text-sm font-medium text-gray-700 cursor-pointer">
									{state}
								</label>
							</div>
						))}
					</div>
				</div>

				<div className="pt-4 border-t border-gray-100">
					<Button
						type="submit"
						disabled={isLoading}
						className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{isLoading ? (
							<div className="flex items-center gap-2">
								<div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
								Searching...
							</div>
						) : (
							<div className="flex items-center gap-2">
								<Search className="h-4 w-4" />
								Apply Filters
							</div>
						)}
					</Button>
				</div>
			</form>
		</div>
	);
}
