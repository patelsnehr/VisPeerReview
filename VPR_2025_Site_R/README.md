
VPR 2025 Site — Final Package
=============================

Contents:
- index.html
- demo.html
- publication.html
- conferences.html
- teams.html
- contact.html
- join.html
- assets/ (logo.png, sample-visual.png)
- style.css
- script.js
- README.md

How to run locally:
1. Unzip the package.
2. Open index.html in a modern browser for a static preview.
3. For best local development experience, use a local server (VS Code Live Server extension or `python -m http.server`).
4. All data (reviews, contact messages, join submissions) are stored in browser localStorage.

LocalStorage keys used:
- vpr_reviews_final  -> saved reviews (array)
- vpr_progress_reviews -> integer count of completed reviews
- vpr_contact_messages -> saved contact messages (array)
- vpr_join_requests -> saved join submissions (array)

