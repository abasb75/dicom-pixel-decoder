declare module "types" {
    export interface DecodeOptions {
        transferSyntaxUID: string;
        bitsAllocated: number;
        littleEndian: boolean;
        pixelRepresentation: number | number;
        samplesPerPixel: number;
        rows: number | undefined;
        columns: number | undefined;
        rescaleSlope: number | undefined;
        rescaleIntercept: number | undefined;
        modality: string;
        windowWidth: number | undefined;
        windowCenter: number | undefined;
        planarConfiguration: number | undefined;
        photometricInterpretation: string;
        bitsStored: number | undefined;
        isFloat: boolean;
    }
    export interface DicomVOILutModule {
        voiLUTFunction: string;
        windowWidth: number | undefined;
        windowCenter: number | undefined;
        voiLUTSequence: unknown;
        lutDescriptor: any;
        lutExplanation: any;
        lutData: any;
        windowCenterAndWidthExplanation: string;
    }
    export interface DicomPatientModule {
        patientName: string;
        patientID: string;
        typeofPatientID: string;
        patientSex: string;
        patientBirthDate: string;
        patientAge: string;
        patientSize: string;
        otherPatientIDs: string;
        otherPatientNames: string;
        patientWeight: string;
    }
    export interface DicomPixelModule {
        photometricInterpretation: string;
        numberOfFrames: number | undefined;
        pixelRepresentation: number | undefined;
        pixeSpacing: any | undefined;
        rows: number | number | undefined;
        columns: number | number | undefined;
        bitsAllocated: number | undefined;
        highBit: number | undefined;
        bitsStored: number | undefined;
        samplesPerPixel: number | undefined;
        pixelDataProviderURL: any;
        pixelPaddingRangeLimit: any;
        extendedOffsetTable: any;
        extendedOffsetTableLengths: any;
        pixelAspectRatio: any;
        planarConfiguration: number | undefined;
        redPaletteColorLookupTableDescriptor: unknown;
        greenPaletteColorLookupTableDescriptor: unknown;
        bluePaletteColorLookupTableDescriptor: unknown;
        alphaPaletteColorLookupTableDescriptor: unknown;
        redPaletteColorLookupTableData: any;
        greenPaletteColorLookupTableData: any;
        bluePaletteColorLookupTableData: any;
        alphaPaletteColorLookupTableData: any;
        segmentedRedPaletteColorLookupTableData: any;
        segmentedGreenPaletteColorLookupTableData: any;
        segmentedBluePaletteColorLookupTableData: any;
        segmentedAlphaPaletteColorLookupTableData: any;
    }
    export interface DicomScalingModule {
        rescaleSlope: number | undefined;
        rescaleIntercept: number | undefined;
        modality: string;
    }
    export type PixelArray = Float64Array | Float32Array | Int32Array | Uint32Array | Uint16Array | Uint8Array | Int32Array | Int16Array | Int8Array;
}
declare module "Utilities/getMinMax" {
    import { PixelArray } from "types";
    function getMinMax(arrayPixel: PixelArray): {
        min: number;
        max: number;
    };
    export default getMinMax;
}
declare module "DecodedImage" {
    import { DicomPixelModule, DicomScalingModule, DicomVOILutModule } from "types";
    import { PixelArray } from "types";
    class DecodedImage {
        transferSyntax: string;
        width: number;
        height: number;
        min: number | undefined;
        max: number | undefined;
        windowWidth: number | undefined;
        windowCenter: number | undefined;
        pixelData: PixelArray;
        photometricInterpretation: string | undefined;
        pixelModule: DicomPixelModule | undefined;
        scalingModule: DicomScalingModule | undefined;
        voiLUTModule: DicomVOILutModule | undefined;
        arrayType: "Int8Array" | "Uint8Array" | "Int16Array" | "Uint16Array" | "Float32Array" | undefined;
        constructor(transferSyntax: string, width: number, height: number, pixelData: PixelArray);
        getMinMax(): {
            min: number;
            max: number;
        };
        getLUT(): {
            windowWidth: number;
            windowCenter: number;
            min: number;
            max: number;
        };
    }
    export default DecodedImage;
}
declare module "JPEG2000" {
    class JPEG2000 {
        static decode(pixelData: DataView): Promise<any>;
    }
    export default JPEG2000;
}
declare module "JPEGBaselineLossyProcess1_8bit" {
    import { DecodeOptions } from "types";
    class JPEGBaselineLossyProcess1_8bit {
        static decode(pixelData: DataView, options: DecodeOptions): Promise<any>;
        static jpegJS(pixelData: DataView, options: DecodeOptions): Promise<any>;
        static browser(pixelData: DataView): Promise<Uint8Array>;
        static turboJpeg(pixelData: DataView): Promise<any>;
    }
    export default JPEGBaselineLossyProcess1_8bit;
}
declare module "JPEGBaselineLossyProcess2_12bit" {
    import { DecodeOptions } from "types";
    import JPEGBaselineLossyProcess1_8bit from "JPEGBaselineLossyProcess1_8bit";
    class JPEGBaselineLossyProcess2_12bit extends JPEGBaselineLossyProcess1_8bit {
        static decode(pixelData: DataView, options: DecodeOptions): Promise<any>;
    }
    export default JPEGBaselineLossyProcess2_12bit;
}
declare module "JPEGLS" {
    class JPEGLS {
        static decode(pixelData: DataView): Promise<any>;
    }
    export default JPEGLS;
}
declare module "JPEGLossLess" {
    class JPEGLossLess {
        static decode(pixelData: DataView): any;
    }
    export default JPEGLossLess;
}
declare module "Uncompressed" {
    class UncompressedDecoder {
        static decode(pixelData: DataView): Uint8Array;
    }
    export default UncompressedDecoder;
}
declare module "Utilities/changeTypedArray" {
    import { PixelArray } from "types";
    function changeTypedArray(pixelArray: PixelArray, minAfterScale: number, maxAfterScale: number): Float32Array | Int32Array | Uint32Array | Uint16Array | Uint8Array | Int16Array | Int8Array;
    export default changeTypedArray;
}
declare module "Utilities/getIsArrayPixelHasValidType" {
    import { PixelArray } from "types";
    function getIsArrayPixelHasValidType(arrayPixel: PixelArray, min: number, max: number): boolean;
    export default getIsArrayPixelHasValidType;
}
declare module "Utilities/getMinMaxAfterScale" {
    function getMinMaxAfterScale(min: number, max: number, rescaleSlope: number | undefined, rescaleIntercept: number | undefined): {
        min: number;
        max: number;
        minAfterScale?: undefined;
        maxAfterScale?: undefined;
    } | {
        minAfterScale: number;
        maxAfterScale: number;
        min?: undefined;
        max?: undefined;
    };
    export default getMinMaxAfterScale;
}
declare module "RLE" {
    import { DecodeOptions } from "types";
    class RLE {
        static decode(pixelData: DataView, options: DecodeOptions): any;
    }
    export default RLE;
}
declare module "HTJ2K" {
    class HTJ2K {
        static decode(pixelData: DataView): Promise<any>;
    }
    export default HTJ2K;
}
declare module "Utilities/ybrFull" {
    import { DecodeOptions } from "types";
    import { PixelArray } from "types";
    function yrbFullToRgba(pixelData: PixelArray, pixelModule: DecodeOptions): PixelArray;
    export default yrbFullToRgba;
}
declare module "Utilities/ybrFull422" {
    import { DecodeOptions } from "types";
    import { PixelArray } from "types";
    function ybrFull422ToRgba(pixelData: PixelArray, pixelModule: DecodeOptions): PixelArray;
    export default ybrFull422ToRgba;
}
declare module "Utilities/planerConfiguration" {
    import { PixelArray } from "types";
    function applyPlanerConfiguration(pixelData: PixelArray): PixelArray;
    export default applyPlanerConfiguration;
}
declare module "UnSyntaxed" {
    import { DecodeOptions } from "types";
    class UnSyntaxed {
        static decode(pixelData: DataView, options: DecodeOptions): Promise<Uint8Array | undefined>;
    }
    export default UnSyntaxed;
}
declare module "Utilities/invertMonoChrome1" {
    import DecodedImage from "DecodedImage";
    function invertMonochrome1(image: DecodedImage): import("types").PixelArray;
    export default invertMonochrome1;
}
declare module "Decoder" {
    import DecodedImage from "DecodedImage";
    import { DecodeOptions } from "types";
    class Decoder {
        static decode(pixelData: DataView, options: DecodeOptions): Promise<DecodedImage | null>;
        private static _setLUT;
        private static _applyScaling;
        private static _applyColorSpace;
        private static _toSutibleTypedArray;
        private static _endianFixer;
        private static _fixSize;
    }
    export default Decoder;
}
declare module "index" {
    import { DecodeOptions } from "types";
    function decode(pixelData: DataView | ArrayBuffer, options: DecodeOptions): Promise<import("DecodedImage").default | null>;
    export default decode;
}
