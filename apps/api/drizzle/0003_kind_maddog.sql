CREATE TABLE `food_entries` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`entry_date` text NOT NULL,
	`name` text NOT NULL,
	`calories` real NOT NULL,
	`protein_g` real DEFAULT 0 NOT NULL,
	`carbs_g` real DEFAULT 0 NOT NULL,
	`fat_g` real DEFAULT 0 NOT NULL,
	`source` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `food_entries_user_id_idx` ON `food_entries` (`user_id`);--> statement-breakpoint
CREATE INDEX `food_entries_entry_date_idx` ON `food_entries` (`entry_date`);--> statement-breakpoint
DROP INDEX `profiles_user_id_idx`;--> statement-breakpoint
ALTER TABLE `profiles` ADD `api_token` text;--> statement-breakpoint
CREATE UNIQUE INDEX `profiles_user_id_unique` ON `profiles` (`user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `profiles_api_token_unique` ON `profiles` (`api_token`);