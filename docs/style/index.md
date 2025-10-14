# The sqlfmt style
The only thing you can configure with sqlfmt is the desired line length of the formatted file. You can do this with the `--line-length` or `-l` options. The default is 88.

Given the desired line length, sqlfmt has three objectives:
1. Break and indent lines to make the syntactical structure of the code apparent.
2. Combine lines to use the least possible vertical space, without violating the line-length constraint or the structure in #1.
3. Standardize capitalization (to lowercase) and in-line whitespace.

sqlfmt borrows elements from well-accepted styles from other programming languages. It places opening brackets on the same line as preceding function names (like *Black* for python and *1TBS* for C). It indents closing brackets to the same depth as the opening bracket (this is extended to statements that must be closed, like `case` and `end`).

The sqlfmt style is as simple as possible, with little-to-no special-casing of formatting concerns. While at first blush, this may not create a format that is as "nice" or "expressive" as hand-crafted indentation, over time, as you grow accustomed to the style, formatting becomes transparent and the consistency will allow you to jump between files, projects, and even companies much faster.

## Why lowercase?
There are several reasons that sqlfmt insists on lowercase SQL keywords:
1. We believe that SQL is code (this is a surprisingly controversial statement!). Shouting-case keywords perpetuate the myth that SQL isn't "real code", or isn't "modern" and somehow is trapped in the era of low-level imperative languages: BASIC, COBOL, and FORTRAN. The reality is that SQL is an incredibly powerful, declarative, and modern language. It should look like one.
1. Syntax highlighting for SQL makes shouting-case keywords redundant; the syntax highlighter in any text editor is going to be more consistent than any manual shout-casing. If you have a SQL query as a string inside of a block of code in another language, you may want to capitalize your keywords; sqlfmt only operates on dedicated SQL (and templated sql) files, so this is not relevant. However, even without syntax highlighting, the hierarchical and consistent indentation provided by sqlfmt provides sufficient visual structure without shout-casing keywords.
1. Even among people who like shout-cased keywords, there are disagreements between what gets shout-cased. `SELECT`, sure, but `SUM`? `AS`? `OVER`? `AND`? All-lowercase keywords eliminates this potential source of irregularity and disagreement.
1. Research shows that generally, lowercase words are more readable.

## Why trailing commas?
1. Using trailing commas follows the convention of every other written language and programming language.
1. Leading commas require placing the first field name on the same line as `select`, which can obscure that field (especially with `select distinct top 25 ...`).
1. SQL query compilation is extremely fast; the "cost" of "last field" errors is very low. A growing number of dialects (e.g., Snowflake, BigQuery, DuckDB) even allow a trailing comma in the final field of a select statement.
1. Trailing commas generalize better within `select` statements (e.g. `group by` and `partition by` clauses) and in other kinds of SQL statements (e.g. `insert` statements).

## Examples

sqlfmt will put very short queries on a single line:

```sql
SELECT a,
b,
   c
FROM my_table
```
becomes
```sql
select a, b, c from my_table
```

If a query doesn't fit on a single line, sqlfmt will format the query to make its hierarchy apparent. The main keywords in a `select` statement are the top nodes in hierarchy. Individual fields are indented a single level; unless all fields fit on the same line as `select`, they must all be individually split onto their own lines. This is properly formatted code:
```sql
with t as (select * from my_schema."my_QUOTED_ table!")
select
    a_long_field_name,
    another_long_field_name,
    (one_field + another_field) as c,
    a_final_field
from t
where one_field < another_field
```

Note that the main keywords, `with`, `select`, `from`, and `where`, are indented to the same depth. If their arguments fit on a single line (as in `with`, `from`, and `where`), they stay on that line, with the keyword. However, unless all arguments for a keyword fit on one line, they are all wrapped to their own line, and indented:

```sql
with
    a_long_cte_name as (
        select my_field, sum(another_field) from my_schema."my_QUOTED_ table!"
    )
select
    a_long_field_name,
    another_long_field_name,
    (one_field + another_field) as c,
    a_final_field
from a_long_cte_name
where
    one_field < another_field
    and two_field > another_field
    and three_field = another_field
```

Any expressions wrapped in parentheses are similarly one-lined if possible, and split if they are too long.

This hierarchical indentation scales to arbitrarily complex and nested expressions. Another example of properly formatted code (at line length of 88):

```sql
select
    a,
    sum(a) over () as b,
    row_number() over () as c,
    count(case when a is null then 1 end) over (
        partition by user_id, date_trunc('year', performed_at)
    ) as d,
    first_value(
        coalesce(one_field, another_field, yet_another_field) ignore nulls
    ) over (
        partition by user_id
        order by performed_at desc
        rows between unbounded preceding and unbounded following
    ) as e
from my_table
```

## More Examples
We have forked some popular open-source SQL projects and formatted them:
- The Gitlab Data Team's [analytics project](https://github.com/tconbeer/gitlab-analytics-sqlfmt/tree/main/transform/snowflake-dbt) (2,417 files)
- Rittman Analytics' [RA Warehouse Framework](https://github.com/tconbeer/rittman_ra_data_warehouse) (311 files)
- The HTTP Archive's [Almanac](https://github.com/tconbeer/http_archive_almanac/tree/main/sql) (1,702 files)
- dbt Labs' [Jaffle Shop](https://github.com/tconbeer/jaffle_shop) (5 files)
- dbt Labs' [dbt-utils](https://github.com/tconbeer/dbt-utils) (131 files)