import { PixelArray } from "../types";

function getMinMax(arrayPixel:PixelArray){
    let min = arrayPixel[0];
    let max = arrayPixel[0];
    for(let i=1;i<arrayPixel.length;i++){
        const pixel = arrayPixel[i];
        if(pixel<min) min=pixel;
        if(pixel>max) max=pixel;
    }
    return {min,max}
}

export default getMinMax;