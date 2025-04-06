let tracking = false;
let initx = 0;
let inity = 0;
let movableId = 0;
let lastx = 0;
let lasty = 0;
let board = document.getElementById("b");
let doneBoard = document.getElementById("c");
let movingELement;
let currectBoard;
(async function init() {
  console.log("INIT");
  if (localStorage.getItem("id") == null) {
    localStorage.setItem("id", "31");
  }
  if (localStorage.getItem("stickyNotes") == null) {
    localStorage.setItem("stickyNotes", "");
  }
  if (localStorage.getItem("tasks") == null) {
    let apiTasks = await fetch("https://dummyjson.com/todos");
    let c = 5;
    apiTasks.json().then((tasksWithoutFilters) => {
      let tasks = "";
      let stickies = "";
      console.log(tasksWithoutFilters.todos);
      for (let task of tasksWithoutFilters.todos) {
        if (c == 0) break;
        c--;
        console.log(task);
        tasks +=
          task.id +
          "#" +
          (task.completed ? "Completed" : "Pending") +
          "#" +
          task.todo +
          "#";
        stickies += task.id + "#0#0#";
      }
      localStorage.setItem("tasks", tasks.slice(0, tasks.length - 1));
      localStorage.setItem(
        "stickyNotes",
        stickies.slice(0, stickies.length - 1)
      );
      updateListData("");
    });
  }
  console.log("INIT");
  console.log(localStorage.getItem("stickyNotes"));
  updateListData("");
})();

let mouseDownOnStcikyNote = function (e) {
  tracking = true;
  movingELement = e.target;
  currectBoard = e.target.closest("#b") ?? e.target.closest("#c");
  movableId = e.target.dataset.stickyId;
  initx = e.clientX - e.target.offsetLeft - currectBoard.offsetLeft;
  inity = e.clientY - e.target.offsetTop - currectBoard.offsetTop;
};
board.addEventListener("mousedown", mouseDownOnStcikyNote);
doneBoard.addEventListener("mousedown", mouseDownOnStcikyNote);
board.addEventListener("highlightext", () => {});
let movingCard = function (e) {
  if (
    movingELement &&
    e.clientX >= currectBoard.offsetLeft &&
    e.clientX <= currectBoard.offsetLeft + currectBoard.clientWidth &&
    e.clientY >= currectBoard.offsetTop &&
    e.clientY <= currectBoard.offsetTop + currectBoard.clientHeight
  ) {
    let left = Math.min(
      e.clientX - currectBoard.offsetLeft - initx,
      currectBoard.clientWidth - movingELement.clientWidth - 2
    );
    left = Math.max(left, 2);
    lastx = left;
    movingELement.style.left = left + "px";
    let top = Math.min(
      e.clientY - currectBoard.offsetTop - inity,
      currectBoard.clientHeight - movingELement.clientHeight - 2
    );
    top = Math.max(top, 2);
    lasty = top;
    movingELement.style.top = top + "px";
  }
};
board.addEventListener("mousemove", movingCard);
doneBoard.addEventListener("mousemove", movingCard);
document.getElementsByTagName("body")[0].addEventListener("mouseup", (e) => {
  tracking = false;
  movingELement = null;
  currectBoard = null;
  let stickyNotes = localStorage.getItem("stickyNotes");
  let stickyNotesData = stickyNotes.split("#");
  let index = findIndex(movableId, stickyNotesData);
  stickyNotesData[index + 1] = lastx;
  stickyNotesData[index + 2] = lasty;
  localStorage.setItem("stickyNotes", stickyNotesData.join("#"));
});

function updateListData(subString) {
  let tbody = document.getElementsByTagName("tbody")[0];
  tbody.innerHTML = "";
  board.innerHTML = "";
  doneBoard.innerHTML = "";
  let data = localStorage.getItem("tasks").split("#");
  let stickyNotesData = localStorage.getItem("stickyNotes").split("#");
  console.log(stickyNotesData);
  let total = 0;
  for (let i = 0; i < data.length - 1; i += 3) {
    if (data[i + 2].indexOf(subString) != -1) {
      appendTask(data[i], data[i + 1], data[i + 2],stickyNotesData[i + 1],stickyNotesData[i + 2]);
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
  localStorage.setItem(
    "stickyNotes",
    localStorage.getItem("stickyNotes") +
      (localStorage.getItem("stickyNotes").length == 0 ? "" : "#") +
      localStorage.getItem("id") +
      "#0#0"
  );
  appendTask(parseInt(localStorage.getItem("id")), "Pending", newTaskValue);
  localStorage.setItem("id", parseInt(localStorage.getItem("id")) + 1);
  console.log(localStorage.getItem("tasks"));
});

function appendTask(id, status, task, left, top) {
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
  if (status == "Pending")
    board.innerHTML += `
      <div class="inner" data-sticky-id=${id} style="left:${left}px;top:${top}px;"><span>${task}</span></div>
      `;
  else
    doneBoard.innerHTML += `
      <div class="inner" data-sticky-id=${id} style="left:${left}px;top:${top}px;"><span 
      >${task}</span></div>
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
  <input type="text" class="edit-task-content" placeholder="Add new task..." value="${value}" style="display:block; justify-self:center;"/>
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
      let stickNodeForId=document.querySelector(`.inner[data-sticky-id='${id}'] span`);
      stickNodeForId.innerHTML = taskContent;
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
// board.innerHTML ="";
