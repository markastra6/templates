export function matches(text, query) {
  const words = query.trim().toLowerCase().split(/\s+/);
  const content = text.toLowerCase();
  return words.every(word => content.includes(word));
}

if (typeof document !== "undefined") {
  const form = document.querySelector("form");
  const input = document.querySelector("input");
  const status = document.getElementById("result");
  const entries = Array.from(document.querySelectorAll("li"));
  if (form && input && status) {
    form.hidden = false;
    form.addEventListener("submit", event => event.preventDefault());
    const filter = () => {
      let count = 0;
      for (const entry of entries) {
        entry.hidden = !matches(entry.textContent, input.value);
        if (!entry.hidden) count++;
      }
      status.textContent = count ? `${count} of ${entries.length} tools` : "No matching tools. Try a different search.";
    };
    input.addEventListener("input", filter);
    filter();
  }
}
