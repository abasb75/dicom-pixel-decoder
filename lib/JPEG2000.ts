import { decode } from "@abasb75/jpeg2000-decoder";

class JPEG2000{

    static async decode(pixelData:DataView){

        const decoded = await decode(
            pixelData.buffer.slice(
                pixelData.byteOffset,
                pixelData.byteLength,
            ),
        );

        return decoded.decodedBuffer;
        
    }

}

export  default JPEG2000;