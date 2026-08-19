// API Base URL (Connected to Level-1 Task-2 REST API)
const API_URL = "http://localhost:5000/api/tasks";

// Global State
let tasksState = [];
let pendingDeleteId = null;

// DOM Element References
const addTaskForm = document.getElementById("addTaskForm");
const taskTitleInput = document.getElementById("taskTitle");
const taskDescriptionInput = document.getElementById("taskDescription");
const taskStatusInput = document.getElementById("taskStatus");
const titleError = document.getElementById("titleError");
const submitBtn = document.getElementById("submitBtn");
const resetBtn = document.getElementById("resetBtn");

const taskListContainer = document.getElementById("taskList");
const loadingState = document.getElementById("loadingState");
const errorState = document.getElementById("errorState");
const errorStateMsg = document.getElementById("errorStateMsg");
const retryBtn = document.getElementById("retryBtn");
const emptyState = document.getElementById("emptyState");
const emptyStateText = document.getElementById("emptyStateText");

const visibleCountBadge = document.getElementById("visibleCountBadge");
const searchInput = document.getElementById("searchInput");
const statusFilter = document.getElementById("statusFilter");
const refreshBtn = document.getElementById("refreshBtn");

const serverStatusBadge = document.getElementById("serverStatusBadge");
const serverStatusText = document.getElementById("serverStatusText");

// Stat Counters
const totalTasksCount = document.getElementById("totalTasksCount");
const pendingTasksCount = document.getElementById("pendingTasksCount");
const inProgressTasksCount = document.getElementById("inProgressTasksCount");
const completedTasksCount = document.getElementById("completedTasksCount");

// Edit Modal Elements
const editModal = document.getElementById("editModal");
const editTaskForm = document.getElementById("editTaskForm");
const editTaskId = document.getElementById("editTaskId");
const editTaskTitle = document.getElementById("editTaskTitle");
const editTaskDescription = document.getElementById("editTaskDescription");
const editTaskStatus = document.getElementById("editTaskStatus");
const closeModalBtn = document.getElementById("closeModalBtn");
const cancelModalBtn = document.getElementById("cancelModalBtn");

// Delete Modal Elements
const deleteModal = document.getElementById("deleteModal");
const deleteTaskTitle = document.getElementById("deleteTaskTitle");
const cancelDeleteBtn = document.getElementById("cancelDeleteBtn");
const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");

// Toast Container
const toastContainer = document.getElementById("toastContainer");

/**
 * Fetch and display all tasks from the REST API
 * Route: GET http://localhost:5000/api/tasks
 */
async function getTasks() {
  showLoading(true);
  hideError();

  try {
    const response = await fetch(API_URL, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }

    const result = await response.json();

    if (result.success && Array.isArray(result.data)) {
      tasksState = result.data;
      updateServerStatus(true);
      renderTasks();
      updateStats();
    } else {
      throw new Error(
        result.message || "Invalid data format received from API",
      );
    }
  } catch (error) {
    console.error("[API Error in getTasks]:", error);
    updateServerStatus(false);
    showError(
      `Failed to load tasks: ${error.message}. Make sure backend server is running on http://localhost:5000.`,
    );
    showToast("Failed to load tasks from backend", "error");
  } finally {
    showLoading(false);
  }
}

/**
 * Send new task data to create a task in the REST API
 * Route: POST http://localhost:5000/api/tasks
 * @param {Object} taskData - Object containing { title, description, status }
 */
async function createTask(taskData) {
  try {
    setButtonLoading(submitBtn, true, "Adding...");

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(taskData),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Failed to create task");
    }

    // Success response handling
    showToast(result.message || "Task created successfully", "success");
    addTaskForm.reset();
    clearValidationErrors();

    // Refresh task list with latest server data
    await getTasks();
  } catch (error) {
    console.error("[API Error in createTask]:", error);
    showToast(`Error: ${error.message}`, "error");
  } finally {
    setButtonLoading(
      submitBtn,
      false,
      '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg> Add Task',
    );
  }
}

/**
 * Update an existing task by ID using PATCH
 * Route: PATCH http://localhost:5000/api/tasks/:id
 * @param {string|number} id - Task ID to update
 * @param {Object} updatedFields - Fields to update (e.g. { status } or { title, description, status })
 */
async function updateTask(id, updatedFields) {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(updatedFields),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Failed to update task");
    }

    showToast(result.message || "Task updated successfully", "success");
    await getTasks();
  } catch (error) {
    console.error("[API Error in updateTask]:", error);
    showToast(`Error: ${error.message}`, "error");
  }
}

/**
 * Delete a selected task by ID using DELETE
 * Route: DELETE http://localhost:5000/api/tasks/:id
 * @param {string|number} id - Task ID to delete
 */
async function deleteTask(id) {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
      },
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Failed to delete task");
    }

    showToast(result.message || "Task deleted successfully", "success");
    await getTasks();
  } catch (error) {
    console.error("[API Error in deleteTask]:", error);
    showToast(`Error: ${error.message}`, "error");
  }
}

