# Vanilla WebPlayer

## Usage

1. Install package: `npm install @car-cutter/vanilla-webplayer`
2. Import: `import { appendWebPlayerElement } from "@car-cutter/vanilla-webplayer"`
3. Use:

```
  const targetElement = document.getElementById("target");

  appendWebPlayerElement(targetElement, {
    compositionUrl: url,
  });
```

For more customisation, take a look at available **props** in the main README.md
