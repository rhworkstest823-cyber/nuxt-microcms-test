# SCSS Integration (Nuxt / Vue)

This project does not use Tailwind. Tokens are expressed as SCSS variables and, where runtime theming is needed, CSS variables.

## Where tokens live
- `app/assets/scss/foundation/_color.scss` → colors (`clr.$color-*`, auto-injected as `clr`)
- `app/assets/scss/foundation/_stacking.scss` → z-index (`zid`)
- `app/assets/scss/foundation/_easing.scss` → easing (`ease`)
- `app/assets/scss/global/_config.scss`, `_function.scss`, `_mixin.scss` → config, functions, mixins (e.g. `breakpoint-up()`), injected into every SFC via `vite.css.preprocessorOptions.scss.additionalData` in `nuxt.config.ts`

## Mapping the three layers
| Layer | Implementation |
|---|---|
| Primitive | SCSS variables in `foundation/_color.scss` (`$color-gray-100`, ...) |
| Semantic | SCSS variables that reference primitives (`$color-brand-primary`), or CSS variables on `:root` in `base.scss` when runtime switching is required |
| Component | Local values inside the SFC's `<style lang="scss" scoped>`, referencing semantic tokens |

## Rules
- Do not hardcode hex values in components; reference `clr.$...`.
- Class naming follows existing prefixes (`p-` page, etc.). Check neighboring components first.
- Use `@include breakpoint-up(md)` for responsive rules.
- Add new tokens to the existing foundation files rather than creating parallel files.
