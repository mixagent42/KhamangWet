---
name: implement-task
description: Run one Khamang Wet backlog task end to end, for example /implement-task M0-T08, following prompts/02, the Definition of Done and the per-task branch workflow.
disable-model-invocation: true
argument-hint: <task-id>
---
Implement backlog task $ARGUMENTS for Khamang Wet.

1. Read the task block for $ARGUMENTS in `docs/IMPLEMENTATION_BACKLOG.md`, then `prompts/02_IMPLEMENT_FEATURE.md` and `docs/DEFINITION_OF_DONE.md` §3, §4 and §8. Stop and ask if a decision the task needs is not Accepted in `docs/DECISIONS.md`, or a dependency task is not Done.
2. Run `git status`: the tree must be clean and on `main`. Create the branch `m<N>/t<NN>-<slug>` for this task.
3. State the plan, the files that will change and the acceptance criteria. Wait for approval before installing software, adding dependencies, deleting files or editing original design docs.
4. Implement in small steps, only within the task's scope.
5. Run the checks listed under Commands in `CLAUDE.md` and record their real output. Never report a check that did not run as passing.
6. Review the diff (the `reviewer` subagent can help), then show it to the developer before committing.
7. After approval: commit on the branch, record evidence in `docs/IMPLEMENTATION_STATUS.md`, mark the task in the backlog, squash-merge into `main`, confirm the content of `main` matches the branch, and delete the branch.
8. Report with the template in `docs/DEFINITION_OF_DONE.md` §8.
