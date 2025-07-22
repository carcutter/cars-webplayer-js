import { useMemo } from "react";

import {
  getOrGenerateBrowserId,
  getOrGenerateSessionId,
  getOrGenerateInstanceId,
} from "@car-cutter/core/src/utils";

export const useAnalyticsBrowserId = () => {
  return useMemo(() => getOrGenerateBrowserId(), []);
};

export const useAnalyticsSessionId = () => {
  return useMemo(() => getOrGenerateSessionId(), []);
};

export const useAnalyticsInstanceId = () => {
  return useMemo(() => getOrGenerateInstanceId(), []);
};
