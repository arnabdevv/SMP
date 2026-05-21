# Contributing to SMP

Thank you for your interest in contributing to SMP! 🎉

## Table of Contents
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Making Changes](#making-changes)
- [Pull Request Process](#pull-request-process)
- [Code Style](#code-style)
- [Reporting Bugs](#reporting-bugs)

---

## Getting Started

1. **Fork** this repository
2. **Clone** your fork: `git clone https://github.com/your-username/SMP.git`
3. Create a new branch: `git checkout -b feature/your-feature-name`

---

## Development Setup

### Backend
```bash
cd backend
cp .env.example .env     # Fill in your values
npm install
npm run dev              # Starts with nodemon on port 3000
```

### Frontend
```bash
cd frontend
cp .env.example .env     # Set VITE_API_URL=http://localhost:3000
npm install
npm run dev              # Starts Vite dev server on port 5173
```

> **Requirements:** Node.js ≥ 18, a MongoDB Atlas cluster (free tier works fine).

---

## Making Changes

- Keep commits focused — one logical change per commit
- Write clear commit messages: `fix: null crash on invalid batchId` or `feat: add fee payment status`
- Test your changes locally before opening a PR
- If you change a route or API contract, update `backend/ROUTES.md`

---

## Pull Request Process

1. Make sure the backend starts without errors (`npm start`)
2. Make sure the frontend builds without errors (`npm run build`)
3. Open a PR against the `main` branch with a clear description of what you changed and why
4. Link any related issues in the PR description

---

## Code Style

- **Backend:** CommonJS (`require`/`module.exports`), async/await, proper error handling in every controller
- **Frontend:** ES Modules, React functional components with hooks, Tailwind CSS
- Avoid committing `console.log` debug statements
- Never commit `.env` files — use `.env.example` to document variables

---

## Reporting Bugs

Please open a GitHub Issue with:
- Steps to reproduce
- Expected vs. actual behavior
- Screenshots if relevant (for UI bugs)
- Node.js / browser version

---

## Code of Conduct

This project follows the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md). By participating, you agree to uphold it.
