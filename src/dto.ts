type month = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
type day =
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14
  | 15
  | 16
  | 17
  | 18
  | 19
  | 20
  | 21
  | 22
  | 23
  | 24
  | 25
  | 26
  | 27
  | 28
  | 29
  | 30
  | 31;

type getUserTransactionType = {
  userID: string;
  walletID?: string;
  dateOption: {
    date?: Date;
    year?: number;
    month?: month;
    day?: day;
    range?: { start?: Date; end?: Date };
  };
};

type getUserBalanceType = {
  userID: string;
  walletID?: string;
  aggregation: "daily" | "weekly" | "monthly";
  range?: { start: Date; end: Date };
};

type getUserFinancialSummaryType = {
  userID: string;
  walletID?: string;
  range?: { start: Date; end: Date };
};

type getUserNetWorthCompositionType = {
  userID: string;
};

export type {
  getUserTransactionType,
  getUserBalanceType,
  getUserFinancialSummaryType,
  getUserNetWorthCompositionType,
  month,
  day,
};
