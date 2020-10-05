# ChangeLog

## Version 0.3.1
### Bugfixes
- Reverts workaround for Nova (1.3 and above) where the IssueParser put issues on wrong lines.

## Version 0.3
### Features
- New preference option for all linters: change issue severity ([#2](https://github.com/CasperCL/Python-Lint.novaextension/issues/2))
- New preference option for MyPy: follow or skip imports ([#7](https://github.com/CasperCL/Python-Lint.novaextension/issues/7))

## Version 0.2.1
### Bugfixes
- Fix issue where issues are show on one line above the actual issue.
- Potential fix for MyPy showing issues across files
### Other
- Add more `console.log`s to help debugging

## Version 0.2
### Features
- Use project configuration file by default (issue [#1](https://github.com/CasperCL/Python-Lint.novaextension/issues/1))
- Add lint on save option (thanks [@smallgram](https://github.com/smallgram))
- Add more extensive logging (thanks [@smallgram](https://github.com/smallgram))
### Bugfixes
- Fix issue with MyPy showing results from different files (thanks for reporting [@drcongo](https://github.com/drcongo) & [ReagentX](https://github.com/ReagentX) issue [#4](https://github.com/CasperCL/Python-Lint.novaextension/issues/4) and [#8](https://github.com/CasperCL/Python-Lint.novaextension/issues/8))

## Version 0.1.1
- Updated icon
- Remove dummy preference setting for issue severity

## Version 0.1
Initial release with support for:
- flake8
- mypy
- pylint
- CLI arguments for all linters
- Option to enable/disable linters
