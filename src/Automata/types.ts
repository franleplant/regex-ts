export type ISymbol = string;
export type IState = number;
export type IDeltaRule = [IState, ISymbol | Array<ISymbol>, IState];
export type IDelta = Array<IDeltaRule>;
