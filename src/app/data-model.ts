export type ConnectionState = 'disconnected' | 'connecting' | 'connected' | 'closing';
export type LineType = 'real' | 'control' | 'error';

export interface LineEntry {
  line: string;
  timestamp: Date;
  type?: LineType;
}

export interface HexEntry {
  data: number[];
  timestamp: Date;
}
