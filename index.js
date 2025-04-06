(async function init() {
  if (localStorage.getItem("id") == null) {
    localStorage.setItem("id", "31");
  }
  if (localStorage.getItem("tasks") == null) {
    let apiTasks = await fetch("https://dummyjson.com/todos");
    apiTasks.json().then((tasksWithoutFilters) => {
      let tasks = "";
      console.log(tasksWithoutFilters.todos);
      for (let task of tasksWithoutFilters.todos) {
        console.log(task);
        tasks +=
          task.id +
          "#" +
          (task.completed ? "Completed" : "Pending") +
          "#" +
          task.todo +
          "#";
      }
      localStorage.setItem("tasks", tasks.slice(0, tasks.length - 1));
      updateListData("");
    });
  }
  updateListData("");
})();
function updateListData(subString) {
  let tbody = document.getElementsByTagName("tbody")[0];
  tbody.innerHTML = "";
  let data = localStorage.getItem("tasks").split("#");
  let total = 0;
  for (let i = 0; i < data.length - 1; i += 3) {
    if (data[i + 2].indexOf(subString) != -1) {
      appendTask(data[i], data[i + 1], data[i + 2]);
      total++;
    }
  }
  let totalElement = document.getElementById("total-tasks");
  totalElement.innerHTML = `Total : ${total}`;
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
      "Pending" +
      "#" +
      newTaskValue
  );
  localStorage.setItem("id", parseInt(localStorage.getItem("id")) + 1);
  console.log(localStorage.getItem("tasks"));
  appendTask(parseInt(localStorage.getItem("id")) - 1, "Pending", newTaskValue);
});

function appendTask(id, status, task) {
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

function findIndex(id,tasks){
  let tmp=-1;
  let index=-1;
  console.log(tasks.indexOf(id,tmp+1))
  while(tasks.indexOf(id,tmp+1)!=-1&&tasks.indexOf(id,tmp+1)%3!=0){
    console.log(tmp);  
    tmp = tasks.indexOf(id, tmp+1);
    console.log(tmp);  
  
  }
  index = tasks.indexOf(id, tmp + 1);
  return index;
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
    tasks=tasks.split("#");
    let index=findIndex(id,tasks);
    console.log(index);
    if (tasks[index+1] != "Pending") return;
    tasks[index+1]="Completed";
    localStorage.setItem("tasks", tasks.join("#"));
    updateListData("");
  } else if (e.target.id == "edit-btn") {
    let noEnter = closestTr.querySelector(".edit-task-content") != undefined;
    if (noEnter) return;
    let description = closestTr.querySelector("#description");
    // console.log("-----------");
    // console.log(x);
    let value = description.innerHTML;
    description.innerHTML = `
    <input type="text" class="edit-task-content" placeholder="Add new task..." value="${value}"/>
      <input type="button" class="save-task-btn" value="save" />
      <input type="button" class="cancel-task-btn" value="cancel" />
    `;
    let saveTask = closestTr.querySelector(".save-task-btn");
    let cancelTask = closestTr.querySelector(".cancel-task-btn");
    saveTask.addEventListener("click", () => {
      let taskContent = closestTr.querySelector(".edit-task-content").value;
      taskContent = taskContent.trim();
      if (taskContent.length == 0) {
        alert("Not allowed the todo be empty or just have spaces!!!");
        return;
      }
      // console.log(taskContent);
      // console.log(taskContent, "-----------");
      // console.log(closestTr.querySelector(".edit-task-content"), "-----------");
      tasks = tasks.split("#");
      let index = findIndex(id, tasks);
      tasks[index + 2] = taskContent;;
      description.innerHTML = taskContent;
      localStorage.setItem("tasks", tasks.join("#"));
    });
    cancelTask.addEventListener("click", () => {
      description.innerHTML = value;
    });
  } else if (e.target.id == "delete-btn") {
    let dialog = document.getElementById("dialog");
    console.log(dialog);
    let divInDialog = document.querySelector("#dialog div");

    divInDialog.innerHTML = ` 
    <p>
      If you click on <em>OK</em> you will delete todo with id ${id} 
      </p>
      </br>
      <div>
      <input type="button" id="Ok-delete-task-btn" value="OK" />
      <input type="button" id="cancel-delete-task-btn" value="cencel" />
      </div>
    `;
    let tmpfun = () => {
      tasks = tasks.split("#");
      let index = findIndex(id, tasks);
      tasks1 = tasks.slice(0, index);
      tasks2 = index + 3 < tasks.length ? tasks.slice(index + 3) : [];
      tasks=[...tasks1,...tasks2];
      console.log(tasks)
      localStorage.setItem("tasks", tasks.join("#"));
      updateListData("");

      dialog.close();
      document
        .getElementById("Ok-delete-task-btn")
        .removeEventListener("click", tmpfun);
    };

    dialog.showModal();

    document
      .getElementById("Ok-delete-task-btn")
      .addEventListener("click", tmpfun);
document
  .getElementById("cancel-delete-task-btn")
  .addEventListener("click", ()=>{
    dialog.close();
  });
    // closestTr.remove();
  } else {
    return;
  }
});

let searchElem = document.getElementById("search-task-by");
searchElem.addEventListener("keyup", () => {
  console.log(searchElem.value);
  updateListData(searchElem.value);
});
// localStorage.clear();
