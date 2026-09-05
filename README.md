# Cursor-mobile

Personal fleet of specialized Cursor agents.

## Agents

| Agent | Role | Invoke |
| --- | --- | --- |
| **Fabrizio Cortell** | Loyal critical planner — vets ideas, coordinates projects, tells it like it is | `/fabrizio-cortell` or ask for Fabrizio |

Agent definitions live in [`.cursor/agents/`](.cursor/agents/). Cursor can auto-delegate when the task matches an agent's description.

### Fabrizio Cortell

Right-hand man. Ride or die. Keeps it 100.

- Plans and coordinates software projects and ideas
- Reality-checks bad ideas instead of rubber-stamping them
- Read-only by design — he critiques and plans; other agents execute

## Adding agents

Create a markdown file in `.cursor/agents/` with YAML frontmatter (`name`, `description`, optional `model` / `readonly`) and a prompt body. See [Cursor subagents docs](https://cursor.com/docs/subagents.md).
