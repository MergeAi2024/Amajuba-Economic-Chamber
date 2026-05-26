---
title: Logo, vision & mission + app startup
---
# Logo, Vision & Mission Update + App Startup

## What & Why
The user has provided the official Amajuba Economic Chamber of Commerce logo and two organizational documents (Strategic Framework and Newcastle LED Proposal). The app currently loads a placeholder `logo.jpg` that may not match the provided image. The About page needs to properly reflect the chamber's vision, mission, and strategic pillars drawn from those documents. The app also needs a workflow configured so it starts and is visible in the preview pane.

## Done looks like
- The official chamber logo (the eagle/cityscape badge) appears correctly in the navbar and footer on all pages
- The About page has clearly labeled Vision and Mission sections, along with the Core Value Proposition, drawn directly from the provided documents
- The strategic framework (Primary / Secondary / Tertiary sectors and competency development) is accurately represented
- The app loads and is visible in the preview pane without errors

## Out of scope
- Redesigning the full site layout or color scheme
- Adding new pages beyond what already exists
- Changing contact details or registration number

## Steps
1. **Copy the logo** — Copy `attached_assets/Adobe_Express_-_file_1779688574270.jpg` into `public/logo.jpg`, replacing the existing file so all existing `src="/logo.jpg"` references immediately pick up the correct image.
2. **Verify logo display** — Confirm the Navbar and Footer both render the logo at a size that shows the badge clearly (the image is portrait/tall, so ensure `object-contain` or appropriate sizing is used rather than `object-cover` which can crop it).
3. **Enrich the About page** — Add dedicated "Our Vision" and "Our Mission" sections above the existing content, drawn from the documents:
   - **Vision**: To be the leading catalyst for sustainable economic development and inclusive prosperity in the Amajuba District.
   - **Mission**: To serve as a structured platform that facilitates growth, innovation, and community empowerment by implementing targeted sectoral interventions across Primary (Agriculture & Mining), Secondary (Manufacturing & Processing), and Tertiary (Services & Distribution) sectors — building integrated competence across knowledge, skills, and attitudes.
   - Retain and refine the existing Core Value Proposition quote and sector framework cards.
4. **Add Community Empowerment section** — Based on the LED proposal, add a brief "What We Do" / programmes section on the About page highlighting the chamber's capacity-building work: governance literacy, tendering & procurement training, and economic participation.
5. **Configure and start the workflow** — Set up a `Start application` workflow running the Vite dev server so the app is live in the preview pane.

## Relevant files
- `public/logo.jpg`
- `attached_assets/Adobe_Express_-_file_1779688574270.jpg`
- `src/components/Navbar.tsx`
- `src/components/Footer.tsx`
- `src/pages/About.tsx`