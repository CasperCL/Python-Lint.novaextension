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

function issueAssistantForParser(editor, parserName, executable, enabled, args) {
    return new Promise(function(resolve) {
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
            p.onStderr((line) => { console.warn(`ERROR: ${line}`); });
            p.onDidExit((code) => {
                let issues = parser.issues;
                for (issue of issues) {
                    // A bug in the issue parser subtracts 1 from the line no.
                    issue.line += 1;
                    console.log(`${parserName} l${issue.line} issue: ${issue.message}`)
                }
                console.info(`${parserName} found ${issues.length} issue(s)`);
                resolve(issues);
            });
            p.start();
        } catch (err) {
            console.error(`${parserName} error: ${err}`);
        }
    });
}


class Flake8IssueAssistant {
    async provideIssues(editor) {
        var enabled = nova.config.get('unofficial.AnyLint.flake8Enabled');
        var execPath = nova.config.get('unofficial.AnyLint.flake8ExecPath');
        var args = nova.config.get('unofficial.AnyLint.flake8Args');
        return issueAssistantForParser(editor, "flake8", execPath, enabled, parseArgs(args))
    }
}


class MyPyIssueAssistant {
    async provideIssues(editor) {
        var enabled = nova.config.get('unofficial.AnyLint.mypyEnabled');
        var execPath = nova.config.get('unofficial.AnyLint.mypyExecPath');
        var args = nova.config.get('unofficial.AnyLint.mypyArgs');
        
        let parsedArgs = parseArgs(args)
        parsedArgs.push("--follow-imports=silent")
        return issueAssistantForParser(editor, "mypy", execPath, enabled, parsedArgs);
    }
}


class PylintIssueAssistant {
    provideIssues(editor) {
        var enabled = nova.config.get('unofficial.AnyLint.pylintEnabled');
        var execPath = nova.config.get('unofficial.AnyLint.pylintExecPath');
        var args = nova.config.get('unofficial.AnyLint.pylintArgs');
        return issueAssistantForParser(editor, "pylint", execPath, enabled, parseArgs(args));
    }
}
