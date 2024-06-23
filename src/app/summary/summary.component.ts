import { Component, OnInit } from '@angular/core';
import { SummaryHolderService } from '../_services/summary-holder.service';
import { Summary } from '../_models/summary';

@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [],
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.css'
})
export class SummaryComponent implements OnInit {

  summary!: Summary;

  constructor(
    private summaryHolder: SummaryHolderService,
  ) { }


  ngOnInit(): void {
    this.summaryHolder.currentSummary.subscribe(summary => this.onSummaryChanges(summary));
    this.summaryHolder.updateSummary();
  }

  private onSummaryChanges(summary: Summary): void {
    this.summary = summary;
  }

}
