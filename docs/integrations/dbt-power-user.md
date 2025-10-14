# dbt Power User (VS Code Extension)

[dbt Power User](https://github.com/innoverio/vscode-dbt-power-user) is a [VS Code Extension](https://marketplace.visualstudio.com/items?itemName=innoverio.vscode-dbt-power-user) to make VS Code work seamlessly with dbt.

The Extension has many features, including a sqlfmt-powered formatter.

:::tip
sqlfmt must be available on the PATH in order to be accessed by dbt Power User. Install sqlfmt as a tool with `uv` to isolate its dependencies and add it to the PATH.
:::

After installing sqlfmt and the dbt Power User extension:

1. Associate your `.sql` files with the `jinja-sql` language. Select Preferences > Settings, and under Files: Associations click Add Item:
    ![Screenshot of VS Code Settings menu, with Add Items button highlighted](./assets/dbt-power-user-jinja-sql-language.png)

    Alternatively, add the following to your VS Code `settings.json`:

    ```JSON title=settings.json
    "files.associations": {
        "*.sql": "jinja-sql"
    },
    ```

1. Select "dbt Power User" (extension `id:innoverio.vscode-dbt-power-user`) as the default formatter. You can do this either by using the context menu (right click on an open dbt model in the editor) and select "Format Document With...", or you can add the following to your VS Code settings:

    ```JSON title=settings.json
    "[jinja-sql]": {
        "editor.defaultFormatter": "innoverio.vscode-dbt-power-user"
    }
    ```

2. You can enable format on save by adding another line to your VS Code settings:

    ```JSON title=settings.json
    "[jinja-sql]": {
        "editor.defaultFormatter": "innoverio.vscode-dbt-power-user",
        "editor.formatOnSave": true
    }
    ```