import WebPlayer from "../src/WebPlayer";
import WebPlayerCustomMedia from "../src/WebPlayerCustomMedia";
import WebPlayerIcon from "../src/WebPlayerIcon";

const DevApp: React.FC = () => {
  return (
    <div>
      {/* FUTURE: Add some stuff to make it appear like a real app */}

      <div
        style={{
          padding: "1rem",
          marginBottom: "1rem",
          borderBottom: "1px solid #000",
        }}
      >
        <h2
          style={{
            fontSize: "1.5rem",
          }}
        >
          Carcutter Demo React
        </h2>
      </div>

      <div
        style={{
          maxWidth: "800px",
          marginInline: "auto",
        }}
      >
        <WebPlayer
          // compositionUrl="/composition_mock_1.json"
          compositionUrl="https://cdn.car-cutter.com/libs/web-player/v3/demos/composition.json"
          // compositionUrl="https://cdn.car-cutter.com/gallery/7de693a6dd8379eb743f6093499bdd13fe76876f135ae9a08b7d9ecbfb7f8664/WAUZZZF34N1097219/composition_v3.json"
          // hideCategories
          infiniteCarrousel
          permanentGallery
          // mediaLoadStrategy="speed"
          // minMediaWidth={300}
          // maxMediaWidth={1000}
          // preloadRange={3}
          // preventFullScreen
          // eventPrefix="cc-event:"
          // reverse360
        >
          <WebPlayerCustomMedia
            index={4}
            thumbnailSrc="https://cdn.car-cutter.com/libs/web-player/v3/assets/mocks/custom_thumbnail_audi.png"
          >
            <img src="https://cdn.car-cutter.com/libs/web-player/v3/assets/mocks/custom_image_1.jpg" />
          </WebPlayerCustomMedia>
          <WebPlayerCustomMedia index={-2}>
            <img src="https://cdn.car-cutter.com/libs/web-player/v3/assets/mocks/custom_image_2.jpg" />
          </WebPlayerCustomMedia>
          {/* <WebPlayerCustomMedia index={-3}>
            <img src="https://prod.pictures.autoscout24.net/listing-images/4ac589e2-40e3-47b8-a211-579d2e07125e_b277b9ec-63d5-4900-9003-77dd029364dc.jpg/720x540.webp" />
          </WebPlayerCustomMedia> */}

          <WebPlayerIcon name="TIRESPIN">
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
          </WebPlayerIcon>
        </WebPlayer>
      </div>
    </div>
  );
};

export default DevApp;
