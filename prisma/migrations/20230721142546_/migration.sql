-- CreateTable
CREATE TABLE "Account" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "access_token" TEXT NOT NULL,
    "client_token" TEXT NOT NULL,
    "meta" TEXT NOT NULL,
    "user_proprieties" TEXT NOT NULL,
    "uuid" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Launcher" (
    "path" TEXT NOT NULL,
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT
);
