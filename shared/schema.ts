import { pgTable, text, serial, integer, boolean, timestamp, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// IP lookup history table
export const ipLookups = pgTable("ip_lookups", {
  id: serial("id").primaryKey(),
  ip: text("ip").notNull(),
  ipv6: text("ipv6"),
  city: text("city"),
  region: text("region"),
  country: text("country"),
  countryCode: text("country_code"),
  postalCode: text("postal_code"),
  latitude: real("latitude"),
  longitude: real("longitude"),
  timezone: text("timezone"),
  isp: text("isp"),
  organization: text("organization"),
  asn: text("asn"),
  connectionType: text("connection_type"),
  proxy: boolean("proxy"),
  vpn: boolean("vpn"),
  tor: boolean("tor"),
  threatLevel: text("threat_level"),
  currency: text("currency"),
  callingCode: text("calling_code"),
  language: text("language"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertIpLookupSchema = createInsertSchema(ipLookups).omit({
  id: true,
  createdAt: true,
});

export type InsertIpLookup = z.infer<typeof insertIpLookupSchema>;
export type IpLookup = typeof ipLookups.$inferSelect;

// IP Information schema
export const ipInfoSchema = z.object({
  ip: z.string(),
  ipv6: z.string().optional(),
  city: z.string().optional(),
  region: z.string().optional(),
  country: z.string().optional(),
  countryCode: z.string().optional(),
  postalCode: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  timezone: z.string().optional(),
  isp: z.string().optional(),
  organization: z.string().optional(),
  asn: z.string().optional(),
  connectionType: z.string().optional(),
  proxy: z.boolean().optional(),
  vpn: z.boolean().optional(),
  tor: z.boolean().optional(),
  threatLevel: z.string().optional(),
  currency: z.string().optional(),
  callingCode: z.string().optional(),
  language: z.string().optional(),
  userAgent: z.string().optional(),
});

export type IPInfo = z.infer<typeof ipInfoSchema>;