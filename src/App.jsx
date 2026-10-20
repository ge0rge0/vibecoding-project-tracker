import { useState, useEffect } from 'react';

/**
 * Vibecoding Project Tracker — starter scaffold.
 *
 * This file is intentionally almost empty. The boilerplate (Vite, React,
 * Tailwind) is configured for you, plus a few shared constants and a
 * localStorage helper. Everything visible on screen, you build.
 *
 * Where to start (build sequence in Phase 3):
 *   - M4  data-model    : render the four columns and the task cards below.
 *   - M5  crud-modal    : add the "+" button modal and the edit-on-click modal.
 *   - M6  tag-style     : feature vs. bug color coding (uses DESIGN.md §2 colors).
 *   - M7  task-owner    : assignee badge + "Hand off to..." dropdown.
 *   - M8  due-tint      : color cards by due date (uses DESIGN.md §2 due-state colors).
 *   - M9  context       : a curated Context briefing field on the modal.
 *   - M10 copy-prompt   : a "Copy as Prompt Context" button that serializes the task + context.
 *   - M11 anchors       : the Anchor Board above the Kanban.
 *   - M12 secret-sauce  : the one open-ended thing that makes your tracker yours.
 *
 * Search the file for `TODO M<n>` to find the right hook for each milestone.
 */

/**
 * @typedef {Object} Task
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {'feature'|'bug'} type
 * @property {'todo'|'in-progress'|'review'|'done'} status
 * @property {string} assignee
 * @property {string|null} dueDate     ISO 'YYYY-MM-DD'
 * @property {string} createdDate      ISO 'YYYY-MM-DD'
 */

// The four columns of the board, in render order.
// Use these IDs everywhere — do not invent new ones.
export const STAGES = [
  { id: 'todo',        label: 'To Do' },
  { id: 'in-progress', label: 'In Progress' },
  { id: 'review',      label: 'Review' },
  { id: 'done',        label: 'Done' },
];

// Replace these placeholders with the three names from PRD §8 before M4.
// They become the only valid values for `Task.assignee`.
export const TEAM = ['Teammate A', 'Teammate B', 'Teammate C'];

const SEED_TASKS = [
  {
    id: 'task-1',
    title: 'Define the first-time user flow',
    description: 'Map the steps from creating a project to recording a useful prompt.',
    type: 'feature',
    status: 'todo',
    assignee: TEAM[0],
    dueDate: '2026-10-24',
    createdDate: '2026-10-20',
  },
  {
    id: 'task-2',
    title: 'Build the Kanban board layout',
    description: 'Create the four board columns and display tasks in their matching status.',
    type: 'feature',
    status: 'in-progress',
    assignee: TEAM[1],
    dueDate: '2026-10-22',
    createdDate: '2026-10-20',
  },
  {
    id: 'task-3',
    title: 'Check empty-column behaviour',
    description: 'Make sure a column remains clear and understandable when it contains no tasks.',
    type: 'bug',
    status: 'review',
    assignee: TEAM[2],
    dueDate: '2026-10-23',
    createdDate: '2026-10-20',
  },
  {
    id: 'task-4',
    title: 'Prepare the prompt context template',
    description: 'Draft the structure that will later be used for prompt and AI-result notes.',
    type: 'feature',
    status: 'done',
    assignee: TEAM[0],
    dueDate: null,
    createdDate: '2026-10-19',
  },
];

/**
 * A tiny localStorage hook — survives reloads, no library needed.
 *
 * Usage:
 *   const [tasks, setTasks] = useLocalStorage('vibetracker.tasks', []);
 */
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const raw = window.localStorage.getItem(key);
      return raw != null ? JSON.parse(raw) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* quota or private-mode error — silently ignore for hackathon */
    }
  }, [key, value]);

  return [value, setValue];
}

const EMPTY_TASK = {
  title: '',
  description: '',
  type: 'feature',
  status: 'todo',
  assignee: TEAM[0],
  dueDate: '',
};

function getDueState(task) {
  if (task.status === 'done') return 'neutral';
  if (!task.dueDate) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(`${task.dueDate}T00:00:00`);
  const daysUntilDue = Math.ceil((due - today) / (1000 * 60 * 60 * 24));

  if (daysUntilDue < 0) return 'overdue';
  if (daysUntilDue <= 2) return 'warning';
  return 'safe';
}

const DUE_STYLES = {
  safe: 'bg-due-safe text-emerald-900',
  warning: 'bg-due-warning text-amber-900',
  overdue: 'bg-due-overdue text-red-900',
  neutral: 'bg-due-neutral text-slate-600',
};

