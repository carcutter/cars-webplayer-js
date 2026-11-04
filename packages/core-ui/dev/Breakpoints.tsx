import { useEffect, useState } from "react";

import {
  LARGE_MEDIA_QUERY,
  MAX_SMALL_MEDIA_QUERY,
  SMALL_MEDIA_QUERY,
} from "../src/const/browser";

// The breakpoints of the player follow the viewport, not its container: the
// stage width doesn't change them, the browser's device mode does
const QUERIES = {
  "max-small": MAX_SMALL_MEDIA_QUERY,
  small: SMALL_MEDIA_QUERY,
  large: LARGE_MEDIA_QUERY,
};

type Breakpoint = keyof typeof QUERIES;

const LISTS = Object.fromEntries(
  Object.entries(QUERIES).map(([key, query]) => [key, window.matchMedia(query)])
) as Record<Breakpoint, MediaQueryList>;

const matching = () =>
  (Object.keys(LISTS) as Breakpoint[]).filter(key => LISTS[key].matches);

/** The Tailwind breakpoints of the player matching the viewport */
const Breakpoints: React.FC = () => {
  const [active, setActive] = useState(matching);

  useEffect(() => {
    const update = () => setActive(matching());
    Object.values(LISTS).forEach(list =>
      list.addEventListener("change", update)
    );
    return () =>
      Object.values(LISTS).forEach(list =>
        list.removeEventListener("change", update)
      );
  }, []);

  return (
    <span className="pg-breakpoints" title="Viewport breakpoints of the player">
      {(Object.keys(QUERIES) as Breakpoint[]).map(key => (
        <span key={key} data-active={active.includes(key)}>
          {key}
        </span>
      ))}
    </span>
  );
};

export default Breakpoints;
