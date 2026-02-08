import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Transaction } from '../_models/transaction';
import { TransactionService } from './transaction.service';

@Injectable({
  providedIn: 'root'
})
export class TransactionHolderService {

  private emptyTransactions: Transaction[] = [];
  private transactionSource = new BehaviorSubject(this.emptyTransactions);
  currentTransactions = this.transactionSource.asObservable();

  constructor(
    public transactionService: TransactionService,
  ) { }

  updateTransactions() {
    this.transactionService.getTransactions().subscribe(transactions => this.transactionSource.next(transactions));
  }
}
