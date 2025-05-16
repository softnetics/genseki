CREATE TABLE "categoryTags" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"category" uuid,
	"updatedAt" timestamp DEFAULT now(),
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"deletedAt" timestamp
);
--> statement-breakpoint
ALTER TABLE "categoryTags" ADD CONSTRAINT "categoryTags_category_categories_id_fk" FOREIGN KEY ("category") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;