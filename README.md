# School Council Election Website

A comprehensive voting application for school council elections built with Next.js 15, TypeScript, and Prisma.

## 🎯 Features

### 📄 Two-Page Structure

- **Home Page**: Comprehensive election information with candidate profiles, programs, and live statistics
- **Vote Page**: Dedicated voting interface with secure ballot casting

### 🗳️ Voting System

- **One Vote Per Person**: Each voter can only cast one vote using their name
- **Real-time Vote Counting**: Live statistics and vote tracking
- **Team-based Elections**: Support for multiple candidate teams
- **Secure Voting**: Backend validation prevents duplicate votes

### 🎨 Design & UI

- **Modern Design**: Beautiful blue and yellow color scheme as requested
- **Hero Background Image**: AI-generated school campus background
- **Responsive Layout**: Works perfectly on desktop, tablet, and mobile
- **Interactive Components**: Smooth animations and transitions
- **Accessibility**: WCAG compliant with proper ARIA labels

### 📊 Enhanced Features

- **AI-Generated Candidate Photos**: Professional headshots for all candidates
- **Detailed Candidate Profiles**: Complete information including programs and initiatives
- **Live Statistics**: Real-time voting results and team comparisons
- **Countdown Timer**: Dynamic countdown to election deadline
- **Team Statistics**: Vote counts by team with percentages

## 🌐 Pages

### Home Page (`/`)

- **Hero Section**: Eye-catching landing with school campus background image
- **Election Overview**: Information about candidates and voting process
- **Candidate Introductions**: Detailed profiles with photos and programs
- **Live Statistics**: Real-time voting results and team performance
- **Countdown Timer**: Time remaining until election ends
- **Call-to-Action**: Direct navigation to voting page

### Vote Page (`/vote`)

- **Secure Voting Form**: Name input and candidate selection
- **Live Results Panel**: Real-time vote counting and statistics
- **Security Notice**: Information about voting security and fairness
- **Success Confirmation**: Vote confirmation with details
- **Navigation**: Easy access back to home page

## 🏗️ Technology Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript 5
- **Database**: SQLite with Prisma ORM
- **Styling**: Tailwind CSS 4
- **UI Components**: shadcn/ui (New York style)
- **Icons**: Lucide React
- **Image Generation**: z-ai-web-dev-sdk for AI-generated candidate photos

