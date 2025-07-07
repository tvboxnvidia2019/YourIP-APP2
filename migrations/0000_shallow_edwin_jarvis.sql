CREATE TABLE "ip_lookups" (
	"id" serial PRIMARY KEY NOT NULL,
	"ip" text NOT NULL,
	"ipv6" text,
	"city" text,
	"region" text,
	"country" text,
	"country_code" text,
	"postal_code" text,
	"latitude" real,
	"longitude" real,
	"timezone" text,
	"isp" text,
	"organization" text,
	"asn" text,
	"connection_type" text,
	"proxy" boolean,
	"vpn" boolean,
	"tor" boolean,
	"threat_level" text,
	"currency" text,
	"calling_code" text,
	"language" text,
	"user_agent" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"password" text NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
