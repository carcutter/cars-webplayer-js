import Admonition from "@theme/Admonition";
import TabItem from "@theme/TabItem";
import Tabs from "@theme/Tabs";
import React from "react";

import type { WebPlayerAttributes } from "@car-cutter/core-wc";
import type { WebPlayerProps } from "@car-cutter/react-webplayer";

type Property = {
  propName: keyof WebPlayerProps;
  attribute: keyof WebPlayerAttributes;
  type: string;
  defaultValue?: string;
  description: string;
};

const properties: Array<Property> = [
  {
    propName: "compositionUrl",
    attribute: "composition-url",
    type: "string",
    description: "URL to the composition data",
  },
  {
    propName: "hideCategoriesNav",
    attribute: "hide-categories-nav",
    type: "boolean",
    defaultValue: "false",
    description: "Hide the category-based navigation",
  },
  {
    propName: "infiniteCarrousel",
    attribute: "infinite-carrousel",
    type: "boolean",
    defaultValue: "false",
    description: "Allow to navigate from 1st to last media (and vice versa)",
  },
  {
    propName: "permanentGallery",
    attribute: "permanent-gallery",
    type: "boolean",
    defaultValue: "false",
    description: "Display gallery under the carrousel",
  },
  {
    propName: "mediaLoadStrategy",
    attribute: "media-load-strategy",
    type: '"quality"|"balanced"|"speed"',
    defaultValue: '"quality"',
    description: "Strategy for loading medias.",
  },
  {
    propName: "minMediaWidth",
    attribute: "min-media-width",
    type: "number",
    defaultValue: "0",
    description: "Force minimum media width (in pixels)",
  },
  {
    propName: "maxMediaWidth",
    attribute: "max-media-width",
    type: "number",
    defaultValue: "Infinity",
    description: "Force maximum media width (in pixels)",
  },
  {
    propName: "preloadRange",
    attribute: "preload-range",
    type: "number",
    defaultValue: "1",
    description: "Number of medias to preload before & after the viewport",
  },
  {
    propName: "autoLoad360",
    attribute: "auto-load360",
    type: "boolean",
    defaultValue: "false",
    description: "Load 360 images without having to click",
  },
  {
    propName: "autoLoadInterior360",
    attribute: "auto-load-interior360",
    type: "boolean",
    defaultValue: "false",
    description: "Load interior 360 images without having to click",
  },
  {
    propName: "categoriesFilter",
    attribute: "categories-filter",
    type: "string",
    defaultValue: "*",
    description: "Only display certain categories",
  },
  {
    propName: "extendBehavior",
    attribute: "extend-behavior",
    type: '"full_screen"|"event"|"none"',
    defaultValue: "full_screen",
    description: "Handle extend mode",
  },
  {
    propName: "eventPrefix",
    attribute: "event-prefix",
    type: "string",
    defaultValue: '"cc-webplayer:"',
    description: "Prefix of cc-player events",
  },
  {
    propName: "demoSpin",
    attribute: "demo-spin",
    type: "boolean",
    defaultValue: "false",
    description: "Run a spin once the 360 images has been loaded",
  },
  {
    propName: "reverse360",
    attribute: "reverse360",
    type: "boolean",
    defaultValue: "false",
    description: "Reverse the 360-degree rotation",
  },
  {
    propName: "integration",
    attribute: "integration",
    type: "boolean",
    defaultValue: "false",
    description:
      "Enables integration mode: use maxItemsShown, disables permanentGallery with infiniteCarrousel, enables hideCategoriesNav",
  },
  {
    propName: "maxItemsShown",
    attribute: "max-items-shown",
    type: "number",
    defaultValue: "1",
    description: "Maximum number of items to display in the carousel (1, 1.5, 2, or 2.5)",
  },
  {
    propName: "analyticsEventPrefix",
    attribute: "analytics-event-prefix",
    type: "string",
    defaultValue: '"cc-analytics:"',
    description: "Prefix of cc-analytics events",
  },
  {
    propName: "analyticsUrl",
    attribute: "analytics-url",
    type: "string",
    description: "A URL to send simple tracking / analytic events",
  },
  {
    propName: "analyticsBearer",
    attribute: "analytics-bearer",
    type: "string",
    description:
      "A Bearer token to authenticate when sending requests to `analyticsUrl`",
  },
  {
    propName: "analyticsSimpleRequestsOnly",
    attribute: "analytics-simple-requests-only",
    type: "boolean",
    defaultValue: "false",
    description:
      "A flag if only Simple-Requests should be sent. Will disable `analyticsBearer`.",
  },
  {
    propName: "analyticsDryRun",
    attribute: "analytics-dry-run",
    type: "boolean",
    defaultValue: "false",
    description:
      "A flag if the tracking / analytic events should be just output to the console instead of actually send to the `analyticsUrl`",
  },
  {
    propName: "analyticsDebug",
    attribute: "analytics-debug",
    type: "boolean",
    defaultValue: "false",
    description:
      "A flag if the tracking / analytic events should output debug information to the console",
  },
  {
    propName: "monitoring",
    attribute: "monitoring",
    type: "boolean",
    defaultValue: "true",
    description:
      "A flag to send analytics events to the monitoring service instead of `analyticsUrl`",
  },
];

const WebPlayerPropertiesTable: React.FC = () => {
  const Table: React.FC<{ type: "props" | "attributes" }> = ({ type }) => {
    const useProperties = type === "props";

    return (
      <>
        <table>
          <thead>
            <tr>
              <th>{useProperties ? "Property" : "Attributes"}</th>
              <th>Type</th>
              <th>Default</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {properties.map(
              ({ propName, attribute, type, defaultValue, description }) => (
                <tr key={propName}>
                  <td>{useProperties ? propName : attribute}</td>
                  <td>
                    {type.split("|").map((typeItem, index) => (
                      <React.Fragment key={index}>
                        <code>{typeItem}</code>
                        {index < type.split("|").length - 1 && <br />}
                      </React.Fragment>
                    ))}
                  </td>
                  <td>
                    {defaultValue ? (
                      <code>{defaultValue}</code>
                    ) : (
                      <span>🚫 Required</span>
                    )}
                  </td>
                  <td>{description}</td>
                </tr>
              )
            )}
          </tbody>
        </table>

        {!useProperties && (
          <Admonition type="note">
            Regarding the HTML, the attributes are technically all strings. But
            the WebComponent will handle the conversion to the correct type.
          </Admonition>
        )}
      </>
    );
  };

  return (
    <Tabs groupId="implementation-type">
      <TabItem value="framework" label="Frameworks">
        <Table type="props" />
      </TabItem>

      <TabItem value="native" label="Native">
        <Table type="attributes" />
      </TabItem>
    </Tabs>
  );
};

export default WebPlayerPropertiesTable;
