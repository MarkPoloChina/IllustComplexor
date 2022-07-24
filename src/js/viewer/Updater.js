// import fs from 'fs'
import path from 'path'
import { MetaDB } from '../manager/DBService'

export class Updater {
  static saveStar(url, star) {
    if (MetaDB.existMeta({ basePath: path.dirname(url), filename: path.basename(url) })) {
      MetaDB.updateMeta({ basePath: path.dirname(url), filename: path.basename(url) }, 'star', star)
    }
  }
}