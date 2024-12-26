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
    planarConfiguration:number|undefined;
    photometricInterpretation:string;
    bitsStored:number|undefined;
    isFloat:boolean;
}


export interface DicomVOILutModule{
    voiLUTFunction:string;
    windowWidth:number|undefined;
    windowCenter:number|undefined;
    voiLUTSequence:unknown;
    lutDescriptor:any;
    lutExplanation:any;
    lutData:any;
    windowCenterAndWidthExplanation:string;
}

export interface DicomPatientModule{
    patientName:string;
    patientID:string;
    typeofPatientID:string,
    patientSex:string,
    patientBirthDate:string,
    patientAge:string,
    patientSize:string,
    otherPatientIDs:string,
    otherPatientNames:string,
    patientWeight:string,
}

export interface DicomPixelModule{
    photometricInterpretation:string,
    numberOfFrames:number|undefined,
    pixelRepresentation:number|undefined,
    pixelSpacing:any|undefined,
    rows:number|number|undefined,
    columns:number|number|undefined,
    bitsAllocated:number|undefined,
    highBit:number|undefined,
    bitsStored:number|undefined,
    samplesPerPixel:number|undefined;
    pixelDataProviderURL:any;
    pixelPaddingRangeLimit:any;
    extendedOffsetTable:any;
    extendedOffsetTableLengths:any;
    pixelAspectRatio:any;
    planarConfiguration:number|undefined;
    redPaletteColorLookupTableDescriptor:unknown;
    greenPaletteColorLookupTableDescriptor:unknown;
    bluePaletteColorLookupTableDescriptor:unknown;
    alphaPaletteColorLookupTableDescriptor:unknown;
    redPaletteColorLookupTableData:any;
    greenPaletteColorLookupTableData:any;
    bluePaletteColorLookupTableData:any;
    alphaPaletteColorLookupTableData:any;
    segmentedRedPaletteColorLookupTableData:any;
    segmentedGreenPaletteColorLookupTableData:any;
    segmentedBluePaletteColorLookupTableData:any;
    segmentedAlphaPaletteColorLookupTableData:any;
}

export interface DicomScalingModule {
    rescaleSlope:number|undefined, 
    rescaleIntercept:number|undefined, 
    modality:string,
}

export type PixelArray = Float64Array|Float32Array|Int32Array|Uint32Array|Uint16Array|Uint8Array|Int32Array|Int16Array|Int8Array;