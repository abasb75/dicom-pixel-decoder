import { DecodeOptions } from "../types";
import { PixelArray } from "../types";

function ybrFull422ToRgba(pixelData:PixelArray,pixelModule:DecodeOptions){
    const { columns,rows } = pixelModule;
    if(!columns || !rows){
        return pixelData;
    }
    const pixelCounts = rows*columns;

    if(
        pixelData.length !== 2*pixelCounts
    ){
        return  pixelData;
    }

    const _pixelData = new Uint8ClampedArray(pixelCounts * 4);
    let ybrIndex = 0;
    for (let i = 0; i < pixelCounts; i += 2) {
        const y1 = pixelData[ybrIndex++];
        const y2 = pixelData[ybrIndex++];
        const cb = pixelData[ybrIndex++];
        const cr = pixelData[ybrIndex++];
  
        _pixelData[i*4] = y1 + 1.402 * (cr - 128);
        _pixelData[i*4+1] = y1 - 0.34414 * (cb - 128) - 0.71414 * (cr - 128);
        _pixelData[i*4+2] = y1 + 1.772 * (cb - 128);
        _pixelData[i*4+3] = 255;
  
        _pixelData[i*4+4] = y2 + 1.402 * (cr - 128);
        _pixelData[i*4+5] = y2 - 0.34414 * (cb - 128) - 0.71414 * (cr - 128);
        _pixelData[i*4+6] = y2 + 1.772 * (cb - 128);
        _pixelData[i*4+7] = 255;
    }

    return new Uint16Array(_pixelData);
    
}

export default ybrFull422ToRgba;