const DUE_LABELS = {
  safe: 'On track',
  warning: 'Due soon',
  overdue: 'Overdue',
  neutral: 'Complete',
};

export default function App() {
  const [tasks, setTasks] = useLocalStorage('vibetracker.tasks', SEED_TASKS);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_TASK);
  const [handoffMessage, setHandoffMessage] = useState('');
  //
  // TODO M5 crud-modal:
  //   const [editing, setEditing] = useState(null);
  //
  // TODO M11 anchors:
  //   const [anchors, setAnchors] = useLocalStorage('vibetracker.anchors', [...]);

  function openNewTask() {
    setEditing('new');
    setForm({ ...EMPTY_TASK });
  }

  function openTask(task) {
    setEditing(task.id);
    setForm({
      title: task.title,
      description: task.description,
      type: task.type,
      status: task.status,
      assignee: task.assignee,
      dueDate: task.dueDate ?? '',
    });
  }

  function closeModal() {
    setEditing(null);
    setForm({ ...EMPTY_TASK });
  }

  function updateForm(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function saveTask(event) {
    event.preventDefault();
    if (!form.title.trim()) return;

    if (editing === 'new') {
      setTasks((current) => [
        ...current,
        {
          ...form,
          id: `task-${Date.now()}`,
          title: form.title.trim(),
          dueDate: form.dueDate || null,
          createdDate: new Date().toISOString().slice(0, 10),
        },
      ]);
    } else {
      setTasks((current) =>
        current.map((task) =>
          task.id === editing
            ? { ...task, ...form, title: form.title.trim(), dueDate: form.dueDate || null }
            : task,
        ),
      );
    }

    closeModal();
  }

  function deleteTask() {
    if (editing === 'new') return;
    if (!window.confirm('Delete this task? This cannot be undone.')) return;
    setTasks((current) => current.filter((task) => task.id !== editing));
    closeModal();
  }

  function handoffTask(taskId, assignee) {
    setTasks((current) =>
      current.map((task) => (task.id === taskId ? { ...task, assignee } : task)),
    );
    setHandoffMessage(`Task handed off to ${assignee}.`);
    window.setTimeout(() => setHandoffMessage(''), 2500);
  }

  return (
    <div className="min-h-screen p-6">
      <header className="mb-6 flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            VibeFlow
          </h1>
          <p className="text-sm text-slate-500">
            {/* Replace this line with your team name from PRD §11. */}
            Vibecoding project workspace
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right text-xs text-slate-500">
            <p className="font-mono uppercase tracking-wide">M5 crud modal</p>
            <p>{tasks.length} tasks tracked</p>
          </div>
          <button
            type="button"
            onClick={openNewTask}
            className="rounded-md bg-brand-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-accent focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2"
          >
            + Add task
          </button>
        </div>
      </header>

      {/* TODO M11 anchors: render the Anchor Board (Presentation / Demo / Report / Documentation) above the board. */}

      <main className="grid gap-4 lg:grid-cols-4">
        {STAGES.map((stage) => {
          const stageTasks = tasks.filter((task) => task.status === stage.id);

          return (
            <section
              key={stage.id}
              className="min-h-[28rem] rounded-xl border border-slate-200 bg-surface-page p-3"
              aria-labelledby={`${stage.id}-heading`}
            >
              <div className="mb-3 flex items-center justify-between px-1">
                <h2
                  id={`${stage.id}-heading`}
                  className="text-sm font-semibold uppercase tracking-wide text-slate-700"
                >
                  {stage.label}
                </h2>
                <span className="rounded-full bg-white px-2 py-1 text-xs font-medium text-slate-500">
                  {stageTasks.length}
                </span>
              </div>

              <div className="space-y-3">
                {stageTasks.length > 0 ? (
                  stageTasks.map((task) => (
                    (() => {
                      const dueState = getDueState(task);

                      return (
                        <article
                          key={task.id}
                          onClick={() => openTask(task)}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(event) => {
                            if (event.key === 'Enter' || event.key === ' ') openTask(task);
                          }}
                          className={`rounded-lg border border-slate-200 border-l-4 bg-surface-card p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
                            task.type === 'bug' ? 'border-l-type-bug' : 'border-l-type-feature'
                          }`}
                        >
                          <div className="mb-3 flex items-start justify-between gap-3">
                            <h3 className="text-sm font-semibold leading-5 text-text-primary">
                              {task.title}
                            </h3>
                            <span
                              className={`flex shrink-0 items-center gap-1 rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-wide ${
                                task.type === 'bug'
                                  ? 'bg-red-50 text-type-bug'
                                  : 'bg-emerald-50 text-type-feature'
                              }`}
                            >
                              <span aria-hidden="true">{task.type === 'bug' ? '⚠' : '✦'}</span>
                              <span>{task.type}</span>
                            </span>
                          </div>
                          <p className="mb-4 text-xs leading-5 text-text-muted">
                            {task.description}
                          </p>
                          <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-text-muted">
                            <label className="flex items-center gap-1.5" onClick={(event) => event.stopPropagation()}>
                              <span className="sr-only">Hand off {task.title} to</span>
                              <span aria-hidden="true">Owner</span>
                              <select
                                value={task.assignee}
                                onChange={(event) => handoffTask(task.id, event.target.value)}
                                onClick={(event) => event.stopPropagation()}
                                className="max-w-[7rem] rounded border border-slate-200 bg-white px-1.5 py-1 text-xs font-medium text-slate-700 outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-accent/30"
                              >
                                {TEAM.map((member) => <option key={member} value={member}>{member}</option>)}
                              </select>
                            </label>
                            {dueState ? (
                              <span className={`rounded-full px-2 py-1 font-medium ${DUE_STYLES[dueState]}`}>
                                {task.dueDate ? `Due ${task.dueDate}` : DUE_LABELS[dueState]}
                              </span>
                            ) : (
                              <span>No due date</span>
                            )}
                          </div>
                        </article>
                      );
                    })()
                  ))
                ) : (
                  <div className="rounded-lg border border-dashed border-slate-300 px-4 py-8 text-center text-xs text-text-muted">
                    No tasks here yet.
                  </div>
                )}
              </div>
            </section>
          );
        })}
      </main>

      {handoffMessage && (
        <div
          className="fixed bottom-5 left-1/2 z-20 -translate-x-1/2 rounded-md bg-slate-900 px-4 py-3 text-sm font-medium text-white shadow-lg"
          role="status"
        >
          {handoffMessage}
        </div>
      )}

      {editing !== null && (
        <div
          className="fixed inset-0 z-10 flex items-center justify-center bg-slate-900/50 p-4"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeModal();
          }}
        >
          <form
            onSubmit={saveTask}
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6 shadow-xl"
            aria-labelledby="task-modal-title"
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="font-mono text-xs uppercase tracking-wide text-brand-primary">Task editor</p>
                <h2 id="task-modal-title" className="mt-1 text-xl font-semibold text-text-primary">
                  {editing === 'new' ? 'Add a task' : 'Edit task'}
                </h2>
              </div>
              <button type="button" onClick={closeModal} className="text-2xl leading-none text-slate-400 hover:text-slate-700" aria-label="Close task editor">
                ×
              </button>
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-medium text-slate-700">
                Title
                <input name="title" value={form.title} onChange={updateForm} required autoFocus className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-accent/30" />
              </label>

              <label className="block text-sm font-medium text-slate-700">
                Description
                <textarea name="description" value={form.description} onChange={updateForm} rows="3" className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-accent/30" />
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm font-medium text-slate-700">
                  Type
                  <select name="type" value={form.type} onChange={updateForm} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm">
                    <option value="feature">Feature</option>
                    <option value="bug">Bug</option>
                  </select>
                </label>

                <label className="block text-sm font-medium text-slate-700">
                  Status
                  <select name="status" value={form.status} onChange={updateForm} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm">
                    {STAGES.map((stage) => <option key={stage.id} value={stage.id}>{stage.label}</option>)}
                  </select>
                </label>

                <label className="block text-sm font-medium text-slate-700">
                  Assignee
                  <select name="assignee" value={form.assignee} onChange={updateForm} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm">
                    {TEAM.map((member) => <option key={member} value={member}>{member}</option>)}
                  </select>
                </label>

                <label className="block text-sm font-medium text-slate-700">
                  Due date
                  <input type="date" name="dueDate" value={form.dueDate} onChange={updateForm} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
                </label>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
              {editing !== 'new' ? (
                <button type="button" onClick={deleteTask} className="text-sm font-medium text-type-bug hover:underline">Delete task</button>
              ) : <span />}
              <div className="flex gap-3">
                <button type="button" onClick={closeModal} className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">Cancel</button>
                <button type="submit" className="rounded-md bg-brand-primary px-4 py-2 text-sm font-semibold text-white hover:bg-brand-accent">Save task</button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
