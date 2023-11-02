import RegisterForm from "./register-form";

export default function RegisterPage() {
  return (
    <main className="w-full">
      <section className="w-full h-screen flex justify-center flex-col items-center">
        <h1 className="text-3xl font-bold mb-10">회원가입</h1>
        <RegisterForm />
      </section>
    </main>
  );
}
