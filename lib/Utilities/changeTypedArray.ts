import { PixelArray } from "../types";

function changeTypedArray(
    pixelArray:PixelArray,
    minAfterScale:number,
    maxAfterScale:number,
){

    if(Number.isInteger(minAfterScale) && Number.isInteger(maxAfterScale)){
        if(minAfterScale >= 0 && minAfterScale <= 255){
            return new Uint8Array(pixelArray); 
        }else if(minAfterScale >= 0 && minAfterScale <= 65535){
            return new Uint16Array(pixelArray);
        }else if(minAfterScale >= -128 && minAfterScale <= 127){
            return new Int8Array(pixelArray);
        }else if(minAfterScale>= 32768 && minAfterScale <= 32767){
            return new Int16Array(pixelArray);
        }
    }
    return new Float32Array(pixelArray);
}

export default changeTypedArray;