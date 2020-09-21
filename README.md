# Python Lint
This extension brings your favourite Python linters to [Nova](https://nova.app), a Mac native code editor.

Supports the following linters:
1. flake8
2. mypy
3. pylint


## Requirements
Depending on which linter you want to use, you need flake8/mypy/pylint installed:
```bash
pip install flake8 mypy pylint
```

## Configuration
In the Extension Library (`CMD + Shift + 2`) -> `Python Lint`, you can specify the paths to the installed linters. Not sure where they are located? Run:
```bash
which flake8
which mypy
which pylint
```

Once the paths are configured, you're all set!

## Development
Is your favourite linter not in here? Or did you run into a problem? Create an issue. PRs are welcome!

## TODO
1. Default to .pylintrc, mypy.ini or .flake8
2. Change issue severity per linter
