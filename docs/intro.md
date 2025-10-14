---
sidebar_position: 0
slug: /
---

# Introduction to sqlfmt

sqlfmt formats your dbt SQL files so you don't have to. It is similar in nature to *Black*, gofmt, and rustfmt (but for jinja-templated SQL).

sqlfmt is a command-line tool that is built in Python and runs on MacOS, Linux, and Windows, so you can run it locally and in CI.

sqlfmt is not configurable: it enforces a single style. You will never have to mention (or argue about) code style in code reviews again. sqlfmt maintains comments and some extra newlines, but largely ignores all indentation and line breaks in the input file.

sqlfmt is not a linter. It does not parse your code into an AST; it just lexes it and tracks a small subset of tokens that impact formatting. This lets us "do one thing and do it well:" sqlfmt is very fast, easy to maintain, and easy to extend, compared to linters that need a full SQL grammar.

sqlfmt is designed to work with template SQL files that contain Jinja tags and blocks. It formats the code that users look at, and therefore doesn't need to know anything about what happens after the templates are rendered.

:::info Limited DDL and DML
For now, sqlfmt only works on `select`, `delete`, `grant`, `revoke`, and `create function` statements (which is all you need if you use sqlfmt with a dbt project). One day it may be extended to additional DDL and DML. See [this tracking issue](https://github.com/tconbeer/sqlfmt/issues/262) for more information.
:::