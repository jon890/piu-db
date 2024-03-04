import os from "node:os";

export const TMP_DIR =
  os.hostname() === "kbt.local" ? "/Users/nhn" : os.tmpdir();
