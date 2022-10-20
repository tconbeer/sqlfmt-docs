---
sidebar_position: 0
slug: /
---

# Introduction to sqlfmt

sqlfmt formats your dbt SQL files so you don't have to. It is similar in nature to black, gofmt, and rustfmt (but for SQL).

1. **sqlfmt promotes collaboration.** An auto-formatter makes it easier to collaborate with your team and solicit contributions from new people. You will never have to mention (or argue about) code style in code reviews again.
1. **sqlfmt is fast.** Forget about formatting your code, and spend your time on business logic instead. sqlfmt processes hundreds of files per second and only operates on files that have changed since the last run.
1. **sqlfmt works with Jinja.** It formats the code that users look at, and therefore doesn't need to know anything about what happens after the templates are rendered.
1. **sqlfmt integrates with your workflow.** As a CLI written in Python, it's easy to install locally on any OS and run in CI. Plays well with dbt, pre-commit, SQLFluff, VSCode, and GitHub Actions. The sqlfmt API powers the dbt Cloud IDE's Format button.
1. **sqlfmt speaks any dialect.** Most likely you don't even have to configure anything. (Sorry, [ClickHouse](./dialects/index.md#clickhouse))

sqlfmt is a command-line tool that is built in Python and runs on MacOS, Linux, and Windows, so you can run it locally and in CI.

sqlfmt is not configurable, except for line length: it enforces a single style. sqlfmt maintains comments and some extra newlines, but largely ignores all indentation and line breaks in the input file.

sqlfmt is not a linter. It does not parse your code into an AST; it just lexes it and tracks a small subset of tokens that impact formatting. This lets us "do one thing and do it well:" sqlfmt is very fast, easy to maintain, and easy to extend, compared to linters that need a full SQL grammar.

sqlfmt is designed to work with templated SQL files that contain jinja tags and blocks. It formats the code that users look at, and therefore doesn't need to know anything about what happens after the templates are rendered.

:::info No DDL or DML
For now, sqlfmt only works on `select` statements (which is all you need if you use sqlfmt with a dbt project). In the future, it will be extended to DDL/DML commands, as well. See [this tracking issue](https://github.com/tconbeer/sqlfmt/issues/262) for more information.
:::