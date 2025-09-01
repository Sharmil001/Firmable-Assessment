import { SupabaseUploader } from "./supabase-uploader";
import { XMLParser } from "./xml-parser";

async function processABNData() {
	try {
		// -Parse XML files
		console.log("Parsing XML files...");
		const parser = new XMLParser();
		//NOTE: ADD YOUR XML FILE PATH HERE
		//EXAMPLE: const companies = await parser.parseXMLFileInChunks("scripts/data/20250827_Public01.xml");
		const companies = await parser.parseXMLFileInChunks(
			"scripts/data/20250827_Public01.xml",
		);
		console.log(`Parsed ${companies.length} companies`);

		// -Upload to Supabase
		console.log("Uploading to Supabase...");
		const uploader = new SupabaseUploader();
		await uploader.uploadCompanies(companies);
		console.log("Upload completed");

		// -Testing connection
		// const uploader = new SupabaseUploader();
		// await uploader.getCompanies();

		console.log("Data processing completed successfully!");
	} catch (error) {
		console.error("Error processing data:", error);
		process.exit(1);
	}
}

processABNData();
