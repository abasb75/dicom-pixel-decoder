import { decode } from "@abasb75/charls-decoder";

class JPEGLS{
    static async decode(pixelData:DataView){

        console.log('pixelData',pixelData)
        let arrayBuffer = pixelData.buffer;
        let offset = pixelData.byteOffset;
        const length = pixelData.byteLength;

        const decoded = await decode(
            arrayBuffer.slice(offset,length),
        );
        if(!(decoded.decodedBuffer instanceof Uint8Array)){
            return null;
        }
        const bitsPerSample = decoded.frameInfo.bitsPerSample;
        
        if(bitsPerSample > 8) {
            return new Int16Array(
                decoded.decodedBuffer.buffer,
                decoded.decodedBuffer.byteOffset,
                decoded.decodedBuffer.byteLength/2,
            );
        }
        return new Uint8Array(
            decoded.decodedBuffer.buffer,
            decoded.decodedBuffer.byteOffset,
            decoded.decodedBuffer.byteLength,
        );

    }
}


export default JPEGLS;