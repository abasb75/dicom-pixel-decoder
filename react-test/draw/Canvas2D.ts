import Dataset from "@abasb75/dicom-parser/Dataset";
import Utilities from "./Utitlities";
import { PixelArray } from "@abasb75/dicom-parser/types";

class Canvas2D {

    static draw(canvas:HTMLCanvasElement,pixelDatas:PixelArray,dataset:Dataset){
        
        if(!pixelDatas.length) return;

        const pixelData = Canvas2D._scalePixelData(pixelDatas,dataset);
        console.log('scaled_pixel_data',pixelData);
        let {min,max,windowCenter,windowWidth} = Canvas2D._getLUT(pixelData,dataset);
        console.log(min,max,windowCenter,windowWidth,pixelData)
        canvas.width = dataset.pixelModule.columns || 0;
        canvas.height= dataset.pixelModule.rows || 0;

        const context = canvas.getContext('2d');
        const imageData = context?.createImageData(canvas.width,canvas.height);
    
        if(imageData){
            if(imageData.data.length === pixelData.length){
                for(let i = 0; i < pixelData.length; i++) {
                    imageData.data[i] = Canvas2D._calcPixel(pixelData[i],min,max,windowWidth,windowCenter);
                }
            }else if(imageData.data.length/4 === pixelData.length){
                for(let i = 0; i < pixelData.length; i++) {
                    imageData.data[4*i] = Canvas2D._calcPixel(pixelData[i],min,max,windowWidth,windowCenter);
                    imageData.data[4*i+1] = Canvas2D._calcPixel(pixelData[i],min,max,windowWidth,windowCenter);
                    imageData.data[4*i+2] = Canvas2D._calcPixel(pixelData[i],min,max,windowWidth,windowCenter);
                    imageData.data[4*i+3] = 255;
                }
            }else if((3*imageData.data.length)/4 === pixelData.length){
                let imageDataIndex = 0;
                for(let i = 0; i < pixelData.length; i+=3) {
                    imageData.data[imageDataIndex++] = Canvas2D._calcPixel(pixelData[i],min,max,windowWidth,windowCenter);
                    imageData.data[imageDataIndex++] = Canvas2D._calcPixel(pixelData[i+1],min,max,windowWidth,windowCenter);
                    imageData.data[imageDataIndex++] = Canvas2D._calcPixel(pixelData[i+2],min,max,windowWidth,windowCenter);
                    imageData.data[imageDataIndex++] = 255;

                }
            }
            context?.putImageData(imageData,0,0);
        }

    }

    private static _getLUT(pixelData:PixelArray,dataset:Dataset){
        if(dataset.voiLUTModule.windowCenter && dataset.voiLUTModule.windowWidth){
            const windowWidth = dataset.voiLUTModule.windowWidth;
            const windowCenter = dataset.voiLUTModule.windowCenter;
            return {
                windowWidth,
                windowCenter,
                max:windowCenter - 0.5 + windowWidth / 2,
                min:windowCenter - 0.5 - windowWidth / 2,
            }
        }
        const {min,max} =  Utilities.getMinMax(pixelData);
        const windowWidth = max - min;
        const windowCenter = min + windowWidth / 2  - 0.5;
        return {
            min,
            max,
            windowWidth,
            windowCenter,
        }
    }

    private static _calcPixel(pixel:number,min:number,max:number,windowWidth:number,windowCenter:number){
        if(max <= pixel) return 255;
        else if( min >= pixel) return 0;
        else return (Math.round(pixel - windowCenter - 0.5)/(windowWidth-1)+0.5)*255;
    }

    private  static _scalePixelData(
        pixelData: PixelArray,
        dataset:Dataset
      ): PixelArray {

        const scalingModule = dataset.scalingModule;
        const { rescaleSlope, rescaleIntercept, modality } = scalingModule;

        if(!rescaleIntercept 
            || !rescaleIntercept 
            || typeof rescaleSlope!=="number" 
            ||typeof rescaleIntercept !== "number"
        ){
            return pixelData;
        }
        
        console.log('pixel-data-object',rescaleSlope,rescaleIntercept);
        if (
          modality === 'PT'
        //   typeof suvbw === 'number' &&
        //   !isNaN(suvbw)
        ) {
        //   for (let i = 0; i < arrayLength; i++) {
        //     array[i] = suvbw * (array[i] * rescaleSlope + rescaleIntercept);
        //   }
        } else {
          for (let i = 0; i < pixelData.length; i++) {
            pixelData[i] = pixelData[i] * rescaleSlope + rescaleIntercept;
          }
        }
      
        return pixelData;
    }

}

export default Canvas2D;