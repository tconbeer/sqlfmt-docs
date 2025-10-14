---
sidebar_position: 0
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Installation

:::info Try It First
Want to test out sqlfmt on a query before you install it? [On the homepage](/) is an interactive playground with the latest sqlfmt version.
:::

## Recommended Installation: Use uv

sqlfmt is a command-line tool that is built in Python and runs on MacOS, Linux, and Windows. 
There are many ways to install and run it, but we strongly recommend using [uv](https://docs.astral.sh/uv):

1. [Install uv](https://docs.astral.sh/uv/getting-started/installation/#standalone-installer). From a POSIX shell, run:

    ```bash
    curl -LsSf https://astral.sh/uv/install.sh | sh
    ```

    Or using Windows Powershell:

    ```pwsh
    powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
    ```

2. Install sqlfmt as a tool using uv:

    ```bash
    uv tool install "shandy-sqlfmt[jinjafmt]"
    ```

    This command will install sqlfmt into an isolated environment and add it to your PATH so you can easily run the executable.

    :::tip
    Depending on your shell and OS, you may need single or double quotes around `shandy-sqlfmt[jinjafmt]`.
    :::

3. Test the installation; run sqlfmt with no arguments:

    ```bash
    sqlfmt
    ```

    You should see some ASCII art and help text.

:::warning PyPI Names
The PyPI distribtuion is `shandy-sqlfmt`, NOT `sqlfmt`, which is a different (unrelated but not malicious) package.
This is unfortunate, but the author cannot do anything about it.
:::

## Other Installation Options

### Use pip or something pip-like:

If you know what you’re doing, after installing Python 3.9 or above and activating your virtual environment, install `shandy-sqlfmt` using pip, pipx, poetry, or any other program that can install Python packages from PyPI:

```bash
pip install "shandy-sqlfmt[jinjafmt]"
```

### Use Docker

You can skip installation altogether and pull the official Docker image instead. See [the docs](./using-container) on running sqlfmt in a container.
