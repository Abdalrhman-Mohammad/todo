(function init() {
  if (localStorage.getItem("id") == null) {
    localStorage.setItem("id", "1");
  }
  if (localStorage.getItem("tasks") == null) {
    localStorage.setItem("tasks", "");
  }

})();

function appendTask(id, status,task) {
  let tasks = document.getElementById("tasks");
  tasks.innerHTML += `
  <tr id="task" data-task-id="${id}">
            <td id="id">${id}</td>
            <td id="description">${task}</td>
            <td id="status">${status}</td>
            <td id="actions">
              <button id="delete-btn">Delete</button>
              <button id="edit-btn">Edit</button>
              <button id="done-btn">Done</button>
            </td>
  </tr>
            `;
}
// localStorage.clear();
