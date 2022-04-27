export class MessageValidateService {
  static getValidatorMessage(fieldName: string, validatorName: string, validatorValue?: any) {
      let config: { [key: string]: string } = {
          'pattern': `${fieldName} không đúng định dạng`,
          'required': `${fieldName} không được để trống`,
          'minlength': `${fieldName} không được ngắn hơn hơn ${validatorValue.requiredLength} ký tự`,
          'maxlength': `${fieldName} không được dài quá ${validatorValue.requiredLength} ký tự`,
          'min': `${fieldName} không được nhỏ hơn ${validatorValue.min}`,
          'max': `${fieldName} không được lớn hơn ${validatorValue.max}`
      };
      const getKeyValue = <T extends object, U extends keyof T>(obj: T) => (key: U) =>
          obj[key];
      return getKeyValue(config)(validatorName);
  }

}