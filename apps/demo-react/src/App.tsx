import { WebPlayer } from "@car-cutter/react-webplayer";

import reactLogo from "./assets/react.svg";

import "./App.css";

const App = () => {
  return (
    <>
      <header className="header">
        <div className="header__container">
          <div className="header__left">
            <img src={reactLogo} className="header__logo" alt="React logo" />

            <nav className="header__nav">
              <a href="#">Prestation</a>
              <a href="#">Succursale</a>
            </nav>
          </div>
          <a href="#">Vers le site le plus proche</a>
        </div>
      </header>

      <main className="main">
        <div className="main__left">
          <WebPlayer
            compositionUrl="https://cdn.car-cutter.com/libs/web-player/v3/demos/composition.json"
            flatten
            infiniteCarrousel
            permanentGallery
          />
        </div>

        <div className="main__right">
          <div>
            <div className="titles">
              <h1>Volkswagen - Passat 2.0 TDI SCR DSG 4MOT Alltrack</h1>
              <h2>Passat 2.0 TDI SCR DSG 4MOT Alltrack Servotronic</h2>
            </div>
          </div>

          <div className="features">
            <span>Eningen unter Achalm</span>
            <span>occasion</span>
            <span>108.000 km</span>
            <span>EZ 08/2017</span>
            <span>239 PS</span>
            <span>Diesel</span>
            <span>Vollleder</span>
            <span>Regensensor</span>
            <span>Leichtmetallfelgen</span>
            <span>Bluetooth</span>
            <span>Sitzheizung</span>
            <span>+ 5 autres</span>
          </div>

          <p>
            Consommation comb.: 6,0 l/100 km; Émissions de CO2: 157 g/km; Classe
            CO2: F (WLTP)
          </p>

          <div className="payment">
            <h3>Mode de paiement</h3>
            <div className="price-infos">
              <span>Price d&apos;achat</span>
              <span className="price">23.860 €</span>
            </div>
            <div className="buttons">
              <button>Demande de contact sans engagement</button>
              <button>Vers le site</button>
              <button>Vers la demande d&apos;achat</button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default App;
