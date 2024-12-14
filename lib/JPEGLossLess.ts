
//@ts-ignore
import * as JpegLosslessDecoder from "jpeg-lossless-decoder-js";

class JPEGLossLess{
    static decode(pixelData:DataView){

        let arrayBuffer = pixelData.buffer;
        let offset = pixelData.byteOffset;
        const length = pixelData.byteLength;

        const decoder = new JpegLosslessDecoder.Decoder();
        const decoded = decoder.decode(
            arrayBuffer,
            offset,
            length
        );

        return decoded;
    }
}


export default JPEGLossLess;