<?php
?>

<div class="modal-header">
    <h3>Add New Task</h3>
</div>

<div class="modal-body">

<form id="addTaskForm" onsubmit="submitAddTask(event)">

    <label>Title</label>
    <input type="text" id="new-title" required>

    <label>Description</label>
    <textarea id="new-desc"></textarea>

    <div style="margin-top:10px">
        <button type="submit" class="save">Add Task</button>
    </div>

</form>

</div>