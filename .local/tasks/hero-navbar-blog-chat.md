# Hero Cleanup, Navbar Fix, Blog & AI Chat Pages

## What & Why
Four targeted changes requested by the user:
1. Remove the amber/yellow badge in the hero section ("Amajuba District · KwaZulu-Natal · South Africa")
2. Fix the navbar brand text — change "Economic Chamber" subtitle to "Economic Chamber of Commerce"
3. Add a beautifully designed Blog page with one in-depth post about the chamber
4. Add an AI Chat page (route: /chat) using the @google/genai package (Gemini) already installed

## Done looks like
- Hero section has no yellow/amber badge — the headline and subtitle speak for themselves
- Navbar shows "AMAJUBA" on line 1, "Economic Chamber of Commerce" on line 2
- /blog route renders a Blog page with a featured article header and one full in-depth post card about the Amajuba Economic Chamber (history, mission, sectors, community programmes)
- Blog page link is added to the navbar and footer
- /chat route renders a styled Chat page titled "Chat with the Chamber" using Gemini AI (gemini-2.0-flash model); the AI assistant is pre-prompted to answer questions about the Amajuba Economic Chamber
- GEMINI_API_KEY is requested from the user if not present; the chat page shows a graceful message if no key is configured
- "Chat" link added to the navbar and footer

## Out of scope
- Multiple blog posts (one is enough for now)
- User accounts, saving chat history
- Changing the About, Contact, or Registration pages

## Steps
1. **Hero badge removal** — Delete the `<motion.span>` badge element in Home.tsx hero section
2. **Navbar text fix** — Change the subtitle span in Navbar.tsx from "Economic Chamber" to "Economic Chamber of Commerce"; adjust font size if needed to fit
3. **Blog page** — Create `src/pages/Blog.tsx` with a magazine-style layout: a hero banner for the blog, then one featured full post about the chamber covering its founding purpose, three economic sectors, community empowerment programmes, LED partnerships, and the path forward. Register route in App.tsx and add link to Navbar + Footer
4. **Chat page** — Create `src/pages/Chat.tsx` using `@google/genai`. The page should have a clean chat UI (message bubbles, input bar, send button). Call the Gemini API via a system prompt that primes it as the "Amajuba Economic Chamber Virtual Assistant". Use `import.meta.env.VITE_GEMINI_API_KEY` for the key. Request the secret from the user. Register route in App.tsx and add link to Navbar + Footer

## Relevant files
- `src/pages/Home.tsx`
- `src/components/Navbar.tsx`
- `src/components/Footer.tsx`
- `src/App.tsx`
