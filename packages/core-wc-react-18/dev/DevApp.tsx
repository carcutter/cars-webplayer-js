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

        <cc-webplayer-icon name="TIRESPIN">
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
        </cc-webplayer-icon>
      </cc-webplayer>
    </div>
  );
};

export default DevApp;
