# Query Examples

## 1. Get Total Transaction per Category

### Usage Examples

```typescript
import { getUserTransaction } from "./src/service";

// ═══════════════════════════════════════════════
// 1. BY EXACT DATE & SPECIFIC WALLET
// ═══════════════════════════════════════════════
const result1 = await getUserTransaction({
  userID: "user-uuid",
  walletID: "wallet-uuid",
  dateOption: {
    date: new Date("2026-02-12"),
  },
});

// ═══════════════════════════════════════════════
// 2. BY YEAR & SPECIFIC WALLET
// ═══════════════════════════════════════════════
const result2 = await getUserTransaction({
  userID: "user-uuid",
  walletID: "wallet-uuid",
  dateOption: {
    year: 2026,
  },
});

// ═══════════════════════════════════════════════
// 3. BY YEAR & MONTH & SPECIFIC WALLET
// ═══════════════════════════════════════════════
const result3 = await getUserTransaction({
  userID: "user-uuid",
  walletID: "wallet-uuid",
  dateOption: {
    year: 2026,
    month: 2,
  },
});

// ═══════════════════════════════════════════════
// 4. BY YEAR, MONTH, & DAY & SPECIFIC WALLET
// ═══════════════════════════════════════════════
const result4 = await getUserTransaction({
  userID: "user-uuid",
  walletID: "wallet-uuid",
  dateOption: {
    year: 2026,
    month: 2,
    day: 12,
  },
});

// ═══════════════════════════════════════════════
// 5. BY DATE RANGE & SPECIFIC WALLET
// ═══════════════════════════════════════════════
const result5 = await getUserTransaction({
  userID: "user-uuid",
  walletID: "wallet-uuid",
  dateOption: {
    range: {
      start: new Date("2026-01-01"),
      end: new Date("2026-02-12"),
    },
  },
});

// ═══════════════════════════════════════════════
// 6. BY EXACT DATE - ALL WALLETS
// ═══════════════════════════════════════════════
const result6 = await getUserTransaction({
  userID: "user-uuid",
  // walletID: undefined, // or omit walletID
  dateOption: {
    date: new Date("2026-02-12"),
  },
});

// ═══════════════════════════════════════════════
// 7. BY YEAR - ALL WALLETS
// ═══════════════════════════════════════════════
const result7 = await getUserTransaction({
  userID: "user-uuid",
  dateOption: {
    year: 2026,
  },
});

// ═══════════════════════════════════════════════
// 8. BY YEAR & MONTH - ALL WALLETS
// ═══════════════════════════════════════════════
const result8 = await getUserTransaction({
  userID: "user-uuid",
  dateOption: {
    year: 2026,
    month: 2,
  },
});

// ═══════════════════════════════════════════════
// 9. BY YEAR, MONTH, & DAY - ALL WALLETS
// ═══════════════════════════════════════════════
const result9 = await getUserTransaction({
  userID: "user-uuid",
  dateOption: {
    year: 2026,
    month: 2,
    day: 12,
  },
});

// ═══════════════════════════════════════════════
// 10. BY DATE RANGE - ALL WALLETS
// ═══════════════════════════════════════════════
const result10 = await getUserTransaction({
  userID: "user-uuid",
  dateOption: {
    range: {
      start: new Date("2026-01-01"),
      end: new Date("2026-02-12"),
    },
  },
});

// ═══════════════════════════════════════════════
// 11. ALL TIME - ALL WALLETS (No date filter)
// ═══════════════════════════════════════════════
const result11 = await getUserTransaction({
  userID: "user-uuid",
  dateOption: {},
});
```

## Response Format

```typescript
[
  {
    CategoryID: "category-uuid-1",
    CategoryName: "Food & Beverage",
    CategoryType: "expense",
    TotalAmount: 4500000.0,
    TotalTransactions: 30,
  },
  {
    CategoryID: "category-uuid-2",
    CategoryName: "Salary",
    CategoryType: "income",
    TotalAmount: 12000000.0,
    TotalTransactions: 1,
  },
  // ... sorted by TotalAmount descending
];
```

