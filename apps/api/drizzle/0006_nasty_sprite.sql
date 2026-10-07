DROP INDEX `food_entries_user_id_idx`;--> statement-breakpoint
DROP INDEX `food_entries_entry_date_idx`;--> statement-breakpoint
CREATE INDEX `food_entries_user_id_entry_date_idx` ON `food_entries` (`user_id`,`entry_date`);