# 🎬 Daily Film

A modern, high-performance movie streaming application built with Next.js 16, featuring a premium responsive design, seamless playback, and personalized watch history.

![Daily Film Banner](https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?q=80&w=2056&auto=format&fit=crop)

## ✨ Features

- **🎥 Modern Streaming Experience**:
  - **Infinite Scroll** Home Page for endless browsing.
  - **Custom Player** wrapper for a seamless viewing experience.
  - **Auto-Next Episode** suggestions.
  - **Responsive Grid Layouts** optimized for Mobile and Desktop.

- **💾 Smart Retention**:
  - **Continue Watching**: Automatically tracks your progress (anonymous & database-backed).
  - **Watch History**: Never lose your spot.
  - **Related Movies**: Discover similar content instantly.

- **⚡ Tech Excellence**:
  - Built on **Next.js 16** (App Router & Server Actions).
  - **Turso (LibSQL)** for edge-ready database performance.
  - **Tailwind CSS** for sleek, dark-mode-first styling.
  - **SSR & SEO Optimized** for maximum visibility.

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/)
- **Database**: [Turso (LibSQL)](https://turso.tech/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Deployment**: Vercel (Recommended)

## 🚀 Getting Started

Follow these steps to run the project locally.

### Prerequisites

- Node.js 18+ installed.
- A Turso database URL and Token.

### Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/JethroHawthorn/daily-film.git
    cd daily-film
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    # or
    pnpm install
    ```

3.  **Configure Environment**:
    Rename `env.example` to `.env` and fill in your keys:

    ```env
    TURSO_DATABASE_URL="libsql://your-db-url.turso.io"
    TURSO_TOKEN="your-turso-token"
    ADMIN_FEEDBACK_PASSWORD="set-a-strong-password"
    NEXT_PUBLIC_OPHIM_BASE_URL=""
    NEXT_PUBLIC_OPHIM_IMAGE_URL=""
    ```

5.  **Initialize Database Tables**:
    ```bash
    node scripts/setup_feedback_db.js
    ```

6.  **Run Development Server**:
    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) to start watching!

## 📂 Project Structure

- `app/`: Next.js App Router pages and layouts.
- `components/`: Reusable UI components (Hero, Player, MovieGrid).
- `lib/`: Utilities, Database client, and API helpers.
- `types/`: TypeScript definitions for Movies and API responses.
- `actions/`: Server Actions for data mutations (History, Pagination).

## Feedback Inbox

- Users can submit website feedback from the homepage.
- Admin can review feedback at `/admin/feedback`.
- Access is protected by `ADMIN_FEEDBACK_PASSWORD`.

## 🤝 Contributing

Contributions are welcome! Please fork the repository and submit a Pull Request.

---

Built with ❤️ by JethroHawthorn.
