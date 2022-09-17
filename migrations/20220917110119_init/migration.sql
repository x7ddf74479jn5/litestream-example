-- CreateTable
CREATE TABLE "todouhuken" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "ranking" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "todouhukenId" INTEGER NOT NULL,
    "rank" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "ranking_name_todouhukenId_key" ON "ranking"("name", "todouhukenId");
