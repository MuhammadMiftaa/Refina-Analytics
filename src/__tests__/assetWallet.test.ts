// ─────────────────────────────────────────────────────────────
// assetWallet.test.ts
// Unit test untuk: isAssetWallet, ASSET_WALLET_FILTER, dan
// calculateNetWorthCompositions.
//
// Wallet "liability" (kartu kredit / paylater) menyimpan SISA LIMIT pada
// balance, bukan uang yang dimiliki, sehingga harus dikeluarkan dari
// seluruh perhitungan saldo dan net worth.
// ─────────────────────────────────────────────────────────────

import { describe, it, expect } from "@jest/globals";
import {
  ASSET_WALLET_FILTER,
  isAssetWallet,
  LIABILITY_NATURE,
} from "../utils/helper";
import { calculateNetWorthCompositions } from "../grpc/client/initSync.UserNetWorthComposition";

// =====================================================================
// isAssetWallet
// =====================================================================

describe("isAssetWallet", () => {
  it("rejects a Mongo document marked as a liability", () => {
    expect(isAssetWallet({ WalletTypeNature: "liability" })).toBe(false);
  });

  it("rejects an event payload marked as a liability", () => {
    expect(isAssetWallet({ wallet_type_nature: "liability" })).toBe(false);
  });

  it("accepts a wallet explicitly marked as an asset", () => {
    expect(isAssetWallet({ WalletTypeNature: "asset" })).toBe(true);
    expect(isAssetWallet({ wallet_type_nature: "asset" })).toBe(true);
  });

  it("treats a wallet with no nature as an asset", () => {
    // Documents and events written before the field existed must keep
    // counting, otherwise every historical balance would silently drop.
    expect(isAssetWallet({})).toBe(true);
    expect(isAssetWallet({ WalletTypeNature: null })).toBe(true);
    expect(isAssetWallet({ wallet_type_nature: undefined })).toBe(true);
  });

  it("treats an unrecognised nature as an asset", () => {
    expect(isAssetWallet({ WalletTypeNature: "something-else" })).toBe(true);
  });
});

// =====================================================================
// ASSET_WALLET_FILTER
// =====================================================================

describe("ASSET_WALLET_FILTER", () => {
  it("uses $ne so that documents missing the field still match", () => {
    // $eq: "asset" would exclude every wallet written before the field
    // existed; $ne: "liability" includes them.
    expect(ASSET_WALLET_FILTER).toEqual({ $ne: LIABILITY_NATURE });
  });
});

// =====================================================================
// calculateNetWorthCompositions (initial sync)
// =====================================================================

function wallet(overrides: Partial<any> = {}): any {
  return {
    id: "w-1",
    user_id: "u-1",
    name: "BCA Primary",
    number: "123",
    balance: 15_000_000,
    wallet_type_id: "wt-1",
    wallet_type: "bank",
    wallet_type_name: "BCA",
    ...overrides,
  };
}

describe("calculateNetWorthCompositions", () => {
  it("excludes credit lines from the net worth total", () => {
    const result = calculateNetWorthCompositions(
      [
        wallet(),
        wallet({
          id: "w-2",
          balance: 13_600_000,
          wallet_type: "credit_card",
          wallet_type_name: "BCA Credit Card",
          wallet_type_nature: "liability",
        }),
      ],
      [],
    );

    expect(result.get("u-1").Total).toBe(15_000_000);
  });

  it("keeps credit lines out of the composition breakdown", () => {
    const result = calculateNetWorthCompositions(
      [
        wallet(),
        wallet({
          id: "w-2",
          balance: 13_600_000,
          wallet_type_name: "BCA Credit Card",
          wallet_type_nature: "liability",
        }),
      ],
      [],
    );

    const slice = result
      .get("u-1")
      .Slices.find((s: any) => s.Label === "Cash & Bank Accounts");
    expect(slice.Amount).toBe(15_000_000);
    expect(slice.Details.ItemCount).toBe(1);
    expect(slice.Details["BCA Credit Card"]).toBeUndefined();
  });

  it("totals asset wallets normally", () => {
    const result = calculateNetWorthCompositions(
      [
        wallet(),
        wallet({ id: "w-2", balance: 8_250_000, wallet_type_name: "Mandiri" }),
      ],
      [],
    );

    expect(result.get("u-1").Total).toBe(23_250_000);
  });

  it("counts wallets that predate the nature field", () => {
    const result = calculateNetWorthCompositions([wallet()], []);

    expect(result.get("u-1").Total).toBe(15_000_000);
  });

  it("produces no entry for a user whose only wallet is a credit line", () => {
    const result = calculateNetWorthCompositions(
      [wallet({ wallet_type_nature: "liability" })],
      [],
    );

    // The user drops out entirely: they have no assets and no investments.
    expect(result.has("u-1")).toBe(false);
  });

  it("keeps users separate", () => {
    const result = calculateNetWorthCompositions(
      [
        wallet(),
        wallet({ id: "w-2", user_id: "u-2", balance: 1_000_000 }),
        wallet({
          id: "w-3",
          user_id: "u-2",
          balance: 5_000_000,
          wallet_type_nature: "liability",
        }),
      ],
      [],
    );

    expect(result.get("u-1").Total).toBe(15_000_000);
    expect(result.get("u-2").Total).toBe(1_000_000);
  });
});
