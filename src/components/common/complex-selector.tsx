import {
	entityTypeDescriptions,
	entityTypes,
	popularEntityTypes,
} from "@/lib/constants";
import { Building2, Check, ChevronDown, Search } from "lucide-react";
import { useEffect, useState } from "react";

type EntityType = string;

interface EntityTypeSelectorProps {
	selectedTypes: EntityType[];
	onSelectionChange: (types: EntityType[]) => void;
	isOpen: boolean;
	onToggle: () => void;
	onClose: () => void;
}

export function ComplexSelector({
	selectedTypes,
	onSelectionChange,
	isOpen,
	onToggle,
	onClose,
}: EntityTypeSelectorProps) {
	const [searchTerm, setSearchTerm] = useState<string>("");

	const filteredTypes: EntityType[] = entityTypes.filter(
		(type) =>
			type.toLowerCase().includes(searchTerm.toLowerCase()) ||
			entityTypeDescriptions[type]
				?.toLowerCase()
				.includes(searchTerm.toLowerCase()),
	);

	const toggleType = (type: EntityType): void => {
		if (selectedTypes.includes(type)) {
			onSelectionChange(selectedTypes.filter((t) => t !== type));
		} else {
			onSelectionChange([...selectedTypes, type]);
		}
	};

	const selectPopularTypes = (): void => {
		const newSelection = [
			...new Set([...selectedTypes, ...popularEntityTypes]),
		];
		onSelectionChange(newSelection);
	};

	const clearAll = (): void => {
		onSelectionChange([]);
	};

	const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>): void => {
		if (e.target === e.currentTarget) {
			onClose();
		}
	};

	useEffect(() => {
		const handleEscapeKey = (event: KeyboardEvent): void => {
			if (event.key === "Escape" && isOpen) {
				onClose();
			}
		};

		if (isOpen) {
			document.addEventListener("keydown", handleEscapeKey);
			document.body.style.overflow = "hidden";
		}

		return () => {
			document.removeEventListener("keydown", handleEscapeKey);
			document.body.style.overflow = "unset";
		};
	}, [isOpen, onClose]);

	return (
		<div className="relative">
			<button
				type="button"
				onClick={onToggle}
				className={`w-full p-3 border-2 rounded-xl text-left transition-all duration-200 ${
					isOpen
						? "border-blue-500 bg-blue-50/50 shadow-lg"
						: "border-gray-200 hover:border-gray-300 bg-white"
				}`}
				aria-expanded={isOpen}
				aria-haspopup="listbox"
				aria-label="Select entity types"
			>
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2 flex-1 min-w-0">
						<Building2 className="h-4 w-4 text-gray-500 flex-shrink-0" />
						{selectedTypes.length === 0 ? (
							<span className="text-gray-500">Select entity types...</span>
						) : (
							<div className="flex items-center gap-1 flex-1 min-w-0">
								<span className="text-sm font-medium flex-shrink-0">
									{selectedTypes.length} selected
								</span>
								{selectedTypes.length <= 2 && (
									<div className="flex gap-1 ml-2 flex-1 min-w-0">
										{selectedTypes.slice(0, 2).map((type) => (
											<span
												key={type}
												className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-medium flex-shrink-0"
											>
												{type}
											</span>
										))}
									</div>
								)}
							</div>
						)}
					</div>
					<ChevronDown
						className={`h-4 w-4 text-gray-500 transition-transform flex-shrink-0 ${
							isOpen ? "rotate-180" : ""
						}`}
					/>
				</div>
			</button>

			{isOpen && (
				<div
					className="fixed inset-0 z-40"
					onClick={handleBackdropClick}
					aria-hidden="true"
				/>
			)}

			{isOpen && (
				<div
					className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-50 max-h-96 overflow-hidden"
					role="listbox"
					aria-multiselectable="true"
				>
					<div className="p-4 border-b border-gray-100 bg-gray-50/50">
						<div className="relative mb-3">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
							<input
								type="text"
								placeholder="Search entity types..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
								aria-label="Search entity types"
							/>
						</div>

						<div className="flex gap-2">
							<button
								type="button"
								onClick={selectPopularTypes}
								className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
								aria-label="Select popular entity types"
							>
								Select Popular
							</button>
							<button
								type="button"
								onClick={clearAll}
								className="text-xs bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-200 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-1"
								aria-label="Clear all selections"
							>
								Clear All
							</button>
						</div>
					</div>

					<div className="max-h-64 overflow-y-auto">
						{filteredTypes.length === 0 ? (
							<div className="p-4 text-center text-gray-500 text-sm">
								No entity types found
							</div>
						) : (
							<div className="p-2">
								{filteredTypes.map((type) => {
									const isSelected = selectedTypes.includes(type);
									const isPopular = popularEntityTypes.includes(type);

									return (
										<button
											key={type}
											type="button"
											onClick={() => toggleType(type)}
											className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset ${
												isSelected
													? "bg-blue-50 border border-blue-200 shadow-sm"
													: "hover:bg-gray-50"
											}`}
											role="option"
											aria-selected={isSelected}
										>
											<div
												className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 ${
													isSelected
														? "bg-blue-600 border-blue-600"
														: "border-gray-300"
												}`}
											>
												{isSelected && <Check className="h-3 w-3 text-white" />}
											</div>
											<div className="flex-1 min-w-0">
												<div className="flex items-center gap-2">
													<span className="text-sm font-medium text-gray-900">
														{type}
													</span>
													{isPopular && (
														<span className="text-xs bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded-full font-medium">
															Popular
														</span>
													)}
												</div>
												<div className="text-xs text-gray-500 truncate">
													{entityTypeDescriptions[type]}
												</div>
											</div>
										</button>
									);
								})}
							</div>
						)}
					</div>
				</div>
			)}
		</div>
	);
}
