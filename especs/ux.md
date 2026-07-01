Role and Objective
You are an Expert UX/UI Designer and Frontend Developer. Your objective is to design and prototype a highly responsive, modern, and immersive Single Page Application (SPA) dashboard using Tailwind CSS.
Project Context
This is the "Culling Games (Jogo do Abate) - Central Control Panel" from the Jujutsu Kaisen universe. The application serves as a military-grade, tactical monitoring system used to register sorcerers and track their life status and points in real-time.
Visual Identity & Design System
Theme: Strict Dark Mode. The interface must feel tactical, utilitarian, and slightly ominous, avoiding friendly or overly bright layouts.
Typography: Primary font should be Inter or Roboto Mono for a data-heavy, technical feel. Use uppercase with generous letter-spacing for section headers.
Color Palette (Tailwind Tokens):
Backgrounds: Deep, dark tones. Use bg-zinc-950 for the main canvas, bg-zinc-900 for panels/cards, and bg-zinc-800 for borders/dividers.
Text: text-zinc-300 for body text, text-zinc-100 for headings, text-zinc-500 for muted/helper text.
Accents (Cursed Energy): * Primary Action/Danger: Crimson Red (text-red-500, bg-red-600).
Domain/Mystic Elements: Deep Purple (text-purple-400, bg-purple-600).
Success/Active Status: Spectral Green (text-emerald-400, bg-emerald-500/20).
Layout & Structure (Desktop First, Mobile Responsive)
The layout uses a split-screen dashboard approach.
Left Panel (Fixed Sidebar - 30% width on Desktop): The Registration Zone.
A cohesive form panel to register new players.
Fields: "Sorcerer Name" (Text Input), "Starting Colony" (Dropdown/Select), and "Cursed Technique" (Text Area).
Action: A full-width, prominent submit button stylized with a red or purple accent (e.g., "ENTER THE CULLING GAME").
Right Panel (Main Content - 70% width on Desktop): The Monitoring Grid.
A top header showing total active players and total points distributed.
A CSS Grid (grid-cols-1 md:grid-cols-2 lg:grid-cols-3) displaying "Player Cards".
Component Specifications
1. Player Card (Micro-Component)
Each card must display the player's data with clear information hierarchy:
Header: Player Name (bold, white) and a status badge (e.g., a glowing green dot for "Alive", a red cross for "Deceased").
Body: * Colony Name (small, uppercase, zinc-400).
Current Points: Large, highly visible typography (e.g., text-4xl text-purple-400 font-mono).
Footer (Actions): Two distinct, small icon buttons to Add (+1) or Subtract (-1) points, representing the rules of point transfer in the games. Use subtle hover states (hover:bg-zinc-700).
2. Form Inputs (Micro-Component)
Inputs must have a dark background (bg-zinc-950), subtle borders (border-zinc-700), and focus states that glow with an accent color (focus:ring-purple-500). Remove default browser outlines.
Output Requirements (CRITICAL INSTRUCTION)
The output MUST be a SINGLE, PLAIN HTML FILE ONLY.
DO NOT output any frontend framework code or syntax (e.g., NO Angular @if or [property] bindings, NO React className or {state}, NO Vue v-if).
The code must consist EXCLUSIVELY of standard HTML5 tags and Tailwind CSS utility classes.
The generated HTML must be fully static and capable of being opened directly in a browser to view the UI.
Ensure the layout is responsive (stacking the form above the grid on mobile screens).
Include the Tailwind CSS CDN script tag in the <head> so the styles render immediately.