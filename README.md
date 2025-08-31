# ThaparSkills - Peer-to-Peer Skill Sharing Platform

A modern, professional peer-to-peer skill-sharing platform for Thapar University students. Users can sign up, create profiles, post skills, connect with other students, chat in real-time, and schedule learning sessions.

## 🚀 Features

- **Authentication**: Secure signup/signin via Clerk
- **User Profiles**: Complete profiles with roll number verification
- **Skill Posts**: Create and share skills with images
- **Connections**: Send, accept, and reject connection requests
- **Real-time Chat**: Chat with accepted connections using Redis caching
- **Session Scheduling**: Schedule learning sessions with connected users
- **Responsive Design**: Modern UI built with TailwindCSS and Thapar brand colors
- **Redis Caching**: Fast skill feed and recent chat message retrieval
- **Row Level Security**: Secure data access with Supabase RLS policies

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 + TypeScript + TailwindCSS
- **Authentication**: Clerk
- **Database**: Supabase (PostgreSQL)
- **Caching**: Redis
- **Storage**: Supabase Storage
- **Hosting**: Vercel (recommended)

## 📋 Prerequisites

- Node.js 18+ and npm/pnpm
- Supabase account and project
- Clerk account and application
- Redis instance (Redis Cloud, Upstash, or local)

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd thapar-skills
pnpm install
```

### 2. Environment Setup

Copy the environment file and fill in your values:

```bash
cp env.example .env.local
```

Required environment variables:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding

# Supabase Database
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Redis Cache
REDIS_HOST=your_redis_host
REDIS_PORT=your_redis_port
REDIS_PASSWORD=your_redis_password

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=ThaparSkills
```

### 3. Database Setup

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `supabase-schema.sql`
4. Execute the SQL to create tables, indexes, and RLS policies
5. Create a storage bucket named `user-uploads` with public access

### 4. Clerk Setup

1. Create a new Clerk application
2. Configure sign-in and sign-up URLs
3. Set redirect URLs to `/dashboard` and `/onboarding`
4. Copy your API keys to `.env.local`

### 5. Redis Setup

1. Create a Redis instance (Redis Cloud, Upstash, or local)
2. Note your connection details
3. Add them to `.env.local`

### 6. Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

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
└── README.md              # This file
```

## 🔌 API Endpoints

### Authentication Required (All endpoints except public routes)

#### Users
- `POST /api/users` - Create user profile
- `GET /api/users/me` - Get current user profile
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user profile

#### Skills
- `GET /api/skills` - Get skill feed (with caching)
- `POST /api/skills` - Create skill post
- `GET /api/skills/:id` - Get skill by ID
- `PUT /api/skills/:id` - Update skill
- `DELETE /api/skills/:id` - Delete skill

#### Connections
- `GET /api/connections` - Get user connections
- `POST /api/connections` - Create connection request
- `PUT /api/connections/:id` - Update connection status

#### Chats
- `GET /api/chats/:connection_id` - Get chat messages
- `POST /api/chats/:connection_id` - Send message
- `DELETE /api/chats/:connection_id/:msg_id` - Delete message

#### Sessions
- `GET /api/sessions` - Get sessions for connection
- `POST /api/sessions` - Schedule session

## 🎨 UI Components

- **Navbar**: Navigation with user menu
- **BackButton**: Consistent back navigation
- **LogoutButton**: Clerk sign-out
- **SkillCard**: Display skill posts
- **ConnectionItem**: Connection request management
- **ChatBox**: Real-time messaging
- **ScheduleModal**: Session scheduling

## 🔒 Security Features

- **Row Level Security (RLS)**: Database-level access control
- **Clerk Authentication**: Secure user authentication
- **API Route Protection**: Middleware-based route protection
- **Input Validation**: Zod schema validation
- **File Upload Security**: Type and size validation

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically on push to main branch

### Environment Variables for Production

```env
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding
```

## 🧪 Testing

```bash
# Unit tests
pnpm test

# E2E tests
pnpm test:e2e

# Test UI
pnpm test:ui
```

## 📱 Features in Detail

### User Onboarding
- Roll number validation (Thapar format: YYYYCSXXXXX)
- Department auto-detection from roll number
- Skills selection with suggestions
- Profile picture upload

### Skill Feed
- Redis-cached skill posts
- Search and filter by department
- Infinite scroll pagination
- Image support with fallback

### Connections
- Send connection requests
- Accept/reject incoming requests
- View connection status
- Navigate to chat for accepted connections

### Real-time Chat
- Redis-cached recent messages
- Supabase persistence for full history
- Message threading by connection
- Online presence indicators

### Session Scheduling
- Schedule learning sessions
- Date and time selection
- Location specification
- Session count tracking

## 🔧 Configuration

### TailwindCSS
Custom color palette matching Thapar brand:
- Primary: #0065BD (Thapar Blue)
- Secondary: #FFD100 (Thapar Yellow)
- Neutral: #FFFFFF, #F5F5F5, #333333

### Redis Caching Strategy
- **Skill Feed**: Last 200 skills cached
- **Chat Messages**: Last 50 messages per connection
- **Cache Expiry**: 24 hours for chat, persistent for feed

## 🐛 Troubleshooting

### Common Issues

1. **Redis Connection Failed**
   - Check Redis credentials in `.env.local`
   - Verify Redis instance is running

2. **Supabase RLS Errors**
   - Ensure SQL schema is executed correctly
   - Check RLS policies are enabled

3. **Clerk Authentication Issues**
   - Verify redirect URLs in Clerk dashboard
   - Check environment variables

4. **Image Upload Failures**
   - Verify Supabase storage bucket exists
   - Check storage policies

### Development Tips

- Use `console.log` for debugging (remove in production)
- Check browser console for client-side errors
- Monitor Supabase logs for database issues
- Use Redis CLI for cache debugging

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the troubleshooting section
- Review Supabase and Clerk documentation

## 🎯 Roadmap

- [ ] Push notifications
- [ ] Video call integration
- [ ] Skill rating system
- [ ] Advanced search filters
- [ ] Mobile app
- [ ] Analytics dashboard
- [ ] Integration with Thapar systems

---

Built with ❤️ for Thapar University students
#   T h a p a r S k i l l s  
 