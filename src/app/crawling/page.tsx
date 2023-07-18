"use client";

import { loginToAmPass } from "@/client/http.client";
import { useState } from "react";

export type LoginParams = {
  email: string;
  password: string;
};

export default function CrawlingPage() {
  const [loginParams, setLoginParams] = useState<LoginParams>({
    email: "",
    password: "",
  });

  const handleInputChange = (e: React.SyntheticEvent<HTMLInputElement>) => {
    setLoginParams({
      ...loginParams,
      [e.currentTarget.name]: e.currentTarget.value,
    });
  };

  const onSubmit = async (e: React.SyntheticEvent) => {
    loginToAmPass(loginParams);
  };

  return (
    <>
      <div className="container w-screen h-screen mx-auto">
        <h1 className="text-3xl font-bold">크롤링 페이지</h1>

        <input
          className="input input-bordered mt-4"
          type="text"
          name="email"
          placeholder="아이디"
          value={loginParams.email}
          onChange={handleInputChange}
        />
        <input
          className="input input-bordered"
          type="password"
          name="password"
          placeholder="비밀번호"
          value={loginParams.password}
          onChange={handleInputChange}
        />
        <button className="btn btn-primary" onClick={onSubmit} type="button">
          시작
        </button>
      </div>
    </>
  );
}
