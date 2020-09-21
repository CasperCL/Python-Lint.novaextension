exports.activate = function() {
    // Do work when the extension is activated
}

exports.deactivate = function() {
    // Clean up state before the extension is deactivated
}


function issueAssistantForParser(editor, parserName, executable, enabled, args) {
    return new Promise(function(resolve) {
        if (!enabled) {
            resolve([]);
            return;
        }
        
        const issues = [];
        var path = editor.document.path;
        var parsedArgs = [];
        if (args != null) {
            parsedArgs = args.split(' ');
        }
        parsedArgs.push(path)
        console.log("ARGS" + parsedArgs)
        let p = new Process(executable, { args: parsedArgs });
        let parser = new IssueParser(parserName);
        p.onStdout((line) => { parser.pushLine(line); });
        p.onDidExit((code) => {
            let issues = parser.issues;
            console.info(`${parserName} found ${issues.length} issue(s)`);
            resolve(issues);
        });
        p.start();
    });
}


class Flake8IssueAssistant {
    async provideIssues(editor) {
        var enabled = nova.config.get('unofficial.AnyLint.flake8Enabled');
        var execPath = nova.config.get('unofficial.AnyLint.flake8ExecPath');
        var args = nova.config.get('unofficial.AnyLint.flake8Args');
        return issueAssistantForParser(editor, "flake8", execPath, enabled, args)
    }
}


class MyPyIssueAssistant {
    async provideIssues(editor) {
        var enabled = nova.config.get('unofficial.AnyLint.mypyEnabled');
        var execPath = nova.config.get('unofficial.AnyLint.mypyExecPath');
        var args = nova.config.get('unofficial.AnyLint.mypyArgs');
        return issueAssistantForParser(editor, "mypy", execPath, enabled, args);
    }
}


class PylintIssueAssistant {
    provideIssues(editor) {
        var enabled = nova.config.get('unofficial.AnyLint.pylintEnabled');
        var execPath = nova.config.get('unofficial.AnyLint.pylintExecPath');
        var args = nova.config.get('unofficial.AnyLint.pylintArgs');
        return issueAssistantForParser(editor, "pylint", execPath, enabled, args);
    }
}


nova.assistants.registerIssueAssistant("python", new Flake8IssueAssistant(), {event: "onChange"});
nova.assistants.registerIssueAssistant("python", new MyPyIssueAssistant(), {event: "onChange"});
nova.assistants.registerIssueAssistant("python", new PylintIssueAssistant(), {event: "onChange"});
