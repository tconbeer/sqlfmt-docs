# VS Code

There are several ways to integrate sqlfmt with VS Code. All require installation of an Extension from the VS Code Marketplace.

If you already use [dbt Power User](./dbt-power-user.md) or [Trunk](./trunk.md), their extensions can configure sqlfmt as the default formatter and enable a run-on-save hook.

Otherwise, you can use the [Run on Save](https://marketplace.visualstudio.com/items?itemName=emeraldwalk.RunOnSave) extension with sqlfmt to automatically format files when they are saved. After installing the extension:

1. On the extension's page, click the gear icon to access the extension settings.
2. Choose if you would like to create either a User or Workspace setting, and select the appropriate tab. 
3. Then select "Edit in `settings.json`", and add the following:

```JSON title=settings.json
{
    "emeraldwalk.runonsave": {
        "commands": [
            {
                "match": ".*\\.sql(\\.jinja)?",
                "isAsync": true,
                "cmd": "sqlfmt ${file}"
            }
        ]
    }
}
```

:::tip Configuring sqlfmt with Run on Save
You can either use a `pyproject.toml` file in your project directory or add other options to the `cmd` key in the settings above if you would like to change the default behavior of sqlfmt
:::