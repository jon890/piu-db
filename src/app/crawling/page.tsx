"use client";

import { loadRecordFromPIU, loginToAmPass } from "@/client/http.client";
import { Protocol } from "puppeteer";
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
  const [cookies, setCookies] = useState<Protocol.Network.Cookie[] | null>(
    null
  );

  const handleInputChange = (e: React.SyntheticEvent<HTMLInputElement>) => {
    setLoginParams({
      ...loginParams,
      [e.currentTarget.name]: e.currentTarget.value,
    });
  };

  const onSubmit = async (e: React.SyntheticEvent) => {
    const data = await loginToAmPass(loginParams);
    console.log(data);
    setCookies((data as any).data.cookies);
    alert("로그인 성공");
  };

  const handleClickRecordLoad = async () => {
    if (cookies == null) {
      alert("먼저 로그인하세요");
      return;
    }

    const data = await loadRecordFromPIU(cookies);
    console.log(data);
  };

  return (
    <>
      <div className="container w-screen h-screen mx-auto">
        <h1 className="text-3xl font-bold">크롤링 페이지</h1>

        <div>
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

        <div>
          <h2 className="text-2xl font-medium">기록 불러오기</h2>
          <button
            className="btn btn-primary"
            onClick={handleClickRecordLoad}
            type="button"
          >
            로드
          </button>
        </div>
      </div>
    </>
  );
}
