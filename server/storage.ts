import { type MediaFile, type InsertMediaFile, type User, type InsertUser } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getMediaFilesByYearMonth(year: number, month: number): Promise<MediaFile[]>;
  getMediaFile(id: string): Promise<MediaFile | undefined>;
  createMediaFile(mediaFile: InsertMediaFile): Promise<MediaFile>;
  getYearsWithMedia(): Promise<number[]>;
  getMonthsWithMediaForYear(year: number): Promise<{ month: number; count: number }[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private mediaFiles: Map<string, MediaFile>;

  constructor() {
    this.users = new Map();
    this.mediaFiles = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id, createdAt: new Date() };
    this.users.set(id, user);
    return user;
  }

  async getMediaFilesByYearMonth(year: number, month: number): Promise<MediaFile[]> {
    return Array.from(this.mediaFiles.values()).filter(
      (file) => file.year === year && file.month === month
    );
  }

  async getMediaFile(id: string): Promise<MediaFile | undefined> {
    return this.mediaFiles.get(id);
  }

  async createMediaFile(insertMediaFile: InsertMediaFile): Promise<MediaFile> {
    const id = randomUUID();
    const mediaFile: MediaFile = {
      ...insertMediaFile,
      id,
      uploadedAt: new Date(),
    };
    this.mediaFiles.set(id, mediaFile);
    return mediaFile;
  }

  async getYearsWithMedia(): Promise<number[]> {
    const years = new Set<number>();
    const mediaFilesArray = Array.from(this.mediaFiles.values());
    for (const file of mediaFilesArray) {
      years.add(file.year);
    }
    return Array.from(years).sort((a, b) => b - a);
  }

  async getMonthsWithMediaForYear(year: number): Promise<{ month: number; count: number }[]> {
    const monthCounts = new Map<number, number>();
    const mediaFilesArray = Array.from(this.mediaFiles.values());
    
    for (const file of mediaFilesArray) {
      if (file.year === year) {
        const currentCount = monthCounts.get(file.month) || 0;
        monthCounts.set(file.month, currentCount + 1);
      }
    }
    
    return Array.from(monthCounts.entries()).map(([month, count]) => ({
      month,
      count,
    }));
  }
}

export const storage = new MemStorage();
