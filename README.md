# ThaparSkills - Peer-to-Peer Skill Sharing Platform 🚀

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square\&logo=next.js)
![Supabase](https://img.shields.io/badge/Supabase-Database-green?style=flat-square\&logo=supabase)
![Clerk](https://img.shields.io/badge/Clerk-Auth-blue?style=flat-square\&logo=clerk)
![Redis](https://img.shields.io/badge/Redis-Caching-red?style=flat-square\&logo=redis)
![License](https://img.shields.io/badge/License-MIT-lightgrey?style=flat-square)

A modern peer-to-peer skill-sharing platform for **Thapar University students**. Students can sign up, create profiles, post skills, connect with others, chat in real-time, and schedule learning sessions – all in one place!

---

## 📑 Table of Contents

* [✨ Features](#-features)
* [🛠️ Tech Stack](#️-tech-stack)
* [🚀 Quick Start](#-quick-start)
* [🏗️ Project Structure](#️-project-structure)
* [🔌 API Endpoints](#-api-endpoints)
* [🎨 UI Components](#-ui-components)
* [🔒 Security Features](#-security-features)
* [🚀 Deployment](#-deployment)
* [🧪 Testing](#-testing)
* [📱 Features in Detail](#-features-in-detail)
* [🔧 Configuration](#-configuration)
* [🐛 Troubleshooting](#-troubleshooting)
* [🤝 Contributing](#-contributing)
* [📄 License](#-license)
* [🎯 Roadmap](#-roadmap)

---

## ✨ Features

* 🔐 **Authentication** with Clerk
* 👤 **User Profiles** with roll number verification
* 📢 **Skill Posts** with images & descriptions
* 🤝 **Connections** with requests & approvals
* 💬 **Real-time Chat** using Redis caching
* 📅 **Session Scheduling** for learning sessions
* 📱 **Responsive UI** with TailwindCSS & Thapar brand colors
* ⚡ **Redis Caching** for skill feeds & chat messages
* 🛡️ **Row Level Security (RLS)** with Supabase

---

## 🛠️ Tech Stack

| Layer              | Technology                            |
| ------------------ | ------------------------------------- |
| **Frontend**       | Next.js 14 + TypeScript + TailwindCSS |
| **Authentication** | Clerk                                 |
| **Database**       | Supabase (PostgreSQL)                 |
| **Caching**        | Redis (Cloud / Upstash)               |
| **Storage**        | Supabase Storage                      |
| **Hosting**        | Vercel (Recommended)                  |

---

## 🚀 Quick Start

### 1️⃣ Clone & Install

```bash
git clone <your-repo-url>
cd thapar-skills
pnpm install
```

### 2️⃣ Environment Setup

```bash
cp env.example .env.local
```

Fill in your credentials for Clerk, Supabase, and Redis.

### 3️⃣ Database & Auth Setup

* Execute `supabase-schema.sql` in Supabase
* Configure Clerk sign-in/sign-up URLs
* Create Redis instance (Upstash/Cloud)

### 4️⃣ Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) 🚀

---

## 🏗️ Project Structure

```
thapar-skills/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard page
│   ├── onboarding/        # Onboarding page
│   ├── post-skill/        # Post skill page
│   ├── connections/       # Connections page
│   ├── chat/              # Chat pages
│   ├── profile/           # Profile pages
│   └── settings/          # Settings page
├── components/             # Reusable components
├── lib/                   # Utility libraries
├── styles/                # Global styles
├── middleware.ts          # Clerk middleware
├── supabase-schema.sql    # Database schema
└── README.md              # Documentation
```

---

## 🔌 API Endpoints

| Endpoint                    | Method       | Description                    |
| --------------------------- | ------------ | ------------------------------ |
| `/api/users`                | `POST`       | Create user profile            |
| `/api/users/me`             | `GET`        | Get current user profile       |
| `/api/skills`               | `GET`/`POST` | Skill feed / Create skill post |
| `/api/connections`          | `GET`/`POST` | Manage connections             |
| `/api/chats/:connection_id` | `GET`/`POST` | Chat messages                  |
| `/api/sessions`             | `GET`/`POST` | Session scheduling             |

---

## 🎨 UI Components

* **Navbar** → Navigation with user menu
* **BackButton** → Seamless navigation
* **SkillCard** → Display skill posts
* **ChatBox** → Real-time messaging UI
* **ScheduleModal** → Schedule learning sessions

---

## 🔒 Security Features

* **RLS Policies** with Supabase
* **Clerk Auth** for secure login/signup
* **Zod Validation** for API input
* **Storage Rules** for file uploads

---

## 🚀 Deployment

**Vercel (Recommended):**

1. Push code to GitHub
2. Connect to Vercel & add environment variables
3. Deploy automatically on main branch push

---

## 🧪 Testing

```bash
pnpm test        # Unit tests
pnpm test:e2e    # End-to-end tests
pnpm test:ui     # UI tests
```

---

## 📱 Features in Detail

* **Onboarding:** Roll no. validation, skills selection, profile upload
* **Skill Feed:** Search, filter, infinite scroll, Redis caching
* **Connections:** Requests, approvals, status checks
* **Chat:** Real-time, cached messages, online presence
* **Sessions:** Date, time, and location-based learning sessions

---

## 🎯 Roadmap

* [ ] Push Notifications
* [ ] Video Call Integration
* [ ] Skill Rating System
* [ ] Advanced Search Filters
* [ ] Mobile App Version
* [ ] Analytics Dashboard

---

## 📄 License

This project is licensed under the **MIT License**.
