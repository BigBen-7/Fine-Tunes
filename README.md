# Fine-Tunes: AI-Powered Music Discovery Dashboard

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white) ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white) ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white) ![Spotify API](https://img.shields.io/badge/Spotify_API-1DB954?style=for-the-badge&logo=spotify&logoColor=white) ![Gemini API](https://img.shields.io/badge/Gemini_API-4285F4?style=for-the-badge&logo=google-gemini&logoColor=white)

**[LIVE DEMO →](https://finetunes.vercel.app)**


---

!<img width="1709" height="985" alt="image" src="https://github.com/user-attachments/assets/5d11bc5e-9821-4ff2-bbf3-af4a28f6af9e" />

## 🎵 About The Project

Find-Tunes is a full-stack web application that creates a deeply personalized music discovery experience for Spotify users. It connects securely to the Spotify API to build a dashboard of the user's listening habits and leverages the power of the Google Gemini API to generate intelligent, context-aware playlists from natural language prompts.

This project was built from the ground up as a portfolio piece to showcase modern web development practices, including secure authentication, third-party API integration, full-stack AI implementation, and professional code structure.

## ✨ Key Features

* **Secure Spotify Authentication:** Full OAuth 2.0 flow to securely connect a user's Spotify account, with graceful handling for expired tokens.
* **Personalized Dashboard:** Dynamically fetches and displays the user's:
    * Profile Information (Name & Picture)
    * Top Played Tracks
    * Top Played Artists
    * Recently Saved Albums
    * Personal Playlists
* **🤖 AI Playlist Generator:** A core feature that allows users to type a natural language prompt (e.g., "upbeat indie rock for a summer drive") to generate a 50-song playlist using the Gemini API.
* **Full "Save to Spotify" Loop:** Users can name and save their AI-generated playlists directly to their Spotify account. The application's UI then dynamically refreshes to show the newly created playlist.
* **Professional UI/UX:**
    * A custom-animated, visually appealing login screen.
    * Sophisticated skeleton loaders provide a smooth data-fetching experience.
    * A fully responsive design that works seamlessly on desktop and mobile devices.
* **Robust Backend:** A secure server-side API route handles all communication with the Gemini API, protecting the secret API key from public exposure.

## 🛠️ Tech Stack

* **Framework:** [Next.js](https://nextjs.org/) (React)
* **Language:** [TypeScript](https://www.typescriptlang.org/)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/)
* **Deployment:** [Vercel](https://vercel.com/)
* **APIs:**
    * [Spotify Web API](https://developer.spotify.com/documentation/web-api)
    * [Google Gemini API](https://ai.google.dev/)
* **Icons:** [Lucide React](https://lucide.dev/)

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

* Node.js (v18 or later)
* npm or yarn

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/your-username/find-tunes.git](https://github.com/your-username/find-tunes.git)
    cd find-tunes
    ```

2.  **Install NPM packages:**
    ```bash
    npm install
    ```

3.  **Set up Environment Variables:**
    You will need to get API keys from both Spotify and Google.
    * Create a file named `.env.local` in the root of the project.
    * Add the following content to the file, replacing the placeholder values with your actual credentials.

    ```env
    # Get from Spotify Developer Dashboard: [https://developer.spotify.com/dashboard](https://developer.spotify.com/dashboard)
    NEXT_PUBLIC_SPOTIFY_CLIENT_ID="YOUR_SPOTIFY_CLIENT_ID"
    NEXT_PUBLIC_REDIRECT_URI="http://localhost:3000/"

    # Get from Google AI Studio: [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
    GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
    ```
    **Note:** Make sure to add `http://localhost:3000/` as a valid Redirect URI in your Spotify application settings.

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

5.  Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
