import { DecodeOptions, DicomPixelModule, DicomScalingModule, DicomVOILutModule } from "./types";
import getMinMax from "./Utilities/getMinMax";
import { PixelArray } from "./types";
import PaletteColor from "./Utilities/PaletteColor";
import Decoder from "./Decoder";
import PixelSpacing from "./Utilities/PixelSpacing";

class DecodedImage {
    
    transferSyntax:string;
    width:number;
    height:number;
    min:number|undefined;
    max:number|undefined;
    windowWidth:number|undefined;
    windowCenter:number|undefined;
    pixelData:PixelArray;
    photometricInterpretation:string|undefined;
    pixelModule:DicomPixelModule|undefined;
    scalingModule:DicomScalingModule|undefined;
    voiLUTModule:DicomVOILutModule|undefined;
    arrayType:"Int8Array"|"Uint8Array"|"Int16Array"|"Uint16Array"|"Float32Array"|undefined;
    littleEndian:boolean = true;
    pixelTypes:'Integer'|'Float' = 'Integer';
    
    constructor(
        transferSyntax:string,
        width:number,
        height:number,
        pixelData:PixelArray,
    ){
        this.transferSyntax = transferSyntax;
        this.width = width;
        this.height = height;
        this.pixelData = pixelData;
    }

    getMinMax(){
        // if(this.min !==undefined && this.max !== undefined){
        //     return {
        //         min:this.min,
        //         max:this.max,
        //     }
        // }
        return getMinMax(this.pixelData)
    }

    getLUT(){
        return {
            ...this.getMinMax(),
            windowWidth:this.windowWidth as number,
            windowCenter:this.windowCenter as number, 
        }
    }

    applyPaletteColor(paleteData:any){
        if(paleteData){
            this.pixelData = PaletteColor.applyPaletteColor(
                this.pixelData,
                paleteData,
            );
            Decoder._setLUT(this,{
                ...this.pixelModule,
                ...this.scalingModule,
                ...this.voiLUTModule,
                littleEndian:this.littleEndian,
                transferSyntaxUID:this.transferSyntax,
                isFloat:this.pixelTypes==='Float',
            } as DecodeOptions);
        }
    }

    applySpacing(){
        const scaled = PixelSpacing.apply(
            this.pixelData,
            this.pixelModule?.pixelSpacing,
            this.width,
            this.height,
            this.pixelModule?.samplesPerPixel || 1,
        )

        this.pixelData = scaled.pixelData;
        this.width = scaled.width;
        this.height = scaled.hieght;
    }

}


export default DecodedImage;