import express from 'express';
import dotenv from 'dotenv';
import connectDB  from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import dealRoutes from './routes/dealRoutes.js';
import cors from 'cors';
import contactRoutes from './routes/contactRoutes.js';
import leadRoutes from './routes/leadRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import invoiceRoutes from './routes/invoiceRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';
import db from './config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
const avatarsDir = path.join(uploadsDir, 'avatars');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
if (!fs.existsSync(avatarsDir)) {
  fs.mkdirSync(avatarsDir, { recursive: true });
}

const appDir = path.join(uploadsDir, 'app');
if (!fs.existsSync(appDir)) {
  fs.mkdirSync(appDir, { recursive: true });
}

app.use(express.json());
app.use(cors());

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get("/", (req, res) => {
    res.send("Hello World");
});

// Test the connection at startup
if (process.env.NODE_ENV !== 'test') {
  db.getConnection()
    .then(connection => {
      console.log('Database connected!');
      connection.release();
    })
    .catch(err => {
      console.error('Database connection failed:', err);
      process.exit(1);
    });
}

app.use("/api", userRoutes);
app.use("/api", dealRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/leads", leadRoutes);
app.use("/api", reportRoutes);
app.use("/api", invoiceRoutes);
app.use("/api", notificationRoutes);
app.use('/settings', settingsRoutes);

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

