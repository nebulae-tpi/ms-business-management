////////// ANGULAR //////////
import { Component, OnInit, Input, EventEmitter, Output, } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators
} from '@angular/forms';

//////////// ANGULAR MATERIAL
import { MatDialog, MatSnackBar } from '@angular/material';
import { TableDataSource, ValidatorService } from 'angular4-material-table';

////////// RXJS ///////////
import { first, filter, map } from 'rxjs/operators';

////////// COMPONENTS AND SERVICES //////////
import { BusinessDetailService } from '../business-detail.service';

export class Attribute {
  key: string;
  value: string;
}

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'business-contact-info',
  templateUrl: './business-contact-info.component.html',
  styleUrls: ['./business-contact-info.component.scss']
})
export class BusinessContactInfoComponent implements OnInit {


  ////////////// BUSINESS ATTRIBUTES //////////////
  _business: any;

  // FORM ////
  businessContactInfoForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private businessDetailService: BusinessDetailService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}


  ngOnInit() {
  }

  saveBusinessContactInfo() {
    this.businessDetailService.updateBusinessContactInfo$(this._business._id, this.businessContactInfoForm.getRawValue())
      .subscribe(() => { }, err => console.log(err), () => console.log('FINISHED'));
  }

  @Input()
  set business(businessInput: any) {
     this._business = businessInput;

     this.businessContactInfoForm = new FormGroup({
      whatsapp: new FormControl((this._business && this._business.contactInfo) ? this._business.contactInfo.whatsapp : null ),
      phone: new FormControl((this._business && this._business.contactInfo) ? this._business.contactInfo.phone : null),
      zello: new FormControl((this._business && this._business.contactInfo) ? this._business.contactInfo.zello : null)
    });
  }


}
