import { FilenameComparator } from "./FilenameComparator";
import { MetaDB } from "../manager/DBService";
import fs from 'fs-extra'
import path from 'path'

const sleep = async () => {
  return await new Promise((resolve) => {
    setTimeout(resolve, 1)
  })
}

/**
 * Used to start load from file system.
 * @class
 */
export class LoadBase {
  /**
  * @summary 从指定目录筛选可识别的文件名并并入母本数据库。
  * @param {String} [path] 文件夹路径
  * @param {String} [type] 指定母本类型
  * @param {Object} [progress] 进度对象
  */
  static loadFromDirectory = (path, type, progress) => {
    return new Promise((resolve) => {
      let list = []
      let filesCnt = 0
      fs.readdir(path, async (err, files) => {
        filesCnt = files.length
        let index = 0
        for (let item of files) {
          let pid = FilenameComparator.getMatchedPixivId(item)
          let page = FilenameComparator.getMatchedPixivPage(item)
          let title = FilenameComparator.getPxderPixivTitle(item)
          if (!pid || !page) return
          if (!MetaDB.existMeta({ sid: pid, source: 'pixiv', page: page })) {
            if (title)
              list.push({ sid: pid, source: 'pixiv', page: page, title: title, basePath: path, baseType: type })
            else
              list.push({ sid: pid, source: 'pixiv', page: page, basePath: path, baseType: type })
          }
          index++
          progress.value = Math.round(index / files.length * 1000) / 10
          await sleep()
        }
        MetaDB.mergeMeta(list)//出于性能考虑，使用一次IO策略
        resolve({ status: 200, message: `完成导入，共${list.length}个文件被录入，共${filesCnt - list.length}个文件被忽略` })
      })
    })
  }
  /**
  * @summary 从指定文件筛选可识别的文件名并并入母本数据库。
  * @param {Array} [paths] 文件路径
  * @param {String} [type] 指定母本类型
  * @param {Object} [progress] 进度对象
  */
  static loadFromFiles = (paths, type, progress) => {
    return new Promise((resolve, reject) => {
      let successCnt = 0
      paths.forEach(async (_path, index) => {
        try {
          let item = path.basename(_path)
          let pid = FilenameComparator.getMatchedPixivId(item)
          let page = FilenameComparator.getMatchedPixivPage(item)
          let title = FilenameComparator.getPxderPixivTitle(item)
          if (!pid || !page) return
          if (!MetaDB.existMeta({ sid: pid, source: 'pixiv', page: page })) {
            successCnt++
            if (title)
              MetaDB.pushMeta({ sid: pid, source: 'pixiv', page: page, title: title, basePath: path.parse(_path).dir, baseType: type })
            else
              MetaDB.pushMeta({ sid: pid, source: 'pixiv', page: page, basePath: path.parse(_path).dir, baseType: type })
          }
          progress.value = Math.round((index + 1) / paths.length * 1000) / 10
          await sleep()
        }
        catch (err) {
          progress.value = -1
          reject({ status: 500, message: `发生错误：${err}` })
        }
        resolve({ status: 200, message: `完成导入，共${successCnt}个文件被录入，共${paths.length - successCnt}个文件被忽略` })
      })
    })
  }

  static test = () => {
    MetaDB.clearMeta()
  }
}