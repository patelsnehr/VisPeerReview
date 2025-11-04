# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the Visual Peer Review (VPR) 2025 website - a static HTML/CSS/JavaScript application for collaborative visualization critique and peer feedback. It's part of an NSF-funded research project (Grant #2216227) exploring peer review dynamics in visualization education.

## Running the Application

**Local Development Server (Recommended):**
```bash
# Option 1: Python
python -m http.server

# Option 2: VS Code Live Server extension
# Right-click index.html → "Open with Live Server"
```

**Why a server is needed:** The application uses localStorage for data persistence and may have CORS restrictions when opening HTML files directly.

## Architecture

### Core Pages and Flow
- **index.html** - Landing page with About section, FAQ, and NSF funding information
- **demo.html** - Main interactive demo for visualization review with secondary navigation toggle between Demo and Analytics views
- **join.html** - Participation form for research project
- **Journals.html** - Published research papers
- **conferences.html** - Conference presentations
- **teams.html** - Research team members
- **contact.html** - Contact form

### JavaScript Architecture

**script.js** (main application logic):
- Handles demo page review functionality with 3-criterion rubric (Lie Factor, Data-Ink Ratio, Chart Junk)
- Implements behavioral "nudge" system that provides real-time feedback based on form completion
- Manages progress tracking with visual checkboxes (☐/☑) in sidebar
- Handles image upload via drag-drop, file upload, or URL
- Stores review data in localStorage under key `vpr_reviews_v3`
- Info tooltip system for demo instructions
- FAQ accordion functionality with ARIA support
- Secondary navigation toggle between Demo and Analytics views
- Triggers analytics refresh when reviews are saved or cleared

**analytics.js** (embedded analytics dashboard):
- Uses Chart.js (v4.4.0) loaded via CDN in demo.html
- Reads from `vpr_reviews_v3` localStorage key
- Generates real-time statistics: total reviews, average/min/max scores
- Creates 4 chart types:
  - Score distribution (bar chart)
  - Criteria averages (bar chart)
  - Criteria radar analysis (radar chart with normalized 0-5 scale)
  - Trends over time (line chart)
- Export functionality: CSV and JSON formats
- Works both as standalone page and embedded in demo.html
- Exposes global `refreshAnalytics()` function for real-time updates
- Properly destroys and recreates charts to prevent memory leaks

### Data Storage (localStorage)

All data is client-side only:
- `vpr_reviews_v3` - Array of review objects with lieFactor, dataInk, chartJunk ratings and comments
- `vpr_join_requests` - Array of participation form submissions
- No backend server or API calls

### File Structure Requirements

**CRITICAL:** All HTML files must be in root directory. All images must be in `assets/` folder.
- HTML files use `assets/` prefix for all image paths (e.g., `src="assets/logo.png"`)
- Navigation is consistent across all pages with teams.html (not team.html)
- DO NOT restructure files or move images out of assets folder

### Styling System

**style.css** uses CSS custom properties for theming:
- Gradient backgrounds with animated orbs (.orb-wrap)
- Glass morphism effects on cards
- Consistent spacing and border radius (14px for cards)
- Responsive breakpoints at 968px and 768px
- Feature cards use grid layout with `repeat(auto-fit, minmax(280px, 1fr))`
- Analytics stat cards have hover animations (translateY transform)

## Behavioral Nudge System

The nudge system in script.js provides real-time guidance based on rubric completion:

**Individual nudges** (per criterion):
- 💡 Empty state - "Select a rating and add comments"
- ✏️ Rating only - "Great! Now add detailed comments"
- ⚠️ Comment only - "Don't forget to select a rating!"
- 📝 Short comment (<120 chars) - "Consider adding more details"
- ✅ Complete - "Nicely done!"

**Progress tracking:**
- Updates checkboxes in sidebar (☐ → ☑)
- Progress bar percentage
- Dynamic hint text

## Chart.js Integration

Analytics uses Chart.js 4.4.0 from CDN. Charts are initialized in analytics.js:
- Score Distribution: Bar chart of total scores across reviews
- Criteria Averages: Bar chart comparing Lie Factor, Data-Ink, Chart Junk averages
- Trends Over Time: Line chart showing score progression

Charts auto-regenerate when new reviews are saved.

## Important Notes

**Character Encoding:** Files must use UTF-8. Emojis are used throughout (navigation, nudges, analytics).

**Accessibility:** Pages use semantic HTML, ARIA labels, skip links, and keyboard navigation support.

**Image Assets Required:**
- logo.png - Site logo (used in all page headers)
- github-mark.png - GitHub icon (footer)
- NSF_Official_logo.png - NSF logo (index page)
- laptop-demo.png - Demo interface screenshot (index About section)
- progress-made.png - Progress comparison (demo tooltip)
- AF.png, KH.png, LD.png, MDR.png, PR.png, SRP.jpeg - Team photos

**Navigation Consistency:** All pages must have identical navigation structure with same order: Home | Demo | Journals | Conferences | Our Team | Contact | Join Us
