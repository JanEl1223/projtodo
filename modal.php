<?php
require_once 'connectdb.php';

if(!isset($_GET['id'])) exit;

$id = intval($_GET['id']);

$mode = isset($_GET['mode']) ? $_GET['mode'] : 'view';
$readonly = ($mode == 'view') ? 'readonly' : '';
$disabled = ($mode == 'view') ? 'disabled' : '';

$taskQ = mysqli_query($connection,"SELECT * FROM tasks WHERE id=$id");
if(!$taskQ || mysqli_num_rows($taskQ)==0) exit('Task not found');

$task = mysqli_fetch_assoc($taskQ);

$subQ = mysqli_query($connection,"SELECT * FROM subtasks WHERE task_id=$id ORDER BY id ASC");

$subtasks = [];
while($s = mysqli_fetch_assoc($subQ)){
    $subtasks[] = $s;
}
?>

<!-- ================= MODAL HEADER ================= -->
<div class="modal-header">
<h3><?php echo ($mode=='edit') ? 'Edit Task' : 'View Task'; ?></h3>
</div>

<!-- ================= MODAL BODY ================= -->
<div class="modal-body">

<input type="hidden" id="task-id" value="<?php echo $task['id']; ?>">

<label>Title</label>
<input
type="text"
id="task-title"
value="<?php echo htmlspecialchars($task['title']); ?>"
<?php echo $readonly; ?>
>

<label>Description</label>
<textarea id="task-desc" <?php echo $readonly; ?>>
<?php echo htmlspecialchars($task['description']); ?>
</textarea>

<label>Status</label>
<select id="task-status" <?php echo $disabled; ?>>
    <option <?php if($task['status']=='Pending') echo 'selected'; ?>>Pending</option>
    <option <?php if($task['status']=='Done') echo 'selected'; ?>>Done</option>
</select>

<!-- ================= SUBTASKS ================= -->
<div class="subtask-list">
<h4>Subtasks</h4>

<?php foreach($subtasks as $sub): ?>
<div class="subtask-item">

    <div class="subtask-left">
        <input
        type="checkbox"
        id="sub-<?php echo $sub['id'];?>"
        onclick="toggleSubtask(<?php echo $sub['id'];?>)"
        <?php if($sub['checked']) echo 'checked'; ?>
        <?php echo $disabled; ?>
        >

        <label
        for="sub-<?php echo $sub['id'];?>"
        class="<?php if($sub['checked']) echo 'checked'; ?>">
        <?php echo htmlspecialchars($sub['title']); ?>
        </label>
    </div>

    <?php if($mode=='edit'): ?>
        <button onclick="deleteSubtask(<?php echo $sub['id'];?>)">🗑</button>
    <?php endif; ?>

</div>
<?php endforeach; ?>

<?php if($mode=='edit'): ?>
<div class="add-subtask">
    <input type="text" id="newSubtask" placeholder="New subtask">
    <button onclick="addSubtask(<?php echo $task['id'];?>)">Add</button>
</div>
<?php endif; ?>

</div>
</div>

<!-- ================= MODAL FOOTER ================= -->
<?php if($mode == 'view'): ?>
<div class="modal-footer">
<button class="save"
onclick="openModal(<?php echo $task['id'];?>,'edit')">
Edit Task
</button>
</div>
<?php endif; ?>

<?php if($mode == 'edit'): ?>
<div class="modal-footer">
    <button class="save"
        onclick="saveTask(<?php echo $task['id'];?>)">
        Save
    </button>
</div>
<?php endif; ?>