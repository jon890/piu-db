import puppeteer from "@/server/puppeteer";
import { BestScore } from "@/server/puppeteer/load-best-score";
import getQueryParmas from "@/server/utils/getQueryParams";
import { NextRequest } from "next/server";
import { z } from "zod";
import { CrawlingMessage } from "./CrawlingMessage";
import { encodeMessage } from "./encodeMessage";

const LoginParamsValidator = z.object({
  email: z.string().email(),
  password: z.string(),
});

export async function GET(request: NextRequest) {
  const responseStream = new TransformStream();
  const writer = responseStream.writable.getWriter();
  const encoder = new TextEncoder();

  try {
    const query = getQueryParmas(request.url);
    const maybeToken = query.accessToken;
    const data = LoginParamsValidator.parse(JSON.parse(atob(maybeToken)));

    puppeteer.loadBestScore(data, {
      onLaunchBrowser() {
        encodeMessage(
          writer,
          encoder,
          CrawlingMessage.info("Start Login to piugame.com")
        );
      },
      onMoveLoginPage() {
        encodeMessage(
          writer,
          encoder,
          CrawlingMessage.info("move to login page")
        );
      },
      onLoginComplete() {
        encodeMessage(writer, encoder, CrawlingMessage.info("login success!"));
      },
      onLoadBestScore(bestScore: BestScore[]) {
        encodeMessage(writer, encoder, CrawlingMessage.toBestScore(bestScore));
      },
      onFinish() {
        encodeMessage(writer, encoder, CrawlingMessage.finish("Finish!!"));
      },
      onError(message) {
        encodeMessage(
          writer,
          encoder,
          CrawlingMessage.info(`failed.. cause:${message}`)
        );
      },
    });
  } catch (e) {
    console.error(e);
    encodeMessage(
      writer,
      encoder,
      CrawlingMessage.error(`failed.. login info is invalid!`)
    );
    writer.close();
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
