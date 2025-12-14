import turboJPEG from "@abasb75/turbojpeg-decoder";
import { DecodeOptions } from "../types";
//@ts-ignore
import JpegImage from '@abasb75/jpegjs'; 

class JPEGBaselineLossyProcess1_8bit{
  
    static async decode(pixelData:DataView,options:DecodeOptions){
        
        try{
            if (
                options.bitsAllocated === 8 &&
                [3,4].includes(options.samplesPerPixel as number)
            ) {
                return JPEGBaselineLossyProcess1_8bit.browser(pixelData);
            }else{
                return JPEGBaselineLossyProcess1_8bit.jpegJS(pixelData,options);
            }
        }catch{
            // this works fine, but is slower.
            const data = await JPEGBaselineLossyProcess1_8bit.turboJpeg(pixelData);
            return data;
        }
        
    }

    static async jpegJS(pixelData:DataView,options:DecodeOptions){
        //@ts-ignore
        const jpeg = new JpegImage();
        jpeg.parse(new Uint8Array(pixelData.buffer));
        if(options.bitsAllocated>8){
            return jpeg.getData16(options.columns,options.rows);
        }
        return jpeg.getData(options.columns,options.rows);
    }

    static async browser(pixelData:DataView){
        if(typeof document === "undefined"){
            return this.browserV2(pixelData);
        }
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

        // var arrayBufferView = new Uint8Array( pixelData.buffer );
        // var blob = new Blob( [ arrayBufferView ], { type: "image/jpeg" } );

        const buffer = new Uint8Array(pixelData.buffer, pixelData.byteOffset, pixelData.byteLength).slice().buffer;
        var blob = new Blob([buffer], { type: "image/jpeg" });

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
    }

    static async browserV2(pixelData: DataView) {
        const buffer = new Uint8Array(pixelData.buffer, pixelData.byteOffset, pixelData.byteLength).slice().buffer;
        const blob = new Blob([buffer], { type: "image/jpeg" });
        const imageBitmap = await createImageBitmap(blob);

        const canvas = new OffscreenCanvas(imageBitmap.width, imageBitmap.height);
        const ctx = canvas.getContext("2d");
        if(!ctx) {
            throw new Error("Could not get OffscreenCanvasRenderingContext2D");
        }
        ctx.drawImage(imageBitmap, 0, 0);

        const imageData = ctx.getImageData(0, 0, imageBitmap.width, imageBitmap.height);

        return new Uint8Array(imageData.data.buffer);
    }

    static async turboJpeg(pixelData: DataView) {
        // ساخت ArrayBuffer واقعی از ArrayBuffer | SharedArrayBuffer
        const buffer = new Uint8Array(pixelData.buffer, pixelData.byteOffset, pixelData.byteLength).slice().buffer;
        console.log('turbo-jpeg');
        const decoded = await turboJPEG.decode(buffer);
        return decoded?.decodedBuffer;
    }
}

export default JPEGBaselineLossyProcess1_8bit;