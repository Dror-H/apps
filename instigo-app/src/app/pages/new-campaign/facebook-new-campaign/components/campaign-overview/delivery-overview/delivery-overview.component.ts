import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { currencies } from '@instigo-app/data-transfer-object';

@Component({
  selector: 'ingo-delivery-overview',
  templateUrl: './delivery-overview.component.html',
  styleUrls: ['./delivery-overview.component.scss'],
})
export class DeliveryOverviewComponent implements OnInit {
  @Input() deliverySettings: FormGroup;
  public currencyInfo;
  public currencyCode;

  ngOnInit(): void {
    this.currencyCode = this.deliverySettings.parent.get('settings.account').value.currency;
    this.currencyInfo = currencies.find((item) => item.Code === this.currencyCode);
  }
}
