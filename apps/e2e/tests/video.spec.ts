import type { Page } from "@playwright/test";

import { COMPOSITION_URL } from "@car-cutter/demo";

import { expect, pageUrl, test } from "./fixtures";

type Counters = { plays: number; pauses: number; loaded: boolean };

const counters = (page: Page) =>
  page.evaluate(() => (window as unknown as { counters: Counters }).counters);

/**
 * Adds a player whose first item is a video recorded in the page (the demo
 * composition has none), and returns the center of its media. The player is
 * in a closed shadow root: its video is followed through HTMLMediaElement.
 */
async function addVideoPlayer(page: Page) {
  await page.goto(pageUrl("wc"));
  await page.evaluate(async compositionUrl => {
    const counters: Counters = { plays: 0, pauses: 0, loaded: false };
    document.addEventListener("video:composition-loaded", () => {
      counters.loaded = true;
    });
    Object.assign(window, { counters });
    const { play, pause } = HTMLMediaElement.prototype;
    HTMLMediaElement.prototype.play = function () {
      counters.plays++;
      return play.call(this);
    };
    HTMLMediaElement.prototype.pause = function () {
      counters.pauses++;
      return pause.call(this);
    };

    const canvas = Object.assign(document.createElement("canvas"), {
      width: 320,
      height: 240,
    });
    const context = canvas.getContext("2d")!;
    const recorder = new MediaRecorder(canvas.captureStream(30), {
      mimeType: "video/webm",
    });
    const chunks: Blob[] = [];
    recorder.ondataavailable = event => chunks.push(event.data);
    let frame = 0;
    const drawing = setInterval(() => {
      context.fillStyle = `hsl(${frame++ * 7} 80% 50%)`;
      context.fillRect(0, 0, 320, 240);
    }, 33);
    recorder.start();
    await new Promise(resolve => setTimeout(resolve, 4_000));
    recorder.stop();
    await new Promise(resolve => (recorder.onstop = resolve));
    clearInterval(drawing);
    const src = URL.createObjectURL(new Blob(chunks, { type: "video/webm" }));

    const composition = await (await fetch(compositionUrl)).json();
    composition.categories.unshift({
      id: "video",
      title: "Video",
      items: [{ type: "video", src }],
    });

    const player = document.createElement("cc-webplayer");
    player.setAttribute(
      "composition-url",
      `data:application/json,${encodeURIComponent(JSON.stringify(composition))}`
    );
    player.setAttribute("event-prefix", "video:");
    player.setAttribute("monitoring", "false");
    player.style.display = "block";
    player.style.width = "400px";
    document.body.prepend(player);
  }, COMPOSITION_URL);

  await expect.poll(async () => (await counters(page)).loaded).toBe(true);
  await page.waitForTimeout(500);
  const box = (await page.locator("cc-webplayer").first().boundingBox())!;
  // The 4:3 media
  const height = box.width * 0.75;
  return {
    center: { x: box.x + box.width / 2, y: box.y + height / 2 },
    // Where the play/pause button of the controls is (above the progress bar)
    bottomLeft: { x: box.x + 32, y: box.y + height - 54 },
  };
}

test.describe("Video, on a touch screen", () => {
  // Real taps: the browser follows them with emulated mouse events, which
  // synthetic touch events don't trigger
  test.use({ hasTouch: true });

  test("taps play the video, without pausing it", async ({
    page,
    consoleErrors,
  }) => {
    const { center, bottomLeft } = await addVideoPlayer(page);

    // The play button, over the video
    await page.touchscreen.tap(center.x, center.y);
    await expect.poll(async () => (await counters(page)).plays).toBe(1);

    // Then the playing video, which toggles its controls: twice, and where
    // its pause button shows (hidden again, the tap mustn't press it)
    for (const { x, y } of [center, center, center, bottomLeft]) {
      await page.waitForTimeout(500);
      await page.touchscreen.tap(x, y);
    }
    await page.waitForTimeout(500);

    // No tap paused it
    expect(await counters(page)).toMatchObject({ plays: 1, pauses: 0 });
    expect(consoleErrors).toEqual([]);
  });
});

test.describe("Video, with a mouse", () => {
  test("a click on the playing video pauses it", async ({
    page,
    consoleErrors,
  }) => {
    const { center } = await addVideoPlayer(page);

    await page.mouse.click(center.x, center.y);
    await expect.poll(async () => (await counters(page)).plays).toBe(1);

    await page.waitForTimeout(500);
    const { pauses } = await counters(page);
    await page.mouse.click(center.x, center.y);

    await expect
      .poll(async () => (await counters(page)).pauses)
      .toBe(pauses + 1);
    expect(consoleErrors).toEqual([]);
  });

  test("a drag starting on the playing video doesn't pause it", async ({
    page,
    consoleErrors,
  }) => {
    const { center } = await addVideoPlayer(page);

    await page.mouse.click(center.x, center.y);
    await expect.poll(async () => (await counters(page)).plays).toBe(1);

    // A short drag of the carrousel, released on the video
    await page.waitForTimeout(500);
    await page.mouse.move(center.x, center.y);
    await page.mouse.down();
    await page.mouse.move(center.x - 6, center.y, { steps: 3 });
    await page.mouse.up();
    await page.waitForTimeout(500);

    expect(await counters(page)).toMatchObject({ plays: 1, pauses: 0 });
    expect(consoleErrors).toEqual([]);
  });
});
