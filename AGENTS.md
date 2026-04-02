# AGENTS.md - Developer Guidelines for VisitScotland Frontend

## Overview

Nuxt 3 + Vue 3 app with Bloomreach Headless CMS and VisitScotland Component Library.

## Build Commands

```bash
yarn                    # Install dependencies
yarn dev                # Development server
yarn build              # Production build
node .output/server/index.mjs  # Run production locally
yarn lint               # Lint code
yarn lint:fix           # Fix lint issues
```

## Project Structure

```
components/        # Vue components (Base/, Modules/, PageTypes/, Utils/)
composables/       # Vue composables (auto-imported)
stores/            # Pinia stores (auto-imported)
server/api/        # Nuxt server API routes
plugins/           # Nuxt plugins
utils/             # Utility functions
types/             # TypeScript types
```

## Code Style Guidelines

### Formatting
- **Indentation:** 4 spaces | **Quotes:** Single only | **Semicolons:** Always | **Line endings:** LF

### Vue Component Structure
```vue
<template><!-- Component markup --></template>
<script setup lang="ts"></script>
<style scoped></style>
```

### Imports Organization
```typescript
// 1. External libraries
import type { Page } from '@bloomreach/spa-sdk';
import { inject, onMounted, ref } from 'vue';
import { VsContainer, VsHeading } from '@visitscotland/component-library/components';

// 2. Nuxt auto-imports (no import needed)

// 3. Composables and stores
import useConfigStore from '~/stores/configStore.ts';
import dataLayerComposable from '~/composables/dataLayer.ts';

// 4. Local components
import VsBrDivider from './VsBrDivider.vue';
```
**Rules:** Use extensions for local (`~/stores/configStore.ts`), none for node_modules, Vue files need `.vue`.

### Naming Conventions
| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase, prefix `VsBr` | `VsBrSearch.vue` |
| Composables | camelCase | `dataLayer.ts` |
| Stores | camelCase | `searchStore.ts` |
| Types/Interfaces | PascalCase | `SearchApiResult` |
| Constants | SCREAMING_SNAKE_CASE | `API_BASE_URL` |
| Props | camelCase | `modules`, `categoryKey` |

### TypeScript
- Explicit types for props/function parameters
- Use `any` sparingly - prefer explicit types
- Define types in `types/types.ts`

```typescript
type Props = { modules: any[]; };
const { modules } = defineProps<Props>();
const searchTerm = ref<string>();
const isLoading = ref(false);
```

### Vue/Composition API
- Use `<script setup lang="ts">`
- Use `ref()` for primitives, `reactive()` for objects
- Pinia stores with composition API:

```typescript
import { defineStore } from 'pinia';
import { ref } from 'vue';

const useSearchStore = defineStore('search', () => {
    const isLoading = ref(false);
    const searchResults = ref<SearchApiResult[]>([]);

    async function getSearchResults() { /* implementation */ }

    return { isLoading, searchResults, getSearchResults };
});

export default useSearchStore;
```

### Error Handling
- Use try/catch for async operations
- Return consistent error objects:

```typescript
try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Error: ${response.status}`);
    const results = await response.json();
    return { results, totalResults: results.TotalDocument, error: null };
} catch (error: any) {
    console.error('API error', error);
    return { results: [], totalResults: 0, error: { message: 'API error.', status: error?.status || 500 } };
}
```
- Use `console.error()` for logging
- Handle API errors in stores with boolean flags

### Templates
- Self-closing tags for void elements: `<VsBrDivider />`
- Use kebab-case attributes: `:search-term`, `v-if`, `@click`
- Props on own lines, use `v-for` with `:key`

### CSS/SCSS
- Use scoped styles: `<style scoped>`
- Follow BEM-like naming from component library

### ESLint Rules
`vue/component-name-in-template-casing`: PascalCase | `vue/order-in-components`: enforced | `vue/script-indent`/`vue/html-indent`: 4 spaces | `quotes`: single | `semi`: always | `object-curly-newline`: multiline 3+ | `comma-dangle`: always-multiline | `arrow-parens`: always | `no-plusplus`: except for loop afterthoughts | `space-before-function-paren`: never

## Nuxt-Specific Notes

### Auto-Imports
`$fetch`, `useRoute`, `useRouter`, `navigateTo`, `defineNuxtConfig`, `useConfigStore`, all composables in ~/composables

### Runtime Config
```typescript
const config = useRuntimeConfig();
const brEndpoint = config.public.BR_CMS_ORIGIN_LOCATION;
```

### Bloomreach Integration
- Page injected via `inject('page')`
- Use `@bloomreach/spa-sdk` types
- Components receive CMS data via props

## Environment Variables
```
BR_RESOURCE_API_ENDPOINT=http://businessevents.local:8080/site/resourceapi
BR_CMS_ORIGIN_LOCATION=*
BR_NUXT_APP_DEBUG=false
```

## Commit Messages
```bash
yarn commit  # Uses Conventional Commits (feat, fix, docs, style, refactor, test, chore)
```

## Dependencies
- `nuxt` ~3.16.0 | `@bloomreach/vue3-sdk` | `@visitscotland/component-library` | `pinia` + `@pinia/nuxt` | `axios` | `sass` | `typescript`
