"use client";

import { loginToAmPass } from "@/client/api";
import { useMutation } from "@tanstack/react-query";
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
  const [bestScores, setBestScores] = useState<
    | {
        isSingle: boolean;
        isDouble: boolean;
        level: string;
        songName: string;
        score: string;
      }[]
    | null
  >(null);

  const { mutate, data, error, isLoading } = useMutation({
    mutationFn: (param: LoginParams) => loginToAmPass(param),
  });

  const handleInputChange = (e: React.SyntheticEvent<HTMLInputElement>) => {
    setLoginParams({
      ...loginParams,
      [e.currentTarget.name]: e.currentTarget.value,
    });
  };

  const onSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    console.log("hihi");

    const data = await loginToAmPass(loginParams);
    setBestScores((data as any)?.data?.bestScore);

    // mutate(loginParams, {
    //   onSuccess: (data) => {
    //     console.log(data);
    //     setBestScores((data as any).data.bestScore);

    //     console.log(bestScores);
    //     alert("기록 크롤링 성공");
    //   },
    // });
  };

  return (
    <>
      <div className="container w-full h-screen flex flex-col justify-center items-center">
        <h1 className="text-3xl font-bold">크롤링 페이지</h1>

        <form
          onSubmit={onSubmit}
          className="flex flex-col justify-center items-center space-y-5"
        >
          <input
            className="input input-bordered mt-4"
            type="text"
            name="email"
            placeholder="아이디"
            autoComplete="username"
            value={loginParams.email}
            onChange={handleInputChange}
          />
          <input
            className="input input-bordered"
            type="password"
            name="password"
            placeholder="비밀번호"
            value={loginParams.password}
            autoComplete="current-password"
            onChange={handleInputChange}
          />
          <button className="btn btn-primary w-full" type="submit">
            시작
          </button>
        </form>

        {bestScores ? (
          <table className="table table-md mt-10">
            <thead>
              <tr className="bg-base-300">
                <th>No.</th>
                <th>싱글/더블</th>
                <th>레벨</th>
                <th>곡 이름</th>
                <th>점수</th>
              </tr>
            </thead>
            <tbody>
              {bestScores.map((it, index) => (
                <tr key={index}>
                  <td>{index}</td>
                  <td>
                    {it.isSingle ? (
                      <span className="text-red-500">싱글</span>
                    ) : (
                      <span className="text-green-500">더블</span>
                    )}
                  </td>
                  <td>{it.level}</td>
                  <td>{it.songName}</td>
                  <td>{it.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <h2 className="mt-10 font-semibold text-violet-500">
            로그인 하고 기록을 불러와 보세요
          </h2>
        )}
      </div>
    </>
  );
}
