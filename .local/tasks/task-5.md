---
title: Registration wizard & hero redesign
---
# Registration Wizard & Hero Redesign

## What & Why
The registration form needs to be rebuilt as a proper multi-step wizard matching the JotForm reference screenshots. The current form is minimal and missing most sections. The hero section on the home page also needs a real background image and more visual impact.

## Done looks like
- Registration page is a 6-step wizard with a progress bar/step indicator at the top
- Each step maps exactly to the reference screenshots:
  - Step 1 — Applicant Information: First Name + Last Name (two columns), Date of Birth, Gender (Male/Female/Other radio), Email Address, Phone Number, Alternative Phone Number
  - Step 2 — Business Information (If Applicable): Business Name, Registration Number, Type of Business, Industry/Sector, Business Address, Number of Employees
  - Step 3 — Membership Category: radio selection among Individual Member, Small Business Member, Corporate Member, Youth/Student Member, Non-Profit Organization
  - Step 4 — Motivation for Joining: textarea "Please tell us why you want to join Amajuba Economic Chamber"
  - Step 5 — Required Supporting Documents: checkboxes (Copy of Valid ID or Passport, Business Registration Documents (if applicable), Proof of Residence, Company Profile (optional)) + file upload area
  - Step 6 — Declaration & Signature: declaration text, drawn/typed signature field, date, Submit Application button
- Each step has Back / Next buttons; step 6 has a Submit button
- On submission, a success screen is shown with the chamber contact details
- Hero section on Home page has a rich, full-height background image (South African city skyline or economic growth theme from Unsplash) with a dark overlay so text remains readable; the section is at least 700px tall and visually impactful

## Out of scope
- Actually storing or emailing form submissions (form stays client-side only)
- Authentication or login
- Changing any other pages

## Steps
1. **Rebuild Registration page as wizard** — Replace the existing Registration.tsx with a 6-step wizard component. Each step renders its own fields. Use a step indicator at the top showing step number, title, and completion state. Animate the transition between steps.
2. **Signature field on step 6** — Implement a simple canvas-based drawn signature (using an HTML canvas element with mouse/touch events) or a styled text-input fallback. No external library needed.
3. **Success screen** — After submission, show a branded confirmation screen with the chamber name, a checkmark icon, and a note to email amajubaeconomicchamber.office@gmail.com.
4. **Hero section background** — Replace the near-invisible Unsplash overlay with a proper full-opacity background image (a South African business/cityscape photo from Unsplash with a navy/dark gradient overlay). Text should be white on the hero. Add a stat strip or tagline beneath the hero for added depth.

## Relevant files
- `src/pages/Registration.tsx`
- `src/pages/Home.tsx`