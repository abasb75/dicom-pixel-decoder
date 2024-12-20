import { decode } from "@abasb75/charls-decoder";

class JPEGLS{
    static async decode(pixelData:DataView){

       let arrayBuffer = pixelData.buffer;
        let offset = pixelData.byteOffset;
        const length = pixelData.byteLength;

        const decoded = await decode(
            arrayBuffer.slice(offset,length),
        );
        if(!(decoded.decodedBuffer instanceof Uint8Array)){
            return null;
        }

        return decoded.decodedBuffer;
    }
}


export default JPEGLS;