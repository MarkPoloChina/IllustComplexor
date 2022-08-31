const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  chainWebpack: config => {
    config.plugin('html').tap(args => {
      args[0].title = 'Illust Complexor'
      return args
    })
    config.module.rule('scss').oneOfs.store.forEach(item => {
      item
        .use('sass-resources-loader')
        .loader('sass-resources-loader')
        .options({
          resources: './src/style/global.scss'
        })
        .end()
    });
  },
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      builderOptions: {
        appId: "com.mpsto.icxor",
        productName: "Illust Complexor",
        copyright: "Copyright © 2022 MPSTO",
        directories: {
          "buildResources": "build",
          "output": "dist"
        },
        win: {
          target: [
            "msi",
            "nsis"
          ],
          icon: "build/icons/icon.ico"
        },
        nsis: {
          oneClick: false,
          language: "2052",
          allowToChangeInstallationDirectory: true,
          createDesktopShortcut: true,
          createStartMenuShortcut: true
        },
        mac:{
            icon: "build/icons/icon.icns"
        }
      }
    }
  }
})
