export interface Token {
  id: number;
  set: number;
  frames: number[];
  trioName: string;
}

export interface MergedToken extends Token {
  burnedTokenId: number;
  burnedTokensFrames: number[];
}

export interface PurchaseData {
  purchasedTokens: Token[];
  mergedTokens: MergedToken[];
}
