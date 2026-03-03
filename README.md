# projtodo

Members:
Eljohn Jakosalem   |   Aljen Nacis   |   Niño Anthony Espartero   |   Darren Keith Calumpang   |   Rhonevie Frejoles


SQL Data Structure:
The database consists two main tables: tasks and subtasks.

1. Tasks Table: Stores the main task information.
  -Structure:
    *id – Integer (Primary Identifier of each task)
    *title – Varchar(255), stores the task title
    *description – Text, optional detailed description of the task
    *status – Varchar(50), default value is 'Pending' 
  -Purpose: This table contains the core task records. Each task has a unique ID and may include a description and status to track progress.

3. Subtasks Table: Stores smaller task items that belong to a main task.
   -Structure:
     *id – Integer (Identifier of each subtask)
     *task_id – Integer (References the related task)
     *title – Varchar(255), stores the subtask title
     *checked – Tinyint(1), default value is 0 (0 = not completed, 1 = completed)
   -Purpose: This table allows each main task to have multiple subtasks. The task_id column connects each subtask to a specific task, forming a one-to-many relationship.
