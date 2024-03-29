"use strict";

import {
  app,
  protocol,
  BrowserWindow,
  Menu,
  shell,
  nativeTheme,
  dialog,
  ipcMain,
  session,
} from "electron";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
import installExtension, { VUEJS3_DEVTOOLS } from "electron-devtools-installer";
const isDevelopment = process.env.NODE_ENV !== "production";
let toReloadSignal = false;

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: "app", privileges: { secure: true, standard: true } },
]);

const contextMenuTemplate = [
  { label: "撤销", role: "undo" },
  { label: "重做", role: "redo" },
  { type: "separator" },
  { label: "剪切", role: "cut", accelerator: "CmdOrCtrl+X" },
  { label: "复制", role: "copy", accelerator: "CmdOrCtrl+C" },
  { label: "粘贴", role: "paste", accelerator: "CmdOrCtrl+V" },
  { label: "删除", role: "delete" },
  { type: "separator" },
  { label: "全选", role: "selectAll", accelerator: "CmdOrCtrl+A" },
];

async function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 1000,
    webPreferences: {
      webSecurity: false,
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,
    },
  });

  const contextMenu = Menu.buildFromTemplate(contextMenuTemplate);
  win.webContents.on("context-menu", (event, params) => {
    contextMenu.popup(win, params.x, params.y);
  });

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
    if (!process.env.IS_TEST) win.webContents.openDevTools();
  } else {
    createProtocol("app");
    // Load the index.html when not in development
    win.loadURL("app://./index.html");
  }
}

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q

  // if (process.platform !== "darwin") {
  //   app.quit();
  // }

  if (
    (process.env.WEBPACK_DEV_SERVER_URL && process.platform === "darwin") ||
    toReloadSignal
  )
    return;
  app.quit();
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS3_DEVTOOLS);
    } catch (e) {
      console.error("Vue Devtools failed to install:", e.toString());
    }
  }
  prepareEnv();
  createWindow();
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === "win32") {
    process.on("message", (data) => {
      if (data === "graceful-exit") {
        app.quit();
      }
    });
  } else {
    process.on("SIGTERM", () => {
      app.quit();
    });
  }
}

const prepareEnv = () => {
  // 设置菜单模块
  const menu = Menu.buildFromTemplate([
    {
      label: "文件",
      submenu: [
        {
          label: "关于",
          role: "about",
          click: async () => {
            if (BrowserWindow.getAllWindows().length === 0)
              await createWindow();
            const currentWin = BrowserWindow.getAllWindows()[0];
            currentWin.webContents.send("router:go", "/about");
          },
        },
        {
          type: "separator",
        },
        {
          label: "打开调试窗口",
          click: () => {
            BrowserWindow.getFocusedWindow().webContents.openDevTools();
          },
        },
        {
          label: "重载",
          click: () => {
            toReloadSignal = true;
            BrowserWindow.getFocusedWindow().close();
            createWindow();
            toReloadSignal = false;
          },
        },
        {
          type: "separator",
        },
        {
          label: "退出",
          role: "quit",
        },
      ],
    },
    {
      label: "编辑",
      submenu: [
        { label: "撤销", role: "undo" },
        { label: "重做", role: "redo" },
        { type: "separator" },
        { label: "剪切", role: "cut" },
        { label: "复制", role: "copy" },
        { label: "粘贴", role: "paste" },
        { label: "删除", role: "delete" },
        { type: "separator" },
        { label: "全选", role: "selectAll" },
      ],
    },
    {
      label: "视图",
      submenu: [
        { label: "重置视图", role: "resetZoom" },
        { label: "放大", role: "zoomIn" },
        { label: "缩小", role: "zoomOut" },
        { type: "separator" },
        { label: "全屏", role: "togglefullscreen" },
      ],
    },
    {
      label: "帮助",
      submenu: [
        {
          label: "Github主页",
          click: () => {
            shell.openExternal(
              "https://github.com/MarkPoloChina/IllustComplexor"
            );
          },
        },
        {
          label: "个人主页",
          click: () => {
            shell.openExternal("https://www.markpolo.cn");
          },
        },
      ],
    },
  ]);
  Menu.setApplicationMenu(menu);

  // activate darkmode ipc
  ipcMain.handle("dark-mode:toggle", () => {
    if (nativeTheme.shouldUseDarkColors) {
      nativeTheme.themeSource = "light";
    } else {
      nativeTheme.themeSource = "dark";
    }
    return nativeTheme.shouldUseDarkColors;
  });

  ipcMain.handle("dark-mode:system", () => {
    nativeTheme.themeSource = "system";
  });

  ipcMain.handle("dark-mode:get", () => {
    return nativeTheme.shouldUseDarkColors;
  });

  nativeTheme.on("updated", () => {
    BrowserWindow.getAllWindows().forEach((win) => {
      win.webContents.send(
        "dark-mode:updated",
        nativeTheme.shouldUseDarkColors
      );
    });
  });

  // activate dialog ipc
  ipcMain.handle("dialog:openFile", async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog({
      properties: ["openFile", "multiSelections"],
      filters: [{ name: "Images", extensions: ["jpg", "png", "gif"] }],
    });
    if (canceled) {
      return;
    } else {
      return filePaths;
    }
  });

  ipcMain.handle("dialog:openDirectory", async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog({
      properties: ["openDirectory"],
    });
    if (canceled) {
      return;
    } else {
      return filePaths[0];
    }
  });

  // activate context ipc
  ipcMain.on("context:popup", (event, templateMenu) => {
    templateMenu.forEach((item) => {
      item.click = () => {
        event.sender.send("context:click", item.label);
      };
    });
    const ctx = Menu.buildFromTemplate([
      ...templateMenu,
      {
        type: "separator",
      },
      ...contextMenuTemplate,
    ]);
    ctx.popup(BrowserWindow.fromWebContents(event.sender));
  });

  // activate app ipc
  ipcMain.on("app:getPath", (event) => {
    event.returnValue = app.getPath("userData");
  });

  ipcMain.handle("app:getCacheSize", async () => {
    const size = await session.defaultSession.getCacheSize();
    return size;
  });

  ipcMain.handle("app:clearCache", async () => {
    await session.defaultSession.clearCache();
  });

  // add before-request rule
  const filter = {
    urls: ["https://i-cf.pximg.net/*"],
  };
  session.defaultSession.webRequest.onBeforeSendHeaders(
    filter,
    (details, callback) => {
      details.requestHeaders["Referer"] = "https://www.pixiv.net/";
      callback({ requestHeaders: details.requestHeaders });
    }
  );
};
