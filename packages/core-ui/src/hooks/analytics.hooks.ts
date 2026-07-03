import { useMemo } from "react";

import {
  getBrowserId,
  getSessionId,
  getInstanceId,
} from "@car-cutter/core/src/utils";

export const useAnalyticsBrowserId = () => {
  return useMemo(() => getBrowserId(), []);
};

export const useAnalyticsSessionId = () => {
  return useMemo(() => getSessionId(), []);
};

export const useAnalyticsInstanceId = () => {
  return useMemo(() => getInstanceId(), []);
};
