import { decode } from "@abasb75/openjph";

class HTJ2K{

    static async decode(pixelData:DataView){

        const decoded = await decode(
            pixelData.buffer.slice(
                pixelData.byteOffset,
                pixelData.byteLength
            )
        );
        
        return decoded.decodedBuffer;

    }

}

export default HTJ2K;