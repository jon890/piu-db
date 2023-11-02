import Link from "next/link";
import RegisterForm from "./register-form";

export default function RegisterPage() {
  return (
    <main className="w-full">
      <section className="w-full h-screen flex justify-center flex-col items-center">
        <div className="flex flex-row items-center w-1/2 mb-10">
          <Link href="/">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
              />
            </svg>
          </Link>

          <h1 className="text-3xl font-bold mx-auto">회원가입</h1>
        </div>

        <RegisterForm />
      </section>
    </main>
  );
}
