import { LoginParams } from "@/app/crawling/page";
import puppeteer from "@/server/puppeteer";
import getQueryParmas from "@/server/utils/getQueryParams";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const responseStream = new TransformStream();
  const writer = responseStream.writable.getWriter();
  const encoder = new TextEncoder();

  try {
    const query = getQueryParmas(request.url);
    const maybeToken = query.accessToken;
    const data = JSON.parse(atob(maybeToken)) as LoginParams;

    puppeteer.loginToPiu(data, {
      onLaunchBrowser() {
        console.log("asdfasdf");
        writer.write(encoder.encode("data: connect to piugame.com\n\n"));
      },
      onError() {
        writer.write(encoder.encode("data: login failed..\n\n"));
      },
      onLoginComplete() {
        writer.write(encoder.encode("data: login success\n\n"));
      },
      onMoveLoginPage() {
        writer.write(encoder.encode("data: move to login page\n\n"));
      },
    });
  } catch (e) {
    writer.write(
      encoder.encode("data: 로그인 정보를 제대로 입력했는지 확인해주세요\n\n")
    );
  }

  return new Response(responseStream.readable, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "text/event-stream; charset=utf-8",
      Connection: "keep-alive",
      "Cache-Control": "no-cache, no-transform",
      "X-Accel-Buffering": "no",
      "Content-Encoding": "none",
    },
  });
}
