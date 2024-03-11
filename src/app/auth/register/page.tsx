import Link from "next/link";
import RegisterForm from "./register-form";
import ArrowLeftIcon from "@heroicons/react/24/solid/ArrowLeftIcon";

export default function RegisterPage() {
  return (
    <main className="w-full">
      <section className="w-full min-h-screen flex justify-center flex-col items-center p-10">
        <div className="flex flex-row items-center w-full max-w-md mb-10">
          <Link href="/">
            <ArrowLeftIcon className="size-6" />
          </Link>

          <h1 className="text-3xl font-bold mx-auto">회원가입</h1>
        </div>

        <RegisterForm />
      </section>
    </main>
  );
}
