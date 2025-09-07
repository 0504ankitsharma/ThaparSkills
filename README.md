# ThaparSkills — Peer-to-Peer Skill‑Sharing Platform 🚀

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square\&logo=next.js) ![Supabase](https://img.shields.io/badge/Supabase-Database-green?style=flat-square\&logo=supabase) ![Clerk](https://img.shields.io/badge/Clerk-Auth-blue?style=flat-square\&logo=clerk) ![Redis](https://img.shields.io/badge/Redis-Caching-red?style=flat-square\&logo=redis) ![License](https://img.shields.io/badge/License-MIT-lightgrey?style=flat-square)

**ThaparSkills** is a modern peer‑to‑peer skill‑sharing platform built for *Thapar University* students. It allows students to create verified profiles, post skills they can teach, connect with peers, chat in real time, and schedule learning sessions — all with a clean responsive UI.

---

## ✨ Highlights

* 🔐 **Authentication** with Clerk (secure sign‑up + SSO ready)
* 👤 **Verified Profiles** using roll‑number verification
* 📢 **Skill Posts**: images, tags, descriptions, and search
* 🤝 **Connections**: send/accept connection requests
* 💬 **Real‑time Chat** with Redis caching for fast messaging
* 📅 **Session Scheduling** with calendar/time selection
* ⚡ **Caching**: Redis for feeds & chat performance
* 🛡️ **Row‑Level Security (RLS)** enforced in Supabase
* ♿ **Responsive UI** using TailwindCSS and Thapar branding

---

## 🛠️ Tech Stack

| Layer          | Technology                            |
| -------------- | ------------------------------------- |
| Frontend       | Next.js 14 + TypeScript + TailwindCSS |
| Authentication | Clerk                                 |
| Database       | Supabase (PostgreSQL)                 |
| Caching        | Redis (Upstash / Cloud)               |
| Storage        | Supabase Storage                      |
| Hosting        | Vercel (recommended)                  |

---

## 🚀 Quick Start

### 1. Clone & install

```bash
git clone <your-repo-url>
cd thapar-skills
pnpm install
```

> If you prefer npm: `npm install` or yarn: `yarn install`.

### 2. Environment setup

```bash
cp .env.example .env.local
```

Fill in the following values in `.env.local`:

* `NEXT_PUBLIC_SUPABASE_URL`
* `NEXT_PUBLIC_SUPABASE_ANON_KEY`
* `SUPABASE_SERVICE_ROLE_KEY` (server only)
* `CLERK_FRONTEND_API`, `CLERK_API_KEY`, `CLERK_SIGN_IN_URL`, `CLERK_SIGN_UP_URL`
* `REDIS_URL` (Upstash or other provider)
* `NEXTAUTH_URL` (if using additional auth flows)

### 3. Database & auth

1. Create a Supabase project and import `supabase-schema.sql` (present in repo).
2. Configure Supabase Storage buckets and set public/private rules per your app needs.
3. Configure Clerk application with the callback/redirect URLs used by your Next.js app.
4. Add Row Level Security (RLS) policies — sample policies are included in `supabase-schema.sql`.

### 4. Run the development server

```bash
pnpm dev
# or npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🏗️ Project structure

```
thapar-skills/
├── app/                    # Next.js app directory (routes + pages)
│   ├── api/                # Server API routes
│   ├── dashboard/          # User dashboard
│   ├── onboarding/         # Onboarding flow
│   ├── post-skill/         # Create skill posts
│   ├── connections/        # Connections UI
│   ├── chat/               # Real-time chat pages
│   ├── profile/            # Profile pages
│   └── settings/           # Settings & account
├── components/             # Reusable UI components
├── lib/                    # Utilities (supabase, redis, auth helpers)
├── styles/                 # Global styles + theme
├── middleware.ts           # Clerk middleware & auth checks
├── supabase-schema.sql     # Database schema & seed data
├── .env.example            # Example env variables
└── README.md               # Project documentation
```

---

## 🔌 API Endpoints (examples)

| Endpoint                    | Method       | Description                      |
| --------------------------- | ------------ | -------------------------------- |
| `/api/users`                | `POST`       | Create user profile              |
| `/api/users/me`             | `GET`        | Retrieve current user profile    |
| `/api/skills`               | `GET`/`POST` | List skills / Create skill post  |
| `/api/skills/:id`           | `GET`/`PUT`  | Get / Update a skill post        |
| `/api/connections`          | `GET`/`POST` | Manage connection requests       |
| `/api/chats/:connection_id` | `GET`/`POST` | Fetch / Send chat messages       |
| `/api/sessions`             | `GET`/`POST` | List / Create scheduled sessions |

> All API inputs are validated with **Zod** and protected by Clerk authentication.

---

## 🎨 UI Components (key)

* **Navbar** — Top navigation + user menu
* **BackButton** — Consistent navigation helper
* **SkillCard** — Visual card for skill posts (image, tags, meta)
* **ChatBox** — Real‑time chat UI with typing/online indicators
* **ScheduleModal** — Create / confirm learning sessions

---

## 🔒 Security & Best Practices

* **Row Level Security (RLS)** enforced in Supabase for all private data.
* **Clerk** handles authentication and session management.
* **Zod** schemas validate API payloads server‑side.
* **Storage rules** ensure users can only modify their uploads.
* **Rate limiting** and Redis caching recommended for public feed endpoints.

---

## ♻️ Performance & Scaling Notes

* Use Redis (Upstash or managed Redis) to cache skill feeds and chat messages for fast reads.
* Offload media to Supabase Storage and serve via signed URLs for private content.
* Use background jobs (e.g., serverless functions or workers) for heavy tasks like image processing or notifications.

---

## ✅ Deployment

**Vercel (recommended)**

1. Push the repository to GitHub.
2. In Vercel, import the project and add environment variables from `.env.local`.
3. Set the build command to `pnpm build` and output directory to `.next` (default for Next.js 14).
4. Deploy — Vercel will create previews for PRs and auto deploy on main branch.

---

## 🧪 Tests

* Add unit tests for utilities and API routes (Jest / Vitest recommended).
* Add integration tests for key flows: onboarding, posting skills, creating connections, chat.

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repo
2. Create a feature branch `feature/your-feature`
3. Write tests for new behavior
4. Open a Pull Request describing your changes

Please follow the repository's code style and commit conventions.

---

## 📬 Contact

If you have questions or want to collaborate, reach out at: **[0504ankitsharma@gmail.com](mailto:0504ankitsharma@gmail.com)**

---

**Enjoy building — and learning — together!** ✨
