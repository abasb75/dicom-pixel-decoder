import { DecodeOptions } from "../types";
import { PixelArray } from "../types";

function yrbFullToRgba(pixelData:PixelArray,pixelModule:DecodeOptions){
    const { columns,rows,planarConfiguration } = pixelModule;
    if(!columns || !rows){
        return pixelData;
    }

    if(pixelData.length !== columns*rows*3){
        return pixelData;
    }
    const pixelCounts = rows * columns;
    const _pixelData = new Uint8ClampedArray(pixelCounts * 4);

    if(planarConfiguration === 1){
        for(let i=0;i<pixelCounts;i++){
            const y = pixelData[i];
            const cb = pixelData[pixelCounts+i];
            const cr = pixelData[(pixelCounts*2)+i];
            _pixelData[i*4] = y + 1.402 * (cr - 128);
            _pixelData[i*4+1] = y - 0.34414 * (cb - 128) - 0.71414 * (cr - 128);
            _pixelData[i*4+2] = y + 1.772 * (cb - 128);
            _pixelData[i*4+3] = 255;
        }
    }else{
        for(let i=0;i<pixelCounts;i++){
            const y = pixelData[i*3];
            const cb = pixelData[i*3+1];
            const cr = pixelData[i*3+2];
            _pixelData[i*4] = y + 1.402 * (cr - 128);
            _pixelData[i*4+1] = y - 0.34414 * (cb - 128) - 0.71414 * (cr - 128);
            _pixelData[i*4+2] = y + 1.772 * (cb - 128);
            _pixelData[i*4+3] = 255;
        }
    }

    return new Uint8Array(_pixelData);
    
}

export default yrbFullToRgba;