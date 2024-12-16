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
        if(!this.min || this.max){
            return getMinMax(this.pixelData)
        }
        return {
            min:this.min as number,
            max:this.max as number,
        }
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