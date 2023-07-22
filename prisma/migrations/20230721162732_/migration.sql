/*
  Warnings:

  - Added the required column `height` to the `Launcher` table without a default value. This is not possible if the table is not empty.
  - Added the required column `max` to the `Launcher` table without a default value. This is not possible if the table is not empty.
  - Added the required column `min` to the `Launcher` table without a default value. This is not possible if the table is not empty.
  - Added the required column `width` to the `Launcher` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Launcher" (
    "path" TEXT NOT NULL,
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "min" INTEGER NOT NULL,
    "max" INTEGER NOT NULL,
    "javaPath" TEXT
);
INSERT INTO "new_Launcher" ("id", "path") SELECT "id", "path" FROM "Launcher";
DROP TABLE "Launcher";
ALTER TABLE "new_Launcher" RENAME TO "Launcher";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
