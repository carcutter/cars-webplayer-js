import {
  ChangeDetectionStrategy,
  Component,
  computed,
  CUSTOM_ELEMENTS_SCHEMA,
  input,
} from "@angular/core";

import {
  type WebPlayerIconProps,
  webPlayerIconPropsToAttributes,
} from "@car-cutter/wc-webplayer";

import { syncAttributes } from "./sync-attributes";

export type { WebPlayerIconProps };

/** A custom icon, given as content of `<car-cutter-webplayer>` */
@Component({
  selector: "car-cutter-webplayer-icon",
  template: `<cc-webplayer-icon><ng-content /></cc-webplayer-icon>`,
  host: { style: "display: contents" },
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WebPlayerIcon {
  readonly name = input.required<WebPlayerIconProps["name"]>();

  constructor() {
    syncAttributes(
      computed(() =>
        webPlayerIconPropsToAttributes({
          name: this.name(),
        } satisfies Record<keyof WebPlayerIconProps, unknown>)
      )
    );
  }
}
