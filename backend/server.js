import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Sample health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    system: 'GovServe Social Services API Server',
    timestamp: new Date().toISOString()
  });
});

// Sample Services Endpoint
app.get('/api/services', (req, res) => {
  res.json([
    { id: 'aics-medical', title: 'AICS Medical Assistance', category: 'aics' },
    { id: 'pwd-id', title: 'PWD ID Card & Booklet', category: 'pwd' },
    { id: 'senior-pension', title: 'Senior Citizen Social Pension', category: 'senior' }
  ]);
});

app.listen(PORT, () => {
  console.log(`GovServe Backend API server listening on http://localhost:${PORT}`);
});
