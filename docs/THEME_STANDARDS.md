# Theme Development Standards

To ensure a consistent and premium user experience across all memorial templates, the following standards must be applied to every new and existing layout.

## 1. Global Navigation & Actions
### Floating Action Menu (FAB)
- **Position**: Must be locked to the **top-right** corner, just below the main header on all themes.
    - **Desktop**: `fixed top-24 right-6 z-40`
    - **Mobile**: `fixed top-20 right-4 z-50`
- **Behavior**:
    - **Desktop**: Icons appear vertically stacked.
    - **Mobile**: Collapsed into a 'More' (kebab/hamburger) menu that expands downwards.
- **Standard Actions (Top to Bottom)**:
    1.  **Menu Toggle** (Mobile only): `menu` (hamburger) or `more_vert` (kebab).
    2.  **Edit Mode** (Owner only): `edit` icon.
    3.  **Share**: `share` icon.
    4.  **Support/Donate**: `volunteer_activism` icon (if enabled).
- **Consistency**: This component (`FloatingActionMenu`) is globally rendered by `MemorialPage.tsx` and should **not** be duplicated inside individual layout files.

### Tabs & Navigation
- **Standard Tabs**: Story, Gallery, Tributes, Events (conditional).
- **Conditional Tabs**:
    - **Support/Donations**: Must appear if `donationInfo.isEnabled` is true.
        - **Content**: Should contain the Payment Form (clean setup) and Donor Wall.
    - **Events**: Hide if no events are scheduled.
    - **Scrollable Tabs (Mobile)**:
        - **Container**: Must use `flex`, `overflow-x-auto`, and hide scrollbars (`no-scrollbar` utility).
        - **Interaction**: Allow smooth horizontal scrolling.
        - **Visual**: Ensure active tab is clearly distinct (border-bottom or pill shape).
        - **Touch Targets**: Minimum 44px height for easy tapping.

## 2. Layout Structure
- **Responsiveness**: All layouts must be fully responsive (Mobile -> Tablet -> Desktop).
    - Use standard breakpoints (`md: 768px`, `lg: 1024px`).
- **Container Widths**:
    - Main content: `max-w-7xl` or `max-w-screen-xl`.
    - Main content: `max-w-7xl` or `max-w-screen-xl`.
    - Text blocks (stories): `max-w-2xl` or `max-w-3xl` (60-75 characters per line).

## 3. Mobile Specifics
- **Layout Stacking**:
    - **Grid**: Force `grid-cols-1` on mobile, expanding to `md:grid-cols-2+` on tablet/desktop.
    - **Sidebar**: On mobile, sidebars must move to the **bottom** of the content or become a drawer/modal. Never keep sidebars on the side on screens smaller than `lg`.
- **Typography Scaling**:
    - `H1`: Scale down to `text-3xl` or `text-4xl` (vs `5xl+` on desktop).
    - Body text: Maintain readable `text-base` (16px) minimum.
- **Spacing**:
    - Reduce container padding: `p-4` or `p-5` (vs `p-8` or `p-12` on desktop).
    - Preserve whitespace between sections to avoid clutter (`gap-8` minimum).
- **Galleries**:
    - Use `grid-cols-2` or `grid-cols-3` even on mobile (avoid single column images unless full-width hero).

## 4. Typography & Aesthetics
### Font Standards by Theme Style
Select a pairing that matches the emotional tone of the theme:

- **Modern / Minimal**
    - **Headers**: `Montserrat` or `Outfit` (Clean, Geometric).
    - **Body**: `Inter` or `DM Sans` (Highly readable).
- **Traditional / Classic**
    - **Headers**: `Merriweather` or `Lora` (Trustworthy Serif).
    - **Body**: `Open Sans` or `Source Sans Pro` (Neutral Sans).
- **Serenity / Nature**
    - **Headers**: `Playfair Display` (Elegant, Editorial).
    - **Body**: `Lato` or `Nunito` (Organic, Humanist).
- **Timeless / High-End**
    - **Headers**: `Cinzel` or `Cormorant Garamond` (Sophisticated).
    - **Body**: `Raleway` or `Montserrat` (Refined).

### Hierarchy
- `H1`: Memorial Name (3xl-5xl).
- `H2`: Section Headers.
- `Small Caps`: Meta-labels (e.g., "BORN") using `uppercase tracking-widest text-xs font-bold`.

## 4. Visual Elements
### Images
- **Styling**: Always use `object-cover` to prevent distortion.
- **Missing Images**: **Hide** the element completely if the image is missing. Do not show placeholders or broken image icons unless explicitly designed as a fallback pattern.

### Galleries
- **Formats**: Must support and categorize all media types:
    - **Photos**
    - **Videos** (Embedded or uploaded)
    - **Audio** (Voice notes, music)
    - **Links/PDFs** (External memories, documents)
- **Layout**: Grid-based (`grid-cols-2 md:grid-cols-3`).

## 5. Required Sections & Content Order (Story Tab)
All themes must follow this strict vertical order on the "Story" tab to ensure a consistent narrative flow:

1.  **Hero Section**:
    *   Primary AI Snippet (`memorial.aiHighlights[0]`)
    *   Profile Image
    *   Vital Statistics (Born/Passed dates, Location)
2.  **The Story**:
    *   Full Biography (`memorial.biography`)
3.  **Secondary AI Snippet**:
    *   `memorial.aiHighlights[1]` (if available) as a pull quote or highlighted block.
4.  **Gallery Preview**:
    *   A grid or collage of recent photos (3-6 items).
    *   Must link to the full "Gallery" tab.
5.  **Tributes List**:
    *   A list of recent tributes.
6.  **Donation Module / Icon**:
    *   The "Legacy Fund" call-to-action or module.
    *   Must be the final element on the page (or sticky/prominent near the bottom).

## 6. Interactions
- **Hover Effects**: `hover:opacity-90`, `hover:-translate-y-1`.
- **Transitions**: `transition-all duration-300`.
- **Feedback**: Clear success/error states on all forms.
