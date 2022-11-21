# SQLFluff

You can (and should!) use SQLFluff to lint your SQL queries after they are formatted by sqlfmt. However, the two tools do not see eye-to-eye on formatting (by default), so to avoid lint errors, add the following to your `.sqlfluff` config file:

```ini title=.sqlfluff
[sqlfluff]
exclude_rules = L003, L018, L036

[sqlfluff:rules]
max_line_length = 88  # or whatever you set in sqlfmt
capitalisation_policy = lower
extended_capitalisation_policy = lower

[sqlfluff:indentation]
indented_joins = False
indented_using_on = True
template_blocks_indent = False

[sqlfluff:rules:L052]
multiline_newline = True
```