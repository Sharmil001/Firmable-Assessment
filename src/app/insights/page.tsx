"use client";

import React, { useMemo, useState } from "react";
import {
	Building2,
	Shield,
	TrendingUp,
	BarChart3,
	Landmark,
	AlertCircle,
	ChevronDown,
	ChevronUp,
	Info,
	Eye,
	EyeOff,
} from "lucide-react";
import { useCompanyStats } from "@/hooks/useCompanyStats";
import {
	ErrorStateProps,
	MarketAnalysis,
	Categories,
	CategoryCardProps,
	TopEntityCardProps,
} from "@/types/company";
import Loader from "@/components/common/loader";
import { ANIMATION_DURATION, GRADIENT_COLORS } from "@/lib/constants";

const formatNumber = (num: number): string => num.toLocaleString();
const formatPercentage = (value: number, decimals = 1): string =>
	`${value.toFixed(decimals)}%`;
const calculatePercentage = (part: number, total: number): number =>
	total > 0 ? (part / total) * 100 : 0;

const ErrorState: React.FC<ErrorStateProps> = ({ error, onRetry }) => (
	<div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
		<AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
		<h3 className="text-lg font-semibold text-red-800 mb-2">
			Failed to Load Business Intelligence
		</h3>
		<p className="text-red-600 mb-4">{error}</p>
		{onRetry && (
			<button
				onClick={onRetry}
				className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium"
			>
				Retry Loading
			</button>
		)}
	</div>
);

const TopEntityCard: React.FC<TopEntityCardProps> = ({
	code,
	count,
	index,
	totalEntities,
}) => {
	const percentage = calculatePercentage(count, totalEntities);
	const gradientColor = GRADIENT_COLORS[index % GRADIENT_COLORS.length];

	return (
		<div className="text-center p-6 bg-gradient-to-br from-white to-gray-50 rounded-xl hover:shadow-lg transition-all duration-300 group border border-gray-100">
			<div className="flex items-center justify-center mb-3">
				<div className="text-xs font-bold text-white bg-gradient-to-r from-gray-600 to-gray-700 px-3 py-1 rounded-full">
					#{index + 1}
				</div>
			</div>

			<div className="text-base font-bold text-gray-800 mb-2 font-mono tracking-wider">
				{code}
			</div>

			<div className="text-xl font-bold text-gray-900 mb-4">
				{formatNumber(count)}
			</div>

			<div className="w-full bg-gray-200 rounded-full h-3 mb-3 overflow-hidden">
				<div
					className={`bg-gradient-to-r ${gradientColor} h-3 rounded-full transition-all ${ANIMATION_DURATION.extra_slow} ease-out transform origin-left group-hover:scale-x-105`}
					style={{ width: `${Math.min(100, percentage * 1.5)}%` }}
				/>
			</div>

			<div className="text-base font-semibold text-gray-700">
				{formatPercentage(percentage)}
			</div>

			<div className="text-xs text-gray-500 mt-1">of total entities</div>
		</div>
	);
};

const CategoryCard: React.FC<CategoryCardProps> = ({
	data,
	totalEntities,
	onToggleExpanded,
	isExpanded,
	category,
}) => {
	const totalCategoryCount = data.entities.reduce(
		(sum, entity) => sum + entity.count,
		0,
	);
	const visibleEntities = isExpanded
		? data.entities
		: data.entities.slice(0, 3);
	const hasMoreEntities = data.entities.length > 3;

	return (
		<div
			className={`bg-gradient-to-br ${data.bgColor} rounded-xl p-8 border border-white/60 hover:shadow-xl transition-all ${ANIMATION_DURATION.medium} group cursor-pointer`}
		>
			<div className="flex items-center justify-between mb-8">
				<div className="flex items-center gap-4">
					<div
						className={`p-4 bg-gradient-to-r ${data.color} rounded-xl shadow-xl group-hover:scale-110 transition-transform ${ANIMATION_DURATION.medium}`}
					>
						<data.icon className="h-7 w-7 text-white" />
					</div>
					<div>
						<h3 className="text-xl font-bold text-gray-800">{data.name}</h3>
						<p className="text-sm text-gray-600 font-medium">
							{data.entities.length} entity type
							{data.entities.length !== 1 ? "s" : ""}
						</p>
					</div>
				</div>
				<div className="text-right">
					<div className="text-xl font-bold text-gray-800">
						{formatNumber(totalCategoryCount)}
					</div>
					<div className="text-sm text-gray-600 font-medium">
						total entities
					</div>
				</div>
			</div>

			<div className="space-y-4">
				{visibleEntities.map((entity) => {
					const percentage = calculatePercentage(entity.count, totalEntities);
					return (
						<div
							key={entity.code}
							className="flex items-center justify-between p-4 bg-white/70 rounded-xl backdrop-blur-sm border border-white/50 hover:bg-white/90 transition-all duration-200"
						>
							<div className="flex-1">
								<div className="flex items-center gap-3 mb-2">
									<span className="text-xs font-bold text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
										{entity.code}
									</span>
									<span className="text-base font-semibold text-gray-800">
										{entity.name}
									</span>
								</div>
								<div className="text-sm text-gray-600 leading-relaxed">
									{entity.description}
								</div>
							</div>
							<div className="text-right ml-4">
								<div className="text-lg font-bold text-gray-800 mb-1">
									{formatNumber(entity.count)}
								</div>
								<div className="text-sm text-gray-600 font-medium">
									{formatPercentage(percentage)}
								</div>
							</div>
						</div>
					);
				})}
			</div>

			{hasMoreEntities && (
				<button
					onClick={() => onToggleExpanded(category)}
					className="w-full mt-6 flex items-center justify-center gap-2 text-gray-700 hover:text-gray-900 py-3 font-medium transition-colors duration-200 bg-white/50 rounded-xl hover:bg-white/70"
				>
					{isExpanded ? (
						<>
							<EyeOff className="h-4 w-4" />
							Show Less
							<ChevronUp className="h-4 w-4" />
						</>
					) : (
						<>
							<Eye className="h-4 w-4" />+{data.entities.length - 3} more
							entities
							<ChevronDown className="h-4 w-4" />
						</>
					)}
				</button>
			)}
		</div>
	);
};

