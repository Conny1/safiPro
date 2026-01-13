// entry.cjs DONT FORGET TO USE .cjs and not .js

async function loadApp() {
  const { app } = await import("./index.js"); // this is your normal entry file - (index.js, main.js, app.mjs etc.)
}
loadApp();