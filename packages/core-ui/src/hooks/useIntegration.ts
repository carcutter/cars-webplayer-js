import { DEFAULT_MAX_ITEMS_SHOWN } from "@car-cutter/core/src/const/default_props";

import { useGlobalContext } from "../providers/GlobalContext";

type Integration = {
  effectiveMaxItemsShown: number;
};

/**
 * Custom hook to determine the effective maximum number of items shown
 * based on the current integration and full-screen mode.
 *
 * @returns {Object} An object containing the effective maximum items shown.
 */

export const useIntegration = (): Integration => {
  const { isFullScreen, maxItemsShown, integration } = useGlobalContext();

  const effectiveMaxItemsShown =
    integration && isFullScreen ? DEFAULT_MAX_ITEMS_SHOWN : maxItemsShown;

  return { effectiveMaxItemsShown };
};
