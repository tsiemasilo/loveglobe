import { type MediaFile, type InsertMediaFile, type User, type InsertUser, users, mediaFiles } from "@shared/schema";
import { randomUUID } from "crypto";
import { db } from "./db";
import { eq, and, sql } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getMediaFilesByYearMonth(year: number, month: number): Promise<MediaFile[]>;
  getMediaFilesByAlbumYearMonth(albumName: string, year: number, month: number): Promise<MediaFile[]>;
  getMediaFile(id: string): Promise<MediaFile | undefined>;
  createMediaFile(mediaFile: InsertMediaFile): Promise<MediaFile>;
  getYearsWithMedia(): Promise<number[]>;
  getMonthsWithMediaForYear(year: number): Promise<{ month: number; count: number }[]>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getMediaFilesByYearMonth(year: number, month: number): Promise<MediaFile[]> {
    return await db
      .select()
      .from(mediaFiles)
      .where(and(eq(mediaFiles.year, year), eq(mediaFiles.month, month)))
      .orderBy(mediaFiles.uploadedAt);
  }

  async getMediaFilesByAlbumYearMonth(albumName: string, year: number, month: number): Promise<MediaFile[]> {
    return await db
      .select()
      .from(mediaFiles)
      .where(
        and(
          eq(mediaFiles.albumName, albumName),
          eq(mediaFiles.year, year),
          eq(mediaFiles.month, month)
        )
      )
      .orderBy(mediaFiles.uploadedAt);
  }

  async getMediaFile(id: string): Promise<MediaFile | undefined> {
    const [file] = await db.select().from(mediaFiles).where(eq(mediaFiles.id, id));
    return file || undefined;
  }

  async createMediaFile(insertMediaFile: InsertMediaFile): Promise<MediaFile> {
    const [file] = await db
      .insert(mediaFiles)
      .values(insertMediaFile)
      .returning();
    return file;
  }

  async getYearsWithMedia(): Promise<number[]> {
    const result = await db
      .selectDistinct({ year: mediaFiles.year })
      .from(mediaFiles)
      .orderBy(sql`${mediaFiles.year} DESC`);
    
    return result.map(row => row.year);
  }

  async getMonthsWithMediaForYear(year: number): Promise<{ month: number; count: number }[]> {
    const result = await db
      .select({
        month: mediaFiles.month,
        count: sql<number>`count(*)::integer`,
      })
      .from(mediaFiles)
      .where(eq(mediaFiles.year, year))
      .groupBy(mediaFiles.month)
      .orderBy(mediaFiles.month);
    
    return result;
  }
}

export const storage = new DatabaseStorage();
