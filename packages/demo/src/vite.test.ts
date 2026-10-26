// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";

import { DEMO_PORTS } from "./ports";
import { demoPort, localBundle } from "./vite";

const fs = vi.hoisted(() => ({
  existsSync: vi.fn(),
  readdirSync: vi.fn(),
  statSync: vi.fn(),
  createReadStream: vi.fn(),
}));
vi.mock("node:fs", () => fs);

type Middleware = (
  req: { url?: string },
  res: {
    statusCode: number;
    setHeader: (k: string, v: string) => void;
    end: (body: string) => void;
  },
  next: () => void
) => void;

function middleware(): Middleware {
  let handler: Middleware | undefined;
  const plugin = localBundle();
  (plugin.configureServer as (server: unknown) => void)({
    middlewares: { use: (fn: Middleware) => (handler = fn) },
  });
  return handler!;
}

function request(url: string | undefined) {
  const res = {
    statusCode: 200,
    headers: {} as Record<string, string>,
    body: "",
    setHeader(k: string, v: string) {
      this.headers[k] = v;
    },
    end(body: string) {
      this.body = body;
    },
  };
  const next = vi.fn();
  middleware()({ url }, res, next);
  return { res, next };
}

beforeEach(() => vi.resetAllMocks());

describe("demoPort", () => {
  it("serves the demo on its port, strictly", () => {
    const plugin = demoPort("vue");

    expect((plugin.config as () => unknown)()).toEqual({
      server: { port: DEMO_PORTS.vue, strictPort: true },
    });
  });
});

describe("localBundle", () => {
  it("serves the most recent build of the requested bundle", () => {
    const stream = { pipe: vi.fn() };
    fs.existsSync.mockReturnValue(true);
    fs.readdirSync.mockReturnValue([
      "bundle-react-18@3.2.16.js",
      "bundle-react-18@3.2.17.js",
      "script-webplayer-react-18.css",
    ]);
    fs.statSync.mockImplementation((url: URL) => ({
      mtimeMs: url.pathname.endsWith("3.2.17.js") ? 2 : 1,
    }));
    fs.createReadStream.mockReturnValue(stream);

    const { res, next } = request("/local/bundle-react-18.js?t=1");

    expect(next).not.toHaveBeenCalled();
    expect(String(fs.existsSync.mock.calls[0][0])).toMatch(
      /\/webplayer-script-react-18\/dist\/$/
    );
    expect(String(fs.createReadStream.mock.calls[0][0])).toMatch(
      /bundle-react-18@3\.2\.17\.js$/
    );
    expect(res.headers).toEqual({
      "Content-Type": "text/javascript",
      "Cache-Control": "no-store",
    });
    expect(stream.pipe).toHaveBeenCalledWith(res);
  });

  it("answers 404 when the package isn't built", () => {
    fs.existsSync.mockReturnValue(false);

    const { res } = request("/local/bundle.js");

    expect(res.statusCode).toBe(404);
    expect(res.body).toBe(
      "No local build of @car-cutter/script-webplayer in packages/webplayer-script/dist"
    );
  });

  it("answers 404 when dist has no bundle", () => {
    fs.existsSync.mockReturnValue(true);
    fs.readdirSync.mockReturnValue(["script-webplayer.css"]);

    expect(request("/local/bundle.js").res.statusCode).toBe(404);
  });

  it.each([
    "/local/bundle.js.map",
    "/local/bundle.js/x",
    "/index.html",
    undefined,
  ])("passes %s on", url => {
    const { next } = request(url);

    expect(next).toHaveBeenCalledTimes(1);
    expect(fs.existsSync).not.toHaveBeenCalled();
  });
});
