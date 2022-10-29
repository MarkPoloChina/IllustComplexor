export class UtilDate {
  /**
   * @summary Get ISO from Date CST shaped as YYYY-MM-DD or YYYYMMDD or YYYY/MM/DD (for CST)
   * @param {String} [string] date string
   */
  static getISOFromDateCST(string) {
    if (/^(\d\d\d\d)-(\d\d)-(\d\d)$/.test(string)) {
      let date = new Date(`${string}T00:00:00+08:00`);
      return date.toISOString();
    } else if (/^(\d\d\d\d\d\d\d\d)$/.test(string)) {
      let date = new Date(
        `${string.slice(0, 4)}-${string.slice(4, 6)}-${string.slice(
          6,
          8
        )}T00:00:00+08:00`
      );
      return date.toISOString();
    } else if (/^(\d\d\d\d)\/(\d\d)\/(\d\d)$/.test(string)) {
      let date = new Date(`${string.replace(/[/]/g, "-")}T00:00:00+08:00`);
      return date.toISOString();
    } else return null;
  }

  /**
   * @summary Get Date CST shaped as YYYY${desp}MM${desp}DD from a Date Object
   * @param {Date} [date] date object
   * @param {String} [desp] desp string
   */
  static getDateCST(date, desp) {
    let str = date.toISOString();
    let _date = new Date(str.replace("Z", "-08:00"));
    return _date.toISOString().slice(0, 10).replace(/[-]/g, desp);
  }

  /**
   * @summary Get Date JST shaped as YYYY${desp1}MM${desp1}DD${desp2}hh${desp3}mm${desp3}dd from a Date Object
   * @param {Date} [date] date object
   * @param {String} [desp1] desp string1
   * @param {String} [desp2] desp string2
   * @param {String} [desp3] desp string3
   */
  static getDateTimeJST(date, desp1, desp2, desp3) {
    let str = date.toISOString();
    let _date = new Date(str.replace("Z", "-09:00"));
    return _date
      .toISOString()
      .slice(0, 19)
      .replace(/[-]/g, desp1)
      .replace("T", desp2)
      .replace(/[:]/g, desp3);
  }
}
