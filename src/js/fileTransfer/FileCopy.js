import fs from 'fs-extra'
import path from 'path'
import { FilesEnum } from '../viewer/FilesEnum'
import { FilenameComparator } from '../importer/FilenameComparator'

export class FileCopy {
  static copyFilesTo = (files, _path, style, progress) => {
    return new Promise((resolve) => {
      console.log(files.length)
      let list = []
      let index = 0
      files.forEach(url => {
        let meta = FilesEnum.getMetaByUrl(url)
        let filename = ''
        if (style == 'std') {
          filename = `${meta.sid}_p${meta.page}.${FilenameComparator.getExtFilename(meta.filename)}`
        } else if (style == 'pxder') {
          filename = `(${meta.sid})${meta.title}_p${meta.page}.${FilenameComparator.getExtFilename(meta.filename)}`
        }
        if (filename != '') {
          fs.copyFile(url, path.join(_path, filename)).then(() => {
            index++
            progress.value = Math.round(index / files.length * 1000) / 10
          }).catch((err) => {
            list.push({ reason: err, filename: path.basename(url), status: 'failed' })
          })
        }
      })
      resolve({ status: 200, message: `完成导出，共${files.length - list.length}个文件被录入，共${list.length}个文件失败`, data: list })
    })
  }
}