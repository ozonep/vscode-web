const fs = require("fs");
const fse = require("fs-extra");

// Add built in extensions
const extensions = [];

fse.copySync("extraExtensions", "dist/extensions");

const extensionsFolderPath = "dist/extensions";
const extensionsContent = fs.readdirSync(extensionsFolderPath);
for (const extension of extensionsContent) {
  const extensionPath = `${extensionsFolderPath}/${extension}`;
  if (fs.statSync(extensionPath).isDirectory()) {
    const extensionPackagePath = `${extensionPath}/package.json`;
    const extensionPackageNLSPath = `${extensionPath}/package.nls.json`;

    if (!fs.existsSync(extensionPackagePath)) {
      continue;
    }

    const packageJSON = JSON.parse(fs.readFileSync(extensionPackagePath));
    let packageNLS = null;

    if (fs.existsSync(extensionPackageNLSPath)) {
      packageNLS = JSON.parse(fs.readFileSync(extensionPackageNLSPath));
    }
  
    extensions.push({
      packageJSON,
      extensionPath: extension,
      packageNLS
    });
  }
}

const extensionsVar =
  "var extensions =" + JSON.stringify(extensions, { space: "\t", quote: "" });

fs.writeFileSync("dist/extensions.js", extensionsVar);

