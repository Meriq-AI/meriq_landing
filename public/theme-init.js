(function () {
  try {
    var s = localStorage.getItem("theme")
    var d =
      s === "dark" ||
      ((!s || s === "system") &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    var e = document.documentElement
    e.classList.toggle("dark", d)
    e.style.colorScheme = d ? "dark" : "light"
  } catch {}
})()
