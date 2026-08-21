ALTER TABLE "users"
ADD COLUMN "avatarPublicId" TEXT;

ALTER TABLE "users"
RENAME COLUMN "avatar" TO "avatarUrl";