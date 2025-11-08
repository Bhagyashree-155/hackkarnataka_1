import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Example endpoints (can be extended)
app.get('/api/loans', (req, res) => {
  res.json({ message: 'Get all loans endpoint' });
});

app.post('/api/loans', (req, res) => {
  res.json({ message: 'Create loan endpoint' });
});

app.listen(PORT, () => {
  console.log(`BlockGenix API server running on port ${PORT}`);
});
