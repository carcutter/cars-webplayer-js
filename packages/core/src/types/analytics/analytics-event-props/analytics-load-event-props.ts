export type AnalyticsLoadEventProps = {
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
