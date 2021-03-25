const process = require("process");
const child_process = require("child_process");
const fs = require("fs");
const fse = require("fs-extra");
const glob = require("glob");
const rmdir = require('rimraf');

const vscodeVersion = "1.54.3";

if (!fs.existsSync("vscode")) {
  child_process.execSync(`git clone https://github.com/microsoft/vscode.git -b ${vscodeVersion} --depth=1`, {
    stdio: "inherit",
  });
}
process.chdir("vscode");

if (!fs.existsSync("node_modules")) {
  child_process.execSync("yarn", { stdio: "inherit" });
}
// Use simple workbench
fs.copyFileSync(
  "../workbench.ts",
  "src/vs/code/browser/workbench/workbench.ts"
);

// Adapt compilation to web
const gulpfilePath = "./build/gulpfile.vscode.js";
let gulpfile = fs.readFileSync(gulpfilePath, { encoding: "utf8", flag: "r" });

gulpfile = gulpfile
  .replace(
    /vs\/workbench\/workbench.desktop.main/g,
    "vs/workbench/workbench.web.api"
  )
  .replace(
    /buildfile.workbenchDesktop/g,
    "buildfile.workbenchWeb,buildfile.keyboardMaps"
  );

fs.writeFileSync(gulpfilePath, gulpfile);

// Compile
child_process.execSync("yarn gulp compile-build", { stdio: "inherit" });
child_process.execSync("yarn gulp minify-vscode", { stdio: "inherit" });
child_process.execSync("yarn compile-web", { stdio: "inherit" });

// Remove maps
const mapFiles = glob.sync("out-vscode-min/**/*.js.map", {});
mapFiles.forEach((mapFile) => {
  fs.unlinkSync(mapFile);
});

// Extract compiled files
if (fs.existsSync("../dist")) {
  fs.rmdirSync("../dist", { recursive: true });
}
fs.mkdirSync("../dist");
fse.copySync("out-vscode-min", "../dist/vscode");

const extensionNM = glob.sync("extensions/**/node_modules", {});
extensionNM.forEach((modules) => {
  rmdir.sync(modules, { recursive: true });
});
fse.copySync("extensions", "../dist/extensions");
