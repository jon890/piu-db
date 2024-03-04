-- CreateEnum
CREATE TYPE "SongType" AS ENUM ('ARCADE', 'REMIX', 'FULL_SONG', 'SHORT_CUT');

-- CreateEnum
CREATE TYPE "PiuVersion" AS ENUM ('FIRST_ZERO', 'NX_NXA', 'FIESTA_FIESTA2', 'PRIME', 'PRIME2', 'XX', 'PHOENIX');

-- CreateEnum
CREATE TYPE "ChartType" AS ENUM ('SINGLE', 'DOUBLE', 'CO_OP', 'UCS');

-- CreateEnum
CREATE TYPE "RecordGrade" AS ENUM ('ROUGH_GAME', 'FAIR_GAME', 'TALENTED_GAME', 'MARVELOUS_GAME', 'SUPERB_GAME', 'EXTREME_GAME', 'ULTIMATE_GAME', 'PERFECT_GAME');

-- CreateEnum
CREATE TYPE "RecordPlate" AS ENUM ('SSS_PLUS', 'SSS', 'SS_PLUS', 'SS', 'S_PLUS', 'S', 'AAA_PLUS', 'AAA', 'AA_PLUS', 'AA', 'A_PLUS', 'A', 'B', 'C', 'D', 'F');

-- CreateTable
CREATE TABLE "td_user" (
    "seq" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "nickname" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "td_user_pkey" PRIMARY KEY ("seq")
);

-- CreateTable
CREATE TABLE "td_piu_profile" (
    "seq" SERIAL NOT NULL,
    "game_id" TEXT NOT NULL,
    "last_login_date" TEXT,
    "last_played_center" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "user_seq" INTEGER NOT NULL,

    CONSTRAINT "td_piu_profile_pkey" PRIMARY KEY ("seq")
);

-- CreateTable
CREATE TABLE "td_song" (
    "seq" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "artist" TEXT NOT NULL,
    "bpm" TEXT NOT NULL,
    "version" "PiuVersion" NOT NULL,
    "song_type" "SongType" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "td_song_pkey" PRIMARY KEY ("seq")
);

-- CreateTable
CREATE TABLE "td_chart" (
    "seq" SERIAL NOT NULL,
    "song_seq" INTEGER NOT NULL,
    "chart_type" "ChartType" NOT NULL,
    "level" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "td_chart_pkey" PRIMARY KEY ("seq")
);

-- CreateTable
CREATE TABLE "td_record" (
    "seq" SERIAL NOT NULL,
    "song_seq" INTEGER NOT NULL,
    "chart_seq" INTEGER NOT NULL,
    "user_seq" INTEGER NOT NULL,
    "piu_profile_seq" INTEGER NOT NULL,
    "score" INTEGER NOT NULL,
    "perfect" INTEGER NOT NULL,
    "great" INTEGER NOT NULL,
    "good" INTEGER NOT NULL,
    "bad" INTEGER NOT NULL,
    "miss" INTEGER NOT NULL,
    "max_combo" INTEGER NOT NULL,
    "grade" "RecordGrade" NOT NULL,
    "plate" "RecordPlate" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "td_record_pkey" PRIMARY KEY ("seq")
);

-- CreateTable
CREATE TABLE "td_assignment_room" (
    "seq" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "banner_image" TEXT,
    "admin_user_seq" INTEGER NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "td_assignment_room_pkey" PRIMARY KEY ("seq")
);

-- CreateTable
CREATE TABLE "td_assignment_room_participants" (
    "seq" SERIAL NOT NULL,
    "room_seq" INTEGER NOT NULL,
    "user_seq" INTEGER NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "td_assignment_room_participants_pkey" PRIMARY KEY ("seq")
);

-- CreateTable
CREATE TABLE "td_assignment" (
    "seq" SERIAL NOT NULL,
    "room_seq" INTEGER NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "chart_seq" INTEGER NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "td_assignment_pkey" PRIMARY KEY ("seq")
);

-- CreateTable
CREATE TABLE "td_assignment_record" (
    "seq" SERIAL NOT NULL,
    "assignment_seq" INTEGER NOT NULL,
    "user_seq" INTEGER NOT NULL,
    "record_seq" INTEGER NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "td_assignment_record_pkey" PRIMARY KEY ("seq")
);

-- CreateIndex
CREATE UNIQUE INDEX "td_user_name_key" ON "td_user"("name");

-- CreateIndex
CREATE UNIQUE INDEX "td_user_nickname_key" ON "td_user"("nickname");

-- CreateIndex
CREATE UNIQUE INDEX "td_piu_profile_game_id_key" ON "td_piu_profile"("game_id");

-- CreateIndex
CREATE UNIQUE INDEX "td_chart_song_seq_chart_type_level_key" ON "td_chart"("song_seq", "chart_type", "level");

-- CreateIndex
CREATE UNIQUE INDEX "td_assignment_room_name_key" ON "td_assignment_room"("name");

-- CreateIndex
CREATE UNIQUE INDEX "td_assignment_room_participants_room_seq_user_seq_key" ON "td_assignment_room_participants"("room_seq", "user_seq");

-- AddForeignKey
ALTER TABLE "td_piu_profile" ADD CONSTRAINT "td_piu_profile_user_seq_fkey" FOREIGN KEY ("user_seq") REFERENCES "td_user"("seq") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "td_chart" ADD CONSTRAINT "td_chart_song_seq_fkey" FOREIGN KEY ("song_seq") REFERENCES "td_song"("seq") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "td_record" ADD CONSTRAINT "td_record_song_seq_fkey" FOREIGN KEY ("song_seq") REFERENCES "td_song"("seq") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "td_record" ADD CONSTRAINT "td_record_chart_seq_fkey" FOREIGN KEY ("chart_seq") REFERENCES "td_chart"("seq") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "td_record" ADD CONSTRAINT "td_record_user_seq_fkey" FOREIGN KEY ("user_seq") REFERENCES "td_user"("seq") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "td_record" ADD CONSTRAINT "td_record_piu_profile_seq_fkey" FOREIGN KEY ("piu_profile_seq") REFERENCES "td_piu_profile"("seq") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "td_assignment_room" ADD CONSTRAINT "td_assignment_room_admin_user_seq_fkey" FOREIGN KEY ("admin_user_seq") REFERENCES "td_user"("seq") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "td_assignment_room_participants" ADD CONSTRAINT "td_assignment_room_participants_room_seq_fkey" FOREIGN KEY ("room_seq") REFERENCES "td_assignment_room"("seq") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "td_assignment_room_participants" ADD CONSTRAINT "td_assignment_room_participants_user_seq_fkey" FOREIGN KEY ("user_seq") REFERENCES "td_user"("seq") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "td_assignment" ADD CONSTRAINT "td_assignment_room_seq_fkey" FOREIGN KEY ("room_seq") REFERENCES "td_assignment_room"("seq") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "td_assignment" ADD CONSTRAINT "td_assignment_chart_seq_fkey" FOREIGN KEY ("chart_seq") REFERENCES "td_chart"("seq") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "td_assignment_record" ADD CONSTRAINT "td_assignment_record_assignment_seq_fkey" FOREIGN KEY ("assignment_seq") REFERENCES "td_assignment"("seq") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "td_assignment_record" ADD CONSTRAINT "td_assignment_record_user_seq_fkey" FOREIGN KEY ("user_seq") REFERENCES "td_user"("seq") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "td_assignment_record" ADD CONSTRAINT "td_assignment_record_record_seq_fkey" FOREIGN KEY ("record_seq") REFERENCES "td_record"("seq") ON DELETE RESTRICT ON UPDATE CASCADE;
