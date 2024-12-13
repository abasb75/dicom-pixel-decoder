export interface DecodeOptions {
    transferSyntaxUID:string;
    bitsAllocated:number;
    littleEndian:boolean;
    pixelRepresentation:number;
    samplesPerPixel:number;
}

export type PixelArray = Uint32Array|Uint16Array|Uint8Array|Int32Array|Int16Array|Int8Array|ArrayBuffer;