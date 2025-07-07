
import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
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
export const ipLookups = sqliteTable("ip_lookups", {
  id: integer("id").primaryKey({ autoIncrement: true }),
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
  proxy: integer("proxy", { mode: "boolean" }),
  vpn: integer("vpn", { mode: "boolean" }),
  tor: integer("tor", { mode: "boolean" }),
  threatLevel: text("threat_level"),
  currency: text("currency"),
  callingCode: text("calling_code"),
  language: text("language"),
  userAgent: text("user_agent"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()).notNull(),
});

export const insertIpLookupSchema = createInsertSchema(ipLookups).omit({
  id: true,
  createdAt: true,
});

export type InsertIpLookup = z.infer<typeof insertIpLookupSchema>;
export type IpLookup = typeof ipLookups.$inferSelect;

// Define IPInfo schema for API responses
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
