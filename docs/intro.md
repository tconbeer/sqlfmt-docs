---
sidebar_position: 0
slug: /
---

# Introduction to sqlfmt

sqlfmt formats your dbt SQL files so you don't have to. It is similar in nature to black, gofmt, and rustfmt (but for SQL). When you use sqlfmt:

1. You never have to mention (or argue about) code style in code reviews again
1. You make it easier to collaborate and solicit contributions from new people
1. You will be able to read your team's code as if you wrote it
1. You can forget about formatting your code, and spend your time on business logic instead

sqlfmt is a command-line tool that is built in Python and runs on MacOS, Linux, and Windows, so you can run it locally and in CI.

sqlfmt is not configurable, except for line length: it enforces a single style. sqlfmt maintains comments and some extra newlines, but largely ignores all indentation and line breaks in the input file.

sqlfmt is not a linter. It does not parse your code into an AST; it just lexes it and tracks a small subset of tokens that impact formatting. This lets us "do one thing and do it well:" sqlfmt is very fast, easy to maintain, and easy to extend, compared to linters that need a full SQL grammar.

sqlfmt is designed to work with templated SQL files that contain jinja tags and blocks. It formats the code that users look at, and therefore doesn't need to know anything about what happens after the templates are rendered.

:::info No DDL
For now, sqlfmt only works on `select` statements (which is all you need if you use sqlfmt with a dbt project). In the future, it will be extended to DDL statements, as well.
:::