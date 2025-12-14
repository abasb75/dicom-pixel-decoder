import { decode } from "../wasms/openjpeg/index";
// import { decode } from "../wasms/openjs2/index";

// import { decode } from "@abasb75/jpeg2000-decoder";

class JPEG2000{

    static async decode(pixelData:DataView){
       const buffer = new Uint8Array(pixelData.buffer, pixelData.byteOffset, pixelData.byteLength).buffer;
        const decoded = await decode(buffer as ArrayBuffer);
        return decoded.decodedBuffer;
        
    }

}

export  default JPEG2000;