// import path from 'path';
import { app } from 'electron'
const remote = require("@electron/remote")

const APP = process.type === 'renderer' ? remote.app : app // 根据process.type来分辨在哪种模式使用哪种模块
const STORE_PATH = APP.getPath('userData') // 获取electron应用的用户目录

export class PathAnalyzer {
  static getBaseUrl = () => {
    return STORE_PATH
  }
}