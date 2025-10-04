import {CommonModule} from '@angular/common';
import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {User} from './_models/user';
import {AuthenticationService} from './_services/authentication.service';
import {NodeHolderService} from "./_services/node-holder.service";
import {TransactionHolderService} from "./_services/transaction-holder.service";
import {SummaryHolderService} from "./_services/summary-holder.service";
import {CurrencyService} from "./_services/currency.service";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'financial-accounting-system';
  user?: User | null;

  constructor(private authenticationService: AuthenticationService,
              public nodeHolder: NodeHolderService,
              private transactionHolder: TransactionHolderService,
              private summaryHolder: SummaryHolderService,
              private currencyService: CurrencyService
  ) {

    this.authenticationService.user.subscribe(x => this.onUserAuthenticated(x));
  }

  onUserAuthenticated(user: User | null): void {
    this.user = user;
    if (user) {
      this.nodeHolder.updateNodes();
      this.summaryHolder.updateSummary();
      this.transactionHolder.updateTransactions();
      this.currencyService.updateCurrency();
    }
  }

  logout() {
    this.authenticationService.logout();
  }
}
