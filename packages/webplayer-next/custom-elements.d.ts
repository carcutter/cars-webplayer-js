import type {
  WebPlayerAttributes,
  WebPlayerIconAttributes,
} from "@car-cutter/core-wc";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "cc-webplayer": WebPlayerAttributes &
        Pick<React.HTMLAttributes<HTMLElement>, "style">;
      "cc-webplayer-icon": WebPlayerIconAttributes;
    }
  }
}
