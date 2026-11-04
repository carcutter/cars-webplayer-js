import { useCallback, useEffect, useMemo, useState } from "react";

import WebPlayer from "../src/WebPlayer";
import WebPlayerCustomMedia from "../src/WebPlayerCustomMedia";
import WebPlayerIcon from "../src/WebPlayerIcon";

import Breakpoints from "./Breakpoints";
import Controls from "./Controls";
import ErrorBoundary from "./ErrorBoundary";
import EventLog from "./EventLog";
import {
  DEFAULT_SETTINGS,
  parseSettings,
  serializeSettings,
  toCssVariables,
  toPlayerProps,
  type Settings,
} from "./settings";
import Stage from "./Stage";

// Children of the player, created once: they register themselves again when
// they change, which would reset the player on every settings change
const CUSTOM_MEDIAS = (
  <>
    <WebPlayerCustomMedia
      index={4}
      thumbnailSrc="https://cdn.car-cutter.com/libs/web-player/v3/assets/mocks/custom_thumbnail_audi.png"
    >
      <img src="https://cdn.car-cutter.com/libs/web-player/v3/assets/mocks/custom_image_1.jpg" />
    </WebPlayerCustomMedia>
    <WebPlayerCustomMedia index={-2}>
      <img src="https://cdn.car-cutter.com/libs/web-player/v3/assets/mocks/custom_image_2.jpg" />
    </WebPlayerCustomMedia>
  </>
);

const CUSTOM_ICON = (
  <WebPlayerIcon name="UI_360_PLAY">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
    >
      <path
        fill="currentColor"
        d="M24 10h-10v-10h-4v10h-10v4h10v10h4v-10h10z"
      />
    </svg>
  </WebPlayerIcon>
);

/**
 * Playground of the player, on its sources: a change in core-ui shows up as
 * soon as it's saved. Its settings are kept in the URL.
 */
const DevApp: React.FC = () => {
  const [settings, setSettings] = useState(() =>
    parseSettings(window.location.search)
  );
  // Remounts the player, for what it only reads when mounted
  const [playerKey, setPlayerKey] = useState(0);

  // Debounced: a color picker being dragged changes the settings on every
  // move, more often than browsers allow history changes
  useEffect(() => {
    const timeout = setTimeout(
      () =>
        window.history.replaceState(
          null,
          "",
          (serializeSettings(settings) || window.location.pathname) +
            window.location.hash
        ),
      300
    );
    return () => clearTimeout(timeout);
  }, [settings]);

  // Only rendered again when its props change, not for the stage's settings
  // (CSS variables, width)
  const playerProps = JSON.stringify(toPlayerProps(settings));
  const { customMedia, customIcon } = settings;
  const player = useMemo(
    () => (
      <WebPlayer {...JSON.parse(playerProps)}>
        {customMedia && CUSTOM_MEDIAS}
        {customIcon && CUSTOM_ICON}
      </WebPlayer>
    ),
    [playerProps, customMedia, customIcon]
  );

  const onChange = useCallback(
    (changes: Partial<Settings>) =>
      setSettings(previous => ({ ...previous, ...changes })),
    []
  );

  return (
    <div className="pg">
      <header className="pg-header">
        <h1>WebPlayer playground</h1>
        <Breakpoints />
        <button type="button" onClick={() => setPlayerKey(key => key + 1)}>
          Remount
        </button>
        <button
          type="button"
          onClick={() => {
            setSettings(DEFAULT_SETTINGS);
            setPlayerKey(key => key + 1);
          }}
        >
          Reset
        </button>
      </header>

      <Controls settings={settings} onChange={onChange} />

      <main className="pg-main">
        {/* Outside the stage: its message has the playground's styles */}
        <ErrorBoundary
          // Retries for a change of the player, not of its stage
          resetKey={`${playerKey}-${playerProps}-${customMedia}-${customIcon}`}
        >
          <Stage
            // The shadow root can't be removed: a new host for each mode
            key={`${settings.shadowDom}-${playerKey}`}
            shadowDom={settings.shadowDom}
            width={settings.stageWidth}
            cssVariables={toCssVariables(settings)}
          >
            {player}
          </Stage>
        </ErrorBoundary>

        <EventLog
          eventPrefix={settings.eventPrefix}
          analyticsEventPrefix={settings.analyticsEventPrefix}
        />
      </main>
    </div>
  );
};

export default DevApp;
