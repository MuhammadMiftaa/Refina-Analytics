import * as grpc from "@grpc/grpc-js";
import * as wpb from "@muhammadmiftaa/refina-protobuf/wallet/wallet_grpc_pb.js";
import * as tpb from "@muhammadmiftaa/refina-protobuf/transaction/transaction_grpc_pb.js";

export class GRPCClient {
  private readonly walletClient: wpb.WalletServiceClient;
  private readonly transactionClient: tpb.TransactionServiceClient;

  constructor(walletAddr: string, transactionAddr: string) {
    this.walletClient = new wpb.WalletServiceClient(
      walletAddr,
      grpc.credentials.createInsecure(),
    );
    this.transactionClient = new tpb.TransactionServiceClient(
      transactionAddr,
      grpc.credentials.createInsecure(),
    );
  }

  getWalletClient() {
    return this.walletClient;
  }

  getTransactionClient() {
    return this.transactionClient;
  }
}
