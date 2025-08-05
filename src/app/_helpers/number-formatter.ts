import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NumberFormatter {

  format(num: number): String {
    return new Intl.NumberFormat('ru', { minimumFractionDigits: 0 }).format(num)
  }

  padNumber(num: number | string): string {
    return Number(num) > 9 ? String(num) : `0${num}`
  }
}
