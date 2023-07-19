import { CrawlingMessage } from "./CrawlingMessage";

export function encodeMessage(
  writer: WritableStreamDefaultWriter,
  encoder: TextEncoder,
  data: CrawlingMessage
) {
  return writer.write(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
}
