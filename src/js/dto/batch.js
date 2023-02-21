export class BatchDto {
  conditionObject = null;
  addition = null;
  control = {
    asyncResult: true,
    addIfNotFound: false,
  };
  dtos = [];
  polyBase = null;
}
