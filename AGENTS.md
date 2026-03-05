# Car Cutter Webplayer Agent Guidelines

This document provides instructions for AI agents operating in the `cars-webplayer-js` repository.

## 1. Project Overview

This is a **monorepo** managed by **Turborepo** and **Yarn Workspaces**.
- **Package Manager:** Yarn (v1.22.22)
- **Build System:** Turborepo
- **Languages:** TypeScript, JavaScript, CSS/Tailwind
- **Frameworks:** React, Preact, Vue, Web Components (via `r2wc`), Next.js (demos)

### Directory Structure
- **apps/**
  - `demo-*`: Example applications for various frameworks (React, Vue, Vanilla, WC, Next.js).
  - `docs`: Documentation site.
  - `showroom`: Internal testing tool for the webplayer.
- **packages/**
  - `core`: Framework-agnostic core logic, types, constants, and utilities.
  - `core-ui`: Shared UI components and logic built with Preact/React.
  - `webplayer-*`: Wrappers adapting `core-ui` for specific frameworks (React, Vue, WC, etc.).
  - `config-*`: Shared configurations (ESLint, TypeScript).

## 2. Build, Lint, and Test Commands

### Core Commands (Run from Root)
- **Install Dependencies:** `yarn install`
- **Build All:** `yarn build` (runs `turbo build`)
- **Lint All:** `yarn lint` (runs `turbo lint`)
- **Clean:** `yarn clean` (removes `node_modules`, `.turbo`, `dist`)

### Development & Verification
There is no global `test` command. Verification relies on linting, building, and running demo applications to manually verify changes.

- **Start Core Dev:** `yarn dev:core` (Focus on `@car-cutter/core-ui`)
- **Start Showroom:** `yarn dev:showroom` (Internal testing tool)
- **Start Demos:**
  - `yarn demo:react`
  - `yarn demo:vue`
  - `yarn demo:wc`
  - `yarn demo:vanilla`
  - `yarn demo:next`

### Running Tasks for Specific Packages
Use `turbo` filters to run tasks for specific packages:
- **Build specific package:** `yarn turbo build --filter=@car-cutter/core`
- **Lint specific package:** `yarn turbo lint --filter=@car-cutter/core`

## 3. Architecture & Design

### Core Logic (`@car-cutter/core`)
- Contains pure TypeScript logic, constants, and type definitions.
- acts as the source of truth for props, events, and data structures.

### UI Components (`@car-cutter/core-ui`)
- Built using **React/Preact**.
- Uses **Context API** for state management (`GlobalContextProvider`, `CustomizationContextProvider`).
- Uses **Custom Hooks** for logic reuse (e.g., analytics, resizing).
- **Styling:** Uses **Tailwind CSS** with CSS variables for dynamic theming (e.g., `--primary`, `--background`).

### Communication
- **Events:** The player emits Custom Events (defined in `core`) to communicate with the host application (e.g., `compositionLoaded`, `itemChange`).
- **Analytics:** Built-in analytics system dispatching events and/or sending requests to a configurable endpoint.

## 4. Code Style & Conventions

### General
- **Formatting:** Prettier is strictly enforced.
- **Linting:** ESLint with `typescript-eslint`, `import`, and `unused-imports` plugins.
- **Strictness:** TypeScript `strict` mode is enabled.

### Imports
- **Sorting:** Imports must be sorted alphabetically and grouped.
  - Order: Built-in -> External -> Internal (`@/`, `@car-cutter/`) -> Parent -> Sibling -> Index.
- **Unused Imports:** strictly forbidden. Remove them.

### Naming Conventions
- **Files:** `kebab-case` for directories and config files. `PascalCase` for React components/classes. `camelCase` for utilities/functions.
- **Variables/Functions:** `camelCase`.
- **Types/Interfaces:** `PascalCase`.
- **Private Properties:** Do not use `#private` syntax unless necessary; prefer `private` keyword in TS.

### TypeScript
- **Explicit Types:** Prefer explicit return types for exported functions.
- **No `any`:** Avoid `any`; use `unknown` or specific types.
- **Unused Variables:** Must be removed or prefixed with `_` (e.g., `_ignored`).

### Error Handling
- Use `try/catch` blocks for async operations, especially network requests.
- Log errors using a dedicated logger or console (if permitted, though `no-console` is an error rule - check if a logger utility exists).

### Commit Messages
- **Format:** Conventional Commits (`<type>[scope]: <description>`).
- **Types:** `feat`, `fix`, `test`, `style`, `perf`, `ci`, `build`, `docs`, `refactor`.
- **Scope:** Optional (e.g., `Core`, `UI`, `React`).
- **Description:** Start with a capital letter, end with a period.
- **Example:** `fix(Core): Resolved null pointer exception in loader.`

## 5. Workflow for Agents
1.  **Analyze:** detailed understanding of the task and codebase.
2.  **Plan:** Create a plan. If tests are missing, plan to verify via build/lint or creating a reproduction in a demo app.
3.  **Implement:** specific changes adhering to style guides.
4.  **Verify:**
    - Run `yarn lint` to ensure no linting errors.
    - Run `yarn build` to ensure type safety and build success.
    - If applicable, verifying functionality by running a relevant demo.
