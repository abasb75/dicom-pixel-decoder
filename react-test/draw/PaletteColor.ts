import { PixelArray } from "@lib/types";
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

        const redPixels = PaletteColor.paletteDataToPixel(pixelData,paletteColorData.red);
        const greenPixels = PaletteColor.paletteDataToPixel(pixelData,paletteColorData.green);
        const bluePixels = PaletteColor.paletteDataToPixel(pixelData,paletteColorData.blue);

        if(!redPixels || !greenPixels || !bluePixels) {
            return pixelData;
        }

        let _pixelData = null;
        if( pixelData instanceof Uint8Array ){
            _pixelData = new Uint8Array(pixelData.length * 3);
        }else if(pixelData instanceof Uint16Array){
            _pixelData = new Uint16Array(pixelData.length * 3);
        }else if(pixelData instanceof Float32Array){
            _pixelData = new Float32Array(pixelData.length * 3);
        }else{
            return pixelData;
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

        let _pixelData = null;
        if( pixelData instanceof Uint8Array ){
            _pixelData = new Uint8Array(pixelData.length);
        }else if(pixelData instanceof Uint16Array){
            _pixelData = new Uint16Array(pixelData.length);
        }else if(pixelData instanceof Float32Array){
            _pixelData = new Float32Array(pixelData.length);
        }else{
            return pixelData;
        }

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