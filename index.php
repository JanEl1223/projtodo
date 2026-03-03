<?php require_once 'connectdb.php'; ?>
<!DOCTYPE html>
<html>
   <head>
      <title>To-do List</title>
      <link rel="stylesheet" href="styles.css">
   </head>
   <body>
      <div class="container">
         <h2>To-Do List</h2>

         <table>
            <tr>
               <th>Title</th>
               <th>Status</th>
               <th>Actions</th>
            </tr>

            <?php
               $tasks=mysqli_query($connection,"SELECT * FROM tasks ORDER BY id DESC");
               while($row=mysqli_fetch_assoc($tasks)){
            ?>
            <tr class="<?php echo ($row['status']=='Done') ? 'done-row' : ''; ?>">
               <td class="task-title"><?php echo htmlspecialchars($row['title']); ?></td>
               <td><?php echo htmlspecialchars($row['status']); ?></td>
               <td>
                  <a class="view" onclick="openModal(<?php echo $row['id'];?>,'view')">View</a> |
                  <a class="delete" onclick="showDeleteConfirm(<?php echo $row['id'];?>)">Delete</a>
               </td>
            </tr>

            <?php } ?>
         </table>
         <br>
         <button onclick="openAddTask()">+ Add Task</button>
      </div>

      <div id="taskModal" class="modal">
         <div class="modal-content">
            <span class="close" onclick="closeModal()">&times;</span>
            <div id="modalContent"></div>
         </div>
      </div>

      <div id="deleteConfirm">
         <p>Are you sure you want to delete?</p>
         <button class="yes" id="deleteYes">Yes</button>
         <button class="no" onclick="closeDeleteConfirm()">No</button>
      </div>

      <div id="savePopup">Task saved successfully!</div>
      
      <script src="script.js" defer></script>
   </body>
</html>