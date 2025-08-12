/*
  Warnings:

  - You are about to drop the column `coordinates` on the `Locations` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Locations" DROP COLUMN "coordinates",
ADD COLUMN     "coords" DECIMAL(65,30)[];

-- AlterTable
ALTER TABLE "PlaceItem" ADD COLUMN     "coords" DECIMAL(65,30)[];
