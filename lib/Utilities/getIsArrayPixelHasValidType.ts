import { PixelArray } from "../types";

function getIsArrayPixelHasValidType(arrayPixel:PixelArray,min:number,max:number){
    if(arrayPixel instanceof Uint8Array){
        if(min<0 || max>255){
            return false;
        }
    }else if(arrayPixel instanceof Int8Array){
        if(min<-128 || max>127){
            return false;
        }
    }else if(arrayPixel instanceof Uint16Array){
        if(min<0 || max>65535){
            return false;
        }
    }else if(arrayPixel instanceof Int16Array){
        if(min<-32768 || max>32767){
            return false;
        }
    }
    return true;
}

export default getIsArrayPixelHasValidType;