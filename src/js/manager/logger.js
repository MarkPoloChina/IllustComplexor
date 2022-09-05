import Lowdb from 'lowdb'
import FileSync from 'lowdb/adapters/FileSync'
import { PathAnalyzer } from "./PathAnalyzer";
import { Util } from './util';
import path from "path";

export class Logger {
  static newLog(obj) {
    let url = path.join(
      PathAnalyzer.getBaseUrl(),
      "/log",
      `/${Util.getThisTime()}.json`
    );
    const dbLog = Lowdb(new FileSync(url));
    dbLog.defaults(obj).write();
  }
}
