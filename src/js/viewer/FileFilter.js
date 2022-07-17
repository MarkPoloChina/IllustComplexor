import fs from 'fs'
import path from 'path'

export class FilesFilter {
  static test() {
    const base = 'E:\\Pictures\\wallpaper'
    let list = []
    fs.readdirSync(base).forEach(filename => {
      list.push(path.join(base, filename))
    })
    return list
  }
}