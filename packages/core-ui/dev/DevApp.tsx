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

          <WebPlayerIcon name="TIRESPIN" color="#ff00ff">
            <svg
              style={{ color: "white" }}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 -960 960 960"
            >
              <path
                fill="currentColor"
                d="M230-450q-12.75 0-21.375-8.675-8.625-8.676-8.625-21.5 0-12.825 8.625-21.325T230-510h500q12.75 0 21.375 8.675 8.625 8.676 8.625 21.5 0 12.825-8.625 21.325T730-450H230Z"
              />
            </svg>
          </WebPlayerIcon>
        </WebPlayer>
      </div>
    </div>
  );
};

export default DevApp;
