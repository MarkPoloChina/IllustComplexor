export class Util {
  static getThisDate() {
    let date = new Date()
    return `${date.getFullYear()}${(date.getMonth() + 1).toString().length == 2 ? (date.getMonth() + 1) : '0' + (date.getMonth() + 1)}${(date.getDate()).toString().length == 2 ? (date.getDate()) : '0' + (date.getDate())}`
  }
  static getThisTime() {
    let date = new Date()
    return `${this.getThisDate()}_${date.getTime()}`
  }
}