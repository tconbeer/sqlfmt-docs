---
sidebar_position: 1
---
# Using sqlfmt

:::danger Before You Begin
**sqlfmt will not always produce the formatted output you might want.** It might even break your SQL syntax. It is **highly recommended** to only run sqlfmt on files in a version control system (like git), so that it is easy for you to revert any changes made by sqlfmt. On your first run, be sure to make a commit before running sqlfmt.

There are certain situations where sqlfmt can be considered to be in Beta, or even more mature than that. Those are:

1. Using sqlfmt to format select statements for one of the major dialects (PostgresSQL, MySQL, Snowflake, BQ, Redshift).

1. Using sqlfmt to format a dbt project (which may also include jinja and some minimal DDL/DML, like grants, create function, etc.) for one of the major dialects.

However, there are other use cases where sqlfmt is very much alpha:

1. Formatting some dialects that deviate from ANSI or Postgres, like T-SQL (SQLServer).

1. Formatting other DDL (create table, insert, etc.) (sqlfmt attempts to be no-op on these statements as much as possible).

In these domains sqlfmt is nowhere near "feature complete" and caution is highly advised.
:::

sqlfmt is a command-line tool. It works on any posix terminal and on Windows Powershell. If you have used the Python code formatter *Black*, the sqlfmt commands will look familiar. 

:::tip
The code snippets below are commands that can be typed into your terminal, after installing sqlfmt.
:::

To list commands and options:

```bash
sqlfmt --help
```

If you want to format all `.sql` and `.sql.jinja` files in your current working directory (and all nested directories), simply type:
```bash
sqlfmt .
```
You can also supply a path to a one or more files or directories as arguments:
```bash
sqlfmt /path/to/my/dir /path/to/a/file.sql
```
If you don't want to format the files you have on disk, you can run sqlfmt with the `--check` option. sqlfmt will exit with code 1 if the files on disk are not properly formatted:
```bash
sqlfmt --check .
sqlfmt --check path/to/my/dir
```
If you want to print a diff of changes that sqlfmt would make to format a file (but not update the file on disk), you can use the `--diff` option. `--diff` also exits with 1 on changes:
```bash
sqlfmt --diff .
```

sqlfmt can also format code passed through standard input (`stdin`) by passing `-` as the files argument. The formatted code will be output to `stdout` (all other output from sqlfmt is routed to `stderr`):
```bash
echo "select 1" | sqlfmt -
```
