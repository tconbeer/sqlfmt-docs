---
sidebar_position: 2
---

# pre-commit

You can configure [pre-commit](https://pre-commit.com/) to run sqlfmt on your repository before you commit changes.

Add the following config to your `.pre-commit-config.yaml` file:

```yml title=.pre-commit-config.yaml
repos:
  - repo: https://github.com/tconbeer/sqlfmt
    rev: v0.12.0
    hooks:
      - id: sqlfmt
        language_version: python
```

You should replace `rev` with the latest available release, but we do suggest pinning to a specific rev, to avoid unexpected formatting changes.