/* ==========================================================================
   2. UI RENDERING & COMPONENT FUNCTIONS
   ========================================================================== */

/**
 * Render filtered & searched task cards into the DOM grid
 */
function renderTasks() {
  const searchTerm = searchInput.value.toLowerCase().trim();
  const filterValue = statusFilter.value;

  // Filter tasks array according to search and status dropdown
  const filteredTasks = tasksState.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm) ||
      (task.description && task.description.toLowerCase().includes(searchTerm));

    const matchesStatus = filterValue === "all" || task.status === filterValue;

    return matchesSearch && matchesStatus;
  });

  // Update visible task count badge
  visibleCountBadge.textContent = `${filteredTasks.length} ${filteredTasks.length === 1 ? "task" : "tasks"}`;

  // Check if empty
  if (filteredTasks.length === 0) {
    taskListContainer.innerHTML = "";
    emptyState.classList.remove("hidden");
    if (tasksState.length === 0) {
      emptyStateText.textContent =
        "You haven't created any tasks yet. Use the form on the left to add your first task!";
    } else {
      emptyStateText.textContent =
        "No tasks match your current search or filter criteria.";
    }
    return;
  }

  emptyState.classList.add("hidden");

  // Build task cards HTML dynamically
  taskListContainer.innerHTML = filteredTasks
    .map((task) => {
      const statusClass = getStatusClass(task.status);
      const statusLabel = getStatusLabel(task.status);
      const nextStatus = getNextStatus(task.status);

      return `
        <article class="task-card" data-id="${task.id}">
          <div class="task-card-header">
            <h3>${escapeHTML(task.title)}</h3>
            <span class="status-badge ${statusClass}">${statusLabel}</span>
          </div>

          <div class="task-card-body">
            <p>${task.description ? escapeHTML(task.description) : '<em style="color:var(--text-muted)">No description provided</em>'}</p>
          </div>

          <div class="task-card-footer">
            <span class="task-id-tag">ID: #${task.id}</span>
            <div class="task-actions">
              <button 
                class="action-btn update-btn" 
                onclick="cycleTaskStatus(${task.id}, '${task.status}')"
                title="Advance to ${getNextStatusLabel(nextStatus)}"
              >
                ↻ ${getNextStatusActionText(task.status)}
              </button>
              
              <button 
                class="action-btn" 
                onclick="openEditModal(${task.id})"
                title="Edit task details"
              >
                ✏️ Edit
              </button>

              <button 
                class="action-btn delete-btn" 
                onclick="promptDeleteTask(${task.id}, '${escapeQuotes(task.title)}')"
                title="Delete task"
              >
                🗑️ Delete
              </button>
            </div>
          </div>
        </article>
      `;
    })
    .join("");
}

/**
 * Cycle task status (Pending -> In Progress -> Completed -> Pending)
 * @param {string|number} id
 * @param {string} currentStatus
 */
function cycleTaskStatus(id, currentStatus) {
  const nextStatus = getNextStatus(currentStatus);
  updateTask(id, { status: nextStatus });
}

/**
 * Update top metric stats (Total, Pending, In Progress, Completed)
 */
function updateStats() {
  const total = tasksState.length;
  const pending = tasksState.filter((t) => t.status === "pending").length;
  const inProgress = tasksState.filter(
    (t) => t.status === "in-progress",
  ).length;
  const completed = tasksState.filter((t) => t.status === "completed").length;

  totalTasksCount.textContent = total;
  pendingTasksCount.textContent = pending;
  inProgressTasksCount.textContent = inProgress;
  completedTasksCount.textContent = completed;
}

/* ==========================================================================
   3. EVENT HANDLERS & FORM VALIDATION
   ========================================================================== */

// Handle Add Task Form Submission
addTaskForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const title = taskTitleInput.value.trim();
  const description = taskDescriptionInput.value.trim();
  const status = taskStatusInput.value;

  // Validation: Check if title is non-empty
  if (!title) {
    taskTitleInput.classList.add("invalid");
    titleError.style.display = "block";
    showToast("Task title is required", "error");
    return;
  }

  clearValidationErrors();

  // Create task payload
  const newTaskPayload = {
    title,
    description,
    status,
  };

  await createTask(newTaskPayload);
});

// Clear input error on user typing
taskTitleInput.addEventListener("input", () => {
  if (taskTitleInput.value.trim()) {
    clearValidationErrors();
  }
});

// Reset button click
resetBtn.addEventListener("click", () => {
  addTaskForm.reset();
  clearValidationErrors();
});

// Filter & Search input handlers
searchInput.addEventListener("input", renderTasks);
statusFilter.addEventListener("change", renderTasks);
refreshBtn.addEventListener("click", () => {
  showToast("Refreshing task list...", "info");
  getTasks();
});
retryBtn.addEventListener("click", getTasks);

