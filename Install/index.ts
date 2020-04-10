import * as tl from 'azure-pipelines-task-lib/task';
import fetch from 'node-fetch';

async function run() {
    try {
        // 输入
        const channel = tl.getInput('channel', true);
        const version = tl.getInput('version', true);
        const customVersion = tl.getInput('customVersion');

        // 系统
        const platform: string = getPlatform();

        // 获取最新的版本号
        if (version === 'latest' && channel) {
            let currentversion = await getLatestVersion(channel, platform);
            console.log(currentversion);
        }

        tl.setResult(tl.TaskResult.Succeeded, 'succeeded');
    }
    catch (err) {
        tl.setResult(tl.TaskResult.Failed, err.message);
    }
}

async function getLatestVersion(channel: string, platform: string): Promise<string> {
    const releasesUrl = `https://storage.googleapis.com/flutter_infra/releases/releases_${platform}.json`;
    return await fetch(releasesUrl).then(res => res.json())
        .then(json => {
            const currentHash = json.current_release[channel];
            const current = json.releases.find((item: { hash: string; }) => item.hash === currentHash);
            return current.version;
        });
}

function getPlatform(): string {
    const platform: tl.Platform = tl.getPlatform();
    switch (platform) {
        case tl.Platform.Windows: {
            return 'windows';
        }
        case tl.Platform.Linux: {
            return 'linux';
        }
        case tl.Platform.MacOS: {
            return 'macos';
        }
    }
}

run();