const EntityTypesDashboard: React.FC = () => {
	const { entityTypes, isLoading, error } = useCompanyStats();
	const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
		new Set(),
	);
	const calculations = useMemo(() => {
		if (!entityTypes || Object.keys(entityTypes).length === 0) {
			return null;
		}

		const totalEntities = Object.values(entityTypes).reduce(
			(sum, count) => sum + count,
			0,
		);

		const topEntities = Object.entries(entityTypes)
			.sort(([, a], [, b]) => b - a)
			.slice(0, 5);

		const marketAnalysis: MarketAnalysis = {
			privateCompanies: calculatePercentage(
				entityTypes.PRV || 0,
				totalEntities,
			),
			trusts: calculatePercentage(
				(entityTypes.FPT || 0) +
					(entityTypes.SMF || 0) +
					(entityTypes.DIT || 0) +
					(entityTypes.DTT || 0),
				totalEntities,
			),
			partnerships: calculatePercentage(entityTypes.PTR || 0, totalEntities),
			publicCompanies: calculatePercentage(entityTypes.PUB || 0, totalEntities),
		};

		return { totalEntities, topEntities, marketAnalysis };
	}, [entityTypes]);

	const categories: Categories = useMemo(
		() => ({
			major: {
				name: "Major Business Types",
				icon: Building2,
				color: "from-blue-500 to-indigo-600",
				bgColor: "from-blue-50 to-indigo-50",
				entities: [
					{
						code: "PRV",
						name: "Private Company",
						count: entityTypes?.PRV || 0,
						description: "Standard private companies driving the economy",
					},
					{
						code: "FPT",
						name: "Fixed Trust",
						count: entityTypes?.FPT || 0,
						description: "Investment & property trust structures",
					},
					{
						code: "SMF",
						name: "SMSF",
						count: entityTypes?.SMF || 0,
						description: "Self-managed superannuation funds",
					},
					{
						code: "DIT",
						name: "Discretionary Investment Trust",
						count: entityTypes?.DIT || 0,
						description: "Flexible family & investment trusts",
					},
					{
						code: "DTT",
						name: "Discretionary Trading Trust",
						count: entityTypes?.DTT || 0,
						description: "Active business trading structures",
					},
					{
						code: "PTR",
						name: "Partnership",
						count: entityTypes?.PTR || 0,
						description: "Collaborative business partnerships",
					},
				].filter((entity) => entity.count > 0),
			},
			investment: {
				name: "Investment & Finance",
				icon: TrendingUp,
				color: "from-emerald-500 to-teal-600",
				bgColor: "from-emerald-50 to-teal-50",
				entities: [
					{
						code: "FUT",
						name: "Unit Trust",
						count: entityTypes?.FUT || 0,
						description: "Diversified investment vehicles",
					},
					{
						code: "OIE",
						name: "Other Incorporated Entity",
						count: entityTypes?.OIE || 0,
						description: "Specialized corporate structures",
					},
					{
						code: "STR",
						name: "Strata Title",
						count: entityTypes?.STR || 0,
						description: "Property ownership & management",
					},
					{
						code: "TRT",
						name: "Testamentary Trust",
						count: entityTypes?.TRT || 0,
						description: "Estate planning & inheritance",
					},
					{
						code: "UIE",
						name: "Unincorporated Entity",
						count: entityTypes?.UIE || 0,
						description: "Informal business arrangements",
					},
					{
						code: "DST",
						name: "Discretionary Services Trust",
						count: entityTypes?.DST || 0,
						description: "Service-oriented trust structures",
					},
				].filter((entity) => entity.count > 0),
			},
			public: {
				name: "Public & Government",
				icon: Landmark,
				color: "from-purple-500 to-pink-600",
				bgColor: "from-purple-50 to-pink-50",
				entities: [
					{
						code: "PUB",
						name: "Public Company",
						count: entityTypes?.PUB || 0,
						description: "Listed & unlisted public corporations",
					},
					{
						code: "DES",
						name: "Deceased Estate",
						count: entityTypes?.DES || 0,
						description: "Estate administration entities",
					},
					{
						code: "FXT",
						name: "Fixed Unit Trust",
						count: entityTypes?.FXT || 0,
						description: "Structured investment products",
					},
					{
						code: "HYT",
						name: "Hybrid Trust",
						count: entityTypes?.HYT || 0,
						description: "Mixed-purpose trust vehicles",
					},
				].filter((entity) => entity.count > 0),
			},
			specialized: {
				name: "Specialized Entities",
				icon: Shield,
				color: "from-orange-500 to-red-600",
				bgColor: "from-orange-50 to-red-50",
				entities: [
					{
						code: "SGE",
						name: "Strata Group Entity",
						count: entityTypes?.SGE || 0,
						description: "Multi-property management",
					},
					{
						code: "LPT",
						name: "Listed Property Trust",
						count: entityTypes?.LPT || 0,
						description: "Public real estate investment",
					},
					{
						code: "PQT",
						name: "Pooled Superannuation Trust",
						count: entityTypes?.PQT || 0,
						description: "Institutional super funds",
					},
					{
						code: "SAF",
						name: "Small APRA Fund",
						count: entityTypes?.SAF || 0,
						description: "Regulated small super funds",
					},
				].filter((entity) => entity.count > 0),
			},
		}),
		[entityTypes],
	);

	const handleToggleExpanded = (category: string): void => {
		setExpandedCategories((prev) => {
			const newSet = new Set(prev);
			if (newSet.has(category)) {
				newSet.delete(category);
			} else {
				newSet.add(category);
			}
			return newSet;
		});
	};

	const handleRetry = (): void => {
		window.location.reload();
	};

	if (isLoading) {
		return (
			<div className="space-y-8 container mx-auto p-6">
				<Loader />
			</div>
		);
	}

	if (error) {
		return (
			<div className="space-y-8 container mx-auto p-6">
				<ErrorState error={error} onRetry={handleRetry} />
			</div>
		);
	}

	if (!calculations) {
		return (
			<div className="space-y-8 container mx-auto p-6">
				<div className="bg-yellow-50 border border-yellow-200 rounded-xl p-8 text-center">
					<Info className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
					<h3 className="text-lg font-semibold text-yellow-800 mb-2">
						No Entity Data Available
					</h3>
					<p className="text-yellow-600">
						Please check your data source and try again.
					</p>
				</div>
			</div>
		);
	}

	const { totalEntities, topEntities } = calculations;

	return (
		<div className="space-y-12 container mx-auto p-6 max-w-7xl">
			<div className="text-center mb-12">
				<h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent mb-2">
					Australian Business Entity Intelligence
				</h1>
				<p className="text-base text-gray-600 max-w-xl mx-auto">
					Comprehensive analysis of {formatNumber(totalEntities)} registered
					entities across {Object.keys(entityTypes).length} distinct business
					structures
				</p>
			</div>

			<div className="bg-white rounded-xl hover:shadow-xl transition-shadow duration-500 p-8 border border-gray-100">
				<div className="flex items-center justify-between mb-8">
					<div className="flex items-center gap-4">
						<div className="p-4 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-lg">
							<BarChart3 className="h-5 w-5 text-white" />
						</div>
						<div>
							<h3 className="text-xl font-bold text-gray-900">
								Top Business Structures
							</h3>
							<p className="text-gray-600 font-medium">
								Most registered entity types by volume
							</p>
						</div>
					</div>
					<div className="text-right">
						<div className="text-sm text-gray-500 font-medium">
							Showing Top 5
						</div>
						<div className="text-xs text-gray-400">
							of {Object.keys(entityTypes).length} total types
						</div>
					</div>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-5 gap-6">
					{topEntities.map(([code, count], index) => (
						<TopEntityCard
							key={code}
							code={code}
							count={count}
							index={index}
							totalEntities={totalEntities}
						/>
					))}
				</div>
			</div>

			<div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
				{Object.entries(categories).map(([key, category]) => (
					<CategoryCard
						key={key}
						category={key}
						data={category}
						totalEntities={totalEntities}
						onToggleExpanded={handleToggleExpanded}
						isExpanded={expandedCategories.has(key)}
					/>
				))}
			</div>
		</div>
	);
};

export default EntityTypesDashboard;
