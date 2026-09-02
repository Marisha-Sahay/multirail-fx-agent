# Contributing to Multirail FX Agent

First off, thank you for considering contributing to the Multirail FX Agent! It's people like you that make the open-source community such a great place to learn, inspire, and create.

## How Can I Contribute?

### Reporting Bugs
If you find a bug, please create an issue on GitHub with a descriptive title and a clear description of the problem. Include steps to reproduce the bug and your environment details.

### Suggesting Enhancements
Have an idea for a new payment rail integration (e.g., Stripe, Ripple, Lightning Network) or a UI improvement? We'd love to hear it! Open an issue and describe your idea in detail.

### Pull Requests
1. Fork the repository and create your branch from `main`.
2. If you've added code that should be tested, add tests.
3. If you've changed APIs, update the documentation.
4. Ensure the test suite passes (`npm run build` and `npm run lint`).
5. Issue a pull request!

## Development Setup

1. **Clone the repo:** `git clone https://github.com/Marisha-Sahay/multirail-fx-agent.git`
2. **Install dependencies:** `npm install`
3. **Set up env:** Copy `.env.example` to `.env` and add any necessary sandbox tokens (like Wise or Visa).
4. **Run local dev server:** `npm run dev` (Our custom Vite config will automatically mock the Vercel serverless `/api` routes).

## Code Style
- We use standard TypeScript/React conventions.
- Tailwind CSS is used for all styling. Please try to stick to the existing color palette defined in `tailwind.config.js` to maintain the premium dark mode aesthetic.
- Use `lucide-react` for any new icons.

Thank you for contributing!