## Query Logic Priority

1. **Exact Date** (highest priority) - if `date` is provided
2. **Date Range** - if `range.start` and `range.end` are provided
3. **Year + Month + Day** - if all three are provided
4. **Year + Month** - if both are provided
5. **Year Only** - if only year is provided
6. **All Time** - if no date filters are provided (empty `dateOption`)

## Wallet Filtering

- If `walletID` is provided → filter by specific wallet
- If `walletID` is **undefined** or **omitted** → query all wallets

## MongoDB Aggregation Pipeline

The function uses MongoDB aggregation with these stages:

1. **$match** - Filter by UserID, WalletID (optional), and Date conditions
2. **$group** - Group by CategoryID, CategoryName, CategoryType and sum amounts
3. **$sort** - Sort by TotalAmount in descending order
4. **$project** - Clean up the output format

## Notes

- All date comparisons use the `Date` field from the schema
- Year/Month/Day comparisons use the respective fields for faster queries
- The function leverages the indexes defined in the schema for optimal performance

---

## 2. Get User Balance

### Usage Examples

```typescript
import { getUserBalance } from "./src/service";

// ═══════════════════════════════════════════════
// 1. DAILY BALANCE - SPECIFIC WALLET - WITH RANGE
// ═══════════════════════════════════════════════
// Get daily balance for last 7 days
const daily1 = await getUserBalance({
  userID: "user-uuid",
  walletID: "wallet-uuid",
  aggregation: "daily",
  range: {
    start: new Date("2026-02-06"),
    end: new Date("2026-02-12"),
  },
});

// ═══════════════════════════════════════════════
// 2. DAILY BALANCE - ALL WALLETS - WITH RANGE
// ═══════════════════════════════════════════════
const daily2 = await getUserBalance({
  userID: "user-uuid",
  aggregation: "daily",
  range: {
    start: new Date("2026-02-06"),
    end: new Date("2026-02-12"),
  },
});

// ═══════════════════════════════════════════════
// 3. DAILY BALANCE - SPECIFIC WALLET - ALL TIME
// ═══════════════════════════════════════════════
const daily3 = await getUserBalance({
  userID: "user-uuid",
  walletID: "wallet-uuid",
  aggregation: "daily",
});

// ═══════════════════════════════════════════════
// 4. WEEKLY BALANCE - SPECIFIC WALLET - 4 WEEKS
// ═══════════════════════════════════════════════
const weekly1 = await getUserBalance({
  userID: "user-uuid",
  walletID: "wallet-uuid",
  aggregation: "weekly",
  range: {
    start: new Date("2026-01-19"),
    end: new Date("2026-02-12"),
  },
});

// ═══════════════════════════════════════════════
// 5. WEEKLY BALANCE - ALL WALLETS - 4 WEEKS
// ═══════════════════════════════════════════════
const weekly2 = await getUserBalance({
  userID: "user-uuid",
  aggregation: "weekly",
  range: {
    start: new Date("2026-01-19"),
    end: new Date("2026-02-12"),
  },
});

// ═══════════════════════════════════════════════
// 6. MONTHLY BALANCE - SPECIFIC WALLET - 12 MONTHS
// ═══════════════════════════════════════════════
const monthly1 = await getUserBalance({
  userID: "user-uuid",
  walletID: "wallet-uuid",
  aggregation: "monthly",
  range: {
    start: new Date("2025-03-01"),
    end: new Date("2026-02-12"),
  },
});

// ═══════════════════════════════════════════════
// 7. MONTHLY BALANCE - ALL WALLETS - 12 MONTHS
// ═══════════════════════════════════════════════
const monthly2 = await getUserBalance({
  userID: "user-uuid",
  aggregation: "monthly",
  range: {
    start: new Date("2025-03-01"),
    end: new Date("2026-02-12"),
  },
});

// ═══════════════════════════════════════════════
// 8. MONTHLY BALANCE - ALL WALLETS - ALL TIME
// ═══════════════════════════════════════════════
const monthly3 = await getUserBalance({
  userID: "user-uuid",
  aggregation: "monthly",
});
```

