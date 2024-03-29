# SQLFluff

You can (and should!) use SQLFluff to lint your SQL queries after they are formatted by sqlfmt. However, the two tools do not see eye-to-eye on formatting (by default), so to avoid lint errors, add the following to your `.sqlfluff` config file:

```ini title=.sqlfluff
[sqlfluff]
exclude_rules = layout.indent, layout.cte_bracket, layout.select_targets, layout.spacing
# set max_line_length to whatever you set in sqlfmt
max_line_length = 88

[sqlfluff:rules]
capitalisation_policy = lower
extended_capitalisation_policy = lower

[sqlfluff:rules:convention.terminator]
multiline_newline = True
```

Earlier versions of sqlfluff (before v2.0) used a different
configuration format:

```ini title=.sqlfluff
[sqlfluff]
exclude_rules = L003, L018, L036

[sqlfluff:rules]
# set max_line_length to whatever you set in sqlfmt
max_line_length = 88
capitalisation_policy = lower
extended_capitalisation_policy = lower

[sqlfluff:indentation]
indented_joins = False
indented_using_on = True
# if using sqlfluff with sqlfmt < v0.18.0
# template_blocks_indent = False

[sqlfluff:rules:L052]
multiline_newline = True
```
