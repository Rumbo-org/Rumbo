---
name: Rumbo Design System
colors:
  surface: '#f9f9fc'
  surface-dim: '#dadadc'
  surface-bright: '#f9f9fc'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f6'
  surface-container: '#eeeef0'
  surface-container-high: '#e8e8ea'
  surface-container-highest: '#e2e2e5'
  on-surface: '#1a1c1e'
  on-surface-variant: '#4d4356'
  inverse-surface: '#2f3133'
  inverse-on-surface: '#f0f0f3'
  outline: '#7e7388'
  outline-variant: '#cfc2d9'
  surface-tint: '#8600ef'
  primary: '#6e00c7'
  on-primary: '#ffffff'
  primary-container: '#8f00ff'
  on-primary-container: '#efddff'
  inverse-primary: '#dab9ff'
  secondary: '#bc0100'
  on-secondary: '#ffffff'
  secondary-container: '#eb0000'
  on-secondary-container: '#fffbff'
  tertiary: '#00584b'
  on-tertiary: '#ffffff'
  tertiary-container: '#007363'
  on-tertiary-container: '#69fbdf'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#efdbff'
  primary-fixed-dim: '#dab9ff'
  on-primary-fixed: '#2b0053'
  on-primary-fixed-variant: '#6500b8'
  secondary-fixed: '#ffdad4'
  secondary-fixed-dim: '#ffb4a8'
  on-secondary-fixed: '#410000'
  on-secondary-fixed-variant: '#930100'
  tertiary-fixed: '#68fadd'
  tertiary-fixed-dim: '#44ddc1'
  on-tertiary-fixed: '#00201a'
  on-tertiary-fixed-variant: '#005145'
  background: '#f9f9fc'
  on-background: '#1a1c1e'
  surface-variant: '#e2e2e5'
typography:
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 26px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-lg:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.05em
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
  eta-display:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '800'
    lineHeight: 32px
    letterSpacing: -0.03em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  container-margin-mobile: 16px
  container-margin-desktop: 40px
  gutter: 16px
  tap-target-min: 44px
  bottom-sheet-peak: 240px
---

## Brand & Style

The design system is engineered for the fast-paced, high-stakes environment of urban mobility. It prioritizes **clarity, speed of cognition, and reliability**. The brand personality is that of a dependable civic partner—intelligent, efficient, and approachable.

To achieve this, the system employs a **Modern Corporate** aesthetic with a strong emphasis on **Functional Minimalism**. This means generous whitespace to reduce cognitive load during commutes, high-contrast elements for outdoor readability under varying light conditions, and a soft, rounded geometry that makes the technology feel friendly and accessible to a diverse public demographic.

The interface serves two distinct masters: the **Passenger**, who requires calm, organized information for journey planning; and the **Driver**, who requires high-glanceability and large tap targets for safe operation.

## Colors

The color palette is anchored by **Electric Violet** (#8f00ff), chosen for its association with modern digital efficiency and a tech-forward identity. **Command Red** (#ff0000) acts as the high-visibility signal for real-time updates and calls to action, while **Safety Teal** (#00BFA5) is used as a supportive tertiary for success states and verified actions.

**Functional Color Logic:**
- **On Time:** A deep, legible green used for positive progress and confirmed arrivals.
- **Delayed:** A high-contrast amber used to draw attention to deviations from the schedule without causing undue alarm.
- **Stale Data:** A neutral mid-gray used when GPS signals are lost, signaling that the information is no longer "live."
- **Safety Emergency:** A vibrant, high-chroma red (Command Red) reserved exclusively for the SOS/Safety features to ensure it is the most prominent element on any screen.

## Typography

The design system utilizes **Inter** exclusively to ensure maximum legibility across different pixel densities and lighting conditions. The type scale is strictly hierarchical, using weight rather than just size to denote importance.

For transit-critical information like "Minutes until arrival," the `eta-display` role provides a massive, high-weight numerical style that can be read at arm's length. Labels for stops and route numbers use `label-lg` with increased letter-spacing to ensure individual characters remain distinct even when rendered over complex map backgrounds.

## Layout & Spacing

The system follows an **8px linear scale**, ensuring all elements align to a predictable rhythm. 

**Layout Model:**
- **Mobile:** A fluid 4-column grid. Most critical information is housed in a "Bottom Sheet" model to keep primary actions within the "natural thumb zone" (bottom 1/3 of the screen).
- **Desktop:** A 12-column fixed grid (max-width 1280px), centered, with map elements expanding to fill the background.

**Spacing Principles:**
- Use `container-margin-mobile` for all screen edges.
- Interactive elements must maintain the `tap-target-min` to accommodate use while walking or in a moving vehicle.
- Vertical rhythm is prioritized to ensure lists (routes, stops) are easily scannable.

## Elevation & Depth

This design system uses **Tonal Layering** combined with **Ambient Shadows** to create a clear physical hierarchy. 

1.  **Floor (Level 0):** The Map. Desaturated and treated as the base canvas.
2.  **Surface (Level 1):** Static content cards and background containers. No shadow, simple border or subtle tonal shift.
3.  **Raised (Level 2):** Floating Action Buttons (FABs) and the primary Bottom Sheet. These use a medium-diffusion shadow (Y: 4, Blur: 12, Opacity: 0.08) to indicate they can be moved or tapped.
4.  **Overlay (Level 3):** Modals and the Safety Button. These use high-contrast shadows and often include a backdrop blur (12px) to focus the user's attention entirely on the urgent task.

Depth is used functionally: if an element is raised, it is interactive.

## Shapes

The shape language is **Rounded (0.5rem base)**. This soft geometry serves two purposes: it makes the application feel modern and approachable, and it visually distinguishes UI elements (like cards and buttons) from the sharp, linear lines typically found on geographical maps.

- **Standard Buttons & Inputs:** 8px (0.5rem) radius.
- **Cards & Bottom Sheets:** 16px (1rem) top radius to create a containerized feel.
- **Status Chips:** Full pill-shaped radius (999px) to differentiate them from interactive buttons.

## Components

### Buttons
- **Primary:** Electric Violet background, White text. Bold weight.
- **Secondary:** Outlined Violet or Command Red for high-urgency actions.
- **Safety Button:** Solid `safety-emergency` (Command Red) background. Fixed position, minimum 56x56px on mobile. Includes a white "Shield" or "SOS" icon.

### Status Indicators (Chips)
- Small, pill-shaped containers.
- Use `status-` colors for backgrounds with high-contrast text.
- Must include both a color and an icon (e.g., a clock for "On Time") to support accessibility for color-blind users.

### Cards
- White background with a 1px border (#E0E0E0).
- 16px internal padding.
- Used for Route Search results and Trip summaries.

### Input Fields
- 48px height minimum.
- Clear focus state using a 2px `primary-color` (Electric Violet) border.
- Floating labels to ensure context is never lost during data entry.

### Rating Scale
- 5-star horizontal layout.
- Active stars use `rating-active` gold.
- Tap targets for each star are expanded to 44x44px invisible boxes to ensure easy selection on mobile.

### Map Markers
- Route vehicles: Directional "Pill" showing the Route Number and a chevron for heading.
- Current User: Electric Violet dot with a subtle pulse animation for "Live" status.