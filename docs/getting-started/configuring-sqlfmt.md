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

sqlfmt's operation, however, is highly configurable using options at the command line. For a full list of options, see [below](#configuration-reference), or type: 

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

## Configuration Precedence

If conflicting config is given to sqlfmt, config will be resolved in the following order:

1. An explicit option passed at invocation (e.g., `--line-length 99`)
2. A set environment variable (e.g., `LINE_LENGTH=90`)
3. A value from the `pyproject.toml` file (e.g., `line_length=85`)
4. The default behavior (e.g., 88 characters)

### No-color and Force-color

sqlfmt output is colorized by default, by adding ANSI color codes to the terminal output.

sqlfmt supports the standard from [no-color.org](https://no-color.org), and will not 
colorize output if the `NO_COLOR` environment variable is set. We achieve this by
implementing a "no-color" option, which can also be set via the sqlfmt-specific environment
variable, `SQLFMT_NO_COLOR`, the CLI option `--no-color`, or by setting `no_color=true`
in the `pyproject.toml` file.

If you have `NO_COLOR` set (for other programs) and want sqlfmt to colorize output, you can
use the force-color option, via `--force-color`, `SQLFMT_FORCE_COLOR`, or `force_color=true`
in your `pyproject.toml` file.

If the force-color option is set, sqlfmt will colorize output, no matter how no-color and 
force-color are set. For example, if `force_color=true` is set in the config file, but
sqlfmt is run with the `--no-color` option, it **will** colorize output. 

## Configuration Reference

| CLI Option                               | Environment Variable                 | Config File                     | Description                                                                                                                                                                                                                                                                                                                |
|------------------------------------------|--------------------------------------|---------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `--help`                                 | ❌                                  | ❌                              | Show the help message and exit                                                                                                                                                                                                                                                                                             |
| `--version`                              | ❌                                  | ❌                              | Show the version and exit.                                                                                                                                                                                                                                                                                                 |
| `--check`                                | `SQLFMT_CHECK=1`                     | `check=true`                    | Fail with an exit code of 1 if source files are not formatted to spec. Do not write  formatted queries to files.                                                                                                                                                                                                           |
| `--diff`                                 | `SQLFMT_DIFF=1`                      | `diff=true`                     | Print a diff of any formatting changes to  stdout. Fails like `--check` on any changes.  Do not write formatted queries to files.                                                                                                                                                                                          |
| `-l 99`, `--line-length 99`              | `SQLFMT_LINE_LENGTH=99`              | `line_length=99`                | The maximum line length allowed in output files. Default is 88.                                                                                                                                                                                                                                                            |
| `--exclude ./my_dir/**/*.sql`            | `SQLFMT_EXCLUDE="./my_dir/**/*.sql"` | `exclude=["./my_dir/**/*.sql"]` | A string that is passed to glob.glob as a pathname; any matching files returned by glob will be excluded from FILES and not formatted. Note that glob is relative to the current working directory when sqlfmt is called. To exclude multiple globs, repeat the `--exclude` option. The TOML file takes a list of strings. |
| `-d clickhouse`, `--dialect clickhouse`  | `SQLFMT_DIALECT=clickhouse`          | `dialect="clickhouse"`          | The SQL dialect for the target files. Nearly all dialects are supported by the default polyglot dialect. Select the ClickHouse dialect to respect case sensitivity in function, field, and alias names.                                                                                                                    |
| `--no-jinjafmt`                          | `SQLFMT_NO_JINJAFMT=1`               | `no_jinjafmt=true`              | Do not format jinja tags (the code between the curlies). Only necessary to specify this flag if sqlfmt was installed with the jinjafmt extra, or if black was already available in this environment.                                                                                                                       |
| `-k`, `--reset-cache`                    | `SQLFMT_RESET_CACHE=1`               | `reset_cache=true`              | Clear the sqlfmt cache before running, effectively forcing sqlfmt to operate on every file. Will slow down runs.                                                                                                                                                                                                           |
| `-v`, `--verbose`                        | `SQLFMT_VERBOSE=1`                   | `verbose=true`                  | Prints more information to stderr.                                                                                                                                                                                                                                                                                         |
| `-q`, `--quiet`                          | `SQLFMT_QUIET=1`                     | `quiet=true`                    | Prints much less information to stderr.                                                                                                                                                                                                                                                                                    |
| `--no-color`                             | `NO_COLOR=1`, `SQLFMT_NO_COLOR=1`    | `no_color=true`                 | Removes color codes from all output, including diffs. See https://no-color.org/ for more details.                                                                                                                                                                                                                          |
| `--force-color`                          | `SQLFMT_FORCE_COLOR=1`               | `force_color=true`              | sqlfmt output is colorized by default. However, if you have the `NO_COLOR` env var set, and still want sqlfmt to colorize output, you can use `--force-color` to override the no-color option.                                                                                                                             |
| `--no-progressbar`                       | `SQLFMT_NO_PROGRESSBAR=1`            | `no_progressbar=true`           | Never prints a progressbar to stderr.                                                                                                                                                                                                                                                                                      |
| `--single-process`                       | `SQLFMT_SINGLE_PROCESS=1`            | `single_process=true`           | Run sqlfmt in a single process, even when formatting multiple files. If not set, defaults to multiprocessing using as many cores as possible. Also disables the progress bar. Will slow down runs.                                                                                                                         |
