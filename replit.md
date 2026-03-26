# TwoDbet - React + Vite Frontend

## Overview
A React single-page application built with Vite, Tailwind CSS, and React Router.

## Tech Stack
- **Framework:** React 19
- **Build Tool:** Vite 7
- **Styling:** Tailwind CSS 4 (via `@tailwindcss/vite` plugin)
- **Routing:** React Router 7 (react-router + react-router-dom)
- **Icons:** Lucide React
- **Date Picker:** react-datepicker

## Project Structure
```
/
├── src/
│   ├── admin/          # Admin panel components
│   ├── assets/         # Static assets
│   ├── components/     # Shared UI components
│   ├── css/            # Additional CSS files
│   ├── pages/          # Page-level components
│   ├── utils/          # Utility functions
│   ├── App.jsx         # Root app component
│   ├── Layout.jsx      # Layout wrapper
│   ├── main.jsx        # Entry point
│   └── index.css       # Global styles
├── public/             # Static public assets
├── router.jsx          # Route definitions
├── vite.config.js      # Vite configuration
└── package.json
```

## Development
- **Run:** `npm run dev` (served on port 5000)
- **Build:** `npm run build`

## Workflow
- **Start application** — runs `npm run dev` on port 5000 (webview)

## Deployment
- **Type:** Static site
- **Build command:** `npm run build`
- **Public directory:** `dist`
