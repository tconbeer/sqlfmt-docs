---
sidebar_position: 5
---

# Using sqlfmt with Docker

We build official container images with every release of sqlfmt (since v0.15.0) and push it to [GHCR](https://github.com/tconbeer/sqlfmt/pkgs/container/sqlfmt) (the GitHub Container Registry). With Docker installed, you can run sqlfmt to format all files in your current working directory with:

```bash
docker run -v $(pwd):/src ghcr.io/tconbeer/sqlfmt:latest
```

## About the Container File Structure and Default Commands

To format files on the host, you need to configure the container by mapping a volume on the host to a directory inside the container. In the command above, we included `-v $(pwd):/src` to map the current working directory to the `/src` directory in the container. The container is configured to use `/src` as its working directory, so to format files in the volume, you can run `sqlfmt .` inside the container. You can also provide more specific paths (relative to the root of the volume that you provided). For example, if your current working directory includes a subdirectory called `./models`, you can format only that subdirectory with:

```bash
docker run -v $(pwd):/src ghcr.io/tconbeer/sqlfmt:latest sqlfmt ./models
```

Or you can choose to mount only that subdirectory:

```bash
docker run -v $(pwd)/models:/src ghcr.io/tconbeer/sqlfmt:latest sqlfmt .
```

You can create multiple mounts:
```bash
docker run \
    -v $(pwd)/models/model_one.sql:/src/model_one.sql 
    -v $(pwd)/models/model_two.sql:/src/model_two.sql 
    ghcr.io/tconbeer/sqlfmt:latest sqlfmt .
```

The default command for the container is just `sqlfmt .` (with `/src` set as the container's working directory), so running these are equivalent:
```bash
docker run -v $(pwd):/src ghcr.io/tconbeer/sqlfmt:latest
docker run -v $(pwd):/src ghcr.io/tconbeer/sqlfmt:latest sqlfmt .
```

:::tip
The `jinjafmt` extra is installed in the container. You can configure sqlfmt to disable jinja formatting.
:::

## Running Other sqlfmt Commands

You can pass other commands into the container by adding arguments to the end of `docker run`. This will run sqlfmt in `check` mode, with a line length of 100:

```bash
docker run -v $(pwd):/src ghcr.io/tconbeer/sqlfmt:latest sqlfmt . --check --line-length 100
```

## Configuring sqlfmt

Just like when you run sqlfmt natively, you can configure sqlfmt in the container three ways:

1. Pass an explicit CLI option
2. Set environment variables
3. Use a `pyproject.toml` file

:::tip
Read more about configuring sqlfmt [here](./configuring-sqlfmt).
:::

### Using CLI Options

You can simply include any CLI option by passing a command into the container. For example, to run sqlfmt without formatting jinja:

```bash
docker run -v $(pwd):/src ghcr.io/tconbeer/sqlfmt:latest sqlfmt . --no-jinjafmt
```

### Setting Environment Variables

You can use [`docker run -e`](https://docs.docker.com/engine/reference/commandline/run/#-set-environment-variables--e---env---env-file) to set environment variables for configuration:

```bash
docker run \
    -v $(pwd):/src \
    -e SQLFMT_NO_JINJAFMT=1 \
    ghcr.io/tconbeer/sqlfmt:latest
```

### Using a `pyproject.toml` File

If your `pyproject.toml` file is in the directory that is mounted to the container, then sqlfmt will find it and apply its configuration.

## Using a Specific Version of sqlfmt

The [images in GHCR](https://github.com/tconbeer/sqlfmt/pkgs/container/sqlfmt) are tagged with the corresponding sqlfmt version number. Only versions since v0.15.0 are available. You can pin the sqlfmt version by running the container with a version tag:

```bash
docker run -v $(pwd):/src ghcr.io/tconbeer/sqlfmt:v0.16.0
```

The tag `latest` will be bumped with every release (major, minor, or patch).

Images since v0.16.0 have support for multiple platforms: `linux/amd64`, `linux/arm64`, and `linux/arm`. Docker should automatically pull the best image for you. [Open an issue](https://github.com/tconbeer/sqlfmt/issues/new/choose) to request other platforms.

There is no official image for installing sqlfmt `@main`.