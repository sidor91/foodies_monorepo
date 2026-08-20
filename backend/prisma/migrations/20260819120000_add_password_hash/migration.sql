ALTER TABLE "users"
  ADD COLUMN "passwordHash" TEXT NOT NULL,
  ADD COLUMN "refreshTokenHash" TEXT;