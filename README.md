# Sip Find Rate

A personal wine diary and cellar tracker for logging bottles, rating tastings, and keeping tabs on what is waiting in the cellar.

Sip Find Rate is built as a small, mobile-friendly React app with Supabase authentication and storage. It gives you a quick home dashboard, a searchable tasting diary, and an inventory view for tracking bottle counts and storage locations.

<img width="1107" height="1305" alt="grafik" src="https://github.com/user-attachments/assets/aa610e55-ef49-479d-9f79-7a2a9bbe3c66" />


## What It Does

- Track wines with name, vintage, region, grape variety, color, rating, notes, and bottle imagery.
- Keep a tasting diary with search, filters, editable entries, and quick collection stats.
- Manage cellar inventory separately from tasting notes, including quantities and storage locations.
- See a home dashboard with total bottles, average rating, top region, and a daily wine pick.
- Sign in securely with Supabase Auth so each user has their own collection.
- Run as a Vite web app, with Capacitor configuration included for mobile packaging.

## Tech Stack

- React 18 + TypeScript
- Vite
- Tailwind CSS
- shadcn-ui / Radix UI
- Supabase
- TanStack Query
- React Router
- Capacitor
- Vitest

## Getting Started

### Prerequisites

- Node.js and npm
- A Supabase project with the expected tables and auth configuration

### Install

```sh
git clone https://github.com/iliketurtles1-2-3/sip-find-rate.git
cd sip-find-rate
npm install
```

### Configure Environment

Create a `.env.local` file in the project root:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
```

The app expects Supabase tables for wine entries and cellar inventory. The client is configured in `src/integrations/supabase/client.ts`, and generated database types live in `src/integrations/supabase/types.ts`.

### Run Locally

```sh
npm run dev
```

The Vite dev server is configured for port `8080`.

## Available Scripts

```sh
npm run dev        # Start the local development server
npm run build      # Build a production bundle
npm run build:dev  # Build with development mode settings
npm run preview    # Preview the production build locally
npm run lint       # Run ESLint
npm run test       # Run the Vitest suite
npm run test:watch # Run tests in watch mode
```

## Project Structure

```txt
src/
  components/       Shared UI and wine-specific components
  hooks/            Auth and app hooks
  integrations/     Supabase client and generated database types
  pages/            App routes: auth, home, diary, cellar, settings
  assets/           Visual assets used by the interface
```

## Main Screens

- `HomePage` shows collection stats, top region, and the daily pick.
- `DiaryPage` is the tasting journal for adding, editing, searching, filtering, and rating wines.
- `CellarPage` tracks bottle inventory, quantities, locations, and new or existing wines.
- `SettingsPage` handles account and app settings.
- `AuthPage` manages sign-in and account access.

## Deployment

This project originated from Lovable and can still be published there. It can also be built as a normal Vite app:

```sh
npm run build
```

The production output is written to `dist/`.

For mobile packaging, review `capacitor.config.ts` and run the relevant Capacitor commands after building the web bundle.

## Notes

The README used to be the default Lovable template. It now reflects the actual app: a wine diary, rating tool, and cellar inventory tracker.
