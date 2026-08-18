CREATE TABLE `profiles` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`session_id` text NOT NULL,
	`height` integer NOT NULL,
	`weight` integer NOT NULL,
	`age` integer NOT NULL,
	`sex` text NOT NULL,
	`activity_level` text NOT NULL,
	`user_id` integer,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `profiles_session_id_unique` ON `profiles` (`session_id`);