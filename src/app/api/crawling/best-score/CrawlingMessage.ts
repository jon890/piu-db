import { BestScore } from "@/server/puppeteer/load-best-score";

type CrawlingProgress = "best-score" | "info" | "finish" | "error";

export class CrawlingMessage {
  type: CrawlingProgress;
  data: unknown;

  constructor(type: CrawlingProgress, data: unknown) {
    this.type = type;
    this.data = data;
  }

  static info(message: string) {
    return new CrawlingMessage("info", { message });
  }

  static toBestScore(bestScore: BestScore[]) {
    return new CrawlingMessage("best-score", { bestScore });
  }

  static finish(message: string) {
    return new CrawlingMessage("finish", { message });
  }

  static error(message: string) {
    return new CrawlingMessage("error", { message });
  }
}
