import { useEffect, useRef, useState, type ReactNode } from "react";

import {
  CSS_VARIABLES,
  DEMO_COMPOSITION_URL,
  EXTEND_BEHAVIORS,
  MAX_ITEMS_SHOWN,
  MEDIA_LOAD_STRATEGIES,
  STAGE_WIDTHS,
  THEME_CONFIGS,
  MIN,
  isColorVariable,
  type CssVariable,
  type NumberKey,
  type Settings,
} from "./settings";

type Props = {
  settings: Settings;
  onChange: (changes: Partial<Settings>) => void;
};

type BooleanKey = {
  [K in keyof Settings]: Settings[K] extends boolean ? K : never;
}[keyof Settings];

type StringKey = {
  [K in keyof Settings]: Settings[K] extends string ? K : never;
}[keyof Settings];

/** The settings of the playground, grouped like the player's props */
const Controls: React.FC<Props> = ({ settings, onChange }) => {
  const checkbox = (key: BooleanKey, title?: string) => (
    <label className="pg-field pg-field--inline" key={key} title={title}>
      <input
        type="checkbox"
        checked={settings[key]}
        onChange={e => onChange({ [key]: e.target.checked })}
      />
      {key}
    </label>
  );

  const number = (key: NumberKey) => (
    <NumberField
      key={key}
      name={key}
      min={MIN[key]}
      value={settings[key]}
      onChange={value => onChange({ [key]: value })}
    />
  );

  const text = (key: StringKey) => (
    <CommitField
      key={key}
      name={key}
      value={settings[key]}
      onChange={value => onChange({ [key]: value })}
    />
  );

  const select = <K extends StringKey>(key: K, options: Settings[K][]) => (
    <label className="pg-field" key={key}>
      {key}
      <select
        value={settings[key]}
        onChange={e => onChange({ [key]: e.target.value })}
      >
        {options.map(option => (
          <option key={option} value={option}>
            {option || "—"}
          </option>
        ))}
      </select>
    </label>
  );

  return (
    <aside className="pg-controls">
      <Group title="Stage">
        {select("stageWidth", [...STAGE_WIDTHS])}
        {checkbox("shadowDom")}
        {checkbox("customMedia")}
        {checkbox("customIcon")}
      </Group>

      <Group title="Composition">
        {text("compositionUrl")}
        {settings.compositionUrl !== DEMO_COMPOSITION_URL && (
          <button
            type="button"
            onClick={() => onChange({ compositionUrl: DEMO_COMPOSITION_URL })}
          >
            Demo composition
          </button>
        )}
        {text("categoriesFilter")}
      </Group>

      <Group title="Layout">
        {checkbox("integration")}
        <label className="pg-field">
          maxItemsShown
          <select
            value={settings.maxItemsShown}
            onChange={e => onChange({ maxItemsShown: Number(e.target.value) })}
          >
            {MAX_ITEMS_SHOWN.map(value => (
              <option key={value}>{value}</option>
            ))}
          </select>
        </label>
        {checkbox("hideCategoriesNav")}
        {checkbox("forceTopNav")}
        {checkbox("infiniteCarrousel")}
        {checkbox("permanentGallery")}
      </Group>

      <Group title="Medias">
        {select("mediaLoadStrategy", MEDIA_LOAD_STRATEGIES)}
        {number("preloadRange")}
        {checkbox("autoLoad360")}
        {checkbox("autoLoadInterior360")}
        {checkbox("demoSpin")}
        {checkbox("reverse360")}
        {text("spinCursor")}
      </Group>

      <Group title="Miscellaneous">
        {select("extendBehavior", EXTEND_BEHAVIORS)}
        {select("themeConfig", THEME_CONFIGS)}
        {text("eventPrefix")}
      </Group>

      <Group title="Analytics">
        {text("analyticsEventPrefix")}
        {checkbox(
          "analyticsDryRun",
          "Analytics events are logged to the console instead of dispatched: not in the events list"
        )}
        {checkbox("analyticsDebug")}
        {checkbox("monitoring")}
      </Group>

      <Group title="CSS variables">
        {CSS_VARIABLES.map(name => (
          <CssVariableField
            key={name}
            name={name}
            value={settings[name]}
            onChange={value => onChange({ [name]: value })}
          />
        ))}
      </Group>
    </aside>
  );
};

