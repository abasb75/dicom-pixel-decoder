import { DicomPixelModule, DicomScalingModule, DicomVOILutModule } from "./types";
import getMinMax from "./Utilities/getMinMax";
import { PixelArray } from "./types";

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
        return getMinMax(this.pixelData)
    }

    getLUT(){
        return {
            ...this.getMinMax(),
            windowWidth:this.windowWidth as number,
            windowCenter:this.windowCenter as number, 
        }
    }

}


export default DecodedImage;