---
sidebar_position: 2
---

# Configuring sqlfmt

:::tip
You probably don't need to configure sqlfmt at all! sqlfmt supports nearly all SQL dialects without configuration, and doesn't require a jinja templater.
:::

sqlfmt's style is not configurable, except for the line length (the default is 88). To set the line length, use the `-l` or `--line-length` option. For example, to run sqlfmt with a line length of 99:

```bash
sqlfmt -l 99 .
```

sqlfmt's operation, however, is highly configurable using options at the command line. For a full list of options, type: 
```bash
sqlfmt --help
```

## Using a `pyproject.toml` File

Any command-line option for sqlfmt can also be set in a `pyproject.toml` file, under a `[tool.sqlfmt]` section header. Options passed at the command line will override the settings in the config file.

sqlfmt will search for the `pyproject.toml` file using the `files` passed to it as arguments. It starts in the lowest (most specific) common parent directory to all the `files` and recurses up to the root directory. It will load settings from the first `pyproject.toml` file it finds in this search.

Example of a `pyproject.toml` file to run sqlfmt in `check` mode with a line length of 99:

```toml title=pyproject.toml
[tool.sqlfmt]
line_length = 99
check = true
```