CREATE TABLE "foodImages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"url" text NOT NULL,
	"foodId" uuid
);
--> statement-breakpoint
ALTER TABLE "foodImages" ADD CONSTRAINT "foodImages_foodId_foods_id_fk" FOREIGN KEY ("foodId") REFERENCES "public"."foods"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "foods" DROP COLUMN "foodAvatar";