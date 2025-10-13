# pre-commit

You can configure [pre-commit](https://pre-commit.com/) to run sqlfmt on your repository before you commit changes.

Add the following config to your `.pre-commit-config.yaml` file:

```yml title=.pre-commit-config.yaml
repos:
  - repo: https://github.com/tconbeer/sqlfmt
    rev: v0.18.0
    hooks:
      - id: sqlfmt
        language_version: python
```

To run sqlfmt with the recommended jinjafmt extra, you need to specify the extra as an additional dependency of the hook:

```yml title=.pre-commit-config.yaml
repos:
  - repo: https://github.com/tconbeer/sqlfmt
    rev: v0.18.0
    hooks:
      - id: sqlfmt
        language_version: python
        additional_dependencies: ['.[jinjafmt]']
```

You should replace `rev` with the [latest available release](https://github.com/tconbeer/sqlfmt/releases), but we do suggest pinning to a specific rev, to avoid unexpected formatting changes.