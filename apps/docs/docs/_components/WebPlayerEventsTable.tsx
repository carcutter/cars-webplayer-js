import CodeBlock from "@theme/CodeBlock";
import Heading from "@theme/Heading";
import TabItem from "@theme/TabItem";
import Tabs from "@theme/Tabs";

type Event = {
  eventName: string;
  constant: string;
  callbackName: string;
  vueCallback: string;
  type: string;
  description: string;
};

const events: Array<Event> = [
  {
    eventName: "composition-loading",
    constant: "EVENT_COMPOSITION_LOADING",
    callbackName: "onCompositionLoading",
    vueCallback: "@compositionLoading",
    type: "(url: string) => void",
    description: "Triggered when the composition is loading.",
  },
  {
    eventName: "composition-loaded",
    constant: "EVENT_COMPOSITION_LOADED",
    callbackName: "onCompositionLoaded",
    vueCallback: "@compositionLoaded",
    type: "(composition: Composition) => void",
    description: "Triggered when the composition has successfully loaded.",
  },
  {
    eventName: "composition-load-error",
    constant: "EVENT_COMPOSITION_LOAD_ERROR",
    callbackName: "onCompositionLoadError",
    vueCallback: "@compositionLoadError",
    type: "(error: unknown) => void",
    description: "Triggered when there is an error loading the composition.",
  },
  {
    eventName: "item-change",
    constant: "EVENT_ITEM_CHANGE",
    callbackName: "onItemChange",
    vueCallback: "@itemChange",
    type: "(props: { index: number; item: Item }) => void",
    description: "Triggered when there is on a carrousel focus changed.",
  },
  {
    eventName: "extend-mode-on",
    constant: "EVENT_EXTEND_MODE_ON",
    callbackName: "onExtendModeOn",
    vueCallback: "@extendModeOn",
    type: "() => void",
    description: "Triggered when the extend mode is turned on.",
  },
  {
    eventName: "extend-mode-off",
    constant: "EVENT_EXTEND_MODE_OFF",
    callbackName: "onExtendModeOff",
    vueCallback: "@extendModeOff",
    type: "() => void",
    description: "Triggered when the extend mode is turned off.",
  },
  {
    eventName: "hotspots-on",
    constant: "EVENT_HOTSPOTS_ON",
    callbackName: "onHotspotsOn",
    vueCallback: "@hotspotsOn",
    type: "() => void",
    description: "Triggered when hotspots are turned on.",
  },
  {
    eventName: "hotspots-off",
    constant: "EVENT_HOTSPOTS_OFF",
    callbackName: "onHotspotsOff",
    vueCallback: "@hotspotsOff",
    type: "() => void",
    description: "Triggered when hotspots are turned off.",
  },
  {
    eventName: "gallery-open",
    constant: "EVENT_GALLERY_OPEN",
    callbackName: "onGalleryOpen",
    vueCallback: "@galleryOpen",
    type: "() => void",
    description: "Triggered when the gallery is opened.",
  },
  {
    eventName: "gallery-close",
    constant: "EVENT_GALLERY_CLOSE",
    callbackName: "onGalleryClose",
    vueCallback: "@galleryClose",
    type: "() => void",
    description: "Triggered when the gallery is closed.",
  },
];

const WebPlayerEventsTable: React.FC = () => {
  const EventTable: React.FC<{ type: "jsx" | "vue" | "native" }> = ({
    type,
  }) => {
    return (
      <table>
        <thead>
          <tr>
            <th>Event</th>
            <th>Type</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {events.map(event => (
            <tr key={event.eventName}>
              <td>
                <code>
                  {type === "jsx" && event.callbackName}
                  {type === "vue" && event.vueCallback}
                  {type === "native" && event.constant}
                </code>
              </td>
              <td>
                <code>{event.type}</code>
              </td>
              <td>{event.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  const ExampleCode: React.FC<{ type: "jsx" | "vue" | "native" }> = ({
    type,
  }) => {
    let Code: React.ReactNode;

    switch (type) {
      case "jsx":
        Code = (
          <CodeBlock language="tsx">
            {`<WebPlayer
  ...
  onCompositionLoaded={composition => console.log("Composition loaded !", composition)}
>`}
          </CodeBlock>
        );
        break;
      case "vue":
        Code = (
          <CodeBlock language="html">
            {`<WebPlayer
  ...
  @compositionLoaded="
    composition => console.log('Composition loaded', composition)
  "
>`}
          </CodeBlock>
        );
        break;

      case "native":
        Code = (
          <CodeBlock language="javascript">
            {`import { DEFAULT_EVENT_PREFIX, EVENT_COMPOSITION_LOADING } from "@car-cutter/native-webplayer";

document.addEventListener(DEFAULT_EVENT_PREFIX + EVENT_COMPOSITION_LOADING, (event) => {
  console.log("Composition loaded", event.detail);
});
`}
          </CodeBlock>
        );
        break;
    }

    return (
      <>
        <Heading as="h3">Example</Heading>
        {Code}
      </>
    );
  };

  return (
    <Tabs groupId="events-handling">
      <TabItem value="jsx" label="React/Next">
        <EventTable type="jsx" />
        <ExampleCode type="jsx" />
      </TabItem>
      <TabItem value="vue" label="Vue">
        <EventTable type="vue" />
        <ExampleCode type="vue" />
      </TabItem>
      <TabItem value="native" label="Native">
        <EventTable type="native" />
        <ExampleCode type="native" />
      </TabItem>
    </Tabs>
  );
};

export default WebPlayerEventsTable;
