import { decode } from "@abasb75/openjph";

class HTJ2K{

    static async decode(pixelData: DataView) {

        const buffer = new Uint8Array(pixelData.buffer, pixelData.byteOffset, pixelData.byteLength).slice().buffer;

        const decoded = await decode(buffer);

        return decoded.decodedBuffer;
    }


}

export default HTJ2K;