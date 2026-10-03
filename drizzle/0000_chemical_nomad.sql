CREATE TABLE `cart_items` (
	`session_id` text NOT NULL,
	`product_id` text NOT NULL,
	`quantity` integer NOT NULL,
	`updated_at` integer NOT NULL,
	PRIMARY KEY(`session_id`, `product_id`)
);
--> statement-breakpoint
CREATE INDEX `idx_cart_updated` ON `cart_items` (`updated_at`);--> statement-breakpoint
CREATE TABLE `demo_orders` (
	`id` text PRIMARY KEY NOT NULL,
	`session_id` text NOT NULL,
	`idempotency_key` text NOT NULL,
	`total` integer NOT NULL,
	`items_json` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `demo_orders_idempotency_key_unique` ON `demo_orders` (`idempotency_key`);--> statement-breakpoint
CREATE INDEX `idx_orders_session` ON `demo_orders` (`session_id`);--> statement-breakpoint
CREATE TABLE `work_projects` (
	`id` text PRIMARY KEY NOT NULL,
	`owner_id` text NOT NULL,
	`name` text NOT NULL,
	`client` text NOT NULL,
	`status` text NOT NULL,
	`budget` integer NOT NULL,
	`due_date` text NOT NULL,
	`notes` text DEFAULT '' NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_projects_owner_created` ON `work_projects` (`owner_id`,`created_at`);--> statement-breakpoint
CREATE TABLE `workspaces` (
	`owner_id` text PRIMARY KEY NOT NULL,
	`created_at` integer NOT NULL
);