### Response Format

#### Daily Aggregation (Specific Wallet)

```typescript
[
  {
    WalletID: "wallet-uuid",
    WalletName: "BCA Main",
    Date: "2026-02-06T00:00:00.000Z",
    Year: 2026,
    Month: "February",
    Day: 6,
    OpeningBalance: 15000000.0,
    ClosingBalance: 15500000.0,
    TotalIncome: 1000000.0,
    TotalExpense: 500000.0,
    NetChange: 500000.0,
    TransactionCount: 5,
  },
  // ... 7 documents (one per day)
];
```

#### Weekly Aggregation (Specific Wallet)

```typescript
[
  {
    Year: 2026,
    Week: "W06",
    OpeningBalance: 14000000.0, // Saldo awal minggu
    ClosingBalance: 17000000.0, // Saldo akhir minggu
    TotalIncome: 5000000.0,
    TotalExpense: 2000000.0,
    NetChange: 3000000.0,
    TotalTransactions: 35,
  },
  // ... 4 documents (one per week)
];
```

#### Monthly Aggregation (All Wallets)

```typescript
[
  {
    Year: 2026,
    Month: "January",
    WalletID: "wallet-uuid-1",
    WalletName: "BCA Main",
    OpeningBalance: 10000000.0, // Saldo awal bulan
    ClosingBalance: 15000000.0, // Saldo akhir bulan
    TotalIncome: 12000000.0,
    TotalExpense: 7000000.0,
    NetChange: 5000000.0,
    TotalTransactions: 85,
  },
  {
    Year: 2026,
    Month: "January",
    WalletID: "wallet-uuid-2",
    WalletName: "Mandiri Savings",
    OpeningBalance: 5000000.0,
    ClosingBalance: 6000000.0,
    TotalIncome: 2000000.0,
    TotalExpense: 1000000.0,
    NetChange: 1000000.0,
    TotalTransactions: 20,
  },
  // ... more documents (grouped by Year, Month, and WalletID)
];
```

### Aggregation Types

1. **`daily`** - Returns raw daily balance snapshots
   - No aggregation, just filtered and sorted
   - Use for: Daily trend charts, detailed day-by-day view

2. **`weekly`** - Aggregates balance by Year + Week
   - Groups documents by Year and Week
   - `OpeningBalance`: First balance of the week
   - `ClosingBalance`: Last balance of the week
   - Use for: Weekly trend charts, 4-8 weeks view

3. **`monthly`** - Aggregates balance by Year + Month
   - Groups documents by Year and Month
   - `OpeningBalance`: First balance of the month
   - `ClosingBalance`: Last balance of the month
   - Use for: Monthly trend charts, 6-12 months view

### Filtering Options

- **`userID`** (Required) - User identifier
- **`walletID`** (Optional)
  - If provided → specific wallet only
  - If omitted → all wallets (grouped separately in weekly/monthly)
- **`aggregation`** (Required) - `"daily"` | `"weekly"` | `"monthly"`
- **`range`** (Optional)
  - If provided → filter by date range
  - If omitted → all time

### MongoDB Operations

#### Daily

- Uses `find()` with sort
- No aggregation pipeline needed
- Simple and fast

#### Weekly & Monthly

- Uses `aggregate()` pipeline:
  1. **$match** - Filter by UserID, WalletID (optional), Date range (optional)
  2. **$sort** - Sort by Date (for $first and $last operators)
  3. **$group** - Group by Year + Week/Month (+ WalletID if all wallets)
  4. **$sort** - Sort results by Year + Week/Month
  5. **$project** - Clean output format

