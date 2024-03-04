import { auth } from "@/auth";

const getUserSeq = async () => {
  const session = await auth();
  return session?.user?.email ? Number(session?.user?.email) : null;
};

const getUserSeqThrows = async () => {
  const userSeq = await getUserSeq();

  if (!userSeq) {
    throw new Error("Authoirze error in getUserSeqThrows");
  }

  return userSeq;
};

const AuthUtil = {
  getUserSeq,
  getUserSeqThrows,
};

export default AuthUtil;
