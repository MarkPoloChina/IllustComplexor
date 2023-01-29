import { FilterDto } from "./fliter.dto";
import { IllustDto } from "./illust.dto";
import { PolyDto } from "./poly.dto";

export class BodyDto {
  constructor() {
    this.controller = {
      bidMap: {},
    };
    this.illustDtos = [new IllustDto()];
    this.polyDto = new PolyDto();
    this.filterCondition = new FilterDto();
  }
  illustDtos;
  filterCondition;
  polyDto;
  controller;
}
