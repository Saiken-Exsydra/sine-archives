import { micromark } from "micromark";

const OVERVIEW_SELECTOR = "[data-cosmology-overview]";
const OVERVIEW_PATH = "/uploads/terra_cosmology_overview.md";
const FALLBACK_MESSAGE = "Cosmology overview could not be loaded.";

async function renderCosmologyOverview() {
  const overviewContainer = document.querySelector<HTMLElement>(OVERVIEW_SELECTOR);
  if (!overviewContainer) return;

  try {
    const response = await fetch(OVERVIEW_PATH);
    if (!response.ok) {
      throw new Error(`Overview request failed: ${response.status}`);
    }

    const markdown = await response.text();
    overviewContainer.innerHTML = micromark(markdown);
  } catch {
    overviewContainer.textContent = FALLBACK_MESSAGE;
  }
}

renderCosmologyOverview();
