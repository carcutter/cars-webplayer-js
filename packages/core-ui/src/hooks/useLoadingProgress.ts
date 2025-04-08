import { useEffect, useState } from "react";

/**
 * Hook to track the loading progress of a resource via XMLHttpRequest
 * @param targetUrl URL to monitor for loading progress
 * @returns [progress, isLoading] where progress is 0-100 and isLoading is a boolean
 */
export const useLoadingProgress = (targetUrl: string): [number, boolean] => {
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const originalXhrOpen = XMLHttpRequest.prototype.open;
    const originalXhrSend = XMLHttpRequest.prototype.send;

    let isMonitoringResource = false;

    XMLHttpRequest.prototype.open = function (
      method: string,
      url: string | URL,
      async: boolean = true,
      username?: string | null,
      password?: string | null
    ) {
      const urlString = url.toString();
      if (urlString.includes(targetUrl)) {
        isMonitoringResource = true;
        setIsLoading(true);
      }
      return originalXhrOpen.call(
        this,
        method,
        url,
        async,
        username || null,
        password || null
      );
    };

    XMLHttpRequest.prototype.send = function (
      body?: Document | XMLHttpRequestBodyInit | null
    ) {
      if (isMonitoringResource) {
        this.addEventListener("progress", (e: ProgressEvent) => {
          if (e.lengthComputable) {
            const percent = Math.round((e.loaded / e.total) * 100);
            setProgress(percent);
          }
        });

        this.addEventListener("loadend", () => {
          isMonitoringResource = false;
          setProgress(100);
          setIsLoading(false);
        });
      }
      return originalXhrSend.call(this, body);
    };

    return () => {
      XMLHttpRequest.prototype.open = originalXhrOpen;
      XMLHttpRequest.prototype.send = originalXhrSend;
    };
  }, [targetUrl]);

  return [progress, isLoading];
};
