import { Injectable } from '@angular/core';
import { NumberFormatter } from './number-formatter';

@Injectable({
  providedIn: 'root'
})
export class DateFormatter {

  constructor(
    public numberFormatter: NumberFormatter,
  ) {

  }

  format(date: Date): string {
    const dateObj = new Date(date)
    const day = this.numberFormatter.padNumber(dateObj.getDate())
    const month = this.numberFormatter.padNumber(dateObj.getMonth() + 1)
    const year = this.numberFormatter.padNumber(dateObj.getFullYear())
    return `${year}-${month}-${day}`
  }

}