### Notes

- `OpeningBalance` uses `$first` (first document in group after sorting)
- `ClosingBalance` uses `$last` (last document in group after sorting)
- When querying all wallets, weekly/monthly results are grouped per wallet
- All amounts are summed within each period
- Leverages indexes on `UserID`, `WalletID`, and `Date` for performance

---

## 3. Get User Financial Summary

### Usage Examples

```typescript
import { getUserFinancialSummary } from "./src/service";

// ═══════════════════════════════════════════════
// 1. ALL TIME - ALL WALLETS
// ═══════════════════════════════════════════════
const summary1 = await getUserFinancialSummary({
  userID: "user-uuid",
});

// ═══════════════════════════════════════════════
// 2. SPECIFIC DATE RANGE - ALL WALLETS
// ═══════════════════════════════════════════════
// Get summaries for last 6 months
const summary2 = await getUserFinancialSummary({
  userID: "user-uuid",
  range: {
    start: new Date("2025-08-01"),
    end: new Date("2026-02-28"),
  },
});

// ═══════════════════════════════════════════════
// 3. ALL TIME - SPECIFIC WALLET
// ═══════════════════════════════════════════════
const summary3 = await getUserFinancialSummary({
  userID: "user-uuid",
  walletID: "wallet-uuid",
});

// ═══════════════════════════════════════════════
// 4. DATE RANGE - SPECIFIC WALLET
// ═══════════════════════════════════════════════
const summary4 = await getUserFinancialSummary({
  userID: "user-uuid",
  walletID: "wallet-uuid",
  range: {
    start: new Date("2025-08-01"),
    end: new Date("2026-02-28"),
  },
});
```

### Response Format

```typescript
[
  {
    UserID: "user-uuid",
    PeriodType: "monthly",
    PeriodKey: "2026-02",
    PeriodStart: "2026-02-01T00:00:00.000Z",
    PeriodEnd: "2026-02-28T00:00:00.000Z",

    // Current Period
    IncomeNow: 15000000.0,
    ExpenseNow: 12500000.0,
    ProfitNow: 2500000.0,
    BalanceNow: 25000000.0,

    // Previous Period
    IncomePrev: 13000000.0,
    ExpensePrev: 11000000.0,
    ProfitPrev: 2000000.0,
    BalancePrev: 22500000.0,

    // Growth Percentages
    IncomeGrowthPct: 15.38,
    ExpenseGrowthPct: 13.64,
    ProfitGrowthPct: 25.0,
    BalanceGrowthPct: 11.11,

    // Health Indicators
    SavingsRate: 16.67,
    ExpenseToIncomeRatio: 83.33,
    BurnRateDaily: 416666.67,
    AvgIncomeDaily: 500000.0,
    AvgExpenseDaily: 416666.67,
    RunwayDays: 60,

    // Transaction Stats
    TotalTransactions: 85,
    IncomeTransactionCount: 10,
    ExpenseTransactionCount: 75,
    AvgTransactionAmount: 323529.41,
    LargestIncome: 5000000.0,
    LargestExpense: 2500000.0,

    // Investment Summary
    InvestmentSummary: {
      TotalInvested: 10000000.0,
      TotalCurrentValuation: 12500000.0,
      TotalSoldAmount: 3000000.0,
      TotalDeficit: -200000.0,
      UnrealizedGain: 2500000.0,
      RealizedGain: 2800000.0,
      InvestmentGrowthPct: 25.0,
      BuyCount: 5,
      SellCount: 2,
      ActivePositions: 3,
    },

    // Net Worth
    NetWorth: {
      Total: 37500000.0,
      WalletPortion: 25000000.0,
      InvestmentPortion: 12500000.0,
      NetWorthPrev: 33000000.0,
      NetWorthGrowthPct: 13.64,
    },

    // Top Categories
    TopExpenseCategories: [
      {
        CategoryID: "category-uuid",
        CategoryName: "Food & Beverage",
        Amount: 4500000.0,
        Percentage: 36.0,
        TransactionCount: 30,
      },
    ],
    TopIncomeCategories: [
      {
        CategoryID: "category-uuid",
        CategoryName: "Salary",
        Amount: 12000000.0,
        Percentage: 80.0,
        TransactionCount: 1,
      },
    ],

    // Wallet Breakdown (filtered if walletID provided)
    WalletSummaries: [
      {
        WalletID: "wallet-uuid",
        WalletName: "BCA Main",
        WalletType: "Bank",
        OpeningBalance: 15000000.0,
        ClosingBalance: 17000000.0,
        Income: 8000000.0,
        Expense: 6000000.0,
        NetChange: 2000000.0,
        ShareOfBalancePct: 68.0,
      },
    ],
  },
  // ... more periods
];
```

