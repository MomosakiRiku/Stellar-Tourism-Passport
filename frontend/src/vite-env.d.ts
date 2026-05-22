/// <reference types="vite/client" />

declare module '@stellar/freighter-api' {
  export function isConnected(): Promise<boolean>;
  export function getAddress(): Promise<{ address: string }>;
  export function signTransaction(txXDR: string, opts: any): Promise<{ signedTxXdr: string }>;
  export function isAllowed(): Promise<boolean>;
  export function setAllowed(): Promise<boolean>;
  export function getNetwork(): Promise<{ network: string; networkPassphrase: string }>;
}
