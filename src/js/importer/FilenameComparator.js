/**
 * Used to extract information from filename for metadata update or import base.
 * The class DO NOT use fs library, NOT related with file system.
 * @class
 */
export class FilenameComparator {
  /**
    * @summary 返回文件名基名
    * @param {String} [filename] 文件名
    */
  static getBaseFilename = (filename) => {
    if (filename.lastIndexOf('.') == -1) return null
    return filename.substring(0, filename.lastIndexOf("."))
  }

  /**
    * @summary 返回文件名扩展名
    * @param {String} [filename] 文件名
    */
  static getExtFilename = (filename) => {
    if (filename.lastIndexOf('.') == -1) return null
    return filename.substring(filename.lastIndexOf(".") + 1)
  }

  /**
    * @summary 检查是否与PixivWebSTD文件名格式匹配
    * @param {String} [filename] 文件名
    */
  static isMatchPixivWeb = (filename) => {
    if (filename.lastIndexOf('.') == -1) return null
    return /^\d+_p\d+$/.test(this.getBaseFilename(filename))
  }

  /**
    * @summary 检查是否与Pxder文件名格式匹配
    * @param {String} [filename] 文件名
    */
  static isMatchPxder = (filename) => {
    if (filename.lastIndexOf('.') == -1) return null
    return /^\(\d+\)[\w\W]+(_p\d+)?$/.test(this.getBaseFilename(filename))
  }

  /**
    * @summary 检查所有可能的Pixiv文件名匹配，如果匹配则返回pid，否则返回null
    * @param {String} [filename] 文件名
    */
  static getMatchedPixivId = (filename) => {
    if (this.isMatchPxder(filename)) return /^\((\d+)\)[\w\W]+(_p\d+)?$/.exec(this.getBaseFilename(filename))[1]
    else if (this.isMatchPixivWeb(filename)) return /^(\d+)_p\d+$/.exec(this.getBaseFilename(filename))[1]
    else return null
  }
}