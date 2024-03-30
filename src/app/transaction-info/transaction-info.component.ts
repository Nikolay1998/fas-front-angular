import { NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Transaction } from '../_models/transaction';

@Component({
  selector: 'app-transaction-info',
  standalone: true,
  imports: [NgIf],
  templateUrl: './transaction-info.component.html',
  styleUrl: './transaction-info.component.css'
})
export class TransactionInfoComponent {
  @Input() transaction?: Transaction;
}
