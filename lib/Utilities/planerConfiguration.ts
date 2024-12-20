import { PixelArray } from "../types";

function applyPlanerConfiguration(pixelData:PixelArray){
    if(pixelData.length % 3 !== 0){
        return pixelData;
    }
    const pixelCounts = pixelData.length / 3;
    const _pixelData = new Uint8ClampedArray(pixelCounts*4);
    for(let i=0;i<pixelCounts;i++){
        _pixelData[i*4] = pixelData[i];
        _pixelData[i*4+1] = pixelData[pixelCounts+i];
        _pixelData[i*4+2] = pixelData[2*pixelCounts+i];
        _pixelData[i*4+3] = 255;
    }
    return new Uint8Array(_pixelData);
}

export default applyPlanerConfiguration;