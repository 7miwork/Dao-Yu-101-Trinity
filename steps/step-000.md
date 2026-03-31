# Step 000 — Clean Restart + System Init

## Goal
Initialize a clean, professional project foundation for Dao-Yu-101 Trinity with React, Vite, TypeScript, TailwindCSS, and React Router.

## Actions Taken

### 1. Project Initialization
- Created new npm project with `npm init -y`
- Configured as ES module project (`"type": "module"`)
- Added proper scripts: `dev`, `build`, `preview`

### 2. Dependencies Installed

**Production Dependencies:**
| Package | Version | Purpose |
|---------|---------|---------|
| react | ^19.2.4 | UI Framework |
| react-dom | ^19.2.4 | React DOM renderer |
| react-router-dom | ^7.13.2 | Client-side routing |
| vite | ^8.0.3 | Build tool |
| @vitejs/plugin-react | ^6.0.1 | React plugin for Vite |
| typescript | ^6.0.2 | Type safety |
| tailwindcss | ^4.2.2 | Utility-first CSS |
| @tailwindcss/postcss | ^1.0.0 | PostCSS plugin for Tailwind v4 |
| postcss | ^8.5.8 | CSS processing |
| autoprefixer | ^10.4.27 | CSS vendor prefixes |

**Dev Dependencies:**
| Package | Version | Purpose |
|---------|---------|---------|
| @types/react | ^19.2.14 | React type definitions |
| @types/react-dom | ^19.2.3 | ReactDOM type definitions |

### 3. Folder Structure Created

```
Dao-Yu-101-Trinity/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Pages deployment
├── public/                     # Static assets
├── src/
│   ├── app/
│   │   └── router.tsx          # React Router config
│   ├── components/
│   │   ├── ui/                 # Base UI elements
│   │   └── layout/             # Layout components
│   ├── features/               # Feature modules
│   ├── layouts/                # Page layouts
│   ├── pages/
│   │   ├── LandingPage.tsx     # / → landing
│   │   ├── StudentPage.tsx     # /student → placeholder
│   │   ├── TeacherPage.tsx     # /teacher → placeholder
│   │   └── AdminPage.tsx       # /admin → placeholder
│   ├── styles/
│   │   └── index.css           # Global styles with Tailwind
│   └── utils/                  # Utility functions
├── steps/                      # Documentation system
│   └── step-000.md
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
├── tailwind.config.js
└── postcss.config.js
```

### 4. Configuration Files

#### vite.config.ts
- Production-safe path alias using `fileURLToPath` + `URL`
- Base path set to `/Dao-Yu-101-Trinity/` for GitHub Pages
- React plugin configured

#### tsconfig.json
- Path alias: `@/*` → `./src/*`
- Strict mode enabled
- ES2020 target with React JSX support

#### tailwind.config.js
- Content paths configured for all TSX/JSX files
- Custom theme with pixel font, body font
- Custom colors: dark-bg, card-bg, grass, sky, gold, lava
- Custom animations: twinkle, pulse-glow, shimmer

#### postcss.config.js
- Uses `@tailwindcss/postcss` for Tailwind v4
- Autoprefixer configured

### 5. Routing System

Using `createBrowserRouter` + `RouterProvider` pattern:

```tsx
// src/app/router.tsx
export const router = createBrowserRouter([
  { path: '/', element: <LandingPage /> },
  { path: '/student', element: <StudentPage /> },
  { path: '/teacher', element: <TeacherPage /> },
  { path: '/admin', element: <AdminPage /> },
], {
  basename: '/Dao-Yu-101-Trinity'
})
```

**Routes:**
| Route | Page | Content |
|-------|------|---------|
| `/` | LandingPage | "Dao-Yu-101 Trinity" + "System Initializing..." |
| `/student` | StudentPage | "Student Portal — Coming Soon" |
| `/teacher` | TeacherPage | "Teacher Dashboard — Coming Soon" |
| `/admin` | AdminPage | "Admin System — Coming Soon" |

### 6. GitHub Actions Workflow

**File:** `.github/workflows/deploy.yml`

**How it works:**
1. Triggers on push to `main` branch or manual dispatch
2. Checks out code
3. Sets up Node.js 20 with npm cache
4. Installs dependencies with `npm ci`
5. Builds project with `npm run build`
6. Uploads `dist/` folder as GitHub Pages artifact
7. Deploys to GitHub Pages

**Required GitHub Settings:**
- Repository → Settings → Pages → Source: "GitHub Actions"

### 7. Tailwind CSS v4 Setup

Using Tailwind v4 with the new PostCSS plugin:
- Installed `@tailwindcss/postcss` package
- Updated `postcss.config.js` to use `@tailwindcss/postcss`
- Updated `index.css` to use `@import "tailwindcss"` syntax

## Files Created/Modified

| File | Status |
|------|--------|
| package.json | Created |
| vite.config.ts | Created |
| tsconfig.json | Created |
| tsconfig.node.json | Created |
| tailwind.config.js | Created |
| postcss.config.js | Created |
| index.html | Created |
| src/main.tsx | Created |
| src/app/router.tsx | Created |
| src/styles/index.css | Created |
| src/pages/LandingPage.tsx | Created |
| src/pages/StudentPage.tsx | Created |
| src/pages/TeacherPage.tsx | Created |
| src/pages/AdminPage.tsx | Created |
| .github/workflows/deploy.yml | Created |
| steps/step-000.md | Created |

## Reasoning

This foundation provides:
1. **Clean architecture** — Modular folder structure ready for Trinity UI separation
2. **Modern stack** — React 19, Vite 8, TypeScript 6, TailwindCSS 4
3. **Routing ready** — Multi-role routing structure for student/teacher/admin
4. **Deployment ready** — GitHub Actions workflow for automatic deployment
5. **Documentation system** — Step-by-step documentation in `/steps/`

## Verification

| Check | Status |
|-------|--------|
| `npm run dev` | ✅ Server starts on http://localhost:5173/Dao-Yu-101-Trinity/ |
| `npm run build` | ✅ Builds successfully to `dist/` folder |
| Routing | ✅ All 4 routes configured |
| GitHub Actions | ✅ Workflow file created |
| Documentation | ✅ step-000.md created |

## Next Step

**STEP 001 — Design System + Dual UI Foundation**
- Create design tokens
- Build base UI components
- Prepare for Trinity UI separation (Student, Teacher, Admin)