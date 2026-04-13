import type { AnalyticsEvent, AnalyticsEventType } from "@car-cutter/core";

interface MonitoringActivityOptions {
  payload: AnalyticsEvent;
  compositionUrl: string;
}

const API_URL = "https://analytics.eu.car-cutter.com";

const ENDPOINT_MAP: Record<AnalyticsEventType, string> = {
  load: "/webplayer/load",
  display: "/webplayer/display",
  interaction: "/webplayer/interaction",
  error: "/webplayer/error",
};

const getRequestUrl = (eventType: AnalyticsEventType): string => {
  const path = ENDPOINT_MAP[eventType];
  const url = new URL(path, API_URL);
  return url.toString();
};

const getRequestHeaders = (compositionUrl: string): Headers => {
  const headers = new Headers();
  headers.append("Content-Type", "application/json");
  headers.append("Authorization", `Bearer ${compositionUrl}`);
  return headers;
};

const getRequestBody = (event: AnalyticsEvent): string => {
  // Strip the `type` discriminator — the endpoint path serves as the discriminator
  const { type: _type, ...rest } = event;
  return JSON.stringify(rest);
};

const DEFAULT_TIMEOUT_MS = 10_000;

export const emitMonitoringActivityEvent = async (
  options: MonitoringActivityOptions,
  timeoutMs: number = DEFAULT_TIMEOUT_MS
): Promise<void> => {
  const { payload, compositionUrl } = options;

  const headers = getRequestHeaders(compositionUrl);
  const body = getRequestBody(payload);
  const url = getRequestUrl(payload.type);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    await fetch(url, {
      method: "POST" as const,
      headers,
      body,
      signal: controller.signal,
    });

    // NOTE: We intentionally ignore non-ok responses.
    // Monitoring is best-effort and must never break the player.
  } catch {
    // Silently ignore network errors, timeouts, and aborts.
    // Analytics/monitoring failures must never propagate to the caller.
  } finally {
    clearTimeout(timeoutId);
  }
};
