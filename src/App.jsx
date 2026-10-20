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

export default function App() {
  const [tasks] = useLocalStorage('vibetracker.tasks', SEED_TASKS);
  //
  // TODO M5 crud-modal:
  //   const [editing, setEditing] = useState(null);
  //
  // TODO M11 anchors:
  //   const [anchors, setAnchors] = useLocalStorage('vibetracker.anchors', [...]);

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
        <div className="text-right text-xs text-slate-500">
          <p className="font-mono uppercase tracking-wide">M4 data model</p>
          <p>{tasks.length} tasks tracked</p>
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
                    <article
                      key={task.id}
                      className="rounded-lg border border-slate-200 bg-surface-card p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                    >
                      <div className="mb-3 flex items-start justify-between gap-3">
                        <h3 className="text-sm font-semibold leading-5 text-text-primary">
                          {task.title}
                        </h3>
                        <span
                          className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-wide ${
                            task.type === 'bug'
                              ? 'bg-red-50 text-type-bug'
                              : 'bg-emerald-50 text-type-feature'
                          }`}
                        >
                          {task.type}
                        </span>
                      </div>
                      <p className="mb-4 text-xs leading-5 text-text-muted">
                        {task.description}
                      </p>
                      <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-text-muted">
                        <span>{task.assignee}</span>
                        <span>{task.dueDate ? `Due ${task.dueDate}` : 'No due date'}</span>
                      </div>
                    </article>
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
    </div>
  );
}
