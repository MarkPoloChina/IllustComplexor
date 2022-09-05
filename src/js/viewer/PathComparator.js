import { FilenameComparator } from "../importer/FilenameComparator";
import path from "path";
// const IHSCloud = 'https://mp-ihs-1303103554.cos.ap-nanjing.myqcloud.com/mpsic'
const IHSLocal = 'E:\\Pictures\\MPIHS\\SIC'
export class PathComparator {
  static getSTDFromURL(url) {
    let filename_ori = path.basename(url);
    if (FilenameComparator.isMatchPixivWeb(filename_ori)) {
      return `${FilenameComparator.getBaseFilename(filename_ori)}.jpg`;
    }
    let id = FilenameComparator.getMatchedPixivId(filename_ori);
    let page = FilenameComparator.getMatchedPixivPage(filename_ori);
    if (id && page) return `${id}_p${page}.jpg`;
    else return "";
  }

  static getMPSIC(url) {
    return `${IHSLocal}\\${this.getSTDFromURL(
      url
    )}`;
  }
}
