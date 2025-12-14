import { PixelArray } from "../types";
import { PaletteColorData, PaletteColorDataColor } from "@abasb75/dicom-parser/types";

class PaletteColor {

    static applyPaletteColor(
        pixelData:PixelArray,
        paletteColorData:PaletteColorData
    ):PixelArray{



        if(
            !paletteColorData
            || !paletteColorData.red 
            || !paletteColorData.blue
            || !paletteColorData.green
        ){
            return pixelData;
        }

        if(
            !paletteColorData.red.littleEndian 
            && paletteColorData.red.bitsPerEntry===16
            && pixelData instanceof Uint8Array
        ){
            for(let i=0;i<pixelData.byteLength;i+=2){
                const pixel1 = pixelData[i];
                const pixel2 = pixelData[i+1];
                pixelData[i] = pixel2;
                pixelData[i+1] = pixel1;
            }
        }

        const redPixels = PaletteColor.paletteDataToPixel(pixelData,paletteColorData.red);
        const greenPixels = PaletteColor.paletteDataToPixel(pixelData,paletteColorData.green);
        const bluePixels = PaletteColor.paletteDataToPixel(pixelData,paletteColorData.blue);

        if(!redPixels || !greenPixels || !bluePixels) {
            return pixelData;
        }


        let _pixelData = null;
        if(paletteColorData.red.bitsPerEntry === 16){
            _pixelData = new Uint16Array(pixelData.length*3);
        }else{
            _pixelData = new Uint8Array(pixelData.length*3);
        }

        for(let i=0; i<pixelData.length; i++){
            _pixelData[i*3  ] = redPixels[i];
            _pixelData[i*3+1] = greenPixels[i];
            _pixelData[i*3+2] = bluePixels[i];
        }

        

        return _pixelData;
        
    }

    private static paletteDataToPixel(pixelData:PixelArray,colorData:PaletteColorDataColor){

        if(!colorData.data){
            return null;
        }

        let _pixelData = new Array(pixelData.length);

        for(let i=0;i<pixelData.length;i++){
            let pixel = pixelData[i];
            if (pixel < colorData.firstInputValueMapped) {
                pixel = 0;
              } else if (pixel > colorData.firstInputValueMapped + colorData.lutEntries - 1) {
                pixel = colorData.lutEntries - 1;
              } else {
                pixel = pixel - colorData.firstInputValueMapped;
              }
            _pixelData[i] = colorData.data[pixel];
        }

        return _pixelData;


    }


    
}


export default PaletteColor;