const Group: React.FC<{ title: string; children: ReactNode }> = ({
  title,
  children,
}) => (
  <details className="pg-group" open>
    <summary>{title}</summary>
    {children}
  </details>
);

/** Integers. Can be emptied while typing: the setting keeps its last valid one */
const NumberField: React.FC<{
  name: string;
  min: number;
  value: number;
  onChange: (value: number) => void;
}> = ({ name, min, value, onChange }) => {
  const [draft, setDraft] = useState<string | null>(null);

  return (
    <label className="pg-field">
      {name}
      <input
        type="number"
        min={min}
        step={1}
        value={draft ?? value}
        onChange={e => {
          setDraft(e.target.value);
          const number = Number(e.target.value);
          if (
            e.target.value !== "" &&
            Number.isInteger(number) &&
            number >= min
          ) {
            onChange(number);
          }
        }}
        onBlur={() => setDraft(null)}
      />
    </label>
  );
};

/**
 * Applied on Enter or when leaving the field: the player would get every
 * partial value (a composition URL reloads it, a prefix re-emits its events)
 */
const CommitField: React.FC<{
  name: string;
  value: string;
  onChange: (value: string) => void;
}> = ({ name, value, onChange }) => {
  const [draft, setDraft] = useState<string | null>(null);
  const commit = () => {
    if (draft !== null && draft !== value) onChange(draft);
    setDraft(null);
  };

  return (
    <label className="pg-field">
      {name}
      <input
        type="text"
        value={draft ?? value}
        onChange={e => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={e => e.key === "Enter" && commit()}
      />
    </label>
  );
};

const CssVariableField: React.FC<{
  name: CssVariable;
  value: string;
  onChange: (value: string) => void;
}> = ({ name, value, onChange }) => {
  // Not controlled: converting the picked color to a rounded HSL triplet and
  // back would move the picker while dragging. Follows the text field when it
  // holds another color.
  const pickerRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const picker = pickerRef.current;
    if (picker && hexToHslTriplet(picker.value) !== value) {
      picker.value = hslTripletToHex(value);
    }
  }, [value]);

  return (
    <label className="pg-field">
      {name.replace("--cc-webplayer-", "")}
      <span className="pg-field__row">
        {isColorVariable(name) && (
          <input
            ref={pickerRef}
            type="color"
            defaultValue={hslTripletToHex(value)}
            onChange={e => onChange(hexToHslTriplet(e.target.value))}
          />
        )}
        <input
          type="text"
          value={value}
          placeholder="default"
          onChange={e => onChange(e.target.value)}
        />
      </span>
    </label>
  );
};

/** "#1a73e8" to "214 82% 51%", the format of the color variables */
function hexToHslTriplet(hex: string): string {
  const [r, g, b] = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  const d = max - min;
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
  const h =
    d === 0
      ? 0
      : max === r
        ? ((g - b) / d) % 6
        : max === g
          ? (b - r) / d + 2
          : (r - g) / d + 4;

  return `${Math.round((h * 60 + 360) % 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

/** The color picker's value of a "h s% l%" triplet (black when not set) */
function hslTripletToHex(triplet: string): string {
  const match = triplet.match(/^\s*([\d.]+)\s+([\d.]+)%\s+([\d.]+)%\s*$/);
  if (!match) return "#000000";

  const [h, s, l] = [
    Number(match[1]),
    Number(match[2]) / 100,
    Number(match[3]) / 100,
  ];
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const channel = (n: number) =>
    Math.round((l - a * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1))) * 255)
      .toString(16)
      .padStart(2, "0");

  return `#${channel(0)}${channel(8)}${channel(4)}`;
}

export default Controls;
