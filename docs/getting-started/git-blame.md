---
sidebar_position: 6
---

# Improving Git Blame

When running sqlfmt for the first time, or when running an upgraded version of sqlfmt after a style change, you are likely to produce a large number of changes in your codebase.

Some teams find this problemmatic, because they regularly use [git blame](https://git-scm.com/docs/git-blame) as part of their workflow, to see a history of changes and their linked commits.

Fortunately, git makes it possible to ignore specific commits when viewing the blame for a file. To use this feature:

1. Commit all other changes before running sqlfmt on your project.
2. Run `sqlfmt .` to format all files in your project.
2. Create a new commit with only the formatting changes, with `git commit -am "chore: apply sqlfmt"`.
4. Note the SHA hash returned by the previous command (or use `git show -q` to view it), since you'll need it later.

Now that you have an isolated commit with only formatting changes, you can instruct `git blame` to ignore that commit. The simplest way to do this is by passing the SHA to the `--ignore-revs` option:

```bash
git blame --ignore-revs 6ea1f05cc48469c09ba539b6498bd9f484aa63d3
```

This is fine for a one-off use case, but it's brittle and hard to collaborate with teammates, who will also want to ignore this commit. A more robust option is to create a file named `.git-blame-ignore-revs` in the root of your project. That file should contain a list of commits (and optionally comments) for `git blame` to ignore:

```txt title=.git-blame-ignore-revs
# chore: apply sqlfmt v0.18.0
6ea1f05cc48469c09ba539b6498bd9f484aa63d3
```

:::tip
You can name your file anything, but if you use `.git-blame-ignore-revs` and locate that file in the root of your project, GitHub will [automatically](https://docs.github.com/en/repositories/working-with-files/using-files/viewing-a-file#ignore-commits-in-the-blame-view) use that file for its own Blame feature.
:::

Then to view the blame, ignoring commits in the file:

```bash
git blame --ignore-revs-file .git-blame-ignore-revs
```

That's fine, but we can do better. There is a configuration option that allows us to set this filename once, rather than pass it as an option every time we call `git blame`:

```bash
git config blame.ignoreRevsFile .git-blame-ignore-revs
git blame
```
