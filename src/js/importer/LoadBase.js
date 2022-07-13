import { FilenameComparator } from "./FilenameComparator";
import { MetaDB } from "../manager/DBService";
import fs from 'fs-extra'

/**
 * Used to start load of file system.
 * @class
 */

const sleep = async () => {
  return await new Promise((resolve) => {
    setTimeout(resolve, 1)
  })
}
export class LoadBase {
  /**
  * @summary 从指定目录筛选可识别的文件名并并入母本数据库。
  * @param {String} [path] 文件夹路径
  */
  static loadFromDirectory = (path, progress) => {
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
              list.push({ sid: pid, source: 'pixiv', page: page, title: title })
            else
              list.push({ sid: pid, source: 'pixiv', page: page })
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


  static test = () => {
    MetaDB.clearMeta()
  }
}