-- CreateTable
CREATE TABLE `Driver` (
    `id` INTEGER NOT NULL,
    `full_name` VARCHAR(255) NULL,
    `number` INTEGER NOT NULL,
    `email` VARCHAR(255) NULL,
    `password` VARCHAR(255) NULL,
    `createdDT` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
