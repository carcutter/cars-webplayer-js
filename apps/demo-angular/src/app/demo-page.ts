import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from "@angular/core";

import { demoUrl, themeStyle, type Theme } from "@car-cutter/demo";

/**
 * Layout of the demo: the header, then the content given in its `media` (the
 * WebPlayer) and `events` slots
 */
@Component({
  selector: "demo-page",
  template: `
    <div class="dm dm--fit" [style]="style()">
      <header class="dm-header">
        <div class="dm-header__inner">
          <a class="dm-brand" [href]="indexUrl" title="All demos">
            <span class="dm-brand__tile">{{ theme().mono }}</span>
            <span class="dm-brand__text">
              <span class="dm-brand__title">{{ theme().title }}</span>
              <span class="dm-brand__subtitle">
                CarCutter WebPlayer integration
              </span>
            </span>
          </a>
          <span class="dm-pill">{{ theme().pkg }}</span>
        </div>
      </header>
      <main class="dm-main">
        <div class="dm-stage"><ng-content select="[media]" /></div>
        <div class="dm-below"><ng-content select="[events]" /></div>
      </main>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DemoPage {
  readonly theme = input.required<Theme>();

  protected readonly indexUrl = demoUrl("index");
  protected readonly style = computed(() => themeStyle(this.theme()));
}
