(function init() {
  if (localStorage.getItem("id") == null) {
    localStorage.setItem("id", "1");
  }
  if (localStorage.getItem("tasks") == null) {
    localStorage.setItem("tasks", "");
  }
})();