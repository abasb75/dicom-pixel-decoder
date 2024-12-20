
//@ts-ignore
import * as JpegLosslessDecoder from "jpeg-lossless-decoder-js";

class JPEGLossLess{
    static decode(pixelData:DataView){

        const decoder = new JpegLosslessDecoder.Decoder();
        const decoded = decoder.decode(
            new Uint8Array(pixelData.buffer),
            pixelData.byteOffset,
            pixelData.byteLength,
        )
        return decoded;
        
    }
}


export default JPEGLossLess;