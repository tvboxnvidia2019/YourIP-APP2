import { users, type User, type InsertUser, ipLookups, type IpLookup, type InsertIpLookup } from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  saveIpLookup(lookup: InsertIpLookup): Promise<IpLookup>;
  getRecentIpLookups(limit?: number): Promise<IpLookup[]>;
  getIpLookupsByIp(ip: string): Promise<IpLookup[]>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
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

  async saveIpLookup(lookup: InsertIpLookup): Promise<IpLookup> {
    const [savedLookup] = await db
      .insert(ipLookups)
      .values(lookup)
      .returning();
    return savedLookup;
  }

  async getRecentIpLookups(limit = 10): Promise<IpLookup[]> {
    return await db
      .select()
      .from(ipLookups)
      .orderBy(desc(ipLookups.createdAt))
      .limit(limit);
  }

  async getIpLookupsByIp(ip: string): Promise<IpLookup[]> {
    return await db
      .select()
      .from(ipLookups)
      .where(eq(ipLookups.ip, ip))
      .orderBy(desc(ipLookups.createdAt));
  }
}

export const storage = new DatabaseStorage();
