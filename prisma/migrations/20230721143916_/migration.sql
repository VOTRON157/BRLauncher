/*
  Warnings:

  - Added the required column `selected` to the `Account` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Account" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "access_token" TEXT NOT NULL,
    "client_token" TEXT NOT NULL,
    "meta" TEXT NOT NULL,
    "user_properties" TEXT NOT NULL,
    "uuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "selected" BOOLEAN NOT NULL
);
INSERT INTO "new_Account" ("access_token", "client_token", "id", "meta", "name", "user_properties", "uuid") SELECT "access_token", "client_token", "id", "meta", "name", "user_properties", "uuid" FROM "Account";
DROP TABLE "Account";
ALTER TABLE "new_Account" RENAME TO "Account";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