## 📁 Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── candidates/         # Candidate management API
│   │   ├── votes/              # Voting API
│   │   ├── generate-image/     # AI image generation API
│   │   └── admin/              # Admin statistics API
│   ├── vote/
│   │   └── page.tsx           # Dedicated voting page
│   ├── page.tsx               # Home page with election info
│   ├── layout.tsx             # Root layout
│   └── globals.css            # Global styles
├── components/
│   └── ui/                    # shadcn/ui components
├── lib/
│   └── db.ts                  # Prisma database client
├── public/
│   └── uploads/               # Generated images
└── prisma/
    ├── schema.prisma          # Database schema
    └── seed.ts                # Database seed script
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Bun (recommended) or npm/yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd school-council-election
   ```

2. **Install dependencies**

   ```bash
   bun install
   ```

3. **Set up the database**

   ```bash
   bun run db:push
   bun run prisma/seed.ts
   ```

4. **Start the development server**

   ```bash
   bun run dev
   ```

5. **Open your browser**
   - Home Page : [http://localhost:3000](http://localhost:3000)
   - Vote Page : [http://localhost:3000/vote](http://localhost:3000/vote)
   - Live Result Page : [http://localhost:3000/live-results](http://localhost:3000/live-results)

### Migrate DB to Vercel Postgres

1. Set up a Vercel Postgres database and get the connection string (you can find a youtube video how to make it).
2. **Connect Vercel project**

   ```bash
   vercel link
   ```

3. **Pull the database URL from Vercel**

   ```bash
   vercel env pull .env.local
   ```

4. **Run the migration to Vercel Postgres**

   ```bash
   bunx prisma migrate dev --name=init
   bun db:push
   bun run prisma/seed.ts
   ```

5. **Open Prisma Studio to verify**

   ```bash
   bunx prisma studio
   ```

## 🔌 API Endpoints

### Teams

- `GET /api/teams` - Get all teams with vote counts
- `POST /api/teams` - Create a new team (admin)

### Votes

- `POST /api/votes` - Cast a vote for a team
- `GET /api/votes` - Get all votes with statistics

### Live Results

- `GET /api/live-results` - Get live voting results and statistics

### Image Generation

- `POST /api/generate-image` - Generate AI images for teams

### Admin

- `GET /api/admin/stats` - Get comprehensive election statistics

## 🗄️ Database Schema

### Team

```typescript
interface Team {
  id: string;
  name: string;
  description: string;
  vision: string;
  image?: string;
  leader: string;
  coLeader: string;
  votes: Vote[];
  createdAt: Date;
  updatedAt: Date;
}
```

### Vote

```typescript
interface Vote {
  id: string;
  voterName: string;
  teamId: string;
  team: Team;
  timestamp: Date;
}
```

## 🎭 Default Teams

The system comes with 2 pre-configured teams with AI-generated photos:

### Visionary Leaders Team

- **Leader**: Sarah Johnson (Grade 12 Student Council President)
- **Co-Leader**: Michael Chen (Grade 11 Student Representative)
- **Vision**: Creating an inclusive educational environment that fosters academic achievement, personal growth, and community engagement through innovative programs and student-centered initiatives
- **Key Initiatives**: Academic excellence programs, student welfare initiatives, inclusive community building, innovation in education

### Future Forward Team

- **Leader**: Emily Rodriguez (Grade 12 Environmental Club President)
- **Co-Leader**: James Wilson (Grade 11 Sports Captain)
- **Vision**: Building a sustainable future for our school through environmental stewardship, athletic excellence, and facility improvements that benefit all students
- **Key Initiatives**: Environmental sustainability, athletic facility improvements, campus modernization, health and wellness programs

## 🎨 Color Scheme

- **Primary Blue**: `blue-600` to `blue-800` gradients
- **Secondary Yellow**: `yellow-400` to `yellow-500` accents
- **Background**: Light blue gradients and white
- **Text**: Blue-900 for headings, gray-700 for body text

## 🔒 Security Features

- **Input Validation**: All user inputs are validated on both client and server
- **SQL Injection Prevention**: Prisma ORM provides protection against SQL injection
- **Vote Duplication Prevention**: Case-insensitive name checking prevents duplicate votes
- **Error Handling**: Comprehensive error handling with user-friendly messages

## 📱 Responsive Design

- **Mobile First**: Designed for mobile devices first
- **Breakpoints**:
  - Mobile: < 768px
  - Tablet: 768px - 1024px
  - Desktop: > 1024px
- **Touch Friendly**: Minimum 44px touch targets

## ⚡ Performance Optimizations

- **Code Splitting**: Automatic code splitting with Next.js
- **Image Optimization**: Next.js Image component for optimized images
- **Database Indexing**: Optimized database queries
- **Caching**: Efficient data fetching patterns

## 🛠️ Development Commands

```bash
# Development
bun run dev          # Start development server
bun run lint         # Run ESLint
bun run build        # Build for production

# Database
bun run db:push      # Push schema changes
bun run db:studio    # Open Prisma Studio
bun run prisma/seed.ts # Seed database
```

## 🎨 Customization

### Adding New Teams

1. Use the admin API: `POST /api/teams`
2. Or modify the seed script in `prisma/seed.ts`
3. Generate new photos using the image generation API at `POST /api/generate-image`

### Changing Colors

Update the Tailwind classes in the page files:

- Primary: Change `blue-*` classes
- Secondary: Change `yellow-*` classes

### Modifying Teams

Edit the team data in `prisma/seed.ts` to add new teams or modify existing ones.

### Custom Hero Image

Replace the hero background image by updating the image generation or providing your own image in the public folder.

## 🚀 Deployment

The application is ready for deployment on any platform that supports Next.js:

- **Vercel** (recommended)
- **Netlify**
- **AWS Amplify**
- \*\*DigitalOcean App Platform`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🆘 Support

For support and questions:

- Create an issue in the repository
- Contact the development team

---

Built with ❤️ for democratic school governance
