import Lowdb from 'lowdb'
import FileSync from 'lowdb/adapters/FileSync'
import path from 'path';
import { app } from 'electron'
const remote = require("@electron/remote")

const APP = process.type === 'renderer' ? remote.app : app // 根据process.type来分辨在哪种模式使用哪种模块
const STORE_PATH = APP.getPath('userData') // 获取electron应用的用户目录
const dbConfig = Lowdb(new FileSync(path.join(STORE_PATH, '/config.json')))
// const dbMeta = Lowdb(new FileSync(path.join(STORE_PATH, '/meta.json')))

// const tempReader = { randomId: "", obj: null }
export class ConfigDB {
  static initDB = () => {
    if (!dbConfig.has('initStatus').value()) {
      dbConfig.defaults({ initStatus: 'true' }).write();
    }
    dbConfig.set('lastVisit', new Date().toISOString()).write()
  }

  static getByKey = (key) => {
    return dbConfig.get(key).value()
  }

  static setByKey = (key, value) => {
    dbConfig.set(key, value).write()
  }
}

// export class MetaDB {
//   static initMeta = () => {
//     if (!dbMeta.has('initStatus').value()) {
//       dbMeta.defaults({ initStatus: 'true', meta: [] }).write();
//     }
//   }

//   static mergeMeta = (list) => {
//     if (list.length == 0) return
//     let _list = dbMeta.get('meta').value() //取出原先的输出
//     _list.push(...list) //合并新数据,使用的是一次IO策略
//     dbMeta.set('meta', _list).write()
//   }

//   static setMeta = (list) => {
//     dbMeta.set('meta', list).write()
//   }

//   static existMeta = (condition) => {
//     return dbMeta.get('meta').filter(condition).size().value() != 0
//   }

//   static clearMeta = () => {
//     dbMeta.set('meta', []).write()
//   }

//   static getSizeOfMeta = (condition) => {
//     return dbMeta.get('meta').filter(condition).size().value()
//   }

//   static getAllMeta = () => {
//     return dbMeta.get('meta').value()
//   }

//   static getMeta = (condition) => {
//     return dbMeta.get('meta').filter(condition).value()
//   }

//   static pushMeta = (obj) => {
//     dbMeta.get('meta').push(obj).write()
//   }

//   static pushCopy = (condition, obj) => {
//     if (!dbMeta.get('meta').find(condition).get('copy').value())
//       dbMeta.get('meta').find(condition).set('copy', []).write()
//     dbMeta.get('meta').find(condition).get('copy').push(obj).write()
//   }

//   static existCopy = (conditionOfMeta, conditionOfCopy) => {
//     if (!dbMeta.get('meta').find(conditionOfMeta).get('copy').value())
//       return false
//     return dbMeta.get('meta').find(conditionOfMeta).get('copy').filter(conditionOfCopy).size().value() != 0
//   }

//   static getMetaCopyFilter = (key, value) => {
//     return dbMeta.get('meta').filter((_value) => { return _value.copy ? _value.copy.find((__value) => { return __value[key] == value }) : false }).value()
//   }

//   static updateMeta = (condition, key, value) => {
//     dbMeta.get('meta').find(condition).set(key, value).write()
//   }

//   static updateMetaByPush = (condition, key, value) => {
//     if (!dbMeta.get('meta').find(condition).get(key).value())
//       dbMeta.get('meta').find(condition).set(key, []).write()
//     dbMeta.get('meta').find(condition).get(key).push(value).write()
//   }
// }