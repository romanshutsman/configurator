import { Directive, forwardRef, Input } from '@angular/core';
import { NG_VALIDATORS, AbstractControl, ValidationErrors, Validator, FormControl } from '@angular/forms';
import { BaseSmartTag } from '../components/smart-tag-editor/base-smart-tag';
import { SharedService } from './shared.service';

@Directive({
  selector: '[validateName]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: CustomValidatorDirective, multi: true }
  ]
})
export class CustomValidatorDirective extends BaseSmartTag implements Validator {
  constructor(public service: SharedService) { super(service) }
  @Input() dataNode: any;

  validate(c: FormControl): ValidationErrors | null {
    return CustomValidatorDirective.validateSameName(c, this.dataNode);
  }
  static validateSameName(control: FormControl, dataNode): ValidationErrors | null {
    const names = [];
    let result;
    if (dataNode) {
      if(dataNode.parent && dataNode.selectedItem) {
        const label = dataNode.selectedItem.label;
        if (dataNode.parent.children.length) {
          dataNode.parent.children.forEach(element => names.push(element.label));
        }
        const ind = names.indexOf(label);
        if (ind > -1) {
          names.splice(ind, 1);
        }
        result = names.filter(item => control.value == item ? true : false)
        if (result.length > 0) {
          return { sameName: 'This name already exist!' };
        }
      } else {
        if (dataNode.selectedItem.children.length) {
          dataNode.selectedItem.children.forEach(element => names.push(element.label));
        }
        result = names.filter(item => control.value == item ? true : false)
        if (result.length > 0) {
          return { sameName: 'This name already exist!' };
        }
      }
    }
    return null;
  }
}
