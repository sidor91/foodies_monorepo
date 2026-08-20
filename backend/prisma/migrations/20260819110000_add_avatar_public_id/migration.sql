ALTER TABLE "users"
  ADD COLUMN "avatarPublicId" TEXT,
  RENAME COLUMN "avatar" TO "avatarUrl";