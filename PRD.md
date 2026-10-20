# Vibecoding Project Tracker — PRD

**Status:** Team-specific PRD completed for the hackathon prototype.

---

## 1. Problem

Vibecoding teams have two recurring pains with large projects:

1. **They lose track of tasks.** Three teammates, a hundred small things, no shared view. Nothing tells them what state each task is actually in.
2. **They lose track of prompts.** The AI gave them working code two days ago but no one remembers the prompt that produced it. When they need to iterate, they start from scratch.

A spreadsheet doesn't solve this. A real project tool (Linear, Jira, Notion) is overkill, doesn't know about prompts, and takes hours to set up.

## 2. Target users

- **Primary:** the team members, for the remaining weeks of the summer semester.
- **Secondary:** future cohorts of vibecoders taking the same class.

We are designing the tool we ourselves will use. The pitch demo is also our first real user test.

## 3. Product overview

A single-page web app with two persistent surfaces:

- A **Kanban board** where vibecoding tasks move through four states.
- An **Anchor Board** above it that pins the four final-project deliverables (Presentation, Demo, Report, Documentation).

Each task carries the prompt context that produced it, so any teammate can click a button and copy the task + prompt history back into an AI chat to continue work.

## 4. Primary user flow

1. Open the Webapp. The board loads from local storage.
2. Click "+" to add a task. Fill in title, type, assignee, due date, prompt context.
3. Move the task across columns as you work.
4. When stuck, click "Copy as Prompt Context" on a task and paste it into Claude/ChatGPT/Cursor to continue.
5. Hand off a task to a teammate with one dropdown.
6. Drop final deliverable links into the Anchor Board as you produce them.

## 5. Data model

Locked. Do not change without team agreement.

```js
// A single vibecoding task.
Task = {
  id: string,                    // uuid or timestamp string
  title: string,
  description: string,
  type: 'feature' | 'bug',       // visual color coding
  status: 'todo' | 'in-progress' | 'review' | 'done',
  assignee: string,              // one of the three teammate names from §8
  dueDate: string | null,        // ISO date 'YYYY-MM-DD'
  createdDate: string,           // ISO date 'YYYY-MM-DD'

  // Added in later milestones:
  context: string,               // M9 context — curated briefing for the next AI / teammate
  contextTool: string | null,    // M9 context — 'Claude' | 'ChatGPT' | 'Cursor' | 'Lovable' | 'Replit' | 'Other'
  contextUpdatedAt: string|null, // M9 context — ISO timestamp set automatically on save
}

// One of four pinned deliverable slots.
Anchor = {
  id: 'presentation' | 'demo' | 'report' | 'documentation',
  label: string,                 // human-readable
  url: string | null,            // the link the team pastes in
}
```

## 6. Tech stack

| Layer | Choice | Why |
|---|---|---|
| Framework | React (via Vite) | What the scaffold ships with. Don't migrate. |
| Styling | Tailwind | Already configured. Use utility classes; no separate CSS files. |
| State | React `useState` + a `useLocalStorage` hook | Simple, no library needed. |
| Persistence | **localStorage** | Zero infra. Pick this. Do not switch to a backend mid-hackathon. |
| Deploy | Vercel | One-click deploy from GitHub. |

> **Decision:** localStorage, not a shared backend. If you want a shared backend later, that's M14 — out of scope for the hackathon.

## 7. Stage names

Four columns, in this order, with these exact labels in the UI:

1. **To Do**
2. **In Progress**
3. **Review**
4. **Done**

## 8. Team

Fill these in before tagging `prd-done`:

| Slot | Name | GitHub handle |
|---|---|---|
| Teammate A | George Ward | `ge0rge0` |
| Teammate B | Alex Morgan | `alex-morgan-demo` |
| Teammate C | Jamie Patel | `jamie-patel-demo` |

These three names become the **only** allowed values for `Task.assignee`. No auth — just a dropdown.

## 9. Milestone ownership

Fill in the owner column. Recommended default in **bold**; change if your team has different strengths.

| # | Tag | Title | Suggested owner | Final owner |
|---|---|---|---|---|
| 3 | `design-done` | Design system + voice (DESIGN.md) | **B** | B |
| 4 | `data-model` | Task model + board view | **A** | A |
| 5 | `crud-modal` | Add / edit / delete modal | **A** | A |
| 6 | `tag-style` | Feature / bug colors | **B** | B |
| 7 | `task-owner` | Owner indicator + handoff | **A** | A |
| 8 | `due-tint` | Due-date color tinting | **B** | B |
| 9 | `context` | Context field on the task modal | **C** | C |
| 10 | `copy-prompt` | "Copy as Prompt Context" button | **C** | C |
| 11 | `anchors` | Deliverable Anchor Board | **B** | B |
| 12 | `secret-sauce` | The one thing that makes it yours | **C / All** | C / All |
| 13 | `pitch-ready` | Demo + pitch rehearsal | **All** | All |


Track A owns the state model and task ownership. Track B owns the visuals (and design — M3 runs parallel to M2 so the team starts Phase 3 with the palette already chosen). Track C owns the differentiator features (M9 + M10 — the context field and the Copy-as-Prompt button) and usually leads on M12 secret-sauce. Put your strongest prompter on Track C.

