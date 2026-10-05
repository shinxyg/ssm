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
      
      -- Funeral Assistance Explicit DB Columns (Step 1 & Step 2)
      ALTER TABLE aics_applications ADD COLUMN IF NOT EXISTS deceased_date_of_death VARCHAR(50);
      ALTER TABLE aics_applications ADD COLUMN IF NOT EXISTS deceased_cremation_or_burial VARCHAR(50);
      ALTER TABLE aics_applications ADD COLUMN IF NOT EXISTS deceased_place_of_death TEXT;
      ALTER TABLE aics_applications ADD COLUMN IF NOT EXISTS deceased_date_of_burial VARCHAR(50);
      ALTER TABLE aics_applications ADD COLUMN IF NOT EXISTS burial_location_site TEXT;
      ALTER TABLE aics_applications ADD COLUMN IF NOT EXISTS cremation_location_site TEXT;
      ALTER TABLE aics_applications ADD COLUMN IF NOT EXISTS funeral_district VARCHAR(50);
      ALTER TABLE aics_applications ADD COLUMN IF NOT EXISTS funeral_home_name VARCHAR(255);
      ALTER TABLE aics_applications ADD COLUMN IF NOT EXISTS initial_funeral_choice VARCHAR(255);
      
      ALTER TABLE aics_applications ADD COLUMN IF NOT EXISTS scheduled_payout_date VARCHAR(50);
      ALTER TABLE aics_applications ADD COLUMN IF NOT EXISTS scheduled_payout_time VARCHAR(50);
      ALTER TABLE aics_applications ADD COLUMN IF NOT EXISTS appointment_date VARCHAR(50);
      ALTER TABLE aics_applications ADD COLUMN IF NOT EXISTS appointment_time VARCHAR(50);
      
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
        first_name VARCHAR(100),
        middle_name VARCHAR(100),
        last_name VARCHAR(100),
        suffix VARCHAR(20),
        dob VARCHAR(50),
        age VARCHAR(10),
        gender VARCHAR(20),
        civil_status VARCHAR(50),
        house_no VARCHAR(100),
        street_name VARCHAR(150),
        barangay VARCHAR(150),
        phone_number VARCHAR(50),
        senior_id_no VARCHAR(50),
        employment_status VARCHAR(100),
        occupation VARCHAR(255),
        source_of_income VARCHAR(255),
        approx_monthly_income VARCHAR(100),
        pension_received VARCHAR(100),
        pension_details VARCHAR(255),
        total_monthly_expenses VARCHAR(100),
        living_arrangement VARCHAR(100),
        custom_living_arrangement VARCHAR(255),
        financial_support_source VARCHAR(100),
        custom_financial_support VARCHAR(255),
        reason_for_assistance VARCHAR(100),
        custom_reason_for_assistance VARCHAR(255),
        other_benefits_received VARCHAR(100),
        custom_other_benefit VARCHAR(255),
        service_name VARCHAR(255) DEFAULT 'Senior Citizen Financial Assistance',
        category VARCHAR(50) DEFAULT 'Senior Assistance',
        assistance_type VARCHAR(100) DEFAULT 'Senior Cash Grant',
        amount NUMERIC(10,2) DEFAULT 3000.00,
        status VARCHAR(100) DEFAULT 'Pending Validation',
        disapproval_reason TEXT,
        appointment_date VARCHAR(50),
        appointment_day VARCHAR(50),
        appointment_time VARCHAR(50),
        appointment_venue VARCHAR(255),
        payout_date VARCHAR(50),
        payout_day VARCHAR(50),
        payout_time VARCHAR(50),
        payout_venue VARCHAR(255),
        details JSONB,
        date_submitted TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      ALTER TABLE senior_applications ADD COLUMN IF NOT EXISTS first_name VARCHAR(100);
      ALTER TABLE senior_applications ADD COLUMN IF NOT EXISTS middle_name VARCHAR(100);
      ALTER TABLE senior_applications ADD COLUMN IF NOT EXISTS last_name VARCHAR(100);
      ALTER TABLE senior_applications ADD COLUMN IF NOT EXISTS suffix VARCHAR(20);
      ALTER TABLE senior_applications ADD COLUMN IF NOT EXISTS dob VARCHAR(50);
      ALTER TABLE senior_applications ADD COLUMN IF NOT EXISTS age VARCHAR(10);
      ALTER TABLE senior_applications ADD COLUMN IF NOT EXISTS gender VARCHAR(20);
      ALTER TABLE senior_applications ADD COLUMN IF NOT EXISTS civil_status VARCHAR(50);
      ALTER TABLE senior_applications ADD COLUMN IF NOT EXISTS house_no VARCHAR(100);
      ALTER TABLE senior_applications ADD COLUMN IF NOT EXISTS street_name VARCHAR(150);
      ALTER TABLE senior_applications ADD COLUMN IF NOT EXISTS barangay VARCHAR(150);
      ALTER TABLE senior_applications ADD COLUMN IF NOT EXISTS phone_number VARCHAR(50);
      ALTER TABLE senior_applications ADD COLUMN IF NOT EXISTS senior_id_no VARCHAR(50);
      ALTER TABLE senior_applications ADD COLUMN IF NOT EXISTS employment_status VARCHAR(100);
      ALTER TABLE senior_applications ADD COLUMN IF NOT EXISTS occupation VARCHAR(255);
      ALTER TABLE senior_applications ADD COLUMN IF NOT EXISTS source_of_income VARCHAR(255);
      ALTER TABLE senior_applications ADD COLUMN IF NOT EXISTS approx_monthly_income VARCHAR(100);
      ALTER TABLE senior_applications ADD COLUMN IF NOT EXISTS pension_received VARCHAR(100);
      ALTER TABLE senior_applications ADD COLUMN IF NOT EXISTS pension_details VARCHAR(255);
      ALTER TABLE senior_applications ADD COLUMN IF NOT EXISTS total_monthly_expenses VARCHAR(100);
      ALTER TABLE senior_applications ADD COLUMN IF NOT EXISTS living_arrangement VARCHAR(100);
      ALTER TABLE senior_applications ADD COLUMN IF NOT EXISTS custom_living_arrangement VARCHAR(255);
      ALTER TABLE senior_applications ADD COLUMN IF NOT EXISTS financial_support_source VARCHAR(100);
      ALTER TABLE senior_applications ADD COLUMN IF NOT EXISTS custom_financial_support VARCHAR(255);
      ALTER TABLE senior_applications ADD COLUMN IF NOT EXISTS reason_for_assistance VARCHAR(100);
      ALTER TABLE senior_applications ADD COLUMN IF NOT EXISTS custom_reason_for_assistance VARCHAR(255);
      ALTER TABLE senior_applications ADD COLUMN IF NOT EXISTS other_benefits_received VARCHAR(100);
      ALTER TABLE senior_applications ADD COLUMN IF NOT EXISTS custom_other_benefit VARCHAR(255);
      ALTER TABLE senior_applications ADD COLUMN IF NOT EXISTS service_name VARCHAR(255) DEFAULT 'Senior Citizen Financial Assistance';
      ALTER TABLE senior_applications ADD COLUMN IF NOT EXISTS category VARCHAR(50) DEFAULT 'Senior Assistance';
      ALTER TABLE senior_applications ADD COLUMN IF NOT EXISTS assistance_type VARCHAR(100) DEFAULT 'Senior Cash Grant';
      ALTER TABLE senior_applications ADD COLUMN IF NOT EXISTS amount NUMERIC(10,2) DEFAULT 3000.00;
      ALTER TABLE senior_applications ADD COLUMN IF NOT EXISTS status VARCHAR(100) DEFAULT 'Pending Validation';
      ALTER TABLE senior_applications ADD COLUMN IF NOT EXISTS disapproval_reason TEXT;
      ALTER TABLE senior_applications ADD COLUMN IF NOT EXISTS appointment_date VARCHAR(50);
      ALTER TABLE senior_applications ADD COLUMN IF NOT EXISTS appointment_day VARCHAR(50);
      ALTER TABLE senior_applications ADD COLUMN IF NOT EXISTS appointment_time VARCHAR(50);
      ALTER TABLE senior_applications ADD COLUMN IF NOT EXISTS appointment_venue VARCHAR(255);
      ALTER TABLE senior_applications ADD COLUMN IF NOT EXISTS payout_date VARCHAR(50);
      ALTER TABLE senior_applications ADD COLUMN IF NOT EXISTS payout_day VARCHAR(50);
      ALTER TABLE senior_applications ADD COLUMN IF NOT EXISTS payout_time VARCHAR(50);
      ALTER TABLE senior_applications ADD COLUMN IF NOT EXISTS payout_venue VARCHAR(255);
      ALTER TABLE senior_applications ADD COLUMN IF NOT EXISTS details JSONB;
      ALTER TABLE senior_applications ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

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

