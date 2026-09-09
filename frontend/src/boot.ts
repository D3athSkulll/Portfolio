/** Dismiss the pre-React boot loader defined in index.html. */
export function dismissBoot() {
  const el = document.getElementById("boot");
  if (!el || el.classList.contains("boot--done")) return;
  el.classList.add("boot--done");
  setTimeout(() => el.remove(), 400);
}
