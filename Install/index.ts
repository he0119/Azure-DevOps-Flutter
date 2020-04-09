import tl = require('azure-pipelines-task-lib/task');

async function run() {
    try {
        const channel: string | undefined = tl.getInput('channel', true);
        if (channel == 'stable') {
            tl.setResult(tl.TaskResult.Succeeded, 'Stable Channel');
            return;
        }
        console.log('Hello', channel);
    }
    catch (err) {
        tl.setResult(tl.TaskResult.Failed, err.message);
    }
}

run();