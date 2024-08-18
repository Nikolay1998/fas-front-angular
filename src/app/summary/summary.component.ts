import { KeyValuePipe, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NumberFormatter } from '../_helpers/number-formatter';
import { SummaryHolderService } from '../_services/summary-holder.service';


@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [NgIf, NgFor, KeyValuePipe],
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.css'
})
export class SummaryComponent implements OnInit {

  summary!: Map<string, number>;

  constructor(
    private summaryHolder: SummaryHolderService,
    public numberFormatter: NumberFormatter,
  ) { }


  ngOnInit(): void {
    this.summaryHolder.currentSummary.subscribe(summary => this.onSummaryChanges(summary));
    this.summaryHolder.updateSummary();
  }

  private onSummaryChanges(summary: Map<string, number>): void {
    this.summary = summary;
  }
}
