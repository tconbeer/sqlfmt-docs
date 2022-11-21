# Versioning and Stability

sqlfmt is being actively developed, and as version 0 software, anything about the sqlfmt style, operations, or interface may change in the future.

That said, this project conforms to [semantic versioning](https://semver.org/). *Patch* releases will only fix bugs or add backwards-compatible features, and will not change the Python API or the formatting of files, except under two scenarios:

1. The previous release introduced a major regression and the patch returns the behavior to the previous and intended behavior, before the regression.
2. The patch introduces formatting changes in a very small number of scenarios, where the previous formatting was obviously deficient or undesirable.

Accordingly, at least until version 1.0, *minor* releases may include changes that:
1. Change the public API
2. Change the sqlfmt style

All such changes will be communicated via the [CHANGELOG](https://github.com/tconbeer/sqlfmt/blob/main/CHANGELOG.md), under sections title "Breaking API Changes" and "Formatting Changes", respectively.

At this time, we will not be back-porting any commits in patch releases to older minor releases (PRs welcome).

## Evolving the sqlfmt Style

If you would like to make suggestions or otherwise be involved in the future of the sqlfmt style, please start or join a [discussion](https://github.com/tconbeer/sqlfmt/discussions) in the project repo.