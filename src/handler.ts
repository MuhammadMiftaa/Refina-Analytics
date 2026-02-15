import { NextFunction, Request, Response } from "express";
import {
  getUserBalanceType,
  getUserFinancialSummaryType,
  getUserNetWorthCompositionType,
  getUserTransactionType,
  investmentType,
  transactionType,
  walletType,
} from "./dto";
import service from "./service";
import helper from "./helper";
import env from "./env";
import { ForbiddenError } from "./errors";
import { initialSync } from "./initial-sync";
import logger from "./logger";

const getUserTransaction = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data: getUserTransactionType = req.body;
    const userTransaction = await service.getUserTransaction(data);
    res.json(userTransaction);
  } catch (error) {
    next(error);
  }
};

const getUserBalance = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data: getUserBalanceType = req.body;
    const userBalance = await service.getUserBalance(data);
    res.json(userBalance);
  } catch (error) {
    next(error);
  }
};

const getUserFinancialSummary = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data: getUserFinancialSummaryType = req.body;
    const userFinancialSummary = await service.getUserFinancialSummary(data);
    res.json(userFinancialSummary);
  } catch (error) {
    next(error);
  }
};

const getUserNetWorthComposition = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data: getUserNetWorthCompositionType = req.body;
    const userNetWorthComposition =
      await service.getUserNetWorthComposition(data);
    res.json(userNetWorthComposition);
  } catch (error) {
    next(error);
  }
};

const initialSyncHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const secretKey = req.body.secretKey;
    if (secretKey !== env.INITIAL_SYNC_KEY) {
      throw new ForbiddenError("Invalid secret key");
    }

    const wallets =
      (await req.app.locals.walletGRPCClient.getWallets()) as walletType[];
    const transactions =
      (await req.app.locals.transactionGRPCClient.getTransactions()) as transactionType[];
    const investments =
      (await req.app.locals.investmentGRPCClient.getInvestments()) as investmentType[];

    logger.info("Fetch data for initial sync successfully");
    await initialSync(wallets, transactions, investments);
    logger.info("Initial sync completed successfully");

    res.json({
      status: true,
      statusCode: 200,
      message: "Initial sync completed successfully",
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getUserTransaction,
  getUserBalance,
  getUserFinancialSummary,
  getUserNetWorthComposition,
  initialSyncHandler,
};
