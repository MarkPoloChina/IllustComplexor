import fs from 'fs'
import path from 'path'
import { MetaDB } from '../manager/DBService'

export class FilesEnum {
  static test() {
    const base = 'E:\\Pictures\\wallpaper'
    let list = []
    fs.readdirSync(base).forEach(filename => {
      list.push(path.join(base, filename))
    })
    return list
  }

  static getPicoltEnum(copyLevel) {
    let list = []
    MetaDB.getMetaCopyFilter('copyLevel', copyLevel).forEach(item => {
      let index = item.copy.findIndex((value) => { return value.copyLevel == copyLevel })
      if (index != -1) {
        let _index = list.findIndex((_item) => { return _item.name == item.copy[index].copyNo.toString() })
        if (_index == -1) {
          list.push({ name: item.copy[index].copyNo.toString(), list: [path.join(item.copy[index].copyPath, item.copy[index].filename)] })
        }
        else list[_index].list.push(path.join(item.copy[index].copyPath, item.copy[index].filename))
      }
    })
    return list
  }

  static getTimelineEnum() {
    let list = []
    MetaDB.getMeta((item) => { return item.timestamp && item.timestamp != "" }).forEach(item => {
      let index = list.findIndex((_item) => { return _item.time == item.timestamp })
      if (index == -1) {
        list.push({ time: item.timestamp, list: [path.join(item.basePath, item.filename)] })
      } else list[index].list.push(path.join(item.basePath, item.filename))
    })
    return list
  }
}