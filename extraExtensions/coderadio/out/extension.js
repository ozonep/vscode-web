import * as vscode from "vscode";

let statusBar;

const radio = "https://coderadio-admin.freecodecamp.org/radio/8010/radio.mp3";


function updateSidebar(text, tooltip, command) {
  statusBar.text = text;
  statusBar.tooltip = tooltip;
  statusBar.command = command;
  statusBar.show();
}

let url = "https://coderadio-relay-blr.freecodecamp.org/radio/8010/radio.mp3"
let audioObj = new Audio(radio);

async function playStream() {
  audioObj.play();
  updateSidebar("◼ Code Radio", "◼ Stop playing", "coderadio.stop");
}

async function stopStream() {
  audioObj.pause();
  updateSidebar("▶ Code Radio", "▶ Start playing", "coderadio.play");
}

export function activate(context) {
  let subscriptions = [
    vscode.commands.registerCommand("coderadio.play", playStream),
    vscode.commands.registerCommand("coderadio.stop", stopStream),
  ];

  statusBar = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left,
    Number.MIN_SAFE_INTEGER
  );
  subscriptions.push(statusBar);

  context.subscriptions.push(...subscriptions);
  document.body.appendChild(audioObj);
  stopStream();
}

export function deactivate() {
  stopStream();
}
