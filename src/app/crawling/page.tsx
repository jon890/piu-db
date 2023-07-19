"use client";

import { useEffect, useState } from "react";

export type LoginParams = {
  email: string;
  password: string;
};

export default function CrawlingPage() {
  const [loginParams, setLoginParams] = useState<LoginParams>({
    email: "",
    password: "",
  });
  const [eventSource, setEventSource] = useState<EventSource | null>(null);
  const [start, setStart] = useState<boolean>(false);
  const [messages, setMessages] = useState<{ time: string; message: string }[]>(
    []
  );
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

  const handleInputChange = (e: React.SyntheticEvent<HTMLInputElement>) => {
    setLoginParams({
      ...loginParams,
      [e.currentTarget.name]: e.currentTarget.value,
    });
  };

  const onSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    if (start) {
      return;
    }

    setStart(() => true);
    setMessages(() => []);
    setEventSource(
      new EventSource(
        `/api/crawling/best-score?accessToken=${btoa(
          JSON.stringify(loginParams)
        )}`,
        { withCredentials: true }
      )
    );
  };

  useEffect(() => {
    if (eventSource) {
      eventSource.onmessage = (event) => {
        if (event.data === "login success") {
          eventSource.close();
          setStart(false);
          setEventSource(null);
        }

        setMessages((old) => [
          ...old,
          { message: event.data, time: event.timeStamp.toFixed(0) },
        ]);
      };
      eventSource.onerror = (event) => {
        setMessages((old) => [
          ...old,
          { message: "error occurred!!", time: event.timeStamp.toFixed(0) },
        ]);
        eventSource.close();
        setStart(false);
        setEventSource(null);
      };
      eventSource.onopen = (event) => {
        setMessages((old) => [
          ...old,
          { message: "start", time: event.timeStamp.toFixed(0) },
        ]);
      };
    }
  }, [eventSource, messages, start]);

  return (
    <>
      <div className="container w-full h-screen flex flex-col justify-center items-center">
        <h1 className="text-3xl font-bold">베스트 스코어 불러오기</h1>

        <div className="flex flex-row space-x-10">
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

          <table
            className={`table table-xs mt-10 transition-all ${
              messages.length > 0 ? "" : "hidden"
            }`}
          >
            <thead>
              <tr>
                <th>시간</th>
                <th>메시지</th>
              </tr>
            </thead>
            <tbody>
              {messages.map((it) => (
                <tr key={it.time}>
                  <td>{it.time}</td>
                  <td>{it.message}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

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
