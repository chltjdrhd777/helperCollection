class transformerCore {
  constructor(public value: string) {}

  protected updateValue(updatedValue: string) {
    this.value = updatedValue;
    return this;
  }
}

export class InputTransformer extends transformerCore {
  constructor(value: string) {
    super(value);
  }

  number() {
    return this.updateValue(this.value.replace(/\D/, ''));
  }

  max(maxLength: number) {
    return this.updateValue(this.value.substring(0, Math.max(maxLength, 0)));
  }

  regex(regex: RegExp, replaceValue: any) {
    return this.updateValue(this.value.replace(regex, replaceValue));
  }
}
