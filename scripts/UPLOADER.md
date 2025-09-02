# ABN XML Data Processor

A high-performance Node.js script app for parsing large Australian Business Number (ABN) XML files and uploading the processed data to Supabase. 
This project demonstrates efficient handling of large datasets through chunked processing and batch uploads.

## 🚀 Features

- **Chunked XML Parsing**: Memory-efficient parsing of large XML files using streaming techniques
- **Data Normalization**: Clean and standardize ABN data during processing
- **Batch Upload**: Optimized bulk uploads to Supabase with error handling
- **Error Recovery**: Robust error handling and logging throughout the pipeline
- **Memory Optimization**: Process large datasets without memory overflow

## 🏗️ Architecture

The application follows a modular architecture with clear separation of concerns:

```
├── xml-parser.js       # Handles XML parsing and data normalization
├── supabase-uploader.js # Manages database connections and batch uploads
└── index.js           # Main orchestration and error handling
```

## 🔧 Technical Implementation

### XML Parsing Strategy

The `XMLParser` class implements a streaming-based approach to handle large XML files efficiently:

- **Chunked Processing**: Reads XML in configurable chunks to prevent memory exhaustion
- **Stream-based Parsing**: Uses Node.js streams for optimal memory usage
- **Data Validation**: Validates and normalizes data structures during parsing
- **Progress Tracking**: Provides real-time feedback on parsing progress

### Data Normalization

During parsing, the application performs several normalization steps:

- Cleans and validates ABN numbers
- Standardizes company names and addresses
- Handles missing or malformed data gracefully
- Converts data types to match database schema

### Batch Upload Strategy

The `SupabaseUploader` class optimizes database operations:

- **Batch Processing**: Groups records into optimal batch sizes for Supabase
- **Connection Pooling**: Efficiently manages database connections
- **Error Handling**: Implements retry logic for failed uploads
- **Transaction Safety**: Ensures data consistency during uploads

## 📋 Prerequisites

- Node.js (v18 or higher)
- bun or npm
- Supabase account and project setup
- ABN XML data files

## ⚙️ Setup
Set up environment variables:
```bash
cp .env.example .env
```

Configure your `.env` file:
```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## 🚀 Usage

### Basic Usage

1. Place your XML file in the `scripts/data/` directory
2. Update the file path in `index.ts`:
```typescript
const companies = await parser.parseXMLFileInChunks(
    "scripts/data/your_xml_file.xml"
);
```

3. Run the processor:
```bash
bun run scripts
#or
npm run scripts
```

### Configuration Options

You can customize the processing behavior by modifying the parser configuration:

```javascript
const parser = new XMLParser({
    chunkSize: 1000,        // Number of records per chunk
    batchSize: 100,         // Database batch size
    validateData: true,     // Enable data validation
    normalizeFields: true   // Enable field normalization
});
```

## 📊 Performance Considerations

### Memory Management

- **Streaming Architecture**: Processes files of any size with constant memory usage
- **Garbage Collection**: Properly disposes of processed chunks to prevent memory leaks
- **Buffer Management**: Optimizes buffer sizes for different file sizes

### Database Optimization

- **Batch Uploads**: Reduces database round trips by grouping operations
- **Connection Pooling**: Reuses database connections efficiently
- **Prepared Statements**: Uses parameterized queries for better performance

### Monitoring

The application provides detailed logging for monitoring:

```
Parsing XML files...
Processing chunk 1/50 (2000 records)...
Processing chunk 2/50 (2000 records)...
Parsed 100000 companies
Uploading to Supabase...
Batch upload 1/100 completed (1000 records)...
Upload completed
Data processing completed successfully!
```

## 🗄️ Database Schema

The application expects the following Supabase table structure:

```sql
CREATE TABLE IF NOT EXISTS companies (
  id BIGSERIAL PRIMARY KEY,
  abn TEXT UNIQUE NOT NULL,
  abn_status TEXT,
  entity_type TEXT,
  entity_name TEXT NOT NULL,
  trading_name TEXT,
  gst_status TEXT,
  registration_date TEXT,
  last_updated_date TEXT,
  business_names JSONB, -- Store array of names as JSON
  addresse JSONB,      -- Store address object as JSON
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE UNIQUE INDEX companies_abn_key ON public.companies USING btree (abn)
CREATE UNIQUE INDEX companies_pkey ON public.companies USING btree (id)
CREATE INDEX idx_abn ON public.companies USING btree (abn)
CREATE INDEX idx_companies_entity_name ON public.companies USING btree (entity_name text_pattern_ops)
CREATE INDEX idx_companies_entity_name_sort ON public.companies USING btree (entity_name)
CREATE INDEX idx_abn_sort ON public.companies USING btree (abn)
CREATE INDEX idx_registration_date_sort ON public.companies USING btree (registration_date)
CREATE INDEX idx_companies_address_state ON public.companies USING btree (((address ->> 'state'::text)))
CREATE INDEX idx_entity_type ON public.companies USING btree (entity_type)
CREATE INDEX idx_entity_name ON public.companies USING btree (entity_name)
CREATE INDEX idx_entity_name_tsv ON public.companies USING gin (to_tsvector('english'::regconfig, entity_name))
CREATE INDEX idx_abn_tsv ON public.companies USING gin (to_tsvector('english'::regconfig, abn))
```


## 🔒 Security

- Environment variables for sensitive configuration
- Parameterized queries to prevent SQL injection
- Input validation and sanitization
- Secure connection handling

