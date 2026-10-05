import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import { pool, initDB } from './db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Setup Nodemailer Transporter using Gmail App Password
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// POST endpoint to send emails
app.post('/api/send-email', async (req, res) => {
  const { to, subject, text, html } = req.body;
  if (!to || !subject) {
    return res.status(400).json({ error: 'Recipient "to" and "subject" are required.' });
  }

  try {
    const info = await transporter.sendMail({
      from: `"GovServe Social Services" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text: text || '',
      html: html || text || '',
    });
    console.log('Email sent:', info.messageId);
    res.json({ success: true, messageId: info.messageId });
  } catch (err) {
    console.error('Email sending error:', err);
    res.status(500).json({ error: 'Failed to send email', details: err.message });
  }
});
// Helper to check if current real-time clock >= scheduled date & time
const isScheduledTimeReached = (dStr, tStr) => {
  if (!dStr || !tStr) return false;
  try {
    let year, month, day;
    if (typeof dStr === 'string' && dStr.includes('-')) {
      const parts = dStr.split('-');
      year = parseInt(parts[0], 10);
      month = parseInt(parts[1], 10) - 1;
      day = parseInt(parts[2], 10);
    } else {
      const dt = new Date(dStr);
      if (isNaN(dt.getTime())) return false;
      year = dt.getFullYear();
      month = dt.getMonth();
      day = dt.getDate();
    }

    let hours = 0, minutes = 0;
    if (typeof tStr === 'string' && tStr.includes(':')) {
      const isPM = tStr.toUpperCase().includes('PM');
      const isAM = tStr.toUpperCase().includes('AM');
      const cleanTime = tStr.replace(/(AM|PM|\s)/gi, '');
      const tParts = cleanTime.split(':');
      hours = parseInt(tParts[0], 10);
      minutes = parseInt(tParts[1], 10);
      if (isPM && hours < 12) hours += 12;
      if (isAM && hours === 12) hours = 0;
    }

    const schedDate = new Date(year, month, day, hours, minutes, 0, 0);
    const now = new Date();
    return now.getTime() >= schedDate.getTime();
  } catch (e) {
    return false;
  }
};

// Automatic 1-second interval to auto-release payouts when exact scheduled date & time is reached
setInterval(async () => {
  try {
    const result = await pool.query(`
      SELECT reference_no, scheduled_payout_date, scheduled_payout_time, status 
      FROM aics_applications 
      WHERE (status = 'Payout Scheduled' OR status = 'Ready for Payout' OR status = 'Approved') 
        AND scheduled_payout_date IS NOT NULL 
        AND scheduled_payout_time IS NOT NULL
    `);
    for (const row of result.rows) {
      if (isScheduledTimeReached(row.scheduled_payout_date, row.scheduled_payout_time)) {
        console.log(`⏰ [AUTO-TRIGGER] Scheduled payout time reached for ${row.reference_no}! Auto-updating status to RELEASED / COMPLETED`);
        await pool.query(`UPDATE aics_applications SET status = 'RELEASED / COMPLETED', updated_at = NOW() WHERE reference_no = $1`, [row.reference_no]);
      }
    }
  } catch (err) {
    // ignore
  }
}, 1000);

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    const dbRes = await pool.query('SELECT NOW()');
    res.json({
      status: 'online',
      system: 'GovServe Social Services API Server',
      database: 'connected',
      dbTime: dbRes.rows[0].now,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.json({
      status: 'online',
      system: 'GovServe Social Services API Server',
      database: 'disconnected',
      error: err.message,
      timestamp: new Date().toISOString()
    });
  }
});

// GET all AICS applications from PostgreSQL DB
app.get('/api/aics/applications', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM aics_applications ORDER BY date_submitted DESC');
    const formatted = result.rows.map(row => ({
      referenceNo: row.reference_no,
      applicantName: row.applicant_name,
      serviceName: row.service_name,
      category: row.category,
      assistanceType: row.assistance_type,
      hospitalFacility: row.hospital_facility,
      medicalCondition: row.medical_condition,
      status: row.status,
      scheduledPayoutDate: row.scheduled_payout_date,
      scheduledPayoutTime: row.scheduled_payout_time,
      appointmentDate: row.appointment_date,
      appointmentTime: row.appointment_time,
      appointmentDetails: {
        appointmentDate: row.appointment_date || row.scheduled_payout_date,
        appointmentTime: row.appointment_time || row.scheduled_payout_time,
        venue: 'QC Hall SSDD Desk 3, Ground Flr High-Rise Bldg',
        assignedWorker: row.assigned_social_worker || 'Maria Santos, RSW'
      },
      amountOrType: row.assistance_type || 'Guarantee Letter / Financial Subsidy',
      assignedSocialWorker: row.assigned_social_worker,
      benefitDocumentType: row.benefit_document_type,
      dateSubmitted: row.date_submitted ? `${new Date(row.date_submitted).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} • ${new Date(row.date_submitted).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}` : 'Today',
      details: row.details || {
        applicantName: row.applicant_name,
        firstName: row.first_name || '',
        middleName: row.middle_name || '',
        lastName: row.last_name || '',
        suffix: row.suffix || '',
        dob: row.dob || '',
        age: row.age || '',
        gender: row.gender || '',
        civilStatus: row.civil_status || '',
        houseNo: row.house_no || '',
        street: row.street_name || '',
        barangay: row.barangay || '',
        fullAddress: [row.house_no, row.street_name, row.barangay ? `Brgy. ${row.barangay}` : '', 'Quezon City'].filter(Boolean).join(', '),
        phone: row.phone_number || '',
        isApplicantPatient: row.is_patient_self !== undefined ? row.is_patient_self : true,
        patientRelation: row.patient_relationship || 'Self',
        patientName: [row.patient_first_name, row.patient_middle_name, row.patient_last_name, row.patient_suffix].filter(Boolean).join(' ') || row.applicant_name,
        patientGender: row.patient_gender || row.gender || '',
        patientDob: row.patient_dob || row.dob || '',
        patientAge: row.patient_age || row.age || '',
        patientAddress: [row.patient_house_no, row.patient_street_name, row.patient_barangay ? `Brgy. ${row.patient_barangay}` : '', 'Quezon City'].filter(Boolean).join(', '),
        hospitalFacility: row.hospital_facility,
        medicalCondition: row.medical_condition,
        category: row.category,
        assistanceType: row.assistance_type
      }
    }));
    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST submit new AICS application to PostgreSQL DB
app.post('/api/aics/applications', async (req, res) => {
  const { 
    referenceNo, 
    applicantName, 
    serviceName, 
    category, 
    assistanceType, 
    hospitalFacility, 
    medicalCondition, 
    assignedSocialWorker, 
    benefitDocumentType,
    status,
    details
  } = req.body;

  try {
    const refNo = referenceNo || `QC-AICS-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const name = applicantName || details?.applicantName || 'Applicant';
    const firstName = details?.firstName || name.split(' ')[0] || '';
    const middleName = details?.middleName || '';
    const lastName = details?.lastName || name.split(' ').pop() || '';
    const suffix = details?.suffix || '';
    const dob = details?.dob || '';
    const age = details?.age || '';
    const gender = details?.gender || '';
    const civilStatus = details?.civilStatus || '';
    const houseNo = details?.houseNo || '';
    const streetName = details?.street || details?.streetName || '';
    const barangay = details?.barangay || '';
    const phoneNumber = details?.phone || details?.phoneNumber || '';

    const isPatientSelf = details?.isApplicantPatient !== undefined ? details.isApplicantPatient : true;
    const patientRel = details?.patientRelation || (isPatientSelf ? 'Self' : '');
    const patientFirst = details?.patientFirstName || (isPatientSelf ? firstName : '');
    const patientMiddle = details?.patientMiddleName || (isPatientSelf ? middleName : '');
    const patientLast = details?.patientLastName || (isPatientSelf ? lastName : '');
    const patientSuf = details?.patientSuffix || (isPatientSelf ? suffix : '');
    const patientGender = details?.patientGender || (isPatientSelf ? gender : '');
    const patientDob = details?.patientDob || (isPatientSelf ? dob : '');
    const patientAge = details?.patientAge || (isPatientSelf ? age : '');
    const patientHouse = details?.patientHouseNo || houseNo;
    const patientStreet = details?.patientStreet || streetName;
    const patientBrgy = details?.patientBarangay || barangay;

    const sName = serviceName || 'QC Medical Assistance';
    const cat = category || 'AICS';
    const astType = assistanceType || details?.assistanceType || 'Medical Assistance';
    const hosp = hospitalFacility || details?.hospitalFacility || details?.hospital || '';
    const cond = medicalCondition || details?.medicalCondition || details?.diagnosis || '';
    const worker = assignedSocialWorker || 'Social Worker Maria Santos, RSW (QC CSWDO)';
    const appStatus = status || 'Under Review';
    const defaultBenefit = benefitDocumentType || (astType === 'Medicines / Medical Supplies'
      ? 'Medicine Gift Certificate / Pharmacy Voucher'
      : 'Hospital Guarantee Letter (GL)');

    const deceasedDateOfDeath = details?.deceasedDateOfDeath || '';
    const deceasedCremationOrBurial = details?.deceasedCremationOrBurial || '';
    const deceasedPlaceOfDeath = details?.deceasedPlaceOfDeath || '';
    const deceasedDateOfBurial = details?.deceasedDateOfBurial || '';
    const burialLocationSite = details?.burialLocationSite || '';
    const cremationLocationSite = details?.cremationLocationSite || '';
    const funeralDistrict = details?.funeralDistrict || '';
    const funeralHomeName = details?.funeralHomeName || hosp || '';
    const initialFuneralChoice = details?.selectedFuneralHome || '';

    const savedDetails = JSON.stringify(details || { applicantName: name, hospitalFacility: hosp, medicalCondition: cond, category: cat, assistanceType: astType });

    const query = `
      INSERT INTO aics_applications 
      (
        reference_no, applicant_name, first_name, middle_name, last_name, suffix, dob, age, gender, civil_status, house_no, street_name, barangay, phone_number,
        is_patient_self, patient_relationship, patient_first_name, patient_middle_name, patient_last_name, patient_suffix, patient_gender, patient_dob, patient_age, patient_house_no, patient_street_name, patient_barangay,
        service_name, category, assistance_type, hospital_facility, medical_condition, status, assigned_social_worker, benefit_document_type,
        deceased_date_of_death, deceased_cremation_or_burial, deceased_place_of_death, deceased_date_of_burial, burial_location_site, cremation_location_site, funeral_district, funeral_home_name, initial_funeral_choice,
        details
      )
      VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14,
        $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26,
        $27, $28, $29, $30, $31, $32, $33, $34,
        $35, $36, $37, $38, $39, $40, $41, $42, $43,
        $44
      )
      ON CONFLICT (reference_no) DO UPDATE SET
        applicant_name = EXCLUDED.applicant_name,
        first_name = EXCLUDED.first_name,
        middle_name = EXCLUDED.middle_name,
        last_name = EXCLUDED.last_name,
        suffix = EXCLUDED.suffix,
        dob = EXCLUDED.dob,
        age = EXCLUDED.age,
        gender = EXCLUDED.gender,
        civil_status = EXCLUDED.civil_status,
        house_no = EXCLUDED.house_no,
        street_name = EXCLUDED.street_name,
        barangay = EXCLUDED.barangay,
        phone_number = EXCLUDED.phone_number,
        is_patient_self = EXCLUDED.is_patient_self,
        patient_relationship = EXCLUDED.patient_relationship,
        patient_first_name = EXCLUDED.patient_first_name,
        patient_middle_name = EXCLUDED.patient_middle_name,
        patient_last_name = EXCLUDED.patient_last_name,
        patient_suffix = EXCLUDED.patient_suffix,
        patient_gender = EXCLUDED.patient_gender,
        patient_dob = EXCLUDED.patient_dob,
        patient_age = EXCLUDED.patient_age,
        patient_house_no = EXCLUDED.patient_house_no,
        patient_street_name = EXCLUDED.patient_street_name,
        patient_barangay = EXCLUDED.patient_barangay,
        assistance_type = EXCLUDED.assistance_type,
        hospital_facility = EXCLUDED.hospital_facility,
        medical_condition = EXCLUDED.medical_condition,
        status = EXCLUDED.status,
        deceased_date_of_death = EXCLUDED.deceased_date_of_death,
        deceased_cremation_or_burial = EXCLUDED.deceased_cremation_or_burial,
        deceased_place_of_death = EXCLUDED.deceased_place_of_death,
        deceased_date_of_burial = EXCLUDED.deceased_date_of_burial,
        burial_location_site = EXCLUDED.burial_location_site,
        cremation_location_site = EXCLUDED.cremation_location_site,
        funeral_district = EXCLUDED.funeral_district,
        funeral_home_name = EXCLUDED.funeral_home_name,
        initial_funeral_choice = EXCLUDED.initial_funeral_choice,
        details = EXCLUDED.details,
        updated_at = NOW()
      RETURNING *;
    `;
    const values = [
      refNo, name, firstName, middleName, lastName, suffix, dob, age, gender, civilStatus, houseNo, streetName, barangay, phoneNumber,
      isPatientSelf, patientRel, patientFirst, patientMiddle, patientLast, patientSuf, patientGender, patientDob, patientAge, patientHouse, patientStreet, patientBrgy,
      sName, cat, astType, hosp, cond, appStatus, worker, defaultBenefit,
      deceasedDateOfDeath, deceasedCremationOrBurial, deceasedPlaceOfDeath, deceasedDateOfBurial, burialLocationSite, cremationLocationSite, funeralDistrict, funeralHomeName, initialFuneralChoice,
      savedDetails
    ];

    const result = await pool.query(query, values);
    const row = result.rows[0];
    const formatted = {
      referenceNo: row.reference_no,
      applicantName: row.applicant_name,
      serviceName: row.service_name,
      category: row.category,
      assistanceType: row.assistance_type,
      hospitalFacility: row.hospital_facility,
      medicalCondition: row.medical_condition,
      status: row.status,
      amountOrType: row.assistance_type || 'Guarantee Letter / Financial Subsidy',
      assignedSocialWorker: row.assigned_social_worker,
      benefitDocumentType: row.benefit_document_type,
      dateSubmitted: row.date_submitted ? new Date(row.date_submitted).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Today',
      details: row.details || {
        qcId: '110000262304143',
        applicantName: row.applicant_name,
        firstName: row.first_name,
        middleName: row.middle_name,
        lastName: row.last_name,
        suffix: row.suffix,
        dob: row.dob,
        age: row.age,
        gender: row.gender,
        civilStatus: row.civil_status,
        houseNo: row.house_no,
        street: row.street_name,
        barangay: row.barangay,
        fullAddress: [row.house_no, row.street_name, row.barangay ? `Brgy. ${row.barangay}` : '', 'Quezon City'].filter(Boolean).join(', '),
        phone: row.phone_number,
        isApplicantPatient: row.is_patient_self,
        patientRelation: row.patient_relationship,
        patientName: [row.patient_first_name, row.patient_middle_name, row.patient_last_name, row.patient_suffix].filter(Boolean).join(' '),
        patientGender: row.patient_gender,
        patientDob: row.patient_dob,
        patientAge: row.patient_age,
        patientAddress: [row.patient_house_no, row.patient_street_name, row.patient_barangay ? `Brgy. ${row.patient_barangay}` : '', 'Quezon City'].filter(Boolean).join(', '),
        hospitalFacility: row.hospital_facility,
        medicalCondition: row.medical_condition,
        category: row.category,
        assistanceType: row.assistance_type
      }
    };
    res.status(201).json(formatted);
  } catch (err) {
    console.error('Database POST error:', err);
    res.status(500).json({ error: err.message });
  }
});

// PUT update application status & scheduled dates/times in PostgreSQL DB
app.put('/api/aics/applications/:refNo/status', async (req, res) => {
  const { refNo } = req.params;
  const { status, scheduledPayoutDate, scheduledPayoutTime, appointmentDate, appointmentTime, appointmentDetails } = req.body;

  const apptDate = appointmentDate || appointmentDetails?.appointmentDate || null;
  const apptTime = appointmentTime || appointmentDetails?.appointmentTime || null;

  try {
    const query = `
      UPDATE aics_applications 
      SET status = $1, 
          scheduled_payout_date = COALESCE($2, scheduled_payout_date),
          scheduled_payout_time = COALESCE($3, scheduled_payout_time),
          appointment_date = COALESCE($4, appointment_date),
          appointment_time = COALESCE($5, appointment_time),
          updated_at = NOW() 
      WHERE reference_no = $6 
      RETURNING *;
    `;
    const result = await pool.query(query, [status, scheduledPayoutDate || null, scheduledPayoutTime || null, apptDate, apptTime, refNo]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Application not found' });
    }
    const row = result.rows[0];
    console.log(`✅ Updated status for ${refNo} to "${status}" (Appt: ${row.appointment_date} ${row.appointment_time}, Payout: ${row.scheduled_payout_date} ${row.scheduled_payout_time}) in DB`);
    const formatted = {
      referenceNo: row.reference_no,
      applicantName: row.applicant_name,
      serviceName: row.service_name,
      category: row.category,
      assistanceType: row.assistance_type,
      status: row.status,
      scheduledPayoutDate: row.scheduled_payout_date,
      scheduledPayoutTime: row.scheduled_payout_time,
      appointmentDate: row.appointment_date,
      appointmentTime: row.appointment_time,
      appointmentDetails: {
        appointmentDate: row.appointment_date || row.scheduled_payout_date,
        appointmentTime: row.appointment_time || row.scheduled_payout_time,
        venue: 'QC Hall SSDD Desk 3, Ground Flr High-Rise Bldg',
        assignedWorker: row.assigned_social_worker || 'Maria Santos, RSW'
      },
      amountOrType: row.assistance_type || 'Guarantee Letter / Financial Subsidy',
      assignedSocialWorker: row.assigned_social_worker,
      benefitDocumentType: row.benefit_document_type,
      dateSubmitted: row.date_submitted ? new Date(row.date_submitted).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Today',
      details: {
        applicantName: row.applicant_name,
        hospital: row.hospital_facility,
        diagnosis: row.medical_condition
      }
    };
    res.json(formatted);
  } catch (err) {
    console.error('Error updating status in DB:', err);
    res.status(500).json({ error: err.message });
  }
});

// GET all Senior Citizen applications from PostgreSQL DB
app.get('/api/senior/applications', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM senior_applications ORDER BY date_submitted DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST submit new Senior Citizen application to PostgreSQL DB
app.post('/api/senior/applications', async (req, res) => {
  const { 
    referenceNo, 
    applicantName, 
    firstName,
    middleName,
    lastName,
    suffix,
    dob,
    age,
    gender,
    civilStatus,
    houseNo,
    streetName,
    barangay,
    phoneNumber,
    seniorIdNo,
    status,
    details
  } = req.body;

  try {
    const refNo = referenceNo || `SENIOR-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const name = applicantName || details?.personalInformation?.applicantName || `${firstName || ''} ${lastName || ''}`.trim() || 'Senior Applicant';
    const savedDetails = JSON.stringify(details || {});

    const empStatus = details?.occupationFinancialInformation?.employmentStatus || '';
    const occ = details?.occupationFinancialInformation?.occupation || '';
    const srcIncome = details?.occupationFinancialInformation?.sourceOfIncome || '';
    const approxInc = details?.occupationFinancialInformation?.approxMonthlyIncome || '';
    const pensionRec = details?.occupationFinancialInformation?.pensionReceived || '';
    const pensionDet = details?.occupationFinancialInformation?.otherPensionDetails || '';
    const monthlyExp = details?.monthlyHouseholdExpenses?.totalMonthlyExpenses || '';
    const livArrangement = details?.livingSituationAdditionalInfo?.livingArrangement || '';
    const custLivArrangement = details?.livingSituationAdditionalInfo?.customLivingArrangement || '';
    const finSupportSrc = details?.livingSituationAdditionalInfo?.financialSupportSource || '';
    const custFinSupport = details?.livingSituationAdditionalInfo?.customFinancialSupport || '';
    const reasonAssist = details?.livingSituationAdditionalInfo?.reasonForAssistance || '';
    const custReasonAssist = details?.livingSituationAdditionalInfo?.customReasonForAssistance || '';
    const otherBenRec = details?.otherAssistanceBenefits?.benefitReceived || '';
    const custOtherBen = details?.otherAssistanceBenefits?.customBenefitReceived || '';

    const query = `
      INSERT INTO senior_applications (
        reference_no, applicant_name, first_name, middle_name, last_name, suffix, dob, age, gender, civil_status, house_no, street_name, barangay, phone_number, senior_id_no,
        employment_status, occupation, source_of_income, approx_monthly_income, pension_received, pension_details, total_monthly_expenses,
        living_arrangement, custom_living_arrangement, financial_support_source, custom_financial_support, reason_for_assistance, custom_reason_for_assistance,
        other_benefits_received, custom_other_benefit, status, details
      )
      VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15,
        $16, $17, $18, $19, $20, $21, $22,
        $23, $24, $25, $26, $27, $28,
        $29, $30, $31, $32
      )
      ON CONFLICT (reference_no) DO UPDATE SET
        applicant_name = EXCLUDED.applicant_name,
        details = EXCLUDED.details,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *;
    `;

    const values = [
      refNo,
      name,
      firstName || details?.personalInformation?.firstName || '',
      middleName || details?.personalInformation?.middleName || '',
      lastName || details?.personalInformation?.lastName || '',
      suffix || details?.personalInformation?.suffix || '',
      dob || details?.personalInformation?.dateOfBirth || '',
      age || details?.personalInformation?.age || '',
      gender || details?.personalInformation?.gender || '',
      civilStatus || details?.personalInformation?.civilStatus || '',
      houseNo || details?.personalInformation?.houseNo || '',
      streetName || details?.personalInformation?.streetName || '',
      barangay || details?.personalInformation?.barangay || '',
      phoneNumber || details?.personalInformation?.phoneNumber || '',
      seniorIdNo || details?.personalInformation?.seniorCitizenId || '',
      empStatus,
      occ,
      srcIncome,
      approxInc,
      pensionRec,
      pensionDet,
      monthlyExp,
      livArrangement,
      custLivArrangement,
      finSupportSrc,
      custFinSupport,
      reasonAssist,
      custReasonAssist,
      otherBenRec,
      custOtherBen,
      status || 'Pending Validation',
      savedDetails
    ];

    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error saving senior application to DB:', err);
    res.status(500).json({ error: err.message });
  }
});

// PUT update status/schedule of a Senior application
app.put('/api/senior/applications/:id/status', async (req, res) => {
  const { id } = req.params;
  const { 
    status, 
    disapprovalReason, 
    appointmentDate, 
    appointmentDay, 
    appointmentTime, 
    appointmentVenue, 
    payoutDate, 
    payoutDay, 
    payoutTime, 
    payoutVenue 
  } = req.body;

  try {
    const query = `
      UPDATE senior_applications 
      SET 
        status = COALESCE($1, status),
        disapproval_reason = COALESCE($2, disapproval_reason),
        appointment_date = COALESCE($3, appointment_date),
        appointment_day = COALESCE($4, appointment_day),
        appointment_time = COALESCE($5, appointment_time),
        appointment_venue = COALESCE($6, appointment_venue),
        payout_date = COALESCE($7, payout_date),
        payout_day = COALESCE($8, payout_day),
        payout_time = COALESCE($9, payout_time),
        payout_venue = COALESCE($10, payout_venue),
        updated_at = CURRENT_TIMESTAMP
      WHERE id::text = $11 OR reference_no = $11
      RETURNING *;
    `;
    const result = await pool.query(query, [
      status, disapprovalReason, appointmentDate, appointmentDay, appointmentTime, appointmentVenue,
      payoutDate, payoutDay, payoutTime, payoutVenue, id
    ]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Senior application not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET all appointments from PostgreSQL DB
app.get('/api/appointments', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM appointments ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST schedule new appointment in PostgreSQL DB
app.post('/api/appointments', async (req, res) => {
  const { 
    referenceNo, 
    moduleName, 
    applicantName, 
    appointmentDate, 
    appointmentTime, 
    venue, 
    purpose, 
    socialWorkerNotes 
  } = req.body;

  try {
    const query = `
      INSERT INTO appointments 
      (reference_no, module_name, applicant_name, appointment_date, appointment_time, venue, purpose, social_worker_notes)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *;
    `;
    const values = [
      referenceNo,
      moduleName || 'AICS Assistance',
      applicantName || 'Applicant Name',
      appointmentDate || new Date().toISOString().split('T')[0],
      appointmentTime || '09:00 AM',
      venue || 'SSDD Assessment Desk 3, QC Hall',
      purpose || 'Document Verification & Intake Interview',
      socialWorkerNotes || 'Initial appointment set'
    ];

    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update status/decision of an appointment in PostgreSQL DB
app.put('/api/appointments/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status, socialWorkerNotes } = req.body;

  try {
    const query = `
      UPDATE appointments 
      SET status = $1, social_worker_notes = COALESCE($2, social_worker_notes)
      WHERE id = $3 
      RETURNING *;
    `;
    const result = await pool.query(query, [status, socialWorkerNotes, id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE reset all test data in PostgreSQL DB
app.delete('/api/reset-data', async (req, res) => {
  try {
    await pool.query('TRUNCATE TABLE aics_applications, appointments, pwd_applications, senior_applications, livelihood_applications RESTART IDENTITY CASCADE;');
    res.json({ success: true, message: 'All database records successfully cleared.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`GovServe Backend API server listening on http://localhost:${PORT}`);
  initDB();
});
