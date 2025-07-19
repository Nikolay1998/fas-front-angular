import {BalanceChange} from "./balance-change";

export interface PeriodStats {
  balanceChange: BalanceChange[],
  inAndOut: BalanceChange[],
}
