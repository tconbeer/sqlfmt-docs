# GitHub Actions

sqlfmt can be easily installed and run in a GitHub Actions Workflow. Alternatively, [Trunk](./trunk.md) provides an Action that can be used to invoke sqlfmt.

## Running sqlfmt as a check

The simplest way to run sqlfmt in CI is to run it in `--check` or `--diff` mode against all files in your project. In this mode, if sqlfmt detects invalid formatting in any file, it will exit with status code 1, which the Workflow will intepret as a failed check (setting a ❌ next to the commit, and optionally blocking merging).

1. If you do not already use GitHub Actions, create a directory named `.github` (with a preceding `.`) in the root of your project.
2. In the `.github` directory, create a new directory called `workflows`.
3. Create a new YAML file in the `workflows` directory called anything you like, perhaps `sqlfmt.yml`.
4. Next you have to define the workflow that will run sqlfmt. At a minimum, this workflow must check out your repository, install Python, and install sqlfmt before running sqlfmt in check or diff mode. This example does that. Paste the following config into that file:

    ```yml title=.github/workflows/sqlfmt.yml
    name: sqlfmt

    on:
      pull_request:

    jobs:
      static:
        name: sqlfmt
        runs-on: ubuntu-latest
        steps:
          - name: Check out Repo
            uses: actions/checkout@v3
            with:
              persist-credentials: false
          - name: Set up Python 3.10
            uses: actions/setup-python@v4
            with:
              python-version: "3.10"
          - name: Install sqlfmt
            run: pip install shandy-sqlfmt[jinjafmt]
          - name: Run sqlfmt
            run: sqlfmt --diff .
    ```

## Only Running against Changed Files

If you are migrating an existing project onto sqlfmt and do not wish to format every file in your project, you can instead run a check against only files that have changed in the PR.

There are many ways to do this. One way is to use another Action to generate a list of changed files for you. We can recommend the [changed-files](https://github.com/marketplace/actions/changed-files) action.

You must add this Action as a step before sqlfmt runs, and then use the output of this Action in your call to sqlfmt. Note that sqlfmt only operates on `.sql` and `.sql.jinja` files, so you do not need to filter the list of changed files that you pass to sqlfmt (it will not read or operate on files with other extensions).

This is a minimal workflow that does just that:

```yml title=.github/workflows/sqlfmt.yml
name: sqlfmt

on:
  pull_request:

jobs:
  static:
    name: sqlfmt
    runs-on: ubuntu-latest
    steps:
      - name: Check out Repo
        uses: actions/checkout@v3
      - name: Set up Python 3.10
        uses: actions/setup-python@v4
        with:
          python-version: "3.10"
      - name: Install sqlfmt
        run: pip install shandy-sqlfmt[jinjafmt]
      - name: Get Changed Files
        id: changed-files
        uses: tj-actions/changed-files@v46
      - name: Run sqlfmt
        run: sqlfmt --diff ${{ steps.changed-files.outputs.all_changed_files }}
```

## Committing changes made by sqlfmt

If you have many team members who are using the [dbt Cloud IDE](./dbt-cloud.md), you may wish to have sqlfmt actually format the code in your repo, and commit the changes as part of any PR.

:::warning
**sqlfmt will not always produce the formatted output you might want.** It might even break your SQL syntax. It is **highly recommended** to carefully review the commits made by sqlfmt before merging to main. If you have automated tests, they should run **after** sqlfmt to ensure sqlfmt does not introduce regressions.

There are certain situations where sqlfmt can be considered to be in Beta, or even more mature than that. Those are:

1. Using sqlfmt to format select statements for one of the major dialects (PostgresSQL, MySQL, Snowflake, BQ, Redshift).

1. Using sqlfmt to format a dbt project (which may also include jinja and some minimal DDL/DML, like grants, create function, etc.) for one of the major dialects.

However, there are other use cases where sqlfmt is very much alpha:

1. Formatting some dialects that deviate from ANSI or Postgres, like T-SQL (SQLServer).

1. Formatting other DDL (create table, insert, etc.) (sqlfmt attempts to be no-op on these statements as much as possible).

In these domains sqlfmt is nowhere near "feature complete" and caution is highly advised.
:::

Committing changes from an Action adds some complexity, including authorizing the Actions user to write to your repo. We recommend using the [git-auto-commit](https://github.com/marketplace/actions/git-auto-commit) Action for this.

This is a minimal example, which assigns `permissions: contents: write` to the sqlfmt job, which allows the final step to push changes back to the repo.

```yml title=.github/workflows/sqlfmt.yml
name: sqlfmt

on:
  pull_request:

jobs:
  static:
    name: sqlfmt
    runs-on: ubuntu-latest
    permissions:
      contents: write
    steps:
      - name: Check out Repo
        uses: actions/checkout@v3
      - name: Set up Python 3.10
        uses: actions/setup-python@v4
        with:
          python-version: "3.10"
      - name: Install sqlfmt
        run: pip install shandy-sqlfmt[jinjafmt]
      - name: Get Changed Files
        id: changed-files
        uses: tj-actions/changed-files@v46
      - name: Run sqlfmt
        run: sqlfmt ${{ steps.changed-files.outputs.all_changed_files }}
      - name: Commit sqlfmt changes
        uses: stefanzweifel/git-auto-commit-action@v4
        with:
          commit_message: "fix: sqlfmt"
```

:::info
There are many ways this can go wrong, depending on your repo configuration. Please see the [git-auto-commit docs](https://github.com/marketplace/actions/git-auto-commit) for more information and additional configuration options.
:::

## Configuring sqlfmt in CI

If you do not use the default configuration and are running sqlfmt in multiple places (e.g., locally by different team members and/or locally and in CI), you should really use (and check in) a [configuration file](../getting-started/configuring-sqlfmt.md#using-a-pyprojecttoml-file). Since that file lives alongside the code you are formatting, sqlfmt will always find it and apply the configuration.

That said, you can pass additional options via command-line arguments or environment variables by adding them to the `run:` key in your workflow's YAML file, as you would locally.

:::info
When run by a Github Action, sqlfmt will automatically detect that it is not in an interactive shell, and will not show colorized output or a progress bar by default.
:::
