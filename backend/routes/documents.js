import express from 'express';
import multer from 'multer';
import path from 'path';
import Document from '../models/Document.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf|doc|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images and PDFs are allowed.'));
    }
  }
});

// Upload document
router.post('/upload', authenticate, upload.single('document'), async (req, res) => {
  try {
    const { loanId, docType } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const document = new Document({
      loanId,
      userId: req.user._id,
      docType,
      fileName: req.file.originalname,
      filePath: req.file.path,
      fileSize: req.file.size,
      mimeType: req.file.mimetype
    });

    await document.save();

    res.status(201).json({
      success: true,
      document
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get documents for a loan
router.get('/loan/:loanId', authenticate, async (req, res) => {
  try {
    const documents = await Document.find({ loanId: req.params.loanId });
    res.json({ documents });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get user documents
router.get('/user', authenticate, async (req, res) => {
  try {
    const documents = await Document.find({ userId: req.user._id });
    res.json({ documents });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;

