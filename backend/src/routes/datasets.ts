import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { authenticateToken } from '../middleware/auth.js';
import { db, dbRun, dbGet, dbAll } from '../database/init.js';
import { processDataset } from '../services/mlService.js';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = './uploads';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
      cb(null, true);
    } else {
      cb(new Error('Only CSV files are allowed'));
    }
  }
});

/**
 * @swagger
 * components:
 *   schemas:
 *     Dataset:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The dataset ID
 *         name:
 *           type: string
 *           description: The dataset name
 *         filename:
 *           type: string
 *           description: The original filename
 *         size:
 *           type: integer
 *           description: File size in bytes
 *         columns:
 *           type: integer
 *           description: Number of columns
 *         rows:
 *           type: integer
 *           description: Number of rows
 *         status:
 *           type: string
 *           enum: [processing, ready, error]
 *           description: Processing status
 *         model_type:
 *           type: string
 *           enum: [classification, regression]
 *           description: Type of ML model
 *         accuracy:
 *           type: number
 *           description: Model accuracy percentage
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Upload timestamp
 */

/**
 * @swagger
 * /api/datasets/upload:
 *   post:
 *     summary: Upload a new dataset
 *     tags: [Datasets]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               dataset:
 *                 type: string
 *                 format: binary
 *                 description: CSV file to upload
 *     responses:
 *       201:
 *         description: Dataset uploaded successfully
 *       400:
 *         description: Invalid file format
 *       401:
 *         description: Unauthorized
 */
router.post('/upload', authenticateToken, upload.single('dataset'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const file = req.file;
    const userId = req.user.userId;

    // Get basic file info
    const stats = fs.statSync(file.path);
    
    // Parse CSV to get rows and columns count
    const csvContent = fs.readFileSync(file.path, 'utf-8');
    const lines = csvContent.trim().split('\n');
    const rows = lines.length - 1; // Subtract header row
    const columns = lines[0] ? lines[0].split(',').length : 0;

    // Save dataset record
    const result = await dbRun(`
      INSERT INTO datasets (user_id, name, filename, file_path, size, columns, rows, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      userId,
      file.originalname.replace('.csv', ''),
      file.originalname,
      file.path,
      stats.size,
      columns,
      rows,
      'processing'
    ]);

    const dataset = {
      id: result.lastID.toString(),
      name: file.originalname.replace('.csv', ''),
      filename: file.originalname,
      size: stats.size,
      columns,
      rows,
      status: 'processing' as const,
      uploadedAt: new Date().toISOString(),
    };

    // Process dataset asynchronously
    processDataset(result.lastID, file.path).catch(console.error);

    res.status(201).json(dataset);
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Upload failed' });
  }
});

/**
 * @swagger
 * /api/datasets:
 *   get:
 *     summary: Get all datasets for the authenticated user
 *     tags: [Datasets]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of datasets
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Dataset'
 */
router.get('/', authenticateToken, async (req, res) => {
  try {
    const datasets = await dbAll(
      'SELECT * FROM datasets WHERE user_id = ? ORDER BY created_at DESC',
      [req.user.userId]
    );

    const formattedDatasets = datasets.map(dataset => ({
      id: dataset.id.toString(),
      name: dataset.name,
      filename: dataset.filename,
      size: dataset.size,
      columns: dataset.columns,
      rows: dataset.rows,
      status: dataset.status,
      modelType: dataset.model_type,
      accuracy: dataset.accuracy,
      uploadedAt: dataset.created_at,
    }));

    res.json(formattedDatasets);
  } catch (error) {
    console.error('Get datasets error:', error);
    res.status(500).json({ message: 'Failed to fetch datasets' });
  }
});

/**
 * @swagger
 * /api/datasets/{id}:
 *   get:
 *     summary: Get a specific dataset
 *     tags: [Datasets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Dataset ID
 *     responses:
 *       200:
 *         description: Dataset details
 *       404:
 *         description: Dataset not found
 */
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const dataset = await dbGet(
      'SELECT * FROM datasets WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.userId]
    );

    if (!dataset) {
      return res.status(404).json({ message: 'Dataset not found' });
    }

    res.json({
      id: dataset.id.toString(),
      name: dataset.name,
      filename: dataset.filename,
      size: dataset.size,
      columns: dataset.columns,
      rows: dataset.rows,
      status: dataset.status,
      modelType: dataset.model_type,
      accuracy: dataset.accuracy,
      uploadedAt: dataset.created_at,
    });
  } catch (error) {
    console.error('Get dataset error:', error);
    res.status(500).json({ message: 'Failed to fetch dataset' });
  }
});

export { router as datasetRoutes };