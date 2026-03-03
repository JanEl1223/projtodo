function openAddTask() {
  fetch("add_modal.php")
    .then((res) => res.text())
    .then((data) => {
      document.getElementById("modalContent").innerHTML = data;
      document.getElementById("taskModal").style.display = "block";
    });
}

function submitAddTask(e) {
  e.preventDefault();

  let title = document.getElementById("new-title").value;
  let desc = document.getElementById("new-desc").value;
  let status = "Pending";

  fetch("add.php", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body:
      "title=" +
      encodeURIComponent(title) +
      "&description=" +
      encodeURIComponent(desc) +
      "&status=" +
      encodeURIComponent(status),
  }).then(() => {
    closeModal();
    showSavePopup();
    setTimeout(() => {
      location.reload();
    }, 1500);
  });
}
// Open modal
function openModal(id, mode = "view") {
  fetch("modal.php?id=" + id + "&mode=" + mode)
    .then((res) => res.text())
    .then((data) => {
      document.getElementById("modalContent").innerHTML = data;
      document.getElementById("taskModal").style.display = "block";
    });
}
function closeModal() {
  document.getElementById("taskModal").style.display = "none";
}

// Delete confirmation
let deleteId = null;
function showDeleteConfirm(id) {
  deleteId = id;
  document.getElementById("deleteConfirm").style.display = "block";
}
function closeDeleteConfirm() {
  document.getElementById("deleteConfirm").style.display = "none";
}
document.getElementById("deleteYes").onclick = function () {
  window.location = "delete.php?id=" + deleteId;
};

// Subtasks
function toggleSubtask(subId) {
  let checkbox = document.getElementById("sub-" + subId);
  let checked = checkbox.checked ? 1 : 0;
  fetch("update_subtask.php", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: "id=" + subId + "&checked=" + checked,
  }).then(() => {
    if (checked) {
      checkbox.nextElementSibling.classList.add("checked");
    } else {
      checkbox.nextElementSibling.classList.remove("checked");
    }
  });
}

function deleteSubtask(subId) {
  fetch("delete_subtask.php?id=" + subId).then(() => {
    openModal(document.getElementById("task-id").value);
  });
}

function addSubtask(taskId) {
  let input = document.getElementById("newSubtask");
  let subInput = input.value.trim();

  if (subInput === "") return;

  fetch("add_subtask.php", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: "task_id=" + taskId + "&title=" + encodeURIComponent(subInput),
  })
    .then((res) => res.text())
    .then(() => {
      input.value = "";
      openModal(taskId, "edit");
    });
}

// Save popup
function showSavePopup() {
  const popup = document.getElementById("savePopup");
  popup.style.display = "block";
  popup.style.opacity = "1";
  popup.style.transition = "opacity 2s ease";
  setTimeout(() => {
    popup.style.opacity = "0";
    setTimeout(() => {
      popup.style.display = "none";
    }, 2000);
  }, 2000);
}

// Save task
function saveTask(id) {
  let title = document.getElementById("task-title").value;
  let desc = document.getElementById("task-desc").value;
  let status = document.getElementById("task-status").value;

  fetch("update.php", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body:
      "id=" +
      id +
      "&title=" +
      encodeURIComponent(title) +
      "&description=" +
      encodeURIComponent(desc) +
      "&status=" +
      encodeURIComponent(status),
  })
    .then((res) => res.text())
    .then((response) => {
      if (response.trim() === "success") {
        showSavePopup();
        setTimeout(() => {
          location.reload();
        }, 4000);
      } else {
        alert("Error saving task: " + response);
      }
    });
}