**Dependency note.** M3 (`design-done`) runs **in parallel with M2** — Person B drafts DESIGN.md and pastes the colors into `tailwind.config.js` while the rest of the team reviews the PRD. M6 / M7 / M8 / M11 all depend on M4 + M5 being done first. While Person A builds M4+M5 (first ~60 min of Phase 3), Person C should draft the Markdown template for the "Copy as Prompt Context" output (M10). M12 `secret-sauce` is open-ended — pick whatever makes the tracker uniquely yours; constraint is "must be visible in the demo and must not break anything else."

## 10. AI / vibe coding angle

Where AI will be heavily used:
- M4, M5: scaffold the board and the modal from a single prompt each.
- M9, M10: write the Markdown serialization helper for the Context field.
- M7: animation polish for the handoff toast.

Where AI will **not** save you time:
- M2 (this PRD review) — read it yourself.
- M3 (DESIGN.md) — design taste is yours, not the model's.
- M12 (secret-sauce) — the whole point is that AI can't predict it.
- M13 (pitch) — write the script in your own voice.

Keep the Context field of each real task up to date as you work. By the end of the hackathon you should have a handful of curated context blocks — those become part of your Module 5 "Vibe Coding History" deliverable.

## 11. Team identity

Fill in:

- **Team name:** `VibeFlow`
- **Tagline (one sentence):** `Keep every task and prompt moving forward.`
- **Tracker URL after deploy:** `https://vibecoding-project-tracker-snowy.vercel.app/`

## 12. Out of scope (do not build)

- Authentication / accounts.
- Real GitHub integration.
- A real backend / shared database.
- Mobile responsive — desktop only is fine.
- Multi-team support.
- Real-time collaboration.

## 13. Definition of done

The hackathon is "done" when all 13 milestone tags are pushed to your repo and visible on the dashboard. The pitch is "done" when:

- The board loads on Vercel without errors.
- The "Copy as Prompt Context" demo works on stage.
- 5 min pitch is rehearsed.

## 14. Functional requirements

| ID | Requirement | MVP | Related milestone |
|---|---|---|---|
| FR01 | The user shall be able to view tasks organised into To Do, In Progress, Review, and Done columns. | Yes | M4 |
| FR02 | The user shall be able to create a task with a title, description, type, status, assignee, and due date. | Yes | M5 |
| FR03 | The user shall be able to edit the details of an existing task. | Yes | M5 |
| FR04 | The user shall be able to delete an existing task after confirming the action. | Yes | M5 |
| FR05 | The system shall save task changes to local storage and restore them when the application reloads. | Yes | M4/M5 |
| FR06 | The user shall be able to identify whether a task is a feature or a bug. | Yes | M6 |
| FR07 | The user shall be able to assign a task to one of the project team members. | Yes | M7 |
| FR08 | The user shall be able to hand a task over to another team member. | Yes | M7 |
| FR09 | The system shall show a visual due-date state for safe, upcoming, overdue, and completed tasks. | Yes | M8 |
| FR10 | The user shall be able to record prompt context and the AI tool used for a task. | Yes | M9 |
| FR11 | The user shall be able to copy a formatted task and prompt-context summary to the clipboard. | Yes | M10 |
| FR12 | The user shall be able to add and update links for the Presentation, Demo, Report, and Documentation deliverables. | Yes | M11 |
| FR13 | The user shall be able to use one additional project-specific interaction that differentiates VibeFlow from a standard Kanban board. | No | M12 |

## 15. Non-functional requirements

| ID | Requirement | MVP | Rationale |
|---|---|---|---|
| NFR01 | The interface shall use consistent labels, colours, spacing, and interaction patterns across all screens. | Yes | Consistency helps users understand the board quickly. |
| NFR02 | A new user shall be able to understand the main purpose of the board without formal training. | Yes | The tool is intended for quick use during active development. |
| NFR03 | The application shall provide visible feedback after important actions such as saving, deleting, copying, or handing off a task. | Yes | Feedback confirms that the user's action succeeded. |
| NFR04 | The application shall remain usable on a standard desktop or laptop screen. | Yes | Desktop use is the defined scope of the hackathon. |
| NFR05 | Text and controls shall have sufficient contrast and readable sizing. | Yes | This supports clear reading and basic accessibility. |
| NFR06 | The application shall load the saved board without requiring authentication or a backend account. | Yes | The hackathon uses local storage and excludes authentication. |
| NFR07 | Common actions shall require a small number of steps and shall use familiar controls such as buttons, forms, and dropdowns. | Yes | This reduces friction while developers are working quickly. |
| NFR08 | The application shall not lose saved task data when the user refreshes the browser during normal use. | Yes | Persistence is essential to the tracker workflow. |
| NFR09 | The application shall avoid unnecessary animation, decoration, and visual clutter. | Yes | A focused interface keeps attention on project work. |
| NFR10 | The application shall remain responsive during normal use with the expected hackathon dataset. | No | The prototype should feel immediate without requiring a complex backend. |

---

*PRD version: hackathon-starter v1 · maintained by Prof. Dr. Ignacio Alvarez*

