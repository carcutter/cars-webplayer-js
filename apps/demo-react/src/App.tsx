import { WebPlayer } from "@car-cutter/react-webplayer";

function App() {
  return (
    <div>
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
          React-App
        </h2>
      </div>

      <div
        style={{
          maxWidth: "800px",
          marginInline: "auto",
        }}
      >
        <WebPlayer
          compositionUrl="https://cdn.car-cutter.com/gallery/767f46375d752707fcb76a19b8b22bc0040bd3ff59abc43d1c19eb0c04785c68/TEST1/composition_v3.json"
          flatten
        />
      </div>
    </div>
  );
}

export default App;
