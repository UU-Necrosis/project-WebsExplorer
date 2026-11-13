# Frontend Page Structure Guidance

When creating a new page in this project, follow this structure exactly.

## Required folder pattern

Each page belongs in its own folder under the relevant section, for example:

- frontend/src/pages/client/Guest pages/
- frontend/src/pages/client/User pages/
- frontend/src/pages/admin/
- frontend/src/pages/admin/security/

Inside each page folder:

- keep the page component as a `.tsx` file
- keep the styles in a sibling `css/` folder
- name the component file clearly, such as `GuestLoginPage.tsx`
- name the CSS file clearly, such as `GuestLoginPage.css`

## Example

```text
frontend/src/pages/client/Guest pages/
  GuestLoginPage.tsx
  css/
    GuestLoginPage.css
```

## Rules

1. Do not mix page JSX and CSS in the same file unless the page is a tiny one-off component.
2. Keep the page logic in the `.tsx` file and the styling in the `css/` file.
3. Import CSS with the local relative path:

```tsx
import './css/GuestLoginPage.css'
```

4. Use folder-level organization instead of placing page files directly in a broad directory.
5. Keep each page in its own dedicated folder when it has custom styles.
6. For reused UI blocks, prefer shared components, but page-specific screens should stay isolated.

## Style consistency

- Prefer clear class names using the page name as a prefix.
- Keep component structure readable and explicit.
- Match the existing naming convention already used in the project.

## When to apply this

Apply this rule whenever creating or editing:

- new page components
- new guest pages
- new user pages
- admin pages
- any route-level screen

This keeps the project organized, easier to maintain, and easier for agents to edit without breaking the layout file structure.
