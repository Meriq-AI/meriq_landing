(function () {
  try {
    var s = localStorage.getItem("theme")
    // Default to dark on first visit (no stored choice). A stored "light"/"dark"
    // wins; "system" follows the OS preference.
    var d =
      s === "dark" ||
      !s ||
      (s === "system" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    var e = document.documentElement
    e.classList.toggle("dark", d)
    e.style.colorScheme = d ? "dark" : "light"
  } catch {}
})()
