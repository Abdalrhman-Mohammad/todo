(function init() {
  if (localStorage.getItem("id") == null) {
    localStorage.setItem("id", "1");
  }
  if (localStorage.getItem("tasks") == null) {
    localStorage.setItem("tasks", "");
  }
  updateListData();
})();
function updateListData(){
  let tbody = document.getElementsByTagName("tbody")[0];
  tbody.innerHTML="";
  let data = localStorage.getItem("tasks").split("#");
  for (let i = 0; i < data.length - 1; i += 3) {
    appendTask(data[i], data[i + 1], data[i + 2]);
  }
}
let addTaskBtn = document.getElementById("add-task");
let newTaskElement = document.getElementById("new-task");

addTaskBtn.addEventListener("click", () => {
  console.log("clicked");

  let newTaskValue = newTaskElement.value;

  newTaskElement.value = "";

  newTaskValue = String(newTaskValue).trim();
  if (newTaskValue.length == 0) {
    return;
  }

  if (new String(newTaskValue).indexOf("#") != -1) {
    newTaskElement.value = newTaskValue;
    alert("Please don't use #");
    return;
  }

  console.log(newTaskValue);
  console.log(localStorage.getItem("tasks"));

  localStorage.setItem(
    "tasks",
    localStorage.getItem("tasks") +
      (localStorage.getItem("tasks").length == 0 ? "" : "#") +
      localStorage.getItem("id") +
      "#" +
      "Pinding"
      +"#" +
      newTaskValue
  );
  localStorage.setItem("id", parseInt(localStorage.getItem("id")) + 1);
  console.log(localStorage.getItem("tasks"));
  appendTask(parseInt(localStorage.getItem("id"))-1,newTaskValue);
});

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

let table = document.getElementsByTagName("table")[0];
table.addEventListener("click", (e) => {
  // console.log(e.currentTarget);
  let closestTr = e.target.closest("tr");
  // console.log(closestTr);
  if (closestTr == null || closestTr.id != "task") {
    return;
  }
  let id = closestTr.dataset.taskId;
  let tasks = localStorage.getItem("tasks");
  if (e.target.id == "done-btn") {
    let start = tasks.indexOf(id) + id.length + 1;
    let end = start + "Pinding".length;
    if (tasks.slice(start, end) != "Pinding") return;
    tasks = tasks.slice(0, start) + "Completed" + tasks.slice(end);
    localStorage.setItem("tasks", tasks);
    updateListData();
  } else if (e.target.id == "edit-btn") {
   
  } else if (e.target.id == "delete-btn") {
    let start = tasks.indexOf(id) - 1;
    let end = tasks.indexOf("#", start + 1);
    if (end != -1) {
      end = tasks.indexOf("#", end + 1);
      if (end != -1) {
        end = tasks.indexOf("#", end + 1);
      }
    }
    if (end == -1 && start == -1) tasks = "";
    else if (end == -1) tasks = tasks.slice(0, start);
    else if (start == -1) tasks = tasks.slice(end + 1);
    else tasks = tasks.slice(0, start) + tasks.slice(end - 1);
    localStorage.setItem("tasks", tasks);
    updateListData();
    // closestTr.remove();
  } else {
    return;
  }
});
// localStorage.clear();