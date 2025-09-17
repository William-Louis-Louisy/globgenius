# Next.js 15.2 Fullstack Template 🚀

[![Next.js](https://img.shields.io/badge/Next.js-15.2-blue?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.x-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-4.0-blue?logo=tailwindcss)](https://tailwindcss.com/)
[![NextAuth](https://img.shields.io/badge/NextAuth-5.0-blue?logo=nextauth)](https://next-auth.js.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green)](LICENSE)

<div align="center">
  <img src="https://ucarecdn.com/7a96a378-0837-459c-ae3d-1ade754ec2e4/-/preview/1000x455/" alt="Project Header" />
</div>

---

## Table of Contents

- [Next.js 15.2 Fullstack Template 🚀](#nextjs-152-fullstack-template-)
  - [Table of Contents](#table-of-contents)
  - [Overview](#overview)
  - [Features](#features)
  - [Installation](#installation)
  - [Project Structure](#project-structure)
  - [Configuration](#configuration)
    - [UI Components](#ui-components)
    - [Deployment](#deployment)
    - [Contributing](#contributing)
    - [License](#license)

---

## Overview

Welcome to the **Next.js 15.2 Fullstack Template**! This template is built with modern best practices and a passion for clean, maintainable code. It is designed to get you started quickly with a powerful fullstack setup including:

- **TypeScript** for robust, type-safe code.
- **Next.js App Router** for advanced routing and API capabilities.
- **NextAuth with Google OAuth** with an integrated **ADMIN role** for secure authentication.
- **Tailwind CSS 4.0** for rapid and flexible UI styling.
- **Internationalization (i18n)** using next‑intl for a multilingual experience.
- **Headless UI & Phosphor Icons** to build accessible, stylish components.
- **Vercel-friendly** configuration for smooth deployment.

---

## Features

- **Next.js 15.2 & App Router**  
  Utilize the latest Next.js features with a segment-based routing system and serverless API routes.

- **TypeScript**  
  Benefit from static typing and enhanced code reliability throughout your project.

- **NextAuth with Google OAuth**  
  Secure user authentication with Google OAuth. Users whose email matches the `ADMIN_EMAIL` environment variable are granted the ADMIN role.

- **Tailwind CSS 4.0**  
  Build and customize your UI using Tailwind's utility-first classes. Easily tweak your design in `tailwind.config.js`.

- **Internationalization (i18n)**  
  Effortlessly support multiple languages (default: English and French) with dynamic route segments and server-loaded translations.

- **Headless UI & Phosphor Icons**  
  Integrate Headless UI for accessible, unstyled components and use Phosphor Icons to enhance your interface with elegant iconography.

- **Vercel Friendly**  
  Optimized for fast deployments on Vercel with lightweight middleware and efficient caching strategies.

---

## Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/your-username/your-repo.git
   cd your-repo
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Configure Environment Variables**

Create a .env.local file in the project root and add:

```dotenv
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
ADMIN_EMAIL=admin@example.com
NEXTAUTH_URL=https://your-deployment.vercel.app
NEXTAUTH_SECRET=your_nextauth_secret
```

---

## Project Structure

```graphql

├── src
├── app/
│   ├── favicon.ico
│   ├── manifest.json
│   ├── globals.css
│   ├── providers.tsx
│   ├── [locale]/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── admin/
│   │       └── page.tsx
│   └── api/
│       └── auth/
│           └── [...nextauth]
│               └── route.ts
├── components/
│   ├── navigation/
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   └── commons/
│       ├── MaxWidthWrapper.tsx
│       ├── LocalSwitch.tsx
│       └── Logo.tsx
├── i18n/
│   ├── navigation.ts
│   ├── request.ts
│   └── routing.ts
├── messages/
│   ├── en.json
│   └── fr.json
├── next.config.js
├── postcss.config.mjs
└── package.json
```

---

## Configuration

**Next.js 15.2:** Uses the new App Router for a clear separation of server and client code.

**TypeScript:** Enforces type safety and compile-time error checking for a robust codebase.

**Tailwind v4.0:** Build your UI with customizable utility classes. Modify your theme in tailwind.config.js to align with your brand.

**next‑intl:** Translation messages are stored in the /messages folder and dynamically loaded based on the active locale (e.g., /en/... and /fr/...).

_To add a new language, simply add a JSON file in /messages and update i18n/routing.ts._

**NextAuth:** Configured in app/api/auth/[...nextauth]/route.ts for seamless Google OAuth integration.

**ADMIN Role:** Users whose email matches the ADMIN_EMAIL environment variable are granted the ADMIN role, allowing access to protected routes.

Example of server-side admin route protection:

```tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/");
  }
  return <h1>Admin Dashboard</h1>;
}
```

---

### UI Components

**Headless UI**
Utilize Headless UI to build accessible, unstyled components (e.g., modals, dropdowns) that you can fully style with Tailwind CSS.

**Phosphor Icons**
Enhance your interface with Phosphor Icons. For example:

```tsx
import { House } from "phosphor-react";

export default function ExampleIcon() {
  return <House size={32} weight="bold" />;
}
```

---

### Deployment

This template is optimized for Vercel. To deploy:

**Push to GitHub**
Push your project to a GitHub repository.

**Connect to Vercel**
Link your GitHub repository with Vercel.

**Configure Environment Variables**
Set up your environment variables in the Vercel dashboard.

**Deploy**
Deploy your project and enjoy a fast, edge-optimized site with automatic caching.

### Contributing

Contributions are welcome! To contribute:

- Fork the Repository
- Create a New Branch

```bash
git checkout -b feature/my-new-feature
```

- Commit Your Changes
  Use clear and descriptive commit messages.
- Open a Pull Request
  Submit a PR detailing your modifications.

### License

This project is licensed under the MIT License.

<div align="center"> <sub>Crafted with passion and precision for an elegant and efficient fullstack development experience.</sub> </div>
