import { ChangeDetectionStrategy, Component } from "@angular/core";

import { WebPlayer } from "@car-cutter/angular-webplayer";
import { COMPOSITION_URL, THEMES } from "@car-cutter/demo";

import { DemoPage } from "./demo-page";
import { EventLog, eventLog } from "./event-log";

@Component({
  selector: "demo-app",
  imports: [DemoPage, EventLog, WebPlayer],
  template: `
    <demo-page [theme]="theme">
      <car-cutter-webplayer
        media
        class="dm-player"
        [compositionUrl]="compositionUrl"
        infiniteCarrousel
        permanentGallery
        (compositionLoading)="events.log('composition-loading', $event)"
        (compositionLoaded)="events.log('composition-loaded', $event)"
        (compositionLoadError)="events.log('composition-load-error', $event)"
        (itemChange)="events.log('item-change', $event)"
        (extendModeOn)="events.log('extend-mode-on')"
        (extendModeOff)="events.log('extend-mode-off')"
        (hotspotsOn)="events.log('hotspots-on')"
        (hotspotsOff)="events.log('hotspots-off')"
        (galleryOpen)="events.log('gallery-open')"
        (galleryClose)="events.log('gallery-close')"
      />
      <demo-event-log
        events
        [entries]="events.entries()"
        [total]="events.total()"
        source="Via <car-cutter-webplayer (…)> outputs"
        (clear)="events.clear()"
      />
    </demo-page>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  protected readonly theme = THEMES.angular;
  protected readonly compositionUrl = COMPOSITION_URL;
  protected readonly events = eventLog();
}
