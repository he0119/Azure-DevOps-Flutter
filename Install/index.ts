import * as tasklib from 'azure-pipelines-task-lib/task';
import * as toolLib from 'azure-pipelines-tool-lib/tool';
import * as path from 'path';
import fetch from 'node-fetch';

const TOOL_NAME: string = 'flutter';
const TOOL_ENV_NAME: string = 'FLUTTER_PATH';

async function run() {
    try {
        // 输入
        const channel = tasklib.getInput('channel', true);
        const version = tasklib.getInput('version', true);
        const customVersion = tasklib.getInput('customVersion');

        // 系统
        const arch: string = getPlatform();

        // 获取最新的版本号
        let currentversion: string = '';
        if (version === 'latest' && channel) {
            currentversion = await getLatestVersion(channel, arch);
            console.log(currentversion);
        }
        else if (customVersion) {
            currentversion = customVersion;
        }

        // 下载 SDK
        if (channel && currentversion) {
            let toolRoot = toolLib.findLocalTool(TOOL_NAME, currentversion, arch);
            if (!toolRoot) {
                toolRoot = await acquireFlutterSdk(channel, currentversion, arch);
            }
            tasklib.debug(toolRoot);
            // 设置环境变量
            let toolPath = path.join(toolRoot, 'flutter/bin');
            toolLib.prependPath(toolPath);
            tasklib.setVariable(TOOL_ENV_NAME, toolPath);
        } else {
            tasklib.setResult(tasklib.TaskResult.Failed, 'empty channel or version')
        }

        tasklib.setResult(tasklib.TaskResult.Succeeded, 'succeeded');
    }
    catch (err) {
        tasklib.setResult(tasklib.TaskResult.Failed, err.message);
        console.log(err);
    }
}

async function acquireFlutterSdk(channel: string, version: string, arch: string) {
    let extPath: string;
    if (arch === 'linux') {
        const url = `https://storage.googleapis.com/flutter_infra/releases/${channel}/${arch}/flutter_${arch}_${version}-${channel}.tar.xz`;
        const temp: string = await toolLib.downloadTool(url);
        extPath = await toolLib.extractTar(temp);
    }
    else {
        const url = `https://storage.googleapis.com/flutter_infra/releases/${channel}/${arch}/flutter_${arch}_${version}-${channel}.zip`;
        const temp: string = await toolLib.downloadTool(url);
        extPath = await toolLib.extractZip(temp);
    }
    return await toolLib.cacheDir(extPath, TOOL_NAME, version, arch);
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
    const platform: tasklib.Platform = tasklib.getPlatform();
    switch (platform) {
        case tasklib.Platform.Windows: {
            return 'windows';
        }
        case tasklib.Platform.Linux: {
            return 'linux';
        }
        case tasklib.Platform.MacOS: {
            return 'macos';
        }
    }
}

run();
