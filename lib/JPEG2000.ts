import { decode } from "@abasb75/jpeg2000-decoder";

class JPEG2000{

    static async decode(pixelData:DataView){

        let arrayBuffer = pixelData.buffer;
        console.log({arrayBuffer});
        let offset = pixelData.byteOffset;
        const length = pixelData.byteLength;

        const decoded = await decode(
            arrayBuffer.slice(offset,length),
        );

        console.log({decoded})

        return decoded.decodedBuffer;
    }

}

export  default JPEG2000;