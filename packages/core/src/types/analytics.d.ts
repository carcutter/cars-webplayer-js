// ========================
// Shared Sub-Types (API Components)
// ========================

export declare type WebplayerInstance = {
  instance_id: string;
  browser_id?: string;
  session_id?: string;
  from_url?: string;
};

export declare type WebplayerDisplayedItem = {
  category_id: string;
  category_name: string;
  item_type: string;
  item_position: number;
  items_count?: number;
};

export declare type WebplayerAction = {
  name: string;
  field: string;
  value: unknown;
};

export declare type WebplayerError = {
  name: string;
  message: string;
};

// ========================
// Event Type Discriminator
// ========================

export declare type AnalyticsEventType =
  | "load"
  | "display"
  | "interaction"
  | "error";

// ========================
// Event Props (caller-facing, enriched by emitter with timestamp + instance)
// ========================

export declare type AnalyticsLoadEventProps = {
  type: "load";
  config: {
    composition_url: string;
    integration: boolean;
    max_items_shown: number;
    hide_categories_nav: boolean;
    infinite_carrousel: boolean;
    permanent_gallery: boolean;
    media_load_strategy: string;
    min_media_width: number;
    preload_range: number;
    auto_load_360: boolean;
    auto_load_interior_360: boolean;
    categories_filter: string;
    extend_behavior: string;
    event_prefix: string;
    demo_spin: boolean;
    reverse_360: boolean;
  };
};

export declare type AnalyticsDisplayEventProps = {
  type: "display";
  item: WebplayerDisplayedItem;
};

export declare type AnalyticsInteractionEventProps = {
  type: "interaction";
  current: WebplayerDisplayedItem;
  action: WebplayerAction;
};

export declare type AnalyticsErrorEventProps = {
  type: "error";
  current?: WebplayerDisplayedItem;
  action?: WebplayerAction;
  error: WebplayerError;
};

export declare type AnalyticsEventProps =
  | AnalyticsLoadEventProps
  | AnalyticsDisplayEventProps
  | AnalyticsInteractionEventProps
  | AnalyticsErrorEventProps;

// ========================
// Full Event Types (complete payload after enrichment)
// ========================

export declare type AnalyticsLoadEvent = {
  type: "load";
  timestamp: string;
  instance: WebplayerInstance;
  config: AnalyticsLoadEventProps["config"];
};

export declare type AnalyticsDisplayEvent = {
  type: "display";
  timestamp: string;
  instance: WebplayerInstance;
  item: WebplayerDisplayedItem;
};

export declare type AnalyticsInteractionEvent = {
  type: "interaction";
  timestamp: string;
  instance: WebplayerInstance;
  current: WebplayerDisplayedItem;
  action: WebplayerAction;
};

export declare type AnalyticsErrorEvent = {
  type: "error";
  timestamp: string;
  instance: WebplayerInstance;
  current?: WebplayerDisplayedItem;
  action?: WebplayerAction;
  error: WebplayerError;
};

export declare type AnalyticsEvent =
  | AnalyticsLoadEvent
  | AnalyticsDisplayEvent
  | AnalyticsInteractionEvent
  | AnalyticsErrorEvent;
