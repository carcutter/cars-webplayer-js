import {
  ChangeDetectionStrategy,
  Component,
  computed,
  CUSTOM_ELEMENTS_SCHEMA,
  input,
} from "@angular/core";

import {
  type WebPlayerCustomMediaProps,
  webPlayerCustomMediaPropsToAttributes,
} from "@car-cutter/wc-webplayer";

import { syncAttributes } from "./sync-attributes";

export type { WebPlayerCustomMediaProps };

/** A custom media, given as content of `<car-cutter-webplayer>` */
@Component({
  selector: "car-cutter-webplayer-custom-media",
  template: `
    <cc-webplayer-custom-media><ng-content /></cc-webplayer-custom-media>
  `,
  host: { style: "display: contents" },
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WebPlayerCustomMedia {
  readonly index = input.required<number>();
  readonly thumbnailSrc = input<WebPlayerCustomMediaProps["thumbnailSrc"]>();

  constructor() {
    syncAttributes(
      computed(() =>
        webPlayerCustomMediaPropsToAttributes({
          index: this.index(),
          thumbnailSrc: this.thumbnailSrc(),
        } satisfies Record<keyof WebPlayerCustomMediaProps, unknown>)
      )
    );
  }
}
