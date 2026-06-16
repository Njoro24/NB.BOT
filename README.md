# Nabo Capital Chatbot Widget

A floating chatbot widget for Nabo Capital Limited's Next.js website.

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment:**
   Update `.env.local` with your Anthropic API key:
   ```
   ANTHROPIC_API_KEY=your_actual_api_key_here
   ```

3. **Run development server:**
   ```bash
   npm run dev
   ```
   Visit `http://localhost:3000`

## Features

- Floating chat bubble in bottom-right corner
- Dark navy and cyan theme matching Nabo Capital branding
- Responsive design (mobile-optimized)
- Server-side system prompt injection (API key never exposed)
- Typing indicator while waiting for response
- Default greeting message on load
- Clean, outline-style SVG icons (no emoji)
- Scrollable message area with custom scrollbar
- Mobile responsive (full-width panel on screens < 480px)

## Architecture

- **Frontend:** Plain JavaScript widget (`public/nabo-companion.js`)
- **Backend:** Next.js API route (`app/api/chat/route.ts`)
- **AI Model:** Claude 3.5 Sonnet (Anthropic)

## Testing Checklist

- [ ] Bubble appears on all pages
- [ ] Click bubble opens the chat panel
- [ ] Messages send successfully
- [ ] Responses are received from the assistant
- [ ] Typing indicator shows while loading
- [ ] API key is not visible in browser console
- [ ] Close button (X) closes the panel
- [ ] Clicking outside panel closes it
- [ ] Mobile view responsive (< 480px width)
- [ ] No console errors
- [ ] No emoji in UI or code

## Constraints Met

- No Tailwind CSS (plain CSS-in-JS)
- No external CSS files
- No emoji
- TypeScript strict mode
- Self-contained widget script
- No external icon libraries
