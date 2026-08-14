import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { dropPrerenderedSeoWhenReplaced } from './lib/prerenderedSeo'

const rootElement = document.getElementById('root')!
const app = (
  <StrictMode>
    <App />
  </StrictMode>
)

if (rootElement.hasChildNodes()) {
  hydrateRoot(rootElement, app)
  // Retires the prerendered <head> tags as React replaces them, so each page
  // ends up with exactly one title, canonical and description instead of two.
  // See the module for why this waits rather than deleting them outright.
  dropPrerenderedSeoWhenReplaced()
} else {
  createRoot(rootElement).render(app)
}