/* ==========================================================================
   4. MODALS & EDIT/DELETE DIALOGS
   ========================================================================== */

/**
 * Open Edit Modal populated with existing task data
 * @param {string|number} id
 */
function openEditModal(id) {
  const task = tasksState.find((t) => String(t.id) === String(id));
  if (!task) return;

  editTaskId.value = task.id;
  editTaskTitle.value = task.title;
  editTaskDescription.value = task.description || "";
  editTaskStatus.value = task.status;

  editModal.classList.remove("hidden");
}

function closeEditModal() {
  editModal.classList.add("hidden");
  editTaskForm.reset();
}

// Edit Form Submission
editTaskForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const id = editTaskId.value;
  const updatedData = {
    title: editTaskTitle.value.trim(),
    description: editTaskDescription.value.trim(),
    status: editTaskStatus.value,
  };

  if (!updatedData.title) {
    showToast("Title cannot be empty", "error");
    return;
  }

  closeEditModal();
  await updateTask(id, updatedData);
});

closeModalBtn.addEventListener("click", closeEditModal);
cancelModalBtn.addEventListener("click", closeEditModal);

/**
 * Open Delete Confirmation Dialog
 * @param {string|number} id
 * @param {string} title
 */
function promptDeleteTask(id, title) {
  pendingDeleteId = id;
  deleteTaskTitle.textContent = `"${title}"`;
  deleteModal.classList.remove("hidden");
}

function closeDeleteModal() {
  deleteModal.classList.add("hidden");
  pendingDeleteId = null;
}

cancelDeleteBtn.addEventListener("click", closeDeleteModal);

confirmDeleteBtn.addEventListener("click", async () => {
  if (pendingDeleteId !== null) {
    const idToDelete = pendingDeleteId;
    closeDeleteModal();
    await deleteTask(idToDelete);
  }
});

/* ==========================================================================
   5. UTILITY & HELPER FUNCTIONS
   ========================================================================== */

function getStatusClass(status) {
  switch (status) {
    case "completed":
      return "completed";
    case "in-progress":
      return "in-progress";
    default:
      return "pending";
  }
}

function getStatusLabel(status) {
  switch (status) {
    case "completed":
      return "Completed ✅";
    case "in-progress":
      return "In Progress 🚀";
    default:
      return "Pending ⏳";
  }
}

function getNextStatus(status) {
  switch (status) {
    case "pending":
      return "in-progress";
    case "in-progress":
      return "completed";
    case "completed":
      return "pending";
    default:
      return "pending";
  }
}

function getNextStatusLabel(status) {
  switch (status) {
    case "in-progress":
      return "In Progress";
    case "completed":
      return "Completed";
    default:
      return "Pending";
  }
}

function getNextStatusActionText(status) {
  switch (status) {
    case "pending":
      return "Start Task";
    case "in-progress":
      return "Complete";
    case "completed":
      return "Reopen";
    default:
      return "Update";
  }
}

function clearValidationErrors() {
  taskTitleInput.classList.remove("invalid");
  titleError.style.display = "none";
}

function showLoading(isLoading) {
  if (isLoading) {
    loadingState.classList.remove("hidden");
    taskListContainer.classList.add("hidden");
    emptyState.classList.add("hidden");
  } else {
    loadingState.classList.add("hidden");
    taskListContainer.classList.remove("hidden");
  }
}

function showError(message) {
  errorStateMsg.textContent = message;
  errorState.classList.remove("hidden");
  taskListContainer.classList.add("hidden");
  emptyState.classList.add("hidden");
}

function hideError() {
  errorState.classList.add("hidden");
}

function updateServerStatus(isConnected) {
  const indicator = serverStatusBadge.querySelector(".status-indicator");
  indicator.className =
    "status-indicator " + (isConnected ? "connected" : "disconnected");
  serverStatusText.textContent = isConnected
    ? "API Connected (v1)"
    : "API Offline";
}

function setButtonLoading(btn, isLoading, originalHTML) {
  if (isLoading) {
    btn.disabled = true;
    btn.innerHTML = `<span class="spinner" style="width:16px;height:16px;border-width:2px;"></span> ${originalHTML}`;
  } else {
    btn.disabled = false;
    btn.innerHTML = originalHTML;
  }
}

/**
 * Floating Toast Notification System
 */
function showToast(message, type = "info") {
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;

  let icon = "ℹ️";
  if (type === "success") icon = "✅";
  if (type === "error") icon = "⚠️";

  toast.innerHTML = `
    <span>${icon}</span>
    <span>${escapeHTML(message)}</span>
  `;

  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = "toastIn 0.3s ease-out reverse";
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

function escapeHTML(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function escapeQuotes(str) {
  if (!str) return "";
  return String(str).replace(/'/g, "\\'").replace(/"/g, "&quot;");
}

/* ==========================================================================
   6. INITIALIZATION
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  // Fetch tasks on page load as required
  getTasks();
});
