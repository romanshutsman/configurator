import { Directive, forwardRef, Input } from '@angular/core';
import { BaseSmartTag } from '../base-smart-tag';
import { NG_VALIDATORS, Validator, FormControl, ValidationErrors } from '@angular/forms';
import { SharedService } from 'src/app/providers/shared.service';

@Directive({
  selector: '[validateMinValue]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: ValidateMinValueDirective, multi: true }
  ]
})
export class ValidateMinValueDirective extends BaseSmartTag implements Validator{
  constructor(public service: SharedService) { super(service) }
  @Input() dataNode: any;
  validate(c: FormControl): ValidationErrors | null {
    return ValidateMinValueDirective.validateMinValue(c, this.dataNode);
  }
  static validateMinValue(control: FormControl, node): ValidationErrors | null {
    if(node.Min > node.Max) {
      return { errMinMax: 'Min value cant be bigger than Max value!' };
    }
    return null;
  }

}