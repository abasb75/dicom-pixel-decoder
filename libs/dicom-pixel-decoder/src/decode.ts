import DecodedImage from "./DecodedImage";
import type { DecodeOptions } from "./types";

const worker = new Worker(new URL("./decoderWorker.ts", import.meta.url), { type: "module" });

async function decode(pixelData:DataView|ArrayBuffer,options:DecodeOptions){

    
    let pixelDataView;
    if(pixelData instanceof ArrayBuffer){
        pixelDataView = new DataView(pixelData);
    }else{
        pixelDataView = pixelData; 
    }

    const promise =  new Promise((resolve, reject) => {
        const handler = (e: MessageEvent) => {
            const { decoded } = e.data;
            worker!.removeEventListener("message", handler);

            if (!decoded) {
                reject(new Error(e.data.error));
            }
            else {
                const image = new DecodedImage(
                    decoded.transferSyntaxUID,
                    decoded.width,
                    decoded.height,
                    decoded.pixelData,
                );
                image.voiLUTModule = decoded.voiLUTModule;
                image.photometricInterpretation = decoded.photometricInterpretation;
                image.pixelModule = {
                    pixelMeasuresSequence: options.pixelMeasuresSequence,
                    photometricInterpretation: options.photometricInterpretation,
                    numberOfFrames: options.numberOfFrames,
                    pixelRepresentation: options.pixelRepresentation,
                    pixelSpacing: options.pixelSpacing,
                    spacingBetweenSlices: options.spacingBetweenSlices,
                    rows: options.rows,
                    columns: options.columns,
                    bitsAllocated: options.bitsAllocated,
                    highBit: options.highBit,
                    bitsStored: options.bitsStored,
                    samplesPerPixel: options.samplesPerPixel,
                    pixelDataProviderURL: options.pixelDataProviderURL,
                    pixelPaddingRangeLimit: options.pixelPaddingRangeLimit,
                    extendedOffsetTable: options.extendedOffsetTable,
                    extendedOffsetTableLengths: options.extendedOffsetTableLengths,
                    pixelAspectRatio: options.pixelAspectRatio,
                    planarConfiguration: options.planarConfiguration,
                    redPaletteColorLookupTableDescriptor: options.redPaletteColorLookupTableDescriptor,
                    greenPaletteColorLookupTableDescriptor: options.greenPaletteColorLookupTableDescriptor,
                    bluePaletteColorLookupTableDescriptor: options.bluePaletteColorLookupTableDescriptor,
                    alphaPaletteColorLookupTableDescriptor: options.alphaPaletteColorLookupTableDescriptor,
                    redPaletteColorLookupTableData: options.redPaletteColorLookupTableData,
                    greenPaletteColorLookupTableData: options.greenPaletteColorLookupTableData,
                    bluePaletteColorLookupTableData: options.bluePaletteColorLookupTableData,
                    alphaPaletteColorLookupTableData: options.alphaPaletteColorLookupTableData,
                    segmentedRedPaletteColorLookupTableData: options.segmentedRedPaletteColorLookupTableData,
                    segmentedGreenPaletteColorLookupTableData: options.segmentedGreenPaletteColorLookupTableData,
                    segmentedBluePaletteColorLookupTableData: options.segmentedBluePaletteColorLookupTableData,
                    segmentedAlphaPaletteColorLookupTableData: options.segmentedAlphaPaletteColorLookupTableData
                }

                image.scalingModule = decoded.scalingModule;
                image.windowCenter = decoded.windowCenter;
                image.windowWidth = decoded.windowWidth;
                image.min = decoded.min;
                image.max = decoded.max;
                image.arrayType = decoded.arrayType;
                image.littleEndian = options.littleEndian;
                image.pixelTypes = options.isFloat ? 'Float' : 'Integer';
                resolve(image)
            }
        };
        worker!.addEventListener("message", handler);
        worker.postMessage({pixelDataView,options});
    });

    return await promise as DecodedImage;

}


export default decode;