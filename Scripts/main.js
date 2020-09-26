exports.activate = function() {
    let eventRegister = nova.config.get('unofficial.AnyLint.runOnSave') ? {event: "onSave"} : {event: "onChange"};
    nova.assistants.registerIssueAssistant("python", new Flake8IssueAssistant(), eventRegister);
    nova.assistants.registerIssueAssistant("python", new MyPyIssueAssistant(), eventRegister);
    nova.assistants.registerIssueAssistant("python", new PylintIssueAssistant(), eventRegister);
}

exports.deactivate = function() {
    // Clean up state before the extension is deactivated
}

function parseArgs(argsString) {
    if (argsString === null) {
        return [];
    }
    return argsString.split(' ');
}

function issueAssistantForParser(editor, parserName, args) {
    return new Promise(function(resolve) {
        const enabled = nova.config.get(`unofficial.AnyLint.${parserName}Enabled`);
        const executable = nova.config.get(`unofficial.AnyLint.${parserName}ExecPath`);
        const issueSeverity = nova.config.get(`unofficial.PythonLint.${parserName}IssueSeverity`);

        if (!enabled) {
            resolve([]);
            return;
        }

        args.push(editor.document.path);
        console.log(`${parserName} args: ${args}`);
        try {
            let p = new Process(executable, {
                args: args,
                cwd: nova.workspace.path
            });
            let parser = new IssueParser(parserName);
            p.onStdout((line) => { parser.pushLine(line); });
            p.onStderr((line) => { console.warn(`${parserName} ERROR: ${line}`); });
            p.onDidExit((code) => {
                let issues = parser.issues;
                for (issue of issues) {
                    // A bug in the issue parser subtracts 1 from the line no.
                    issue.line += 1;
                    issue.severity = IssueSeverity[issueSeverity];
                    console.log(`${parserName} l${issue.line} issue: ${issue.message}`)
                }

                console.info(`${parserName} found ${issues.length} issue(s)`);
                resolve(issues);
                return;
            });
            p.start();
        } catch (err) {
            console.error(`${parserName} error: ${err}`);
            resolve([]);
            return;
        }
    });
}


class Flake8IssueAssistant {
    async provideIssues(editor) {
        var args = nova.config.get('unofficial.AnyLint.flake8Args');
        return issueAssistantForParser(editor, "flake8", parseArgs(args))
    }
}


class MyPyIssueAssistant {
    async provideIssues(editor) {
        var args = nova.config.get('unofficial.AnyLint.mypyArgs');
        var mypyShouldFollowImports = nova.config.get('unofficial.PythonLint.mypyShouldFollowImports');

        let parsedArgs = parseArgs(args);
        if (mypyShouldFollowImports) {
            // The IssueParser cannot deal with issue reports across different
            // files. It puts all the issues of different files in the active
            // document. As a workaround, we make the errors resulting from
            // imports silent. More (MyPy) information here: 
            // https://mypy.readthedocs.io/en/stable/running_mypy.html#following-imports
            parsedArgs.push("--follow-imports=silent");
        } else {
            parsedArgs.push("--follow-imports=skip");
        }
        return issueAssistantForParser(editor, "mypy", parsedArgs);
    }
}


class PylintIssueAssistant {
    provideIssues(editor) {
        var args = nova.config.get('unofficial.AnyLint.pylintArgs');
        return issueAssistantForParser(editor, "pylint", parseArgs(args));
    }
}
