export function preloadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = src;
    img.onload = () => resolve(img);
    img.onerror = reject;
  });
}

export function isSelfEvent(event: React.MouseEvent) {
  return event.target === event.currentTarget;
}

export function isFirstChildEvent(event: React.MouseEvent) {
  return event.target === event.currentTarget.firstElementChild;
}
