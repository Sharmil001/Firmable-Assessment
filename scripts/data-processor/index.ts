import { XMLParser } from "./xml-parser";
// import { DataNormalizer } from "./data-normalizer";
// import { SupabaseUploader } from "./supabase-uploader";

async function processABNData() {
	console.log("🚀 Starting ABN data processing...");

	try {
		// 1. Parse XML files
		console.log("📄 Parsing XML files...");
		const parser = new XMLParser();
		const companies = await parser.parseXMLFileInChunks("../data/test.xml");
		console.log(`✅ Parsed ${companies.length} companies`);
		console.log(`✅ Parsed ${companies[0]} companies`);

		// 2. Normalize data
		// console.log(companies[0], "FIRST COMPANY");
		// console.log("🔧 Normalizing data...");
		// const normalizedCompanies = companies.map(DataNormalizer.normalizeCompany);
		// console.log(`✅ Normalized ${normalizedCompanies.length} companies`);
		//
		// 3. Upload to Supabase
		// console.log("📤 Uploading to Supabase...");
		// const uploader = new SupabaseUploader();
		// await uploader.uploadCompanies(normalizedCompanies);
		// console.log("✅ Upload completed");

		console.log("🎉 Data processing completed successfully!");
	} catch (error) {
		console.error("❌ Error processing data:", error);
		process.exit(1);
	}
}

processABNData();
