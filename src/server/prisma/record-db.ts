import prisma from "@/server/prisma/client";
import { RecentlyPlayed } from "@/types/recently-played";

function saveRecentRecord(userSeq: number, record: RecentlyPlayed) {
  return prisma.record.create({
    data: {
      
    }
  })
}

const RecordDB = {
  getSongsByName,
};

export default RecordDB;
