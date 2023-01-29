export class IllustDto {
  constructor(type, star, date, pid, page, title) {
    this.type = type;
    this.star = star;
    this.date = date;
    this.meta = {
      pid: pid,
      page: page,
      title: title,
    };
  }
  type;
  star;
  date;
  meta;
}
