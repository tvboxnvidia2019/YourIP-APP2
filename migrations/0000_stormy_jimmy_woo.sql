CREATE TABLE `ip_lookups` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`ip` text NOT NULL,
	`ipv6` text,
	`city` text,
	`region` text,
	`country` text,
	`country_code` text,
	`postal_code` text,
	`latitude` real,
	`longitude` real,
	`timezone` text,
	`isp` text,
	`organization` text,
	`asn` text,
	`connection_type` text,
	`proxy` integer,
	`vpn` integer,
	`tor` integer,
	`threat_level` text,
	`currency` text,
	`calling_code` text,
	`language` text,
	`user_agent` text,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`username` text NOT NULL,
	`password` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_username_unique` ON `users` (`username`);