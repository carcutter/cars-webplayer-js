import { ensureCustomElementsDefinition } from "../src/wc";

ensureCustomElementsDefinition();

const DevApp: React.FC = () => {
  return (
    <div
      style={{
        maxWidth: "800px",
        marginInline: "auto",
      }}
    >
      <h1>WC</h1>

      <cc-webplayer
        composition-url="https://cdn.car-cutter.com/libs/web-player/v3/demos/composition.json"
        hide-categories="true"
        permanent-gallery="true"
      >
        <cc-webplayer-custom-media
          index="4"
          thumbnail-src="https://cdn.car-cutter.com/libs/web-player/v3/assets/mocks/custom_thumbnail_audi.png"
        >
          <img src="https://cdn.car-cutter.com/libs/web-player/v3/assets/mocks/custom_image_1.jpg" />
        </cc-webplayer-custom-media>
      </cc-webplayer>
    </div>
  );
};

export default DevApp;
