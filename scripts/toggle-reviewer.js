#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const args = process.argv.slice(2);
const cmd = args[0] || "--on";
const repoRoot = path.resolve(__dirname, "..");
const envPath = path.join(repoRoot, ".env");

function readEnv() {
  try {
    return fs.readFileSync(envPath, "utf8");
  } catch (e) {
    return "";
  }
}

function writeEnv(content) {
  fs.writeFileSync(envPath, content, "utf8");
}

function setFlag(value) {
  const key = "EXPO_PUBLIC_AUTO_REVIEWER";
  const env = readEnv();
  const lines = env.split(/\r?\n/).filter(Boolean);
  let found = false;
  const newLines = lines.map((line) => {
    if (line.trim().startsWith(key + "=")) {
      found = true;
      return `${key}=${value}`;
    }
    return line;
  });
  if (!found) newLines.push(`${key}=${value}`);
  writeEnv(newLines.join("\n") + "\n");
  console.log(`${key} set to ${value} in ${envPath}`);
}

if (cmd === "--on" || cmd === "--enable" || cmd === "on" || cmd === "enable") {
  setFlag("true");
  process.exit(0);
} else if (
  cmd === "--off" ||
  cmd === "--disable" ||
  cmd === "off" ||
  cmd === "disable"
) {
  setFlag("false");
  process.exit(0);
} else if (cmd === "--toggle" || cmd === "toggle") {
  const env = readEnv();
  const match = env.match(/EXPO_PUBLIC_AUTO_REVIEWER=(true|false)/i);
  const newVal = match && match[1].toLowerCase() === "true" ? "false" : "true";
  setFlag(newVal);
  process.exit(0);
} else {
  console.log("Usage: toggle-reviewer.js [--on|--off|--toggle]");
  process.exit(1);
}
