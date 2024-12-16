export interface DecodeOptions {
    transferSyntaxUID:string;
    bitsAllocated:number;
    littleEndian:boolean;
    pixelRepresentation:number|number;
    samplesPerPixel:number;
    rows:number|undefined;
    columns:number|undefined;
    rescaleSlope:number|undefined;
    rescaleIntercept:number|undefined; 
    modality:string;
    windowWidth:number|undefined;
    windowCenter:number|undefined;

}

export type PixelArray = Uint32Array|Uint16Array|Uint8Array|Int32Array|Int16Array|Int8Array;