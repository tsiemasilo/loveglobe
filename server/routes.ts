import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from "multer";
import path from "path";
import fs from "fs";
import { insertMediaFileSchema } from "@shared/schema";

const uploadsDir = path.join(process.cwd(), "uploads");

// Ensure uploads directory exists
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const { year, month } = req.body;
      const yearMonthDir = path.join(uploadsDir, year, month);
      
      if (!fs.existsSync(yearMonthDir)) {
        fs.mkdirSync(yearMonthDir, { recursive: true });
      }
      
      cb(null, yearMonthDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const ext = path.extname(file.originalname);
      cb(null, `${uniqueSuffix}${ext}`);
    },
  }),
  fileFilter: (req, file, cb) => {
    // Accept images and videos
    const allowedMimes = [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp',
      'video/mp4', 'video/mov', 'video/avi', 'video/quicktime'
    ];
    
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images and videos are allowed.'));
    }
  },
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all years with media
  app.get("/api/years", async (req, res) => {
    try {
      const years = await storage.getYearsWithMedia();
      res.json(years);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch years" });
    }
  });

  // Get months with media count for a specific year
  app.get("/api/years/:year/months", async (req, res) => {
    try {
      const year = parseInt(req.params.year);
      if (isNaN(year)) {
        return res.status(400).json({ message: "Invalid year" });
      }
      
      const months = await storage.getMonthsWithMediaForYear(year);
      res.json(months);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch months" });
    }
  });

  // Get media files for a specific year and month
  app.get("/api/media/:year/:month", async (req, res) => {
    try {
      const year = parseInt(req.params.year);
      const month = parseInt(req.params.month);
      
      if (isNaN(year) || isNaN(month) || month < 0 || month > 11) {
        return res.status(400).json({ message: "Invalid year or month" });
      }
      
      const mediaFiles = await storage.getMediaFilesByYearMonth(year, month);
      res.json(mediaFiles);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch media files" });
    }
  });

  // Upload media files
  app.post("/api/upload", upload.array('files'), async (req, res) => {
    try {
      const { year, month } = req.body;
      const files = req.files as Express.Multer.File[];
      
      if (!files || files.length === 0) {
        return res.status(400).json({ message: "No files uploaded" });
      }
      
      const yearNum = parseInt(year);
      const monthNum = parseInt(month);
      
      if (isNaN(yearNum) || isNaN(monthNum) || monthNum < 0 || monthNum > 11) {
        return res.status(400).json({ message: "Invalid year or month" });
      }
      
      const uploadedFiles = [];
      
      for (const file of files) {
        const mediaFileData = {
          filename: file.filename,
          originalName: file.originalname,
          mimeType: file.mimetype,
          size: file.size,
          year: yearNum,
          month: monthNum,
          filePath: file.path,
        };
        
        // Validate with schema
        const validatedData = insertMediaFileSchema.parse(mediaFileData);
        const savedFile = await storage.createMediaFile(validatedData);
        uploadedFiles.push(savedFile);
      }
      
      res.json({ 
        message: `Uploaded ${uploadedFiles.length} files`,
        files: uploadedFiles 
      });
      
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to upload files" 
      });
    }
  });

  // Serve uploaded files
  app.get("/api/files/:id", async (req, res) => {
    try {
      const mediaFile = await storage.getMediaFile(req.params.id);
      
      if (!mediaFile) {
        return res.status(404).json({ message: "File not found" });
      }
      
      const filePath = mediaFile.filePath;
      
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ message: "File not found on disk" });
      }
      
      res.setHeader('Content-Type', mediaFile.mimeType);
      res.setHeader('Content-Disposition', `inline; filename="${mediaFile.originalName}"`);
      res.sendFile(path.resolve(filePath));
      
    } catch (error) {
      res.status(500).json({ message: "Failed to serve file" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
