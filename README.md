# Kuru Prototype 2

Frontend prototype built with **Vite + React + TypeScript**.

## Prerequisites

- **Node.js** 18+ (recommended: latest LTS)
- **npm** (comes with Node.js)

## How to run the program

1. Open a terminal in the project root:
   - `f:\work\projectprep\kuru-prototype-2`
2. Install dependencies:
   - `npm install`
3. Start the development server:
   - `npm run dev`
4. Open the local URL shown in the terminal (usually `http://localhost:5173`).

## Available scripts

- `npm run dev` — Start local development server
- `npm run build` — Build for production
- `npm run build:dev` — Build using development mode
- `npm run preview` — Preview production build locally
- `npm run lint` — Run ESLint
- `npm run test` — Run tests once with Vitest
- `npm run test:watch` — Run Vitest in watch mode

## Production build (optional)

To build and preview a production version locally:

1. `npm run build`
2. `npm run preview`

## Troubleshooting

- If dependencies fail to install, delete `node_modules` and `package-lock.json`, then run `npm install` again.
- If the dev server port is in use, Vite may automatically choose another port. Use the URL printed in your terminal.
