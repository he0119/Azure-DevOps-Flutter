"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var tasklib = __importStar(require("azure-pipelines-task-lib/task"));
var toolLib = __importStar(require("azure-pipelines-tool-lib/tool"));
var path = __importStar(require("path"));
var node_fetch_1 = __importDefault(require("node-fetch"));
var TOOL_NAME = 'flutter';
var TOOL_ENV_NAME = 'FLUTTER_PATH';
function run() {
    return __awaiter(this, void 0, void 0, function () {
        var channel, version, customVersion, arch, currentversion, toolPath, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 8, , 9]);
                    channel = tasklib.getInput('channel', true);
                    version = tasklib.getInput('version', true);
                    customVersion = tasklib.getInput('customVersion');
                    arch = getPlatform();
                    currentversion = '';
                    if (!(version === 'latest' && channel)) return [3 /*break*/, 2];
                    return [4 /*yield*/, getLatestVersion(channel, arch)];
                case 1:
                    currentversion = _a.sent();
                    console.log(currentversion);
                    return [3 /*break*/, 3];
                case 2:
                    if (customVersion) {
                        currentversion = customVersion;
                    }
                    _a.label = 3;
                case 3:
                    if (!(channel && currentversion)) return [3 /*break*/, 6];
                    toolPath = toolLib.findLocalTool(TOOL_NAME, currentversion, arch);
                    if (!!toolPath) return [3 /*break*/, 5];
                    return [4 /*yield*/, acquireFlutterSdk(channel, currentversion, arch)];
                case 4:
                    toolPath = _a.sent();
                    _a.label = 5;
                case 5:
                    tasklib.debug(toolPath);
                    // 设置环境变量
                    toolLib.prependPath(toolPath);
                    tasklib.setVariable(TOOL_ENV_NAME, toolPath);
                    return [3 /*break*/, 7];
                case 6:
                    tasklib.setResult(tasklib.TaskResult.Failed, 'empty channel or version');
                    _a.label = 7;
                case 7:
                    tasklib.setResult(tasklib.TaskResult.Succeeded, 'succeeded');
                    return [3 /*break*/, 9];
                case 8:
                    err_1 = _a.sent();
                    tasklib.setResult(tasklib.TaskResult.Failed, err_1.message);
                    console.log(err_1);
                    return [3 /*break*/, 9];
                case 9: return [2 /*return*/];
            }
        });
    });
}
function acquireFlutterSdk(channel, version, arch) {
    return __awaiter(this, void 0, void 0, function () {
        var extPath, url, temp, url, temp, toolRoot;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(arch === 'linux')) return [3 /*break*/, 3];
                    url = "https://storage.googleapis.com/flutter_infra/releases/" + channel + "/" + arch + "/flutter_" + arch + "_" + version + "-" + channel + ".tar.xz";
                    return [4 /*yield*/, toolLib.downloadTool(url)];
                case 1:
                    temp = _a.sent();
                    return [4 /*yield*/, toolLib.extractTar(temp)];
                case 2:
                    extPath = _a.sent();
                    return [3 /*break*/, 6];
                case 3:
                    url = "https://storage.googleapis.com/flutter_infra/releases/" + channel + "/" + arch + "/flutter_" + arch + "_" + version + "-" + channel + ".zip";
                    return [4 /*yield*/, toolLib.downloadTool(url)];
                case 4:
                    temp = _a.sent();
                    return [4 /*yield*/, toolLib.extractZip(temp)];
                case 5:
                    extPath = _a.sent();
                    _a.label = 6;
                case 6:
                    toolRoot = path.join(extPath, 'flutter/bin');
                    return [4 /*yield*/, toolLib.cacheDir(toolRoot, TOOL_NAME, version, arch)];
                case 7: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function getLatestVersion(channel, platform) {
    return __awaiter(this, void 0, void 0, function () {
        var releasesUrl;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    releasesUrl = "https://storage.googleapis.com/flutter_infra/releases/releases_" + platform + ".json";
                    return [4 /*yield*/, node_fetch_1.default(releasesUrl).then(function (res) { return res.json(); })
                            .then(function (json) {
                            var currentHash = json.current_release[channel];
                            var current = json.releases.find(function (item) { return item.hash === currentHash; });
                            return current.version;
                        })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function getPlatform() {
    var platform = tasklib.getPlatform();
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
//# sourceMappingURL=index.js.map