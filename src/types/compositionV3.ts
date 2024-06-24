/**
 * A web player description.
 */
export interface Composition {
  /**
   * The title of the web player.
   */
  title: string;
  /**
   * The categories of the web player.
   */
  categories: [
    {
      /**
       * The title of the category.
       */
      title: string;
      /**
       * The visuals of the category.
       */
      visuals: [
        {
          /**
           * The title of the visual.
           */
          title?: string;
          /**
           * The type of the visual.
           */
          type: "slideshow" | "spin";
          /**
           * The list of images that belong to this visual.
           */
          images: [
            {
              /**
               * The URL to the image.
               */
              url: string;
              /**
               * The list of hotspots that belong to this image.
               */
              hotspots?:
                | []
                | [
                    {
                      /**
                       * The internally used identifier of a known feature.
                       */
                      feature: string;
                      /**
                       * A position, part of a hotspot.
                       */
                      position: {
                        /**
                         * The normalized position of the hotspot along the x-axis.
                         */
                        x: number;
                        /**
                         * The normalized position of the hotspot along the y-axis.
                         */
                        y: number;
                        [k: string]: unknown;
                      };
                      /**
                       * A description, part of a hotspot.
                       */
                      description?: {
                        /**
                         * The short description of the feature used as a title.
                         */
                        short?: string;
                        /**
                         * The long description of the feature.
                         */
                        long?: string;
                        [k: string]: unknown;
                      };
                      /**
                       * A detail, part of a hotspot.
                       */
                      detail?: {
                        /**
                         * The type of detail.
                         */
                        type: "image" | "show-file" | "link";
                        /**
                         * The URL of the detail.
                         */
                        url: string;
                        [k: string]: unknown;
                      };
                      [k: string]: unknown;
                    }
                  ];
              [k: string]: unknown;
            },
            ...{
              /**
               * The URL to the image.
               */
              url: string;
              /**
               * The list of hotspots that belong to this image.
               */
              hotspots?:
                | []
                | [
                    {
                      /**
                       * The internally used identifier of a known feature.
                       */
                      feature: string;
                      /**
                       * A position, part of a hotspot.
                       */
                      position: {
                        /**
                         * The normalized position of the hotspot along the x-axis.
                         */
                        x: number;
                        /**
                         * The normalized position of the hotspot along the y-axis.
                         */
                        y: number;
                        [k: string]: unknown;
                      };
                      /**
                       * A description, part of a hotspot.
                       */
                      description?: {
                        /**
                         * The short description of the feature used as a title.
                         */
                        short?: string;
                        /**
                         * The long description of the feature.
                         */
                        long?: string;
                        [k: string]: unknown;
                      };
                      /**
                       * A detail, part of a hotspot.
                       */
                      detail?: {
                        /**
                         * The type of detail.
                         */
                        type: "image" | "show-file" | "link";
                        /**
                         * The URL of the detail.
                         */
                        url: string;
                        [k: string]: unknown;
                      };
                      [k: string]: unknown;
                    }
                  ];
              [k: string]: unknown;
            }[]
          ];
          [k: string]: unknown;
        },
        ...{
          /**
           * The title of the visual.
           */
          title?: string;
          /**
           * The type of the visual.
           */
          type: "slideshow" | "spin";
          /**
           * The list of images that belong to this visual.
           */
          images: [
            {
              /**
               * The URL to the image.
               */
              url: string;
              /**
               * The list of hotspots that belong to this image.
               */
              hotspots?:
                | []
                | [
                    {
                      /**
                       * The internally used identifier of a known feature.
                       */
                      feature: string;
                      /**
                       * A position, part of a hotspot.
                       */
                      position: {
                        /**
                         * The normalized position of the hotspot along the x-axis.
                         */
                        x: number;
                        /**
                         * The normalized position of the hotspot along the y-axis.
                         */
                        y: number;
                        [k: string]: unknown;
                      };
                      /**
                       * A description, part of a hotspot.
                       */
                      description?: {
                        /**
                         * The short description of the feature used as a title.
                         */
                        short?: string;
                        /**
                         * The long description of the feature.
                         */
                        long?: string;
                        [k: string]: unknown;
                      };
                      /**
                       * A detail, part of a hotspot.
                       */
                      detail?: {
                        /**
                         * The type of detail.
                         */
                        type: "image" | "show-file" | "link";
                        /**
                         * The URL of the detail.
                         */
                        url: string;
                        [k: string]: unknown;
                      };
                      [k: string]: unknown;
                    }
                  ];
              [k: string]: unknown;
            },
            ...{
              /**
               * The URL to the image.
               */
              url: string;
              /**
               * The list of hotspots that belong to this image.
               */
              hotspots?:
                | []
                | [
                    {
                      /**
                       * The internally used identifier of a known feature.
                       */
                      feature: string;
                      /**
                       * A position, part of a hotspot.
                       */
                      position: {
                        /**
                         * The normalized position of the hotspot along the x-axis.
                         */
                        x: number;
                        /**
                         * The normalized position of the hotspot along the y-axis.
                         */
                        y: number;
                        [k: string]: unknown;
                      };
                      /**
                       * A description, part of a hotspot.
                       */
                      description?: {
                        /**
                         * The short description of the feature used as a title.
                         */
                        short?: string;
                        /**
                         * The long description of the feature.
                         */
                        long?: string;
                        [k: string]: unknown;
                      };
                      /**
                       * A detail, part of a hotspot.
                       */
                      detail?: {
                        /**
                         * The type of detail.
                         */
                        type: "image" | "show-file" | "link";
                        /**
                         * The URL of the detail.
                         */
                        url: string;
                        [k: string]: unknown;
                      };
                      [k: string]: unknown;
                    }
                  ];
              [k: string]: unknown;
            }[]
          ];
          [k: string]: unknown;
        }[]
      ];
      [k: string]: unknown;
    },
    ...{
      /**
       * The title of the category.
       */
      title: string;
      /**
       * The visuals of the category.
       */
      visuals: [
        {
          /**
           * The title of the visual.
           */
          title?: string;
          /**
           * The type of the visual.
           */
          type: "slideshow" | "spin";
          /**
           * The list of images that belong to this visual.
           */
          images: [
            {
              /**
               * The URL to the image.
               */
              url: string;
              /**
               * The list of hotspots that belong to this image.
               */
              hotspots?:
                | []
                | [
                    {
                      /**
                       * The internally used identifier of a known feature.
                       */
                      feature: string;
                      /**
                       * A position, part of a hotspot.
                       */
                      position: {
                        /**
                         * The normalized position of the hotspot along the x-axis.
                         */
                        x: number;
                        /**
                         * The normalized position of the hotspot along the y-axis.
                         */
                        y: number;
                        [k: string]: unknown;
                      };
                      /**
                       * A description, part of a hotspot.
                       */
                      description?: {
                        /**
                         * The short description of the feature used as a title.
                         */
                        short?: string;
                        /**
                         * The long description of the feature.
                         */
                        long?: string;
                        [k: string]: unknown;
                      };
                      /**
                       * A detail, part of a hotspot.
                       */
                      detail?: {
                        /**
                         * The type of detail.
                         */
                        type: "image" | "show-file" | "link";
                        /**
                         * The URL of the detail.
                         */
                        url: string;
                        [k: string]: unknown;
                      };
                      [k: string]: unknown;
                    }
                  ];
              [k: string]: unknown;
            },
            ...{
              /**
               * The URL to the image.
               */
              url: string;
              /**
               * The list of hotspots that belong to this image.
               */
              hotspots?:
                | []
                | [
                    {
                      /**
                       * The internally used identifier of a known feature.
                       */
                      feature: string;
                      /**
                       * A position, part of a hotspot.
                       */
                      position: {
                        /**
                         * The normalized position of the hotspot along the x-axis.
                         */
                        x: number;
                        /**
                         * The normalized position of the hotspot along the y-axis.
                         */
                        y: number;
                        [k: string]: unknown;
                      };
                      /**
                       * A description, part of a hotspot.
                       */
                      description?: {
                        /**
                         * The short description of the feature used as a title.
                         */
                        short?: string;
                        /**
                         * The long description of the feature.
                         */
                        long?: string;
                        [k: string]: unknown;
                      };
                      /**
                       * A detail, part of a hotspot.
                       */
                      detail?: {
                        /**
                         * The type of detail.
                         */
                        type: "image" | "show-file" | "link";
                        /**
                         * The URL of the detail.
                         */
                        url: string;
                        [k: string]: unknown;
                      };
                      [k: string]: unknown;
                    }
                  ];
              [k: string]: unknown;
            }[]
          ];
          [k: string]: unknown;
        },
        ...{
          /**
           * The title of the visual.
           */
          title?: string;
          /**
           * The type of the visual.
           */
          type: "slideshow" | "spin";
          /**
           * The list of images that belong to this visual.
           */
          images: [
            {
              /**
               * The URL to the image.
               */
              url: string;
              /**
               * The list of hotspots that belong to this image.
               */
              hotspots?:
                | []
                | [
                    {
                      /**
                       * The internally used identifier of a known feature.
                       */
                      feature: string;
                      /**
                       * A position, part of a hotspot.
                       */
                      position: {
                        /**
                         * The normalized position of the hotspot along the x-axis.
                         */
                        x: number;
                        /**
                         * The normalized position of the hotspot along the y-axis.
                         */
                        y: number;
                        [k: string]: unknown;
                      };
                      /**
                       * A description, part of a hotspot.
                       */
                      description?: {
                        /**
                         * The short description of the feature used as a title.
                         */
                        short?: string;
                        /**
                         * The long description of the feature.
                         */
                        long?: string;
                        [k: string]: unknown;
                      };
                      /**
                       * A detail, part of a hotspot.
                       */
                      detail?: {
                        /**
                         * The type of detail.
                         */
                        type: "image" | "show-file" | "link";
                        /**
                         * The URL of the detail.
                         */
                        url: string;
                        [k: string]: unknown;
                      };
                      [k: string]: unknown;
                    }
                  ];
              [k: string]: unknown;
            },
            ...{
              /**
               * The URL to the image.
               */
              url: string;
              /**
               * The list of hotspots that belong to this image.
               */
              hotspots?:
                | []
                | [
                    {
                      /**
                       * The internally used identifier of a known feature.
                       */
                      feature: string;
                      /**
                       * A position, part of a hotspot.
                       */
                      position: {
                        /**
                         * The normalized position of the hotspot along the x-axis.
                         */
                        x: number;
                        /**
                         * The normalized position of the hotspot along the y-axis.
                         */
                        y: number;
                        [k: string]: unknown;
                      };
                      /**
                       * A description, part of a hotspot.
                       */
                      description?: {
                        /**
                         * The short description of the feature used as a title.
                         */
                        short?: string;
                        /**
                         * The long description of the feature.
                         */
                        long?: string;
                        [k: string]: unknown;
                      };
                      /**
                       * A detail, part of a hotspot.
                       */
                      detail?: {
                        /**
                         * The type of detail.
                         */
                        type: "image" | "show-file" | "link";
                        /**
                         * The URL of the detail.
                         */
                        url: string;
                        [k: string]: unknown;
                      };
                      [k: string]: unknown;
                    }
                  ];
              [k: string]: unknown;
            }[]
          ];
          [k: string]: unknown;
        }[]
      ];
      [k: string]: unknown;
    }[]
  ];
  [k: string]: unknown;
}
