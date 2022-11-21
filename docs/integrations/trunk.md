# Trunk

Use Trunk to integrate sqlfmt into VSCode, GitHub Actions: it's a powerful DevEx toolkit that integrates with every stage of your workflow.

```bash
curl https://get.trunk.io -fsSL | bash
trunk init
trunk check enable sqlfmt
```

:::info
Trunk supports sqlfmt, sqlfluff, and another 50+ linters across over 20+ other languages. 
:::

:::tip
Consider also [tracking the Trunk launcher in your repo](https://docs.trunk.io/docs/install#add-the--directly-into-your-repo-optional).
:::

## VSCode

You can install the VSCode extension [here](https://marketplace.visualstudio.com/items?itemName=Trunk.io), which will not only flag formatting issues for you

![Screenshot of Trunk showing a sqlfmt issue in VSCode](/img/trunk-vscode.png)

but also allow you to use Trunk to format-on-save SQL files with sqlfmt:

```json title=.vscode/settings.json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "trunk.io"
}
```

## GitHub Actions

Trunk provides a [GitHub Action](https://github.com/trunk-io/trunk-action) that will highlight lint and formatting issues for you, including `sqlfmt` issues.

![Screenshot of Trunk showing a sqlfmt issue in GitHub](/img/trunk-github-action.png)

Here's an example workflow that you can use:

```yaml title=.github/workflows/pr.yaml
name: Pull Request
on: [pull_request, workflow_dispatch]
concurrency:
  group: ${{ github.head_ref || github.run_id }}
  cancel-in-progress: true

jobs:
  trunk_check:
    name: Trunk Check Runner
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v3

      - name: Trunk Check
        uses: trunk-io/trunk-action@v1
```

## Learn more

Trunk is capable of a lot more, such as making it easy to [write custom git hook integrations](https://docs.trunk.io/docs/actions-git-hooks). Check out their [documentation](https://docs.trunk.io) to learn more.
