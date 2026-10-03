import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

export const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'govserve_db',
  password: process.env.DB_PASSWORD || 'postgres',
  port: parseInt(process.env.DB_PORT || '5432', 10),
});

// Helper function to test DB connection and initialize tables
export const initDB = async () => {
  try {
    const client = await pool.connect();
    console.log('✅ Connected to PostgreSQL database successfully!');

    // Initialize core tables matching Step 2 Personal Information & Patient Details
    await client.query(`
      CREATE TABLE IF NOT EXISTS aics_applications (
        id SERIAL PRIMARY KEY,
        reference_no VARCHAR(50) UNIQUE NOT NULL,
        applicant_name VARCHAR(255) NOT NULL,
        first_name VARCHAR(100),
        middle_name VARCHAR(100),
        last_name VARCHAR(100),
        suffix VARCHAR(20),
        nationality VARCHAR(50) DEFAULT 'FILIPINO',
        dob VARCHAR(50),
        age VARCHAR(10),
        gender VARCHAR(20),
        civil_status VARCHAR(50),
        house_no VARCHAR(100),
        street_name VARCHAR(150),
        barangay VARCHAR(150),
        phone_number VARCHAR(50),
        
        -- Patient Beneficiary Fields (Step 2)
        is_patient_self BOOLEAN DEFAULT TRUE,
        patient_relationship VARCHAR(100),
        patient_first_name VARCHAR(100),
        patient_middle_name VARCHAR(100),
        patient_last_name VARCHAR(100),
        patient_suffix VARCHAR(20),
        patient_gender VARCHAR(20),
        patient_dob VARCHAR(50),
        patient_age VARCHAR(10),
        patient_house_no VARCHAR(100),
        patient_street_name VARCHAR(150),
        patient_barangay VARCHAR(150),

        -- Service & Status Fields
        service_name VARCHAR(255) NOT NULL,
        category VARCHAR(50) DEFAULT 'AICS',
        assistance_type VARCHAR(100),
        hospital_facility VARCHAR(255),
        medical_condition TEXT,
        status VARCHAR(100) DEFAULT 'Under Review',
        assigned_social_worker VARCHAR(255),
        benefit_document_type VARCHAR(255) DEFAULT 'Hospital Guarantee Letter (GL)',
        date_submitted TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS aics_documents (
        id SERIAL PRIMARY KEY,
        application_ref VARCHAR(50) REFERENCES aics_applications(reference_no) ON DELETE CASCADE,
        document_key VARCHAR(100) NOT NULL,
        file_name VARCHAR(255) NOT NULL,
        file_type VARCHAR(100),
        uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('✅ Database tables matching Step 2 Applicant & Patient details verified & ready!');
    client.release();
  } catch (err) {
    console.error('❌ Database Connection Warning/Notice:', err.message);
  }
};
