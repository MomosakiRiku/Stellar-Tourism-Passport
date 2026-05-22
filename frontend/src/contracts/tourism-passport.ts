import {
  Contract,
  rpc,
  TransactionBuilder,
  BASE_FEE,
  xdr,
  Address,
  nativeToScVal,
  scValToNative,
} from "@stellar/stellar-sdk";

export const CONTRACT_ID = "CCFZ6FYNQWAMJTMBIOZ4LN5332ZRRVMZM6YBSFJZRGZPHK2Q4YPRZFIT";
export const NETWORK_PASSPHRASE = "Test SDF Network ; September 2015";
export const RPC_URL = "https://soroban-testnet.stellar.org";
export const NETWORK = "TESTNET";

const server = new rpc.Server(RPC_URL);

// Helper: Build and simulate a transaction
async function buildAndSimulate(sourcePublicKey: string, contractOp: xdr.Operation) {
  const account = await server.getAccount(sourcePublicKey);
  const tx = new TransactionBuilder(account, {
    fee: BASE_FEE,
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(contractOp)
    .setTimeout(30)
    .build();

  const simulated = await server.simulateTransaction(tx);
  if (rpc.Api.isSimulationError(simulated)) {
    throw new Error(`Simulation failed: ${(simulated as any).error}`);
  }
  return rpc.assembleTransaction(tx, simulated).build();
}

// Helper: Submit a signed transaction
async function submitTransaction(signedTx: any) {
  const result = await server.sendTransaction(signedTx);
  
  if (result.status === "ERROR") {
    throw new Error(`Transaction failed: ${(result as any).errorResult}`);
  }

  // Poll for result
  let response: any = result;
  const hash = result.hash;
  while (response.status === "PENDING" || response.status === "NOT_FOUND") {
    await new Promise((r) => setTimeout(r, 2000));
    response = await server.getTransaction(hash);
  }

  if (response.status === "SUCCESS") {
    return response;
  } else {
    throw new Error(`Transaction failed with status: ${response.status}`);
  }
}

// Contract interaction functions
export const contractClient = {
  server,

  // Initialize the system (admin only)
  async init(sourcePublicKey: string, adminAddress: string, signTransaction: any) {
    const contract = new Contract(CONTRACT_ID);
    const op = contract.call(
      "init",
      new Address(adminAddress).toScVal()
    );
    const tx = await buildAndSimulate(sourcePublicKey, op);
    const signed = await signTransaction(tx.toXDR(), {
      networkPassphrase: NETWORK_PASSPHRASE,
    });
    const signedTx = TransactionBuilder.fromXDR(signed, NETWORK_PASSPHRASE);
    return await submitTransaction(signedTx);
  },

  // Set landmark admin
  async setLandmarkAdmin(sourcePublicKey: string, adminAddress: string, landmarkId: number, managerAddress: string, signTransaction: any) {
    const contract = new Contract(CONTRACT_ID);
    const op = contract.call(
      "set_landmark_admin",
      new Address(adminAddress).toScVal(),
      nativeToScVal(landmarkId, { type: "u32" }),
      new Address(managerAddress).toScVal()
    );
    const tx = await buildAndSimulate(sourcePublicKey, op);
    const signed = await signTransaction(tx.toXDR(), {
      networkPassphrase: NETWORK_PASSPHRASE,
    });
    const signedTx = TransactionBuilder.fromXDR(signed, NETWORK_PASSPHRASE);
    return await submitTransaction(signedTx);
  },

  // Issue stamp to traveler
  async issueStamp(sourcePublicKey: string, managerAddress: string, travelerAddress: string, landmarkId: number, signTransaction: any) {
    const contract = new Contract(CONTRACT_ID);
    const op = contract.call(
      "issue_stamp",
      new Address(managerAddress).toScVal(),
      new Address(travelerAddress).toScVal(),
      nativeToScVal(landmarkId, { type: "u32" })
    );
    const tx = await buildAndSimulate(sourcePublicKey, op);
    const signed = await signTransaction(tx.toXDR(), {
      networkPassphrase: NETWORK_PASSPHRASE,
    });
    const signedTx = TransactionBuilder.fromXDR(signed, NETWORK_PASSPHRASE);
    return await submitTransaction(signedTx);
  },

  // Verify collection (read-only)
  async verifyCollection(travelerAddress: string, landmarkIds: number[]) {
    const contract = new Contract(CONTRACT_ID);
    const scLandmarkIds = xdr.ScVal.scvVec(
      landmarkIds.map((id) => nativeToScVal(id, { type: "u32" }))
    );
    const op = contract.call(
      "verify_collection",
      new Address(travelerAddress).toScVal(),
      scLandmarkIds
    );
    
    // For read-only, we just simulate
    const account = await server.getAccount(travelerAddress);
    const tx = new TransactionBuilder(account, {
      fee: BASE_FEE,
      networkPassphrase: NETWORK_PASSPHRASE,
    })
      .addOperation(op)
      .setTimeout(30)
      .build();

    const simulated = await server.simulateTransaction(tx);
    if (rpc.Api.isSimulationError(simulated)) {
      return false;
    }
    const result = (simulated as rpc.Api.SimulateTransactionSuccessResponse).result;
    return result ? scValToNative(result.retval) : false;
  },

  // Claim reward
  async claimReward(sourcePublicKey: string, travelerAddress: string, collectionId: number, requiredLandmarks: number[], signTransaction: any) {
    const contract = new Contract(CONTRACT_ID);
    const scLandmarkIds = xdr.ScVal.scvVec(
      requiredLandmarks.map((id) => nativeToScVal(id, { type: "u32" }))
    );
    const op = contract.call(
      "claim_reward",
      new Address(travelerAddress).toScVal(),
      nativeToScVal(collectionId, { type: "u32" }),
      scLandmarkIds
    );
    const tx = await buildAndSimulate(sourcePublicKey, op);
    const signed = await signTransaction(tx.toXDR(), {
      networkPassphrase: NETWORK_PASSPHRASE,
    });
    const signedTx = TransactionBuilder.fromXDR(signed, NETWORK_PASSPHRASE);
    return await submitTransaction(signedTx);
  },

  // Get stamp time (read-only)
  async getStampTime(travelerAddress: string, landmarkId: number) {
    const contract = new Contract(CONTRACT_ID);
    const op = contract.call(
      "get_stamp_time",
      new Address(travelerAddress).toScVal(),
      nativeToScVal(landmarkId, { type: "u32" })
    );
    
    const account = await server.getAccount(travelerAddress);
    const tx = new TransactionBuilder(account, {
      fee: BASE_FEE,
      networkPassphrase: NETWORK_PASSPHRASE,
    })
      .addOperation(op)
      .setTimeout(30)
      .build();

    const simulated = await server.simulateTransaction(tx);
    if (rpc.Api.isSimulationError(simulated)) {
      return 0;
    }
    const result = (simulated as rpc.Api.SimulateTransactionSuccessResponse).result;
    return result ? Number(scValToNative(result.retval)) : 0;
  },
};
