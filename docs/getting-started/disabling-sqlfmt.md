---
sidebar_position: 3
---

# Disabling sqlfmt

If you would like sqlfmt to ignore a file, or part of a file, you can add `-- fmt: off` and `-- fmt: on` comments to your code (or `# fmt: off` on MySQL or BigQuery). sqlfmt will not change any code between those comments; a single `-- fmt: off` at the top of a file will keep the entire file intact.

The example below will not change after being formatted with sqlfmt:

```sql
-- fmt: off
select 1, 2, 3
       4, 5, 6
       7, 8, 9
-- fmt: on
from my_table
where something is true -- fmt: off
group by 1, 2, 3
        4, 5, 6
       7, 8, 9

```

You can also configure sqlfmt to exclude certain paths and directories. You can do this on the command line using the `--exclude` option (multiple times if necessary), or in a `pyproject.toml` file. The argument passed to `--exclude` should be a string that will be compiled into a [recursive glob](https://docs.python.org/3/library/glob.html); `pyproject.toml` takes a list of strings.

These are equivalent:

```bash
sqlfmt . --exclude target/**/* --exclude dbt_packages/**/*
```

```toml title=pyproject.toml
[tool.sqlfmt]
exclude=["target/**/*", "dbt_packages/**/*"]
```

:::tip
string literals in TOML files must be quoted
:::
