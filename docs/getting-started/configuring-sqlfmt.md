---
sidebar_position: 2
---

# Configuring sqlfmt

:::tip
You probably don't need to configure sqlfmt at all! sqlfmt supports nearly all SQL dialects without configuration, and doesn't require a jinja templater.
:::

## Configuring Style

sqlfmt's style is not configurable, except for the line length (the default is 88). To set the line length, use the `-l` or `--line-length` option. For example, to run sqlfmt with a line length of 99:

```bash
sqlfmt -l 99 .
```

## Configuring Operations

sqlfmt's operation, however, is highly configurable using options at the command line. For a full list of options, see below, or type: 

```bash
sqlfmt --help
```

## Using Environment Variables

Any CLI option can be configured using environment variables. Variable names are prefixed by `SQLFMT` and are the `SHOUTING_CASE` spelling of the options. For example, `sqlfmt . --line-length 100` is equivalent to `SQLFMT_LINE_LENGTH=100 sqlfmt .` Boolean flags can be set to any truthy value.

## Using a `pyproject.toml` File

Any command-line option for sqlfmt can also be set in a `pyproject.toml` file, under a `[tool.sqlfmt]` section header. Options passed at the command line will override the settings in the config file.

sqlfmt will search for the `pyproject.toml` file using the `files` passed to it as arguments. It starts in the lowest (most specific) common parent directory to all the `files` and recurses up to the root directory. It will load settings from the first `pyproject.toml` file it finds in this search.

Example of a `pyproject.toml` file to run sqlfmt in `check` mode with a line length of 99:

```toml title=pyproject.toml
[tool.sqlfmt]
line_length = 99
check = true
```

:::tip
String literals in TOML files must be quoted!
:::

## Configuration Reference

| CLI Option                               | Environment Variable                 | Config File                     | Description                                                                                                                                                                                                                                                                       |
|------------------------------------------|--------------------------------------|---------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `--help`                                 | ❌                                  | ❌                              | Show the help message and exit                                                                                                                                                                                                                                                    |
| `--version`                              | ❌                                  | ❌                              | Show the version and exit.                                                                                                                                                                                                                                                        |
| `--check`                                | `SQLFMT_CHECK=1`                     | `check=true`                    | Fail with an exit code of 1 if source files are not formatted to spec. Do not write  formatted queries to files.                                                                                                                                                                  |
| `--diff`                                 | `SQLFMT_DIFF=1`                      | `diff=true`                     | Print a diff of any formatting changes to  stdout. Fails like `--check` on any changes.  Do not write formatted queries to files.                                                                                                                                                   |
| `--exclude ./my_dir/**/*.sql `           | `SQLFMT_EXCLUDE="./my_dir/**/*.sql"` | `exclude=["./my_dir/**/*.sql"]` | A string that is passed to glob.glob as a pathname; any matching files returned by glob will be excluded from FILES and not formatted. Note that glob is relative to the current working directory when sqlfmt is called. To exclude multiple globs, repeat the `--exclude` option. The TOML file takes a list of strings. |
| `--single-process `                      | `SQLFMT_SINGLE_PROCESS=1`            | `single_process=true`           | Run sqlfmt in a single process, even when formatting multiple files. If not set, defaults to multiprocessing using as many cores as possible. Also disables the progress bar. Will slow down runs.                                                                                |
| `-k`, `--reset-cache`                    | `SQLFMT_RESET_CACHE=1`               | `reset_cache=true`              | Clear the sqlfmt cache before running, effectively forcing sqlfmt to operate on every file. Will slow down runs.                                                                                                                                                                  |
| `--no-jinjafmt`                          | `SQLFMT_NO_JINJAFMT=1`               | `no_jinjafmt=true`              | Do not format jinja tags (the code between the curlies). Only necessary to specify this flag if sqlfmt was installed with the jinjafmt extra, or if black was already available in this environment.                                                                              |
| `-l 99`, `--line-length 99`              | `SQLFMT_LINE_LENGTH=99`              | `line_length=99`                | The maximum line length allowed in output files. Default is 88.                                                                                                                                                                                                                   |
| `-v`, `--verbose`                        | `SQLFMT_VERBOSE=1`                   | `verbose=true`                  | Prints more information to stderr.                                                                                                                                                                                                                                                |
| `-q`, `--quiet`                          | `SQLFMT_QUIET=1`                     | `quiet=true`                    | Prints much less information to stderr.                                                                                                                                                                                                                                           |
| `--no-progressbar`                       | `SQLFMT_NO_PROGRESSBAR=1`            | `no_progressbar=true`           | Never prints a progressbar to stderr.                                                                                                                                                                                                                                             |
| `--no-color`                             | `NO_COLOR=1`, `SQLFMT_NO_COLOR=1`    | `no_color=true`                 | Removes color codes from all output, including diffs. See https://no-color.org/ for more details.                                                                                                                                                                                 |
| `--force-color`                          | `SQLFMT_FORCE_COLOR=1`               | `force_color=true`              | sqlfmt output is colorized by default. However, if you have the `NO_COLOR` env var set, and still want sqlfmt to colorize output, you can use `--force-color` to override the no-color option.                                                                                                |
| `-d clickhouse`, `--dialect clickhouse`  | `SQLFMT_DIALECT=clickhouse`          | `dialect="clickhouse"`          | The SQL dialect for the target files. Nearly all dialects are supported by the default polyglot dialect. Select the ClickHouse dialect to respect case sensitivity in function, field, and alias names.                                                                           |