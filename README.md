<div align="center">

<img src="apps/web/public/bitwork.svg" width="80" height="80" alt="Bitwork Logo">

![Bitwork](https://capsule-render.vercel.app/api?type=waving&color=7aa2f7&height=200&section=header&text=bitwork&fontSize=80&fontAlignY=35&desc=A%20modern%20job%20board%20platform%20built%20with%20Next.js&descAlignY=55&descSize=20&fontColor=24283b)

<p>
  <a href="https://github.com/codex-mohan/bitwork/stargazers">
    <img src="https://img.shields.io/github/stars/codex-mohan/bitwork?color=f7768e&label=STARS&style=for-the-badge&labelColor=24283b&logo=github&logoColor=f7768e" alt="Stars">
  </a>
  <a href="https://github.com/codex-mohan/bitwork/network/members">
    <img src="https://img.shields.io/github/forks/codex-mohan/bitwork?color=9ece6a&label=FORKS&style=for-the-badge&labelColor=24283b&logo=github&logoColor=9ece6a" alt="Forks">
  </a>
  <a href="https://github.com/codex-mohan/bitwork/issues">
    <img src="https://img.shields.io/github/issues/codex-mohan/bitwork?color=e0af68&label=ISSUES&style=for-the-badge&labelColor=24283b&logo=github&logoColor=e0af68" alt="Issues">
  </a>
</p>

<p>
  <img src="https://img.shields.io/badge/NEXT.JS-16.1-7aa2f7?style=for-the-badge&logo=next.js&logoColor=white&labelColor=24283b" alt="Next.js">
  <img src="https://img.shields.io/badge/REACT-19-61DAFB?style=for-the-badge&logo=react&logoColor=white&labelColor=24283b" alt="React">
  <img src="https://img.shields.io/badge/TYPESCRIPT-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white&labelColor=24283b" alt="TypeScript">
  <img src="https://img.shields.io/badge/TAILWIND-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white&labelColor=24283b" alt="Tailwind CSS">
  <img src="https://img.shields.io/badge/BUN-1.3-f472b6?style=for-the-badge&logo=bun&logoColor=white&labelColor=24283b" alt="Bun">
</p>

<p>
  <img src="https://img.shields.io/badge/DRIZZLE-ORM-C5F015?style=for-the-badge&logo=drizzle&logoColor=white&labelColor=24283b" alt="Drizzle ORM">
  <img src="https://img.shields.io/badge/TURBOREPO-2.9-7B68EE?style=for-the-badge&logo=turborepo&logoColor=white&labelColor=24283b" alt="Turborepo">
  <img src="https://img.shields.io/badge/BIOME-2.3-60A5FA?style=for-the-badge&logo=biome&logoColor=white&labelColor=24283b" alt="Biome">
</p>

</div>

---

## 🚀 About The Project

A significant portion of India's economic activity operates outside formal employment systems. Plumbers, electricians, domestic helpers, tutors, mechanics, small vendors, and students offering part-time services often lack access to structured marketplaces, physical shops, or stable employment contracts. Meanwhile, households, small businesses, and communities frequently need short-duration, task-specific work—not full-time hiring or long-term contracts.

Existing solutions focus on either full employment or gig marketplaces, which introduce high entry barriers, platform dependence, commissions, and rigid role definitions. There is a lack of systems that enable small, composable units of work to be exchanged flexibly, transparently, and locally.

### 🎯 The Problem

- **Informal workers** lack visibility, digital presence, and proof of work without owning a shop or business
- **Small businesses and households** often need short, specific tasks, not long-term hiring
- **Students and learners** have limited opportunities to apply skills in real-world settings before formal employment
- **Existing platforms** prioritize ratings, commissions, and long contracts, which discourage small-scale participation
- **Trust in informal work** is built through word-of-mouth and is not portable across locations

### 💚 Social Responsibility & Ethics

- Encourages fair access to work opportunities
- Avoids exploitative gig dynamics
- Supports inclusion of informal and unregistered workers
- Promotes dignity of labor through contribution-based recognition

---

## ✨ Features

### For Service Seekers
- 🔍 **Find Local Talent**: Discover skilled workers in your area
- 📝 **Post Tasks**: Create specific, short-duration job listings
- 📊 **Track Applications**: Monitor and manage incoming applications
- 🔔 **Real-time Updates**: Stay informed on job progress

### For Skill Providers
- 💼 **Build Your Profile**: Create a digital presence and showcase your work
- 🎯 **Find Opportunities**: Access local, flexible work opportunities
- 📈 **Track Your Progress**: Build a portable reputation across locations
- 🏆 **Gain Recognition**: Earn credibility through completed tasks

---

## 🛠️ Tech Stack

| Category | Technologies |
|----------|-------------|
| **Framework** | Next.js 16, React 19 |
| **Language** | TypeScript 5.9 |
| **Styling** | Tailwind CSS v4 |
| **Database** | Drizzle ORM |
| **Runtime** | Bun |
| **Monorepo** | Turborepo |

---

## 🚀 Getting Started

### Prerequisites

- [Bun](https://bun.sh/) 1.3.9 or later
- Node.js 20+ (for some tooling compatibility)

### Installation

```bash
# Clone the repository
git clone https://github.com/codex-mohan/bitwork.git
cd bitwork

# Install dependencies
bun install

# Set up environment variables
bun run env

# Set up the database
bun run db:gen
bun run db:push

# Start the development server
bun run dev
```

The application will be available at `http://localhost:3000`

---

## 📜 Available Scripts

```bash
bun run dev          # Start development server
bun run build        # Build for production
bun run check-types  # Type checking
bun run check        # Lint & format code
bun run db:gen       # Generate database migrations
bun run db:push      # Push schema changes to database
```

---

## 📚 Documentation

For detailed technical documentation, see [TECHNICAL.md](docs/TECHNICAL.md) which covers:

- Architecture overview
- Complete technology stack details
- UI component library reference
- Project structure details
- Development workflow
- Workspace dependencies

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Please make sure to run `bun run check` before committing and follow the existing code style.

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

<p>
  <img src="https://img.shields.io/badge/MADE%20WITH-♡-f7768e?style=for-the-badge&labelColor=24283b" alt="Made with love">
</p>

<p>If you found this project helpful, please consider giving it a ⭐</p>

</div>
