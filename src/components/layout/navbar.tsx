import { Building, Shell } from "lucide-react";

const Navbar = () => {
	return (
		<div className="relative bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 overflow-hidden">
			<div className="absolute inset-0 opacity-10">
				<div className="absolute top-0 left-1/4 w-72 h-72 bg-blue-500 rounded-full blur-3xl"></div>
				<div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500 rounded-full blur-3xl"></div>
			</div>

			<div
				className="absolute inset-0 opacity-5"
				style={{
					backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
					backgroundSize: "20px 20px",
				}}
			></div>

			<div className="relative max-w-7xl mx-auto px-6 py-4">
				<div className="flex items-center justify-between">
					<div className="flex items-center space-x-4">
						<div className="relative">
							<div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg shadow-blue-500/25 group-hover:shadow-blue-500/40 transition-all duration-300">
								<Shell className="h-8 w-8 text-white" />
							</div>
							<div className="absolute -inset-1 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
						</div>

						<div>
							<h1 className="text-3xl font-black bg-gradient-to-r from-white via-blue-100 to-blue-200 bg-clip-text text-transparent">
								ABN Explorer
							</h1>
							<div className="flex items-center gap-2 mt-1">
								<div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
								<p className="text-blue-200 text-sm font-medium">
									Australian Business Register
								</p>
							</div>
						</div>
					</div>

					<div className="flex items-center space-x-8">
						<div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/20">
							<div className="p-2 bg-blue-500/20 rounded-lg">
								<Building className="h-5 w-5 text-blue-300" />
							</div>
							<div>
								<p className="text-blue-100 text-xs font-medium uppercase tracking-wide">
									Total Businesses
								</p>
								<p className="text-white text-lg font-bold">100,000</p>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className="h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent"></div>
		</div>
	);
};

export default Navbar;
