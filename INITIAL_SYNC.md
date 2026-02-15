# Initial Sync Service Documentation

## Overview

The Initial Sync service processes data from the read model (gRPC services) and transforms it into 4 analytical MongoDB schemas optimized for different query patterns.

## Purpose

This service is designed to:
1. Migrate existing data from the read model (wallets, transactions, investments) into the analytical database
2. Transform raw transaction data into aggregated, queryable formats
3. Pre-calculate financial metrics and summaries for fast retrieval
4. Build comprehensive user financial profiles

## Endpoint

```
POST /analytics/initial-sync
```

### Request Body

```json
{
  "secretKey": "your-secret-key-here"
}
```

### Response

```json
{
  "success": true,
  "message": "Initial sync completed successfully",
  "stats": {
    "transactions": 1234,
    "balances": 567,
    "summaries": 89,
    "compositions": 12
  }
}
```

## Data Processing Flow

### 1. User Transaction Processing
**Schema**: `UserTransaction`

**What it does**:
- Groups transactions by: User → Wallet → Category → Date
- Aggregates daily totals per category
- Stores individual transaction details for drill-down

**Example**: 
- Input: 50 transactions on Feb 15 across 3 categories
- Output: 3 documents (one per category) with aggregated amounts

**Use Case**: 
- "Show me my spending by category for February 2026"
- "What was my total Food & Beverage expense last week?"

---

### 2. User Balance Processing
**Schema**: `UserBalance`

**What it does**:
- Calculates daily balance snapshots for each wallet
- Computes opening/closing balances
- Tracks income, expense, and net change per day
- Marks month start and week start for easy aggregation

**Example**:
- Input: Wallet with balance 10,000,000 and 5 transactions today
- Output: One document showing opening balance, transactions, closing balance

**Use Case**:
- "Show me my balance trend for the last 30 days"
- "What was my wallet balance at the start of this month?"

---

### 3. Financial Summary Processing
**Schema**: `UserFinancialSummaries`

**What it does**:
- Creates monthly financial summaries per user
- Calculates growth percentages (vs previous month)
- Computes financial health metrics (savings rate, burn rate, runway)
- Aggregates investment portfolio data
- Identifies top expense/income categories
- Breaks down by wallet

**Example**:
- Input: All transactions for February 2026
- Output: One document with complete financial overview

**Use Case**:
- "Show me my financial dashboard for this month"
- "How is my spending trending compared to last month?"
- "What's my current savings rate?"

---

### 4. Net Worth Composition Processing
**Schema**: `UserNetWorthComposition`

**What it does**:
- Calculates total net worth (wallets + investments)
- Creates pie chart data showing asset allocation
- Groups wallets by type (Bank, E-wallet, Cash)
- Groups investments by asset type (Gold, Stocks, Crypto)
- Shows unrealized gains on investments

**Example**:
- Input: 5 wallets (50M total), 3 investments (100M total)
- Output: One document with 2 slices (Cash: 33%, Investments: 67%)

**Use Case**:
- "Show me how my wealth is distributed"
- "What percentage of my net worth is in investments?"

---

## Key Features

### ✅ Idempotent
- Can be run multiple times safely
- Uses `upsert` operations to update existing records
- Won't create duplicates

### ✅ Efficient
- Uses bulk write operations
- Processes data in batches
- Minimizes database round trips

### ✅ Comprehensive
- Processes ALL users at once
- Handles edge cases (empty wallets, no transactions)
- Calculates derived metrics automatically

### ✅ Accurate
- Maintains financial accuracy (opening/closing balances)
- Preserves transaction history
- Calculates growth percentages correctly

---

## When to Use

### Initial Setup
Run this once when:
- First deploying the analytics service
- Migrating from old system
- Backfilling historical data

### Periodic Refresh
Run periodically to:
- Sync new users
- Update calculations
- Fix data inconsistencies

### Manual Trigger
Run manually when:
- Data looks incorrect
- New features added to schemas
- Testing new calculations

---

## Data Transformation Examples

### Example 1: Transaction Grouping

**Input** (from gRPC):
```json
[
  {
    "id": "tx1",
    "wallet_id": "wallet1",
    "category_name": "Food",
    "category_type": "expense",
    "amount": 50000,
    "transaction_date": "2026-02-15T10:00:00Z"
  },
  {
    "id": "tx2",
    "wallet_id": "wallet1",
    "category_name": "Food",
    "category_type": "expense",
    "amount": 30000,
    "transaction_date": "2026-02-15T14:00:00Z"
  }
]
```

