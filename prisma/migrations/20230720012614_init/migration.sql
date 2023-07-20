-- CreateTable
CREATE TABLE "Finishers" (
    "id" SERIAL NOT NULL,
    "discord_name" VARCHAR(255) NOT NULL,
    "fulfilled" TIMESTAMP(3),
    "name" VARCHAR(255) NOT NULL,
    "address" VARCHAR(255) NOT NULL,
    "city" VARCHAR(255) NOT NULL,
    "state" VARCHAR(255) NOT NULL,
    "zip" VARCHAR(255) NOT NULL,
    "size" VARCHAR(255) NOT NULL,

    CONSTRAINT "Finishers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Promises" (
    "id" SERIAL NOT NULL,
    "discord_id" BIGINT NOT NULL,
    "discord_name" VARCHAR(255) NOT NULL,
    "summary" VARCHAR(255) NOT NULL,
    "url" VARCHAR(255),
    "completed" TIMESTAMP(3),

    CONSTRAINT "Promises_pkey" PRIMARY KEY ("id")
);
