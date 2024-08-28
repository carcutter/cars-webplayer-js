export function preloadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = src;
    img.onload = () => resolve(img);
    img.onerror = reject;
  });
}

export function isSelfEvent(
  event: Pick<Event, "target" | "currentTarget">,
): boolean {
  return event.target === event.currentTarget;
}
