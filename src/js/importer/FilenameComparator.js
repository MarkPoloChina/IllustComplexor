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
    if (filename.lastIndexOf(".") == -1) return null;
    return filename.substring(0, filename.lastIndexOf("."));
  };

  /**
   * @summary 返回文件名扩展名
   * @param {String} [filename] 文件名
   */
  static getExtFilename = (filename) => {
    if (filename.lastIndexOf(".") == -1) return null;
    return filename.substring(filename.lastIndexOf(".") + 1);
  };

  /**
   * @summary 检查是否与PixivWebSTD文件名格式匹配
   * @param {String} [filename] 文件名
   */
  static isMatchPixivWeb = (filename) => {
    if (filename.lastIndexOf(".") == -1) return null;
    return /^\d+_p\d+$/.test(this.getBaseFilename(filename));
  };

  /**
   * @summary 检查是否与Pxder文件名格式匹配
   * @param {String} [filename] 文件名
   */
  static isMatchPxder = (filename) => {
    if (filename.lastIndexOf(".") == -1) return null;
    return /^\(\d+\)/.test(this.getBaseFilename(filename));
  };

  /**
   * @summary 检查所有可能的Pixiv文件名匹配，如果匹配则返回pid，否则返回null
   * @param {String} [filename] 文件名
   */
  static getMatchedPixivId = (filename) => {
    if (this.isMatchPxder(filename))
      return /^\((\d+)\)/.exec(this.getBaseFilename(filename))[1];
    else if (this.isMatchPixivWeb(filename))
      return /^(\d+)_p\d+$/.exec(this.getBaseFilename(filename))[1];
    else if (this.isMatchPixivWebWithBookmark(filename))
      return /^\d+ - (\d+)_p\d+$/.exec(this.getBaseFilename(filename))[1];
    else if (this.isMatchPixivWebWithBookmarkRank(filename))
      return /^\d+ - \d+ - (\d+)_p\d+$/.exec(this.getBaseFilename(filename))[1];
    else return null;
  };

  /**
   * @summary 检查所有可能的Pixiv文件名匹配，如果匹配则返回页数编号，否则返回null
   * @param {String} [filename] 文件名
   */
  static getMatchedPixivPage = (filename) => {
    if (this.isMatchPxder(filename)) {
      if (/_p(\d+)$/.test(this.getBaseFilename(filename)))
        return /_p(\d+)$/.exec(this.getBaseFilename(filename))[1];
      else return "0";
    } else if (this.isMatchPixivWeb(filename))
      return /^\d+_p(\d+)$/.exec(this.getBaseFilename(filename))[1];
    else if (this.isMatchPixivWebWithBookmark(filename))
      return /^\d+ - \d+_p(\d+)$/.exec(this.getBaseFilename(filename))[1];
    else if (this.isMatchPixivWebWithBookmarkRank(filename))
      return /^\d+ - \d+ - \d+_p(\d+)$/.exec(this.getBaseFilename(filename))[1];
    else return null;
  };

  /**
   * @summary 获取pxder格式的Pixiv图片标题，如果不是pxder格式文件则返回null
   * @param {String} [filename] 文件名
   */
  static getPxderPixivTitle = (filename) => {
    if (this.isMatchPxder(filename)) {
      if (/_p(\d+)$/.test(this.getBaseFilename(filename)))
        return /^\(\d+\)(.*)?_p\d+$/.exec(this.getBaseFilename(filename))[1] ===
          undefined
          ? ""
          : /^\(\d+\)(.*)?_p\d+$/.exec(this.getBaseFilename(filename))[1];
      else
        return /^\(\d+\)(.*)?$/.exec(this.getBaseFilename(filename))[1] ===
          undefined
          ? ""
          : /^\(\d+\)(.*)?$/.exec(this.getBaseFilename(filename))[1];
    } else return null;
  };

  /**
   * @summary 通过扩展名判断文件是否可能是图片
   * @param {String} [filename] 文件名
   */
  static isLikeImage = (filename) => {
    return this.getExtFilename(filename).toLowerCase() == 'jpg' || this.getExtFilename(filename).toLowerCase() == 'png' || this.getExtFilename(filename).toLowerCase() == 'jpeg' || this.getExtFilename(filename).toLowerCase() == 'gif'
  }

  static test = () => {
    console.log(this.getPxderPixivTitle("(39339193) .jpg"));
  };

  /**
   * @summary 检查是否与带bookmark数量的PixivWeb文件名格式匹配
   * @param {String} [filename] 文件名
   */
  static isMatchPixivWebWithBookmark = (filename) => {
    if (filename.lastIndexOf(".") == -1) return null;
    return /^\d+ - \d+_p\d+$/.test(this.getBaseFilename(filename))
  }

  static isMatchPixivWebWithBookmarkRank = (filename) => {
    if (filename.lastIndexOf(".") == -1) return null;
    return /^\d+ - \d+ - \d+_p\d+$/.test(this.getBaseFilename(filename));
  };

  static getPixivWebWithBookmarkBookCnt = (filename) => {
    if (this.isMatchPixivWebWithBookmark(filename))
      return /^(\d+) - \d+_p\d+$/.exec(this.getBaseFilename(filename))[1]
    else if (this.isMatchPixivWebWithBookmarkRank(filename))
      return /^\d+ - (\d+) - \d+_p\d+$/.exec(this.getBaseFilename(filename))[1]
    return null
  }
}
