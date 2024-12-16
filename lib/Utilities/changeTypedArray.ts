import { PixelArray } from "../types";

function changeTypedArray(pixelArray:PixelArray){
    console.log('pixelArray',pixelArray);
    if(pixelArray instanceof Uint8Array){
        return new Int8Array(pixelArray);
    }else if(pixelArray instanceof Int8Array){
        return new Uint8Array(pixelArray);
    }else if(pixelArray instanceof Uint16Array){
        return new Int16Array(pixelArray);
    }else if(pixelArray instanceof Int16Array){
        return new Uint16Array(pixelArray);
    }
    return pixelArray;
}

export default changeTypedArray;