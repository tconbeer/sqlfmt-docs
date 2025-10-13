---
sidebar_position: 7
---

# About File Encodings

:::tip
You probably don't have to worry about this.
:::

sqlfmt uses Python, and Python uses Unicode to represent strings of text, including your SQL code while it is being formatted. When Unicode strings are saved to disk (or read from disk), they must be encoded into a sequence of bytes. This is a 
[surprisingly complex subject](https://docs.python.org/3/howto/unicode.html)!
There are dozens of ways to encode characters into bytes, and a complex web of
partial compatibility between them.

By default, sqlfmt assumes your `.sql` files are encoded in 
[UTF-8](https://en.wikipedia.org/wiki/UTF-8), which is becoming
the de facto standard Unicode encoding.

If your `.sql` files have a different encoding, you can specify that encoding at
runtime by [configuring sqlfmt](configuring-sqlfmt) with the `--encoding` option.
For example, to decode files using the `cp1252` encoding, you can run sqlfmt with:

```bash
sqlfmt --encoding cp1252 ./path/to/cp1252_file.sql
```

Alternatively, sqlfmt can detect its host machine's locale and use that locale's preferred encoding. For this behavior, pass the special word `inherit` to the `--encoding` option, like this:

```bash
sqlfmt --encoding inherit .
```

:::warning
Using `--encoding inherit` can cause compatibility issues between users on
different operating systems, or even different versions of an operating system.
It is provided as an option to replicate the default behavior of sqlfmt, before v0.17.0.
:::

## The BOM
sqlfmt will automatically detect the presence of a
[UTF BOM](https://en.wikipedia.org/wiki/Byte_order_mark) in a source file. If a BOM
is in the source, it will also be written to the formatted file.

To *always* write a BOM to the formatted file, whether or not the source contains
a BOM, you can use the `utf-8-sig` encoding:

```bash
sqlfmt --encoding utf-8-sig .
```

## Newlines
In addition to different encodings, different platforms use different symbols
to represent a newline (or line break). Unix platforms use `\n`, Windows uses
`\r\n`, and Mac Classic (prior to OS X) used just `\r`.

sqlfmt reads in your file in "universal newline" mode, which translates every
newline to `\n` while in memory. It then writes your file using your host machine's default
line ending. This means that sqlfmt won't write a formatted file just to change its
line endings, and a file won't fail in `--check` mode if it uses different
line endings from what the host machine would use. This also plays better with
git's default newline behavior, which is also machine-specific. This behavior
is not configurable.
