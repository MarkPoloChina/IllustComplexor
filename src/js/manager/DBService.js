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

  static mergeMeta = (list) => {
    let _list = dbMeta.get('meta').value() //取出原先的输出
    _list.push(...list) //合并新数据,使用的是一次IO策略
    dbMeta.set('meta', _list).write()
  }

  static setMeta = (list) => {
    dbMeta.set('meta', list).write()
  }

  static existMeta = (condition) => {
    return dbMeta.get('meta').filter(condition).size().value() != 0
  }

  static clearMeta = () => {
    dbMeta.set('meta', []).write()
  }

  static getSizeOfMeta = (condition) => {
    return dbMeta.get('meta').filter(condition).size().value()
  }

  static getMeta = () => {
    return dbMeta.get('meta').value()
  }
}