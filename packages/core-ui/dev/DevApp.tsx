import WebPlayer from "../src/WebPlayer";
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
          // flatten
          infiniteCarrousel
          permanentGallery
          // imageLoadStrategy="speed"
          // minImageWidth={300}
          // maxImageWidth={1000}
          // preventFullScreen
          // eventPrefix="cc-event:"
          // reverse360
        >
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
