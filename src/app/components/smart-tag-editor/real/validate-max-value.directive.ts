import { Directive, forwardRef, Input } from '@angular/core';
import { BaseSmartTag } from '../base-smart-tag';
import { NG_VALIDATORS, Validator, FormControl, ValidationErrors } from '@angular/forms';
import { SharedService } from 'src/app/providers/shared.service';

@Directive({
  selector: '[validateMaxValue]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: ValidateMaxValueDirective, multi: true }
  ]
})
export class ValidateMaxValueDirective extends BaseSmartTag implements Validator{
  constructor(public service: SharedService) { super(service) }
  @Input() dataNode: any;
  validate(c: FormControl): ValidationErrors | null {
    return ValidateMaxValueDirective.validateMaxValue(c, this.dataNode);
  }
  static validateMaxValue(control: FormControl, node): ValidationErrors | null {
    if(node.Min > node.Max) {
      return { errMinMax: 'Max value cant be less than Min value!' };
    }
    return null;
  }

}