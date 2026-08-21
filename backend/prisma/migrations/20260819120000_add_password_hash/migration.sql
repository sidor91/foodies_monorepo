ALTER TABLE "users"
ADD COLUMN "passwordHash" TEXT,
ADD COLUMN "refreshTokenHash" TEXT;

-- backfill existing rows so the column can be made NOT NULL
UPDATE "users"
SET
  "passwordHash" = ''
WHERE
  "passwordHash" IS NULL;

ALTER TABLE "users"
ALTER COLUMN "passwordHash"
SET
  NOT NULL;