import prisma from "@/server/prisma/client";

async function getPiuProfiles(userSeq: number) {
  return prisma.piuProfile.findMany({
    where: { userSeq },
  });
}

const index = {
  getPiuProfiles,
};

export default index;
