---

name: design-foundations
description: A baseline of good interface design to follow whenever creating, exploring or changing anything visible, including quick explorations and mockups: a clear point of view, hierarchy, typography, layout, consistency, states, feedback and accessibility.

---

# Design foundations

## My own rules

- Type does the heavy lifting
- One bold move per screen

## Have a point of view

- Start from the subject's own world (its places, materials, people and language), not from a generic app template.
- Every choice has a reason you can name: why this font, why this color, why this layout.
- Spend boldness in one place per screen and keep everything around it quiet.
- If the same prompt for a different app would give the same design, it's not specific enough. Change it.
- Use real content, never placeholder text.

## Hierarchy

- Every screen has one most important thing. Make it the biggest or boldest; everything else steps back.
- One main action per screen. Other actions look quieter.

## Typography

- Body text at least 16px with comfortable line spacing (about 1.5).
- Lines of reading text stay around 45–75 characters long.
- At most two font families and three weights.
- Use a small, fixed set of text sizes. Headings clearly bigger than body text.

## Layout

- Align things to a few shared edges. Avoid things that almost line up.
- Use a fixed set of spacing values, not random ones.
- Design for a phone first, then make sure it works on a laptop.

## Consistency

- The same kind of thing always looks and behaves the same way.
- Reuse existing components and colors before inventing new ones.

## States and feedback

- Buttons and inputs have hover, pressed, focused and disabled looks.
- Every action shows a result (a change, a message, a count).
- Plan for empty screens, loading, errors and very long content.

## Accessibility

- Text is easy to read against its background (WCAG AA contrast).
- Keyboard focus is always clearly visible.
- Tap targets are at least 44px on phones.
- Never use color alone to show meaning.
- Images and icon-only buttons have a text description for screen readers.

## Motion

- Animate only to give feedback or show where something came from. Keep it quick (under 300ms).
- Respect people who turn off animation in their system settings.
