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
export declare type AnalyticsIdentifyEventPropsWpProperties = Omit<
  WebPlayerProps,
  | "analyticsUrl"
  | "analyticsBearer"
  | "analyticsSimpleRequestsOnly"
  | "analyticsDryRun"
  | "analyticsDebug"
>;

export declare type AnalyticsIdentifyEventProps = {
  type: AnalyticsEventTypeIdentify;
  browser_id: string;
  session_id: string;
  referrer: string;
  origin: string;
  page_url: string;
  user_agent: string;
  wp_properties: AnalyticsIdentifyEventPropsWpProperties;
};

export declare type AnalyticsPageEventProps = {
  type: AnalyticsEventTypePage;
  category_id: string;
  category_name: string;
  category_size: number;
  item_type: string;
  item_position: number;
};

export declare type AnalyticsTrackEventProps = {
  type: AnalyticsEventTypeTrack;
  category_id: string;
  category_name: string;
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
      | undefined;
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
