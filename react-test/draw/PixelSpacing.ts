import { PixelArray } from "@abasb75/dicom-pixel-decoder/types";

type PixelSpacingType = number[];


class PixelSpacing {
    static  apply(
        pixelData:PixelArray,
        pixelSpacing:PixelSpacingType,
        width:number,
        hieght:number,
        samplePerPixel:number,
    ){
        if(
            !pixelSpacing
            || !Array.isArray(pixelSpacing)
        ){
            return {
                pixelData,
                pixelSpacing,
                width,
                hieght,
            }
        }
        if(
            pixelSpacing.length > 2 
            || pixelSpacing[0] === pixelSpacing[1]
        ){
            return {
                pixelData,
                pixelSpacing,
                width,
                hieght,
            }
        }

        const xPixelSpacing = pixelSpacing[1];
        const yPixelSpacing = pixelSpacing[0];
        console.log({pixelSpacing})
        if(xPixelSpacing > yPixelSpacing){
            return PixelSpacing.xScaling(
                pixelData,
                xPixelSpacing,
                yPixelSpacing,
                width,
                hieght,
                samplePerPixel
            );
        }

        return PixelSpacing.yScaling(
            pixelData,
            xPixelSpacing,
            yPixelSpacing,
            width,
            hieght,
            samplePerPixel
        );

    }

    // untested
    static yScaling(
        pixelData:PixelArray,
        xPixelSpacing:number,
        yPixelSpacing:number,
        width:number,
        hieght:number,
        samplePerPixel:number,
    ){
        
        const scaledX = (yPixelSpacing/xPixelSpacing);
        const newHieght = Math.floor(hieght*scaledX);
        //@ts-ignore
        const _pixelData = new pixelData.constructor(width*newHieght*samplePerPixel);
        
        for(let i=0;i<width;i++){
            for (let j=0;j<newHieght;j++){
                const base = i*width*j;
                if(j === 0){
                    for(let k=0;k<samplePerPixel;k++){
                        _pixelData[i+k] = pixelData[i+k];
                    }
                    continue;
                }
                const targetPixelIndex = Math.round((i*hieght)/newHieght);
                for(let k=0;k<samplePerPixel;k++){
                    _pixelData[base+j+k] = pixelData[(i*width*targetPixelIndex)+k];
                }
            }
        }

        return {
            pixelData:_pixelData,
            width,
            hieght:newHieght,
        }



    }

    static xScaling(
        pixelData:PixelArray,
        xPixelSpacing:number,
        yPixelSpacing:number,
        width:number,
        hieght:number,
        samplePerPixel:number,
    ){
        
        const scaledX = (xPixelSpacing/yPixelSpacing);
        const newWidth = Math.floor(width*scaledX);
        //@ts-ignore
        const _pixelData = new pixelData.constructor(newWidth*hieght*samplePerPixel);
        
        for(let j=0;j<hieght;j++){
            for (let i=0;i<newWidth;i++){
                const baseTarget = j*newWidth;
                const baseSource = j*width;
                if(i === 0){
                    for(let k=0;k<samplePerPixel;k++){
                        _pixelData[baseTarget+i+k] = pixelData[baseSource+i+k];
                    }
                    continue;
                }
                const targetPixelIndex = Math.round((i*width)/newWidth);
                for(let k=0;k<samplePerPixel;k++){
                    _pixelData[baseTarget+i+k] = pixelData[baseSource+targetPixelIndex+k];
                }
            }
        }

        return {
            pixelData:_pixelData,
            width:newWidth,
            hieght,
        }



    }
}


export default PixelSpacing;