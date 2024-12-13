
//@ts-ignore
import * as JpegLosslessDecoder from "jpeg-lossless-decoder-js";

class JPEGLossLess{
    static async decode(pixelData:DataView){

        console.log('pixelData',pixelData)
        let arrayBuffer = pixelData.buffer;
        let offset = pixelData.byteOffset;
        const length = pixelData.byteLength;
        await  JpegLosslessDecoder;
        
        const decoder = new JpegLosslessDecoder.Decoder();
        console.log(decoder)
        const decoded = await decoder.decode(
            arrayBuffer.slice(offset,length),
        );
        return decoded;
    }
}


export default JPEGLossLess;