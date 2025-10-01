import {KeyValuePipe, NgFor, NgIf} from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {NumberFormatter} from '../_helpers/number-formatter';
import {SummaryHolderService} from '../_services/summary-holder.service';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CurrencyService} from "../_services/currency.service";
import {Currency} from "../_models/currency";
import {PeriodStats} from "../_models/period-stats";
import {VisibleSections} from "./visible-sections";
import {RateService} from "../_services/rate.service";
import {BalanceChange} from "../_models/balance-change";


@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [NgIf, NgFor, KeyValuePipe, ReactiveFormsModule, FormsModule],
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.css'
})
export class SummaryComponent implements OnInit {

  summary!: Map<string, number>;
  currencies: Currency[] = [];
  periodStats!: PeriodStats;

  summaryEquivalent: Map<string, number> = new Map<string, number>();
  balanceChangeEquivalent: Map<string, number> = new Map<string, number>();
  expensesEquivalent: Map<string, number> = new Map<string, number>();
  incomeEquivalent: Map<string, number> = new Map<string, number>();

  summaryCurrencies: string[] = [];
  balanceChangeCurrencies: string[] = [];
  expensesCurrencies: string[] = [];
  incomeCurrencies: string[] = [];

  summarySelectedCurrency: string | null = null;
  balanceChangeSelectedCurrency: string | null = null;
  expensesSelectedCurrency: string | null = null;
  incomeSelectedCurrency: string | null = null;

  expandedRows: { [key: number]: boolean } = {};

  balanceChangeForm = new FormGroup({
    from: new FormControl(),
    to: new FormControl(),
  })
  defaultFromDate;
  defaultToDate = new Date().toISOString().split('T')[0];

  constructor(
    private summaryHolder: SummaryHolderService,
    public numberFormatter: NumberFormatter,
    private currencyService: CurrencyService,
    private rateService: RateService
  ) {
    this.defaultFromDate = this.getFromDate();
  }

  sectionsVisible: VisibleSections = {
    summary: true,
    balance: true,
    expenses: true,
    incomes: true
  };


  toggleSection(section: keyof VisibleSections) {
    this.sectionsVisible[section] = !this.sectionsVisible[section];
  }

  ngOnInit(): void {
    console.log("NgOnInit summary called ")
    this.balanceChangeForm.controls['from'].valueChanges.subscribe(value => {
        this.summaryHolder.setFrom = value;
      }
    );

    this.balanceChangeForm.controls['to'].valueChanges.subscribe(value => {
        this.summaryHolder.setTo = value;
      }
    );

    this.balanceChangeForm.controls['from'].setValue(this.defaultFromDate);
    this.balanceChangeForm.controls['to'].setValue(this.defaultToDate);

    this.currencyService.currentCurerncies.subscribe(currencies => this.currencies = currencies);
    this.summaryHolder.currentSummary.subscribe(summary => this.onSummaryChanges(summary));
    this.summaryHolder.currentPeriodStats.subscribe(balanceChange => this.onPeriodStatsChange(balanceChange));
  }

  private onSummaryChanges(summary: Map<string, number>): void {
    this.summary = summary;
    if (summary) {
      let balanceChangeMap = this.transformToMap(summary);
      this.rateService.getEquivalents(balanceChangeMap).subscribe(eq => {
        // if (eq) {
        this.summaryEquivalent = this.transformToMap(eq);
        this.summaryCurrencies = Array.from(this.summaryEquivalent.keys());
        if (!this.summarySelectedCurrency) {
          this.summarySelectedCurrency = this.summaryCurrencies[0] || null;
          // }
        }
      })
    }
  }

  private getFromDate(): string {
    const date = new Date();
    date.setMonth(date.getMonth() - 1);
    return date.toISOString().split('T')[0];
  }

  getSumByKey(key: string | null, equivalents: Map<string, number>): number {
    return equivalents?.get(key ?? "USD") ?? 0;
  }

  private transformToMap(any: any): Map<string, number> {
    return new Map<string, number>(
      Object.entries(any)
    );
  }

  private onPeriodStatsChange(periodStats: PeriodStats): void {
    this.periodStats = periodStats;
    if (periodStats && periodStats.balanceChange) {
      let balanceChangeMap: Map<string, number> = new Map<string, number>();
      periodStats.balanceChange.forEach((change: BalanceChange) => {
        balanceChangeMap.set(change.currencyId, change.totalChange);
      });
      this.rateService.getEquivalents(balanceChangeMap).subscribe(eq => {
        // if (eq) {
        this.balanceChangeEquivalent = this.transformToMap(eq);
        this.balanceChangeCurrencies = Array.from(this.balanceChangeEquivalent.keys());
        if (!this.balanceChangeSelectedCurrency) {
          this.balanceChangeSelectedCurrency = this.balanceChangeCurrencies[0] || null;
        }
        // }
      })
    }

    if (periodStats && periodStats.inAndOut) {
      let incomeMap: Map<string, number> = new Map<string, number>();
      let outgoMap: Map<string, number> = new Map<string, number>();
      periodStats.inAndOut.forEach((change: BalanceChange) => {
        incomeMap.set(change.currencyId, change.income);
        outgoMap.set(change.currencyId, change.outgo);
      });
      this.rateService.getEquivalents(incomeMap).subscribe(eq => {
        // if (eq) {
        this.incomeEquivalent = this.transformToMap(eq);
        this.incomeCurrencies = Array.from(this.incomeEquivalent.keys());
        if (!this.incomeSelectedCurrency) {
          this.incomeSelectedCurrency = this.incomeCurrencies[0] || null;
        }
        // }
      })

      this.rateService.getEquivalents(outgoMap).subscribe(eq => {
        // if (eq) {
        this.expensesEquivalent = this.transformToMap(eq);
        this.expensesCurrencies = Array.from(this.expensesEquivalent.keys());
        if (!this.expensesSelectedCurrency) {
          this.expensesSelectedCurrency = this.expensesCurrencies[0] || null;
        }
        // }
      })
    }
  }

  getCurrencySymbolById(id: String): string {
    return this.currencies.filter(cur => cur.id == id)[0].symbol;
  }

  getCurrencyNameById(id: String): string {
    return this.currencies.filter(cur => cur.id == id)[0].fullName;
  }

  toggleRow(index: number): void {
    this.expandedRows[index] = !this.expandedRows[index];
  }
}
