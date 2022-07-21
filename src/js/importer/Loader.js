import { FilenameComparator } from "./FilenameComparator";
import { MetaDB } from "../manager/DBService";
import { Util } from '@/js/manager/util'
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
          let timestamp = Util.getThisDate()
          if (pid && page && FilenameComparator.isLikeImage(item) && !MetaDB.existMeta({ sid: pid, source: 'pixiv', page: page })) {
            if (title)
              list.push({ sid: pid, source: 'pixiv', page: page, title: title, basePath: path, baseType: type, filename: item, timestamp: timestamp })
            else
              list.push({ sid: pid, source: 'pixiv', page: page, basePath: path, baseType: type, filename: item, timestamp: timestamp })
          }
          index++
          progress.value = Math.round(index / files.length * 1000) / 10
          await sleep()
        }
        MetaDB.mergeMeta(list)//出于性能考虑，使用一次IO策略
        resolve({ status: 200, message: `完成母本导入，共${list.length}个文件被录入，共${filesCnt - list.length}个文件被忽略` })
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
          if (pid && page && FilenameComparator.isLikeImage(item) && !MetaDB.existMeta({ sid: pid, source: 'pixiv', page: page })) {
            successCnt++
            if (title)
              MetaDB.pushMeta({ sid: pid, source: 'pixiv', page: page, title: title, basePath: path.parse(_path).dir, baseType: type, filename: item })
            else
              MetaDB.pushMeta({ sid: pid, source: 'pixiv', page: page, basePath: path.parse(_path).dir, baseType: type, filename: item })
          }
          progress.value = Math.round((index + 1) / paths.length * 1000) / 10
          await sleep()
        }
        catch (err) {
          progress.value = -1
          reject({ status: 500, message: `发生错误：${err}` })
        }
        resolve({ status: 200, message: `完成母本导入，共${successCnt}个文件被录入，共${paths.length - successCnt}个文件被忽略` })
      })
    })
  }

  static test = () => {
    MetaDB.clearMeta()
  }
}

export class AddCopy {
  /**
  * @summary 从指定副本目录筛选可识别的文件名并加入特定元数据进入数据库。
  * @param {String} [path] 文件夹路径
  * @param {Object} [copyMeta] 副本元数据对象
  * @param {Object} [progress] 进度对象
  */
  static loadFromDirectory = (path, copyMeta, progress) => {
    return new Promise((resolve) => {
      let successCnt = 0
      let filesCnt = 0
      let ignoredList = []
      fs.readdir(path, async (err, files) => {
        filesCnt = files.length
        let index = 0
        for (let item of files) {
          let pid = FilenameComparator.getMatchedPixivId(item)
          let page = FilenameComparator.getMatchedPixivPage(item)
          if (!pid || !page || !FilenameComparator.isLikeImage(item))
            ignoredList.push({ reason: 'unknownName', filename: item, status: 'ignore' })
          else if (!MetaDB.existMeta({ sid: pid, source: 'pixiv', page: page }))
            ignoredList.push({ reason: 'notfound', filename: item, status: 'ignore' })
          else if (MetaDB.existCopy({ sid: pid, source: 'pixiv', page: page }, { copyPath: path })) {
            ignoredList.push({ reason: 'exist', filename: item, status: 'ignore' })
          } else {
            successCnt++
            MetaDB.pushCopy({ sid: pid, source: 'pixiv', page: page }, { ...copyMeta, filename: item })
          }
          index++
          progress.value = Math.round(index / files.length * 1000) / 10
          await sleep()
        }
        resolve({ status: 200, message: `完成副本导入，共${successCnt}个文件被录入，共${filesCnt - successCnt}个文件被忽略`, data: ignoredList })
      })
    })
  }
}

export class UpdateMeta {
  /**
  * @summary 从指定目录筛选可识别的文件名并匹配相应的元数据对象，更新其指定自字段。
  * @param {String} [path] 文件夹路径
  * @param {String} [metaKey] 字段
  * @param {String} [metaValue] 字段值
  * @param {Object} [progress] 进度对象
  */
  static updateMetaFromDirectoryWithGiven = (path, metaKey, metaValue, progress) => {
    return new Promise((resolve) => {
      let successCnt = 0
      let filesCnt = 0
      let ignoredList = []
      fs.readdir(path, async (err, files) => {
        filesCnt = files.length
        let index = 0
        for (let item of files) {
          let pid = FilenameComparator.getMatchedPixivId(item)
          let page = FilenameComparator.getMatchedPixivPage(item)
          if (!pid || !page || !FilenameComparator.isLikeImage(item))
            ignoredList.push({ reason: 'unknownName', filename: item, status: 'ignore' })
          else if (!MetaDB.existMeta({ sid: pid, source: 'pixiv', page: page }))
            ignoredList.push({ reason: 'notfound', filename: item, status: 'ignore' })
          else {
            successCnt++
            if (metaKey == 'object')
              MetaDB.updateMetaByPush({ sid: pid, source: 'pixiv', page: page }, metaKey, metaValue)
            else
              MetaDB.updateMeta({ sid: pid, source: 'pixiv', page: page }, metaKey, metaValue)
          }
          index++
          progress.value = Math.round(index / files.length * 1000) / 10
          await sleep()
        }
        resolve({ status: 200, message: `完成元数据更新，共${successCnt}个文件被更新，共${filesCnt - successCnt}个文件被忽略`, data: ignoredList })
      })
    })
  }

  /**
  * @summary 从指定目录筛选可识别的文件名并匹配相应的元数据对象，更新其指定自字段。
  * @param {String} [path] 文件夹路径
  * @param {String} [metaKey] 字段
  * @param {String} [metaValue] 字段值
  * @param {Object} [progress] 进度对象
  */
  static updateMetaFromDirectoryWithFilename = (path, metaKey, progress) => {
    return new Promise((resolve) => {
      let successCnt = 0
      let filesCnt = 0
      let ignoredList = []
      fs.readdir(path, async (err, files) => {
        filesCnt = files.length
        let index = 0
        for (let item of files) {
          let pid = FilenameComparator.getMatchedPixivId(item)
          let page = FilenameComparator.getMatchedPixivPage(item)
          let bookCnt = FilenameComparator.getPixivWebWithBookmarkBookCnt(item)
          if (!pid || !page || !FilenameComparator.isLikeImage(item))
            ignoredList.push({ reason: 'unknownName', filename: item, status: 'ignore' })
          else if (!MetaDB.existMeta({ sid: pid, source: 'pixiv', page: page }))
            ignoredList.push({ reason: 'notfound', filename: item, status: 'ignore' })
          else if (metaKey == 'bookCnt') {
            if (!bookCnt)
              ignoredList.push({ reason: 'unknownName', filename: item, status: 'ignore' })
            else {
              successCnt++
              MetaDB.updateMeta({ sid: pid, source: 'pixiv', page: page }, metaKey, bookCnt)
            }
          }
          else {
            ignoredList.push({ reason: 'notFoundMetaKey', filename: item, status: 'ignore' })
          }
          index++
          progress.value = Math.round(index / files.length * 1000) / 10
          await sleep()
        }
        resolve({ status: 200, message: `完成元数据更新，共${successCnt}个文件被更新，共${filesCnt - successCnt}个文件被忽略`, data: ignoredList })
      })
    })
  }
}