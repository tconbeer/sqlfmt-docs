---
sidebar_position: 0
---

# dbt (Core)

sqlfmt was built for dbt, so only minimal configuration is required. We recommend excluding your `target` and `dbt_packages` directories from formatting. You can do this with the command-line `--exclude` option, or by setting `exclude` in your `pyproject.toml` file:

```toml title=pyproject.toml
[tool.sqlfmt]
exclude=["target/**/*", "dbt_packages/**/*"]
```