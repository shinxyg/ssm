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
        details JSONB,
        date_submitted TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      ALTER TABLE aics_applications ADD COLUMN IF NOT EXISTS first_name VARCHAR(100);
      ALTER TABLE aics_applications ADD COLUMN IF NOT EXISTS middle_name VARCHAR(100);
      ALTER TABLE aics_applications ADD COLUMN IF NOT EXISTS last_name VARCHAR(100);
      ALTER TABLE aics_applications ADD COLUMN IF NOT EXISTS suffix VARCHAR(20);
      ALTER TABLE aics_applications ADD COLUMN IF NOT EXISTS dob VARCHAR(50);
      ALTER TABLE aics_applications ADD COLUMN IF NOT EXISTS age VARCHAR(10);
      ALTER TABLE aics_applications ADD COLUMN IF NOT EXISTS gender VARCHAR(20);
      ALTER TABLE aics_applications ADD COLUMN IF NOT EXISTS civil_status VARCHAR(50);
      ALTER TABLE aics_applications ADD COLUMN IF NOT EXISTS house_no VARCHAR(100);
      ALTER TABLE aics_applications ADD COLUMN IF NOT EXISTS street_name VARCHAR(150);
      ALTER TABLE aics_applications ADD COLUMN IF NOT EXISTS barangay VARCHAR(150);
      ALTER TABLE aics_applications ADD COLUMN IF NOT EXISTS phone_number VARCHAR(50);
      ALTER TABLE aics_applications ADD COLUMN IF NOT EXISTS is_patient_self BOOLEAN DEFAULT TRUE;
      ALTER TABLE aics_applications ADD COLUMN IF NOT EXISTS patient_relationship VARCHAR(100);
      ALTER TABLE aics_applications ADD COLUMN IF NOT EXISTS patient_first_name VARCHAR(100);
      ALTER TABLE aics_applications ADD COLUMN IF NOT EXISTS patient_middle_name VARCHAR(100);
      ALTER TABLE aics_applications ADD COLUMN IF NOT EXISTS patient_last_name VARCHAR(100);
      ALTER TABLE aics_applications ADD COLUMN IF NOT EXISTS patient_suffix VARCHAR(20);
      ALTER TABLE aics_applications ADD COLUMN IF NOT EXISTS patient_gender VARCHAR(20);
      ALTER TABLE aics_applications ADD COLUMN IF NOT EXISTS patient_dob VARCHAR(50);
      ALTER TABLE aics_applications ADD COLUMN IF NOT EXISTS patient_age VARCHAR(10);
      ALTER TABLE aics_applications ADD COLUMN IF NOT EXISTS patient_house_no VARCHAR(100);
      ALTER TABLE aics_applications ADD COLUMN IF NOT EXISTS patient_street_name VARCHAR(150);
      ALTER TABLE aics_applications ADD COLUMN IF NOT EXISTS patient_barangay VARCHAR(150);
      ALTER TABLE aics_applications ADD COLUMN IF NOT EXISTS nationality VARCHAR(50) DEFAULT 'FILIPINO';
      ALTER TABLE aics_applications ADD COLUMN IF NOT EXISTS details JSONB;

      DROP TABLE IF EXISTS aics_documents CASCADE;

      CREATE TABLE IF NOT EXISTS appointments (
        id SERIAL PRIMARY KEY,
        reference_no VARCHAR(50) NOT NULL,
        module_name VARCHAR(100) NOT NULL,
        applicant_name VARCHAR(255) NOT NULL,
        appointment_date VARCHAR(50) NOT NULL,
        appointment_time VARCHAR(50) NOT NULL,
        venue VARCHAR(255) NOT NULL,
        purpose VARCHAR(255),
        status VARCHAR(50) DEFAULT 'Scheduled',
        social_worker_notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS pwd_applications (
        id SERIAL PRIMARY KEY,
        reference_no VARCHAR(50) UNIQUE NOT NULL,
        applicant_name VARCHAR(255) NOT NULL,
        pwd_id_no VARCHAR(50),
        disability_type VARCHAR(100),
        barangay VARCHAR(150),
        phone_number VARCHAR(50),
        status VARCHAR(100) DEFAULT 'Pending Review',
        date_submitted TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS senior_applications (
        id SERIAL PRIMARY KEY,
        reference_no VARCHAR(50) UNIQUE NOT NULL,
        applicant_name VARCHAR(255) NOT NULL,
        osca_id_no VARCHAR(50),
        dob VARCHAR(50),
        age VARCHAR(10),
        barangay VARCHAR(150),
        phone_number VARCHAR(50),
        status VARCHAR(100) DEFAULT 'Pending Verification',
        date_submitted TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS livelihood_applications (
        id SERIAL PRIMARY KEY,
        reference_no VARCHAR(50) UNIQUE NOT NULL,
        applicant_name VARCHAR(255) NOT NULL,
        program_name VARCHAR(255) NOT NULL,
        proposal_title VARCHAR(255),
        barangay VARCHAR(150),
        phone_number VARCHAR(50),
        status VARCHAR(100) DEFAULT 'Under Evaluation',
        date_submitted TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('✅ Database tables for AICS, Appointments, PWD, Senior, and Livelihood verified & ready!');
    client.release();
  } catch (err) {
    console.error('❌ Database Connection Warning/Notice:', err.message);
  }
};