### Features

- **Comprehensive Financial Overview** - All key metrics in one query
- **Period-based Analysis** - Usually monthly summaries
- **Growth Tracking** - Compare current vs previous period
- **Health Indicators** - Savings rate, burn rate, runway days, etc.
- **Top Categories** - Most significant income/expense categories
- **Investment Integration** - Investment portfolio summary included
- **Net Worth Calculation** - Total net worth with breakdown
- **Wallet-specific View** - Optional filtering by wallet

### Filtering Options

- **`userID`** (Required) - User identifier
- **`walletID`** (Optional)
  - If provided → `WalletSummaries` array filtered to specific wallet
  - If omitted → all wallets included
- **`range`** (Optional)
  - If provided → filter by `PeriodStart` and `PeriodEnd`
  - If omitted → all periods (all time)

### Use Cases

1. **Dashboard Overview** - Show current month financial summary
2. **Trend Analysis** - Get last 12 months to show growth trends
3. **Wallet Performance** - Compare specific wallet across periods
4. **Year-over-Year** - Compare same periods across years

---

## 4. Get User Net Worth Composition

### Usage Examples

```typescript
import { getUserNetWorthComposition } from "./src/service";

// ═══════════════════════════════════════════════
// GET NET WORTH COMPOSITION (Always ALL TIME, ALL WALLETS)
// ═══════════════════════════════════════════════
const netWorth = await getUserNetWorthComposition({
  userID: "user-uuid",
});
```

### Response Format

```typescript
{
  UserID: "user-uuid",
  Total: 37500000.00,
  Slices: [
    {
      Label: "Cash & Bank Accounts",
      Amount: 25000000.00,
      Percentage: 66.67,
      Details: {
        BCA: 17000000.00,
        Mandiri: 8000000.00
      }
    },
    {
      Label: "Investments",
      Amount: 12500000.00,
      Percentage: 33.33,
      Details: {
        Stocks: 8000000.00,
        Crypto: 4500000.00
      }
    }
  ],
  CreatedAt: "2026-02-12T10:00:00.000Z",
  UpdatedAt: "2026-02-12T14:30:00.000Z"
}
```

### Features

- **Always Latest Snapshot** - Returns most recent net worth composition
- **Always ALL TIME** - No date filtering (represents current state)
- **Always ALL WALLETS** - No wallet filtering (total net worth)
- **Percentage Breakdown** - Each slice shows % of total
- **Detailed Breakdown** - `Details` object contains sub-categories

### Use Cases

1. **Pie Chart** - Visualize net worth distribution
2. **Asset Allocation** - Show where money is allocated
3. **Portfolio Overview** - Quick snapshot of total wealth

### Notes

- This function always queries for the **latest** document (sorted by `UpdatedAt`)
- No date range filtering - represents **current net worth state**
- No wallet filtering - represents **total net worth across all assets**
- Use `findOne()` instead of `find()` since we only need the latest snapshot
