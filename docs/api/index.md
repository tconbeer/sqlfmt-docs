# API Reference

sqlfmt can be imported as a Python library and defines a
[mostly-stable](../versioning/index.md) public API.

The public API is defined in the `sqlfmt.api` module. Any breaking changes to the public API will be limited to new minor versions (`0.x.0`) and documented in the [CHANGELOG](https://github.com/tconbeer/sqlfmt/tree/main/CHANGELOG.md).

## `api.Mode`

`Mode` is an object (a dataclass) that encompasses all configuration for sqlfmt.

All of the other API functions expect a `Mode` as an argument. A `Mode` with
the default configuration can be instantiated with no arguments
(e.g., `mode = Mode()`).

For more information on each option, see 
[Configuring sqlfmt](../getting-started/configuring-sqlfmt.md), `sqlfmt --help`,
or the source in the `sqlfmt.cli` module.

```py
@dataclass
class Mode:
    """
    A Mode is a container for all sqlfmt config, including formatting config and
    report config.
    """

    SQL_EXTENSIONS: List[str] = field(default_factory=lambda: [".sql", ".sql.jinja"])
    dialect_name: str = "polyglot"
    line_length: int = 88
    check: bool = False
    diff: bool = False
    exclude: List[str] = field(default_factory=list)
    encoding: str = 'utf-8'
    fast: bool = False
    single_process: bool = False
    no_jinjafmt: bool = False
    reset_cache: bool = False
    verbose: bool = False
    quiet: bool = False
    no_progressbar: bool = False
    no_color: bool = False
    force_color: bool = False
```

## `api.format_string`

The simplest way to format a query is to pass that query as a string to `api.format_string`.


```py
def format_string(source_string: str, mode: Mode) -> str:
    """
    Takes a raw query string and a Mode as input, returns the formatted query
    as a string, or raises a SqlfmtError if the string cannot be formatted
    """
```

Example:
```py
from sqlfmt.api import Mode, format_string
from sqlfmt.exception import SqlfmtError

mode = Mode()
query = "select 1"

try:
    formatted_query = format_string(query, mode)
except SqlfmtError as e:
    print(f"Oops!\n\n{e}")

assert formatted_query == "select 1\n"
```

## `api.run`

The CLI uses `api.run` to modify files on disk and produce the report that
gets printed to `stderr`. `api.run` catches `SqlfmtError` exceptions.

```py
def run(
    files: Collection[Path],
    mode: Mode,
    callback: Optional[Callable[[Awaitable[SqlFormatResult]], None]] = None,
) -> Report:
    """
    Runs sqlfmt on all files in Collection of Paths (files), using the specified Mode.

    Modifies SQL files in place, by default. Check or diff Mode do not modify files,
    they only create a Report.

    If a callback is provided, will execute the callback after each file is formatted.

    Returns a Report that can be queried or printed with the display_report() method.
    """
```

Example:

```py
from pathlib import Path

from sqlfmt.api import Mode, run

mode = Mode()

# these files need to exist
files = [
    Path("/home/me/sql/one.sql"),
    Path("/home/me/sql/two.sql"),
]

report = run(files, mode)
report.display_report()
```

## `api.get_matching_paths`

`api.run` expects a unique Collection of Paths that enumerates every individual file
to be formatted. To generate that Collection, you can use `api.get_matching_paths`:

```py
def get_matching_paths(paths: Iterable[Path], mode: Mode) -> Set[Path]:
    """
    Takes an Iterable of Paths (files or directories) and a Mode as an input, and
    returns a Set of unique paths to individual files that match the input paths 
    (or are contained in its directories) and are not excluded by the mode's exclude
    glob.
    """
```

Example:

```py
from Pathlib import Path

from sqlfmt.api import Mode, run, get_matching_paths

mode = Mode(exclude=["./do_not_format/**/*.sql"])

this_dir = Path(__file__).parent

# all SQL files nested under this directory, except
# those in the `do_not_format` directory
files = get_matching_paths([this_dir], mode)
report = run(files, mode)

report.display_report()
```

## `api.initialize_progress_bar`

The CLI uses [tqdm](https://github.com/tqdm/tqdm) to show a progess bar for long
runs. Since by default `api.run` uses multiple processes, we update the progress bar
using a callback supplied to `api.run`. This function is a convenience function to
initialize the progress bar.

```py
def initialize_progress_bar(
    total: int, mode: Mode, force_progress_bar: bool = False
) -> Tuple[tqdm, Callable[[Awaitable[SqlFormatResult]], None]]:
    """
    Return a Tuple consisting of the progress bar object and a
    callable that can be used with api.run to update the progress bar
    after each file is formatted.

    Pass force_progress_bar to enable the progress bar, even on non-TTY
    terminals (this is handy for testing the progress bar).
    """
```

Example:

```py
from pathlib import Path

from sqlfmt.api import Mode, run, initialize_progress_bar

mode = Mode()

# these files need to exist
files = [
    Path("/home/me/sql/one.sql"),
    Path("/home/me/sql/two.sql"),
]

progress_bar, progress_callback = api.initialize_progress_bar(
    total=len(files), mode=mode
)

report = run(files, mode, callback=progress_callback)

progress_bar.close()
report.display_report()
```