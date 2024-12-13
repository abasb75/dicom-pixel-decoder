import { decode } from "@abasb75/turbojpeg-decoder";
import { DecodeOptions } from "./types";
const jpeg = require('jpeg-js');


class JPEGBaselineLossyProcess1_8bit{
    static async decode(pixelData:DataView,options:DecodeOptions){
        try{
            if (
                options.bitsAllocated === 8 &&
                [3,4].includes(options.samplesPerPixel as number)
            ) {
                // decode with browser option.
                console.log("browser");
                return JPEGBaselineLossyProcess1_8bit.browser(pixelData);
            }else{
                console.log("jpeg-js");
                return JPEGBaselineLossyProcess1_8bit.jpegJS(pixelData);
            }
        }catch{
            console.log("turbo-jpeg");
            const data = await JPEGBaselineLossyProcess1_8bit.turboJpeg(pixelData);
            return data;
        }
        
    }

    static async jpegJS(pixelData:DataView){
        const decoded = jpeg.decode(pixelData.buffer,{useTArray: true});
        if(decoded?.data){
            return decoded.data;
        }
        return null;
    }

    static async browser(pixelData:DataView){
        try{
            const createImage = (imageData:any)=>new Promise<HTMLImageElement>((resolve,reject)=>{
                var img = document.createElement('img');
                img.src = imageData;
                img.onload = ()=>{
                    resolve(img);
                }
                img.onerror = ()=>{
                    reject();
                }
            });

            var arrayBufferView = new Uint8Array( pixelData.buffer );
            var blob = new Blob( [ arrayBufferView ], { type: "image/jpeg" } );
            var urlCreator = window.URL || window.webkitURL;
            var imageUrl = urlCreator.createObjectURL( blob );
            const img = await createImage(imageUrl);

            const canvas = document.createElement('canvas') as HTMLCanvasElement;
            canvas.height = img.height;
            canvas.width = img.width;
            const context = canvas.getContext('2d');
            context?.drawImage(img, 0, 0);

            const imageData = context?.getImageData(0,0,img.width,img.height);
            return new Uint8Array(imageData?.data?.buffer as ArrayBufferLike);
        }catch{
            return JPEGBaselineLossyProcess1_8bit.jpegJS(pixelData);
        }

    }

    static async turboJpeg(pixelData:DataView){
        const decoded = await decode(pixelData.buffer);
        return decoded?.decodedBuffer;
    }
}

export default JPEGBaselineLossyProcess1_8bit;