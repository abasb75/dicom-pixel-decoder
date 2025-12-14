// TypeScript bindings for emscripten-generated code.  Automatically generated at compile time.
interface WasmModule {
}

export interface ClassHandle {
  isAliasOf(other: ClassHandle): boolean;
  delete(): void;
  deleteLater(): this;
  isDeleted(): boolean;
  // @ts-ignore - If targeting lower than ESNext, this symbol might not exist.
  [Symbol.dispose](): void;
  clone(): this;
}
export type FrameInfo = {
  width: number,
  height: number,
  bitsPerSample: number,
  componentCount: number,
  isSigned: boolean
};

export interface JPEGDecoder extends ClassHandle {
  getEncodedBuffer(_0: number): any;
  getDecodedBuffer(): any;
  readHeader(): void;
  decode(): void;
  getFrameInfo(): FrameInfo;
}

interface EmbindModule {
  JPEGDecoder: {
    new(): JPEGDecoder;
  };
}

export type MainModule = WasmModule & EmbindModule;
export default function MainModuleFactory (options?: unknown): Promise<MainModule>;
