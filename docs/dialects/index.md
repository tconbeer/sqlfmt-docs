# Using sqlfmt with Different SQL Dialects

sqlfmt's rules are simple, which means it does not have to parse every single token in your query. This allows nearly all SQL dialects to be formatted using sqlfmt's default "polyglot" dialect. 

## Polyglot

Using the polyglot dialect requires no configuration. The following dialects are supported by polyglot:

- PostgreSQL
- Snowflake SQL
- BigQuery Standard SQL
- Redshift
- MySQL
- SparkSQL
- DuckDB

Many other dialects will also work just fine, especially if they adhere closely to standard/ANSI SQL. If you dialect isn't formatting properly, please [open an issue](https://github.com/tconbeer/sqlfmt/issues/new/choose).

## ClickHouse

ClickHouse is case-sensitive where other dialects are not. By default, sqlfmt will lowercase all SQL keywords, database identifiers, aliases, etc. (basically anything that isn't quoted). This is bad for ClickHouse. To prevent the lowercasing of function names, database identifiers, and aliases, use the `--dialect clickhouse` option when running sqlfmt. For example,

```bash
$ sqlfmt . --dialect clickhouse
```

This can also be configured using the `pyproject.toml` file:

```toml
[tool.sqlfmt]
dialect = "clickhouse"
```

Note that with this option, sqlfmt will not lowercase **most** non-reserved keywords, even common ones like `sum` or `count`. See (and please join) [this discussion](https://github.com/tconbeer/sqlfmt/discussions/229) for more on this topic.
