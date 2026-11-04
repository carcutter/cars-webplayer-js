import { Component, signal } from "@angular/core";
import {
  WebPlayer,
  WebPlayerCustomMedia,
  WebPlayerIcon,
} from "@car-cutter/angular-webplayer";

const COMPOSITION_URL =
  "https://cdn.car-cutter.com/libs/web-player/v3/demos/composition_v3.json";

// The app of the Angular version the package is built with: zone.js, and the
// AOT build links its partially compiled code
@Component({
  selector: "consumer-app",
  imports: [WebPlayer, WebPlayerCustomMedia, WebPlayerIcon],
  template: `
    <car-cutter-webplayer
      [compositionUrl]="compositionUrl"
      permanentGallery
      (compositionLoading)="onCompositionLoading($event)"
      (compositionLoaded)="log('composition-loaded')"
      (itemChange)="log('item-change')"
    >
      <car-cutter-webplayer-custom-media [index]="4" [thumbnailSrc]="thumbnail">
        <div id="custom-media">Custom media</div>
      </car-cutter-webplayer-custom-media>
      <car-cutter-webplayer-icon name="UI_GALLERY">
        <svg id="custom-icon" viewBox="0 0 10 10">
          <circle cx="5" cy="5" r="4" />
        </svg>
      </car-cutter-webplayer-icon>
    </car-cutter-webplayer>
    <ol id="events">
      @for (name of events(); track $index) {
        <li>{{ name }}</li>
      }
    </ol>
  `,
})
export class App {
  protected readonly compositionUrl = COMPOSITION_URL;
  // Optional inputs take undefined: fails the template check if the
  // declarations lose it (they did when not built with strict)
  protected readonly thumbnail: string | undefined = undefined;
  protected readonly events = signal<string[]>([]);

  protected log(name: string) {
    this.events.update(events => [...events, name]);
  }

  // Typed by the output of the declarations: fails the template check if the
  // payload loses its type
  protected onCompositionLoading(url: string) {
    this.log(url.startsWith("http") ? "composition-loading" : url);
  }
}
