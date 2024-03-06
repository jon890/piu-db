import AuthUtil from "@/server/utils/auth-util";

export default async function AssignmentCreatePage() {
  const userSeq = await AuthUtil.getUserSeqThrows();

  return (
    <div className="flex flex-col items-center w-full h-full space-y-10"></div>
  );
}
