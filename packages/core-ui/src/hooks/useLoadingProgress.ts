import { useEffect, useState } from "react";

type Subscriber = {
  targetUrl: string;
  onStart: () => void;
  onProgress: (percent: number) => void;
  onEnd: () => void;
};

/** The hooks mounted, tracking the requests of their URL */
const subscribers = new Set<Subscriber>();

/** URL of each request opened while XMLHttpRequest is patched */
const requestUrls = new WeakMap<XMLHttpRequest, string>();

/**
 * Patches XMLHttpRequest for the subscribers, once for all of them: one patch
 * per hook would restore the wrong methods when the hooks don't unmount in
 * the reverse order of their mount (several 360s mounted, cleanups deferred)
 */
function patchXhr(): () => void {
  const prototype = XMLHttpRequest.prototype;
  const { open, send } = prototype;

  prototype.open = function (
    this: XMLHttpRequest,
    method: string,
    url: string | URL,
    async: boolean = true,
    username?: string | null,
    password?: string | null
  ) {
    const urlString = url.toString();
    requestUrls.set(this, urlString);
    subscribers.forEach(subscriber => {
      if (urlString.includes(subscriber.targetUrl)) {
        subscriber.onStart();
      }
    });
    return open.call(
      this,
      method,
      url,
      async,
      username || null,
      password || null
    );
  };

  prototype.send = function (
    this: XMLHttpRequest,
    body?: Document | XMLHttpRequestBodyInit | null
  ) {
    const url = requestUrls.get(this);
    subscribers.forEach(subscriber => {
      if (url?.includes(subscriber.targetUrl)) {
        this.addEventListener("progress", (e: ProgressEvent) => {
          if (e.lengthComputable) {
            subscriber.onProgress(Math.round((e.loaded / e.total) * 100));
          }
        });
        this.addEventListener("loadend", subscriber.onEnd);
      }
    });
    return send.call(this, body);
  };

  return () => {
    prototype.open = open;
    prototype.send = send;
  };
}

let restoreXhr: (() => void) | undefined;

/**
 * Hook to track the loading progress of a resource via XMLHttpRequest
 * @param targetUrl URL to monitor for loading progress
 * @returns [progress, isLoading] where progress is 0-100 and isLoading is a boolean
 */
export const useLoadingProgress = (targetUrl: string): [number, boolean] => {
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const subscriber: Subscriber = {
      targetUrl,
      onStart: () => setIsLoading(true),
      onProgress: setProgress,
      onEnd: () => {
        setProgress(100);
        setIsLoading(false);
      },
    };

    subscribers.add(subscriber);
    restoreXhr ??= patchXhr();

    return () => {
      subscribers.delete(subscriber);
      if (subscribers.size === 0) {
        restoreXhr?.();
        restoreXhr = undefined;
      }
    };
  }, [targetUrl]);

  return [progress, isLoading];
};
