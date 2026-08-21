ALTER TABLE "recipes"
RENAME COLUMN "thumb" TO "image";

ALTER TABLE "recipes"
DROP COLUMN "preview",
ADD COLUMN "imagePublicId" TEXT;