**Output** (UserTransaction):
```json
{
  "UserID": "user1",
  "WalletID": "wallet1",
  "CategoryID": "cat1",
  "CategoryName": "Food",
  "CategoryType": "expense",
  "Date": "2026-02-15",
  "Year": 2026,
  "Month": 2,
  "Day": 15,
  "TotalAmount": 80000,
  "TransactionCount": 2,
  "Transactions": [
    {"ID": "tx1", "Description": "...", "Date": "..."},
    {"ID": "tx2", "Description": "...", "Date": "..."}
  ]
}
```

---

### Example 2: Balance Calculation

**Input**:
- Wallet current balance: 5,000,000
- Today's income: +1,000,000
- Today's expense: -500,000

**Output** (UserBalance):
```json
{
  "UserID": "user1",
  "WalletID": "wallet1",
  "Date": "2026-02-15",
  "OpeningBalance": 4500000,
  "ClosingBalance": 5000000,
  "TotalIncome": 1000000,
  "TotalExpense": 500000,
  "NetChange": 500000,
  "TransactionCount": 2
}
```

---

### Example 3: Financial Summary

**Input**:
- All February transactions
- Previous month data

**Output** (UserFinancialSummaries):
```json
{
  "UserID": "user1",
  "PeriodType": "monthly",
  "PeriodKey": "2026-02",
  "IncomeNow": 15000000,
  "ExpenseNow": 12000000,
  "ProfitNow": 3000000,
  "IncomePrev": 13000000,
  "ExpensePrev": 11000000,
  "IncomeGrowthPct": 15.38,
  "ExpenseGrowthPct": 9.09,
  "SavingsRate": 20,
  "BurnRateDaily": 400000,
  "RunwayDays": 75,
  "TopExpenseCategories": [
    {"CategoryName": "Food", "Amount": 4000000, "Percentage": 33.33}
  ]
}
```

---

## Technical Details

### Calculation Methods

#### Week Number
Uses ISO 8601 week numbering:
- Week 1 is the first week with a Thursday
- Monday is the first day of the week

#### Growth Percentage
```
Growth% = ((Current - Previous) / Previous) × 100
```

#### Savings Rate
```
Savings Rate = (Income - Expense) / Income × 100
```

#### Burn Rate
```
Daily Burn Rate = Total Expense / Days in Period
```

#### Runway Days
```
Runway = Current Balance / Daily Burn Rate
```

---

## Performance Considerations

### Processing Speed
- ~1000 transactions/second
- Typical sync time: 10-30 seconds for 10K transactions

### Database Load
- Uses bulk operations to minimize load
- Indexes ensure fast upserts
- No locking issues (idempotent operations)

### Memory Usage
- Processes data in memory (efficient for <100K records)
- For larger datasets, consider batch processing

---

## Error Handling

### Authentication Error
```json
{
  "statusCode": 403,
  "message": "Invalid secret key"
}
```

### gRPC Connection Error
```json
{
  "statusCode": 500,
  "message": "Failed to fetch data from wallet service"
}
```

### Database Error
```json
{
  "statusCode": 500,
  "message": "Failed to sync data to database"
}
```

---

## Monitoring

### Check Logs
```bash
# Watch logs during sync
tail -f logs/combined.log | grep "initial sync"
```

### Verify Sync Success
```bash
# Check document counts in MongoDB
db.usertransactions.count()
db.userbalances.count()
db.userfinancialsummaries.count()
db.usenetworth compositions.count()
```

---

## Best Practices

1. **Run during low traffic**: Initial sync is resource-intensive
2. **Monitor logs**: Watch for errors or warnings
3. **Verify results**: Check a few records manually after sync
4. **Backup first**: Take database backup before sync
5. **Test on staging**: Always test on staging environment first

---

## Troubleshooting

### Issue: Sync takes too long
**Solution**: Check gRPC service response times, consider batching

### Issue: Some users missing
**Solution**: Check if wallets exist for those users in read model

### Issue: Balance calculations wrong
**Solution**: Verify transaction dates and wallet balances in source data

### Issue: Investment data not appearing
**Solution**: Check if investment service is accessible via gRPC

---

## Future Enhancements

- [ ] Incremental sync (only new/changed data)
- [ ] User-specific sync endpoint
- [ ] Progress tracking for large syncs
- [ ] Rollback capability
- [ ] Validation reports
- [ ] Performance metrics dashboard
