import tl = require('azure-pipelines-task-lib/task');

async function run() {
    try {
        const channel: string | undefined = tl.getInput('channel', true);
        console.log(channel);
        if (channel == 'stable') {
            tl.setResult(tl.TaskResult.Succeeded, 'Stable Channel');
            return;
        }
        console.log('Hello', channel);
        tl.setResult(tl.TaskResult.Failed, 'failed');
    }
    catch (err) {
        tl.setResult(tl.TaskResult.Failed, err.message);
    }
}

run();