// Utility: escape HTML for safe rendering
function escapeHtml(text) {
  if (!text) return "";
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Load and render tasks on page load
document.addEventListener("DOMContentLoaded", loadTasks);

async function loadTasks() {
  const res = await fetch("/api/tasks");
  const tasks = await res.json();
  const tbody = document.getElementById("taskList");
  tbody.innerHTML = "";
  tasks.forEach((task) => {
    const tr = document.createElement("tr");
    tr.className = task.status === "Done" ? "done-row" : "";
    tr.innerHTML =
      '<td class="task-title">' +
      escapeHtml(task.title) +
      "</td>" +
      "<td>" +
      escapeHtml(task.status) +
      "</td>" +
      "<td>" +
      '<a class="view" onclick="openModal(' +
      task.id +
      ",'view')\">View</a> | " +
      '<a class="delete" onclick="showDeleteConfirm(' +
      task.id +
      ')">Delete</a>' +
      "</td>";
    tbody.appendChild(tr);
  });
}

// Add task modal
function openAddTask() {
  document.getElementById("modalContent").innerHTML =
    '<div class="modal-header">' +
    "<h3>Add New Task</h3>" +
    "</div>" +
    '<div class="modal-body">' +
    '<form id="addTaskForm" onsubmit="submitAddTask(event)">' +
    "<label>Title</label>" +
    '<input type="text" id="new-title" required>' +
    "<label>Description</label>" +
    '<textarea id="new-desc"></textarea>' +
    '<div style="margin-top:10px">' +
    '<button type="submit" class="save">Add Task</button>' +
    "</div>" +
    "</form>" +
    "</div>";
  document.getElementById("taskModal").style.display = "block";
}

async function submitAddTask(e) {
  e.preventDefault();
  var title = document.getElementById("new-title").value;
  var desc = document.getElementById("new-desc").value;

  await fetch("/api/tasks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title: title, description: desc, status: "Pending" }),
  });

  closeModal();
  showSavePopup();
  setTimeout(loadTasks, 1500);
}

// View/Edit modal
async function openModal(id, mode) {
  mode = mode || "view";
  var res = await fetch("/api/tasks/" + id);
  var task = await res.json();

  var readonly = mode === "view" ? "readonly" : "";
  var disabled = mode === "view" ? "disabled" : "";

  var subtasksHtml = "";
  task.subtasks.forEach(function (sub) {
    subtasksHtml +=
      '<div class="subtask-item">' +
      '<div class="subtask-left">' +
      '<input type="checkbox" id="sub-' +
      sub.id +
      '" onclick="toggleSubtask(' +
      sub.id +
      ')" ' +
      (sub.checked ? "checked" : "") +
      " " +
      disabled +
      ">" +
      '<label for="sub-' +
      sub.id +
      '" class="' +
      (sub.checked ? "checked" : "") +
      '">' +
      escapeHtml(sub.title) +
      "</label>" +
      "</div>" +
      (mode === "edit"
        ? '<button onclick="deleteSubtask(' + sub.id + ')">&#128465;</button>'
        : "") +
      "</div>";
  });

  var addSubtaskHtml = "";
  if (mode === "edit") {
    addSubtaskHtml =
      '<div class="add-subtask">' +
      '<input type="text" id="newSubtask" placeholder="New subtask">' +
      '<button onclick="addSubtask(' +
      task.id +
      ')">Add</button>' +
      "</div>";
  }

  var footerHtml = "";
  if (mode === "view") {
    footerHtml =
      '<div class="modal-footer">' +
      '<button class="save" onclick="openModal(' +
      task.id +
      ",'edit')\">Edit Task</button>" +
      "</div>";
  } else {
    footerHtml =
      '<div class="modal-footer">' +
      '<button class="save" onclick="saveTask(' +
      task.id +
      ')">Save</button>' +
      "</div>";
  }

  document.getElementById("modalContent").innerHTML =
    '<div class="modal-header">' +
    "<h3>" +
    (mode === "edit" ? "Edit Task" : "View Task") +
    "</h3>" +
    "</div>" +
    '<div class="modal-body">' +
    '<input type="hidden" id="task-id" value="' +
    task.id +
    '">' +
    "<label>Title</label>" +
    '<input type="text" id="task-title" value="' +
    escapeHtml(task.title) +
    '" ' +
    readonly +
    ">" +
    "<label>Description</label>" +
    '<textarea id="task-desc" ' +
    readonly +
    ">" +
    escapeHtml(task.description) +
    "</textarea>" +
    "<label>Status</label>" +
    '<select id="task-status" ' +
    disabled +
    ">" +
    "<option " +
    (task.status === "Pending" ? "selected" : "") +
    ">Pending</option>" +
    "<option " +
    (task.status === "Done" ? "selected" : "") +
    ">Done</option>" +
    "</select>" +
    '<div class="subtask-list">' +
    "<h4>Subtasks</h4>" +
    subtasksHtml +
    addSubtaskHtml +
    "</div>" +
    "</div>" +
    footerHtml;

  document.getElementById("taskModal").style.display = "block";
}

function closeModal() {
  document.getElementById("taskModal").style.display = "none";
}

// Delete confirmation
var deleteId = null;
function showDeleteConfirm(id) {
  deleteId = id;
  document.getElementById("deleteConfirm").style.display = "block";
}
function closeDeleteConfirm() {
  document.getElementById("deleteConfirm").style.display = "none";
}
document.getElementById("deleteYes").onclick = async function () {
  await fetch("/api/tasks/" + deleteId, { method: "DELETE" });
  closeDeleteConfirm();
  loadTasks();
};

// Subtasks
async function toggleSubtask(subId) {
  var checkbox = document.getElementById("sub-" + subId);
  var checked = checkbox.checked;
  await fetch("/api/subtasks/" + subId, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ checked: checked }),
  });
  if (checked) {
    checkbox.nextElementSibling.classList.add("checked");
  } else {
    checkbox.nextElementSibling.classList.remove("checked");
  }
}

async function deleteSubtask(subId) {
  var taskId = document.getElementById("task-id").value;
  await fetch("/api/subtasks/" + subId, { method: "DELETE" });
  openModal(parseInt(taskId), "edit");
}

async function addSubtask(taskId) {
  var input = document.getElementById("newSubtask");
  var title = input.value.trim();
  if (title === "") return;

  await fetch("/api/tasks/" + taskId + "/subtasks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title: title }),
  });

  input.value = "";
  openModal(taskId, "edit");
}

// Save popup
function showSavePopup() {
  var popup = document.getElementById("savePopup");
  popup.style.display = "block";
  popup.style.opacity = "1";
  popup.style.transition = "opacity 2s ease";
  setTimeout(function () {
    popup.style.opacity = "0";
    setTimeout(function () {
      popup.style.display = "none";
    }, 2000);
  }, 2000);
}

// Save task
async function saveTask(id) {
  var title = document.getElementById("task-title").value;
  var desc = document.getElementById("task-desc").value;
  var status = document.getElementById("task-status").value;

  var res = await fetch("/api/tasks/" + id, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title: title, description: desc, status: status }),
  });

  if (res.ok) {
    showSavePopup();
    setTimeout(loadTasks, 4000);
  } else {
    var error = await res.text();
    alert("Error saving task: " + error);
  }
}
