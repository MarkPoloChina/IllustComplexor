export class BatchDto {
  conditionObject = null;
  addition = null;
  control = {
    asyncResult: false,
    addIfNotFound: false,
  };
  dtos = [];
  polyBase = null;
}
