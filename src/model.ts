import { model, Schema } from "mongoose";

const userTransaction: Schema = new Schema({
  UserID: String,

  WalletID: String,
  WalletName: String,
  WalletType: String,

  CategoryID: String,
  CategoryName: String,
  CategoryType: String,

  Date: Date,
  Year: Number,
  Month: String,
  Day: Number,

  TotalAmount: Number,
  TransactionCount: Number,
  Transactions: [
    {
      ID: String,
      Description: String,
      Date: Date,
    },
  ],

  CreatedAt: { type: Date, default: Date.now },
  UpdatedAt: { type: Date, default: Date.now },
});

userTransaction.index({ UserID: 1, Date: 1, WalletID: 1 }, { unique: true });
userTransaction.index({ UserID: 1, Date: 1, CategoryID: 1 }, { unique: true });
userTransaction.index({ UserID: 1, Year: 1, Month: 1 });
userTransaction.index({ UserID: 1, Year: 1, Week: 1 });

const userBalance: Schema = new Schema({
  UserID: String,

  WalletID: String,
  WalletName: String,

  Date: Date,
  Year: Number,
  Month: String,
  Week: String,
  Day: Number,
  IsMonthStart: Boolean,
  IsWeekStart: Boolean,

  OpeningBalance: Number,
  ClosingBalance: Number,

  TotalIncome: Number,
  TotalExpense: Number,
  NetChange: Number,
  TransactionCount: Number,

  CumulativeIncome: Number,
  CumulativeExpense: Number,

  CreatedAt: { type: Date, default: Date.now },
  UpdatedAt: { type: Date, default: Date.now },
});

userBalance.index({ WalletID: 1, Date: 1 }, { unique: true });
userBalance.index({ UserID: 1, Date: 1 });

const userFinancialSummaries: Schema = new Schema({
  UserID: String,

  PeriodType: String,
  PeriodKey: String,
  PeriodStart: Date,
  PeriodEnd: Date,

  IncomeNow: Number,
  ExpenseNow: Number,
  ProfitNow: Number,
  BalanceNow: Number,

  IncomePrev: Number,
  ExpensePrev: Number,
  ProfitPrev: Number,
  BalancePrev: Number,

  IncomeGrowthPct: Number,
  ExpenseGrowthPct: Number,
  ProfitGrowthPct: Number,
  BalanceGrowthPct: Number,

  SavingsRate: Number,
  ExpenseToIncomeRatio: Number,
  BurnRateDaily: Number,
  AvgIncomeDaily: Number,
  AvgExpenseDaily: Number,
  RunwayDays: Number,

  TotalTransactions: Number,
  IncomeTransactionCount: Number,
  ExpenseTransactionCount: Number,
  AvgTransactionAmount: Number,
  LargestIncome: Number,
  LargestExpense: Number,

  InvestmentSummary: {
    TotalInvested: Number,
    TotalCurrentValuation: Number,
    TotalSoldAmount: Number,
    TotalDeficit: Number,
    UnrealizedGain: Number,
    RealizedGain: Number,
    InvestmentGrowthPct: Number,
    BuyCount: Number,
    SellCount: Number,
    ActivePositions: Number,
  },

  NetWorth: {
    Total: Number,
    WalletPortion: Number,
    InvestmentPortion: Number,
    NetWorthPrev: Number,
    NetWorthGrowthPct: Number,
  },

  TopExpenseCategories: [
    {
      CategoryID: String,
      CategoryName: String,
      Amount: Number,
      Percentage: Number,
      TransactionCount: Number,
    },
  ],
  TopIncomeCategories: [
    {
      CategoryID: String,
      CategoryName: String,
      Amount: Number,
      Percentage: Number,
      TransactionCount: Number,
    },
  ],

  WalletSummaries: [
    {
      WalletID: String,
      WalletName: String,
      WalletType: String,
      OpeningBalance: Number,
      ClosingBalance: Number,
      Income: Number,
      Expense: Number,
      NetChange: Number,
      ShareOfBalancePct: Number,
    },
  ],

  CreatedAt: { type: Date, default: Date.now },
  UpdatedAt: { type: Date, default: Date.now },
});

userFinancialSummaries.index({ UserID: 1, PeriodKey: 1 }, { unique: true });
userFinancialSummaries.index({ UserID: 1, PeriodType: 1, PeriodStart: 1 });

const userNetWorthComposition: Schema = new Schema({
  UserID: String,
  Total: Number,
  Slices: [
    {
      Label: String,
      Amount: Number,
      Percentage: Number,
      Details: {},
    },
  ],

  CreatedAt: { type: Date, default: Date.now },
  UpdatedAt: { type: Date, default: Date.now },
});

userNetWorthComposition.index({ UserID: 1 });

export const userTransactionModel = model("UserTransaction", userTransaction);
export const userBalanceModel = model("UserBalance", userBalance);
export const userFinancialSummariesModel = model(
  "UserFinancialSummaries",
  userFinancialSummaries,
);
export const userNetWorthCompositionModel = model(
  "UserNetWorthComposition",
  userNetWorthComposition,
);
