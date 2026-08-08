import { ValidationError } from "./errors";
import { ZodType } from "zod";

//$ Interface for JWT payload structure
interface JwtPayload {
  email: string;
  id: string;
  username: string;
}

const getWeekNumber = (date: Date): number => {
  const startDate = new Date(date.getFullYear(), 0, 1);
  const days = Math.floor(
    (date.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
  );
  return Math.ceil((days + startDate.getDay() + 1) / 7);
};

//$ Validates request body against Joi schema
const validate = <T>(schema: ZodType, data: unknown): T => {
  const result = schema.safeParse(data);

  if (!result.success) {
    const errorMessages = result.error.issues
      .map((issue) => issue.message)
      .join(", ");
    throw new ValidationError("Invalid request data, " + errorMessages);
  }

  return result.data as T;
};

//$ Wallet nature — a "liability" wallet is a credit line (credit card,
//$ paylater) whose balance is the credit still AVAILABLE to borrow, not money
//$ owned. Counting it would inflate every balance and net worth figure, so it
//$ is excluded from all of them.
const LIABILITY_NATURE = "liability";

//$ Mongo filter for wallets that hold money. $ne also matches documents written
//$ before WalletTypeNature existed, so historical wallets keep counting.
const ASSET_WALLET_FILTER = { $ne: LIABILITY_NATURE } as const;

//$ Same rule applied in memory, for wallets coming straight off gRPC or an
//$ event payload rather than out of Mongo.
const isAssetWallet = (wallet: {
  WalletTypeNature?: string | null;
  wallet_type_nature?: string | null;
}): boolean =>
  (wallet.WalletTypeNature ?? wallet.wallet_type_nature ?? "asset") !==
  LIABILITY_NATURE;

export default { getWeekNumber, validate, isAssetWallet };
export { ASSET_WALLET_FILTER, isAssetWallet, LIABILITY_NATURE };
export type { JwtPayload };
