import Lowdb from 'lowdb'
import FileSync from 'lowdb/adapters/FileSync'
import path from 'path';
import { app, remote } from 'electron' // 引入remote模块

const APP = process.type === 'renderer' ? remote.app : app // 根据process.type来分辨在哪种模式使用哪种模块
const STORE_PATH = APP.getPath('userData') // 获取electron应用的用户目录
const dbConfig = Lowdb(new FileSync(path.join(STORE_PATH, '/config.json')))

const dbMeta = Lowdb(new FileSync(path.join(STORE_PATH, '/meta.json')))
export class ConfigDB {
  static initDB = () => {
    if (!dbConfig.has('initStatus').value()) {
      dbConfig.defaults({ initStatus: 'true' }).write();
    }
    dbConfig.set('lastVisit', new Date().toISOString()).write()
  }
}

export class MetaDB {
  static initMeta = () => {
    if (!dbMeta.has('initStatus').value()) {
      dbMeta.defaults({ initStatus: 'true', meta: [] }).write();
    }
  }
}