"use client";

import api from "@/client/api";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import InputWithLabel from "./InputWithLabel";
import { RegisterParam } from "./register-param";

export default function AuthPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,

    formState: { errors },
  } = useForm<RegisterParam>();

  const onSubmit = async (params: RegisterParam) => {
    if (params.password !== params.passwordConfirm) {
      alert("비밀번호와 확인 값이 다릅니다");
      return;
    }

    try {
      const response = await api.register(params);

      if (response.ok) {
        alert("축하합니다 회원가입 되었습니다!");
        router.push("/");
      } else {
        alert(`실패 했습니다 ㅠㅠ ${response.message ?? ""}`);
      }
    } catch (error) {
      alert(`실패 했습니다 ㅠㅠ ${error ?? ""}`);
    }
  };

  return (
    <main className="w-full">
      <section className="w-full flex justify-center flex-col items-center">
        <h1 className="text-3xl font-bold mb-10">회원가입</h1>
        <form
          className="flex justify-center items-center w-1/2 flex-col"
          onSubmit={handleSubmit(onSubmit)}
        >
          <InputWithLabel
            topLeft="아이디"
            placeholder="아이디를 입력해주세요"
            register={register("name", {
              required: { value: true, message: "아이디는 필수 입니다" },
            })}
          />
          <InputWithLabel
            type="password"
            topLeft="비밀번호"
            placeholder="비밀번호를 입력해주세요"
            register={register("password", {
              required: { value: true, message: "비밀번호는 필수 입니다" },
              minLength: {
                value: 6,
                message: "비밀번호는 6자리 이상으로 입력해주세요",
              },
            })}
          />
          <InputWithLabel
            type="password"
            topLeft="비밀번호 확인"
            placeholder="비밀번호 확인을 입력해주세요"
            register={register("passwordConfirm", {
              required: { value: true, message: "비밀번호 확인은 필수 입니다" },
              minLength: {
                value: 6,
                message: "비밀번호는 6자리 이상으로 입력해주세요",
              },
            })}
          />
          <InputWithLabel
            topLeft="닉네임"
            placeholder="닉네임을 입력해주세요"
            register={register("nickname", {
              required: { value: true, message: "닉네임은 필수 입니다" },
            })}
          />
          <button className="btn btn-primary w-full max-w-md mt-5">
            회원가입
          </button>
        </form>

        <div className="flex flex-col space-y-2 mt-4">
          {errors &&
            Object.entries(errors).map(([k, v]) => (
              <p key={k} className="text-red-500 font-bold">
                {v?.message}
              </p>
            ))}
        </div>
      </section>
    </main>
  );
}
