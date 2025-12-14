//@ts-ignore
import TurboJPEGWasm from "./libjpegturbojs.js";

import { FrameInfo } from "./interface.js";

let turboJpeg:any;

interface DecodeOptions{
    iterations?:number;
}

async function decode(imageBuffer:ArrayBuffer,options:DecodeOptions={}) {

    if(!turboJpeg){
        console.log(TurboJPEGWasm)
        turboJpeg = await TurboJPEGWasm()
    }

    const iterations = options.iterations || 1;

    const decoder = new turboJpeg.JPEGDecoder();
    
    
    const encodedBitStream = new Uint8Array(imageBuffer)
    const encodedBuffer = decoder.getEncodedBuffer(encodedBitStream.length);
    encodedBuffer.set(encodedBitStream);

    for(let i=0; i < iterations; i++) {
      decoder.decode();
    }

    const frameInfo:FrameInfo = decoder.getFrameInfo();


    var decodedBuffer = decoder.getDecodedBuffer();
   
    return {
        decodedBuffer,
        frameInfo,
    }
  }


export default {
    decode
};