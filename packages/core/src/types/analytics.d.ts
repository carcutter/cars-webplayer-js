// - Types
export declare type AnalyticsEventTypeIdentify = "identify";
export declare type AnalyticsEventTypePage = "page";
export declare type AnalyticsEventTypeTrack = "track";
export declare type AnalyticsEventType =
  | AnalyticsEventTypeIdentify
  | AnalyticsEventTypePage
  | AnalyticsEventTypeTrack;

// - Base
export declare type AnalyticsEventBase = {
  type: AnalyticsEventType;
  timestamp: string;
  instance_id: string;
};

// - Props
export declare type AnalyticsIdentifyEventProps = {
  type: AnalyticsEventTypeIdentify;
  browser_id: string;
  session_id: string;
  referrer: string;
  origin: string;
  page_url: string;
  user_agent: string;
  wp_properties: {
    composition_url: string;

    // Integration mode
    integration: boolean;
    max_items_shown: number;

    // Layout
    hide_categories_nav: boolean;
    infinite_carrousel: boolean;
    permanent_gallery: boolean;

    // Medias loading
    media_load_strategy: string;
    min_media_width: number;
    max_media_width: number;
    preload_range: number;
    auto_load_360: boolean;
    auto_load_interior_360: boolean;

    // Miscellaneous
    categories_filter: string;
    extend_behavior: string;
    event_prefix: string;
    demo_spin: boolean;
    reverse_360: boolean;
  };
};

export declare type AnalyticsPageEventProps = {
  type: AnalyticsEventTypePage;
  category_id: string;
  category_name: string;
  items_count: number;
  page_properties: {
    item_type: string;
    item_position: number;
  };
};

export declare type AnalyticsTrackEventProps = {
  type: AnalyticsEventTypeTrack;
  category_id: string;
  category_name: string;
  item_type: string;
  item_position: number;
  action_properties: {
    action_name: string;
    action_field: string;
    action_value:
      | bigint
      | boolean
      | null
      | number
      | string
      | symbol
      | undefined
      | object;
  };
};

export declare type AnalyticsEventProps =
  | AnalyticsIdentifyEventProps
  | AnalyticsPageEventProps
  | AnalyticsTrackEventProps;

// - Events
export declare type AnalyticsIdentifyEvent = Omit<AnalyticsEventBase, "type"> &
  AnalyticsIdentifyEventProps;

export declare type AnalyticsPageEvent = Omit<AnalyticsEventBase, "type"> &
  AnalyticsPageEventProps;

export declare type AnalyticsTrackEvent = Omit<AnalyticsEventBase, "type"> &
  AnalyticsTrackEventProps;

export declare type AnalyticsEvent =
  | AnalyticsIdentifyEvent
  | AnalyticsPageEvent
  | AnalyticsTrackEvent;
