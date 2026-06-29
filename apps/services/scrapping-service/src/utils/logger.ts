export interface AppLogger {
  info(msg: string): void;
  warn(msg: string): void;
  error(msg: string, cause?: unknown): void;
}

export const consoleLogger: AppLogger = {
  info: (msg) => process.stdout.write(JSON.stringify({ level: "info", msg, time: Date.now() }) + "\n"),
  warn: (msg) => process.stdout.write(JSON.stringify({ level: "warn", msg, time: Date.now() }) + "\n"),
  error: (msg, cause) =>
    process.stderr.write(JSON.stringify({ level: "error", msg, err: String(cause), time: Date.now() }) + "\n"),
};
