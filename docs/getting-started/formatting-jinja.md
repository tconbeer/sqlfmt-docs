---
sidebar_position: 4
---

# Formatting Jinja

sqlfmt loves properly-formatted Jinja, too.

sqlfmt will safely attempt to import the Python code formatter, *Black*. If it is successful (either because sqlfmt was installed with the jinjafmt extra or because *Black* was installed separately in the same environment), it will use *Black* to format the contents of Jinja tags. 

If you do not want sqlfmt to use *Black* to format your Jinja, then specify the `--no-jinjafmt` flag when running sqlfmt.

Installing sqlfmt with the jinjafmt extra will also install *Black*. You can do this with `uv tool install "sqlfmt[jinjafmt]"`. If you want to pin a specific *Black* version, you should specify that separately, as a direct dependency of your project (in your `Pipfile`, `pyproject.toml`, etc.), or using uv's `--with` option: `uv tool install sqlfmt --with "black==25.9.0"`.

If sqlfmt was installed without the jinjafmt extra, and *Black* is not otherwise installed, then sqlfmt will not attempt to format the contents of Jinja tags, except for enforcing a single space inside each curly.
