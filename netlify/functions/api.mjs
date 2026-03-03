import { getStore } from "@netlify/blobs";

const STORE_NAME = "todos";
const DATA_KEY = "data";

async function getData() {
  const store = getStore({ name: STORE_NAME, consistency: "strong" });
  const data = await store.get(DATA_KEY, { type: "json" });
  if (!data) {
    return { nextTaskId: 1, nextSubtaskId: 1, tasks: [] };
  }
  return data;
}

async function saveData(data) {
  const store = getStore({ name: STORE_NAME, consistency: "strong" });
  await store.setJSON(DATA_KEY, data);
}

function json(data, status = 200) {
  return Response.json(data, { status });
}

export default async (req) => {
  const url = new URL(req.url);
  const path = url.pathname;
  const method = req.method;
  const segments = path.split("/").filter(Boolean);

  // GET /api/tasks — list all tasks
  if (segments.length === 2 && segments[1] === "tasks" && method === "GET") {
    const data = await getData();
    const sorted = [...data.tasks].sort((a, b) => b.id - a.id);
    return json(sorted);
  }

  // POST /api/tasks — create task
  if (segments.length === 2 && segments[1] === "tasks" && method === "POST") {
    const body = await req.json();
    const data = await getData();
    const task = {
      id: data.nextTaskId++,
      title: body.title || "",
      description: body.description || "",
      status: body.status || "Pending",
      subtasks: [],
    };
    data.tasks.push(task);
    await saveData(data);
    return json(task, 201);
  }

  // /api/tasks/:id
  if (segments.length === 3 && segments[1] === "tasks" && /^\d+$/.test(segments[2])) {
    const taskId = parseInt(segments[2]);

    // GET /api/tasks/:id
    if (method === "GET") {
      const data = await getData();
      const task = data.tasks.find((t) => t.id === taskId);
      if (!task) return json({ error: "Task not found" }, 404);
      return json(task);
    }

    // PUT /api/tasks/:id
    if (method === "PUT") {
      const body = await req.json();
      const data = await getData();
      const task = data.tasks.find((t) => t.id === taskId);
      if (!task) return json({ error: "Task not found" }, 404);
      if (body.title !== undefined) task.title = body.title;
      if (body.description !== undefined) task.description = body.description;
      if (body.status !== undefined) task.status = body.status;
      await saveData(data);
      return json(task);
    }

    // DELETE /api/tasks/:id
    if (method === "DELETE") {
      const data = await getData();
      data.tasks = data.tasks.filter((t) => t.id !== taskId);
      await saveData(data);
      return json({ success: true });
    }
  }

  // POST /api/tasks/:id/subtasks — add subtask
  if (
    segments.length === 4 &&
    segments[1] === "tasks" &&
    /^\d+$/.test(segments[2]) &&
    segments[3] === "subtasks" &&
    method === "POST"
  ) {
    const taskId = parseInt(segments[2]);
    const body = await req.json();
    const data = await getData();
    const task = data.tasks.find((t) => t.id === taskId);
    if (!task) return json({ error: "Task not found" }, 404);
    const subtask = {
      id: data.nextSubtaskId++,
      title: body.title || "",
      checked: false,
    };
    task.subtasks.push(subtask);
    await saveData(data);
    return json(subtask, 201);
  }

  // /api/subtasks/:id
  if (segments.length === 3 && segments[1] === "subtasks" && /^\d+$/.test(segments[2])) {
    const subId = parseInt(segments[2]);

    // PUT /api/subtasks/:id — toggle subtask
    if (method === "PUT") {
      const body = await req.json();
      const data = await getData();
      for (const task of data.tasks) {
        const sub = task.subtasks.find((s) => s.id === subId);
        if (sub) {
          if (body.checked !== undefined) sub.checked = body.checked;
          await saveData(data);
          return json(sub);
        }
      }
      return json({ error: "Subtask not found" }, 404);
    }

    // DELETE /api/subtasks/:id
    if (method === "DELETE") {
      const data = await getData();
      for (const task of data.tasks) {
        const idx = task.subtasks.findIndex((s) => s.id === subId);
        if (idx !== -1) {
          task.subtasks.splice(idx, 1);
          await saveData(data);
          return json({ success: true });
        }
      }
      return json({ error: "Subtask not found" }, 404);
    }
  }

  return json({ error: "Not found" }, 404);
};

export const config = {
  path: ["/api/tasks", "/api/tasks/*", "/api/subtasks/*"],
};
