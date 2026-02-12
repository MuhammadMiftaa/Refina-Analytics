import { NextFunction, Request, Response } from "express";
import {
  getUserBalanceType,
  getUserFinancialSummaryType,
  getUserNetWorthCompositionType,
  getUserTransactionType,
} from "./dto";
import service from "./service";

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

export default {
  getUserTransaction,
  getUserBalance,
  getUserFinancialSummary,
  getUserNetWorthComposition,
};
