CREATE TABLE `tacos` (
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL,
	`filling` text NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`notes` text,
	`toppings` text NOT NULL,
	`updatedAt` integer DEFAULT (unixepoch()) NOT NULL
);
