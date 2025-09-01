const Loader = () => {
	return (
		<div className="min-h-100 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
			<div className="text-center">
				<div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
				<h2 className="text-xl font-semibold text-gray-700">
					Loading ABN Data...
				</h2>
				<p className="text-gray-500">
					Processing Australian Business Register data
				</p>
			</div>
		</div>
	);
};

export default Loader;
