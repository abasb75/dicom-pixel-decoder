//@ts-ignore
import CharLSDecoder from "@abasb75/charls/decode";
//@ts-ignore
import decoderUrl from "@abasb75/charls/jls_decoder.wasm?url"; 

var decoder:any=null;

var decode:any = null;

class JPEGLS{

    static async decode(pixelData: DataView) {
        if(!decoder || !decode){
            decoder = await CharLSDecoder({
                locateFile: () => {
                    return new URL(decoderUrl, import.meta.url).href;
                }
            });
            decode = decoder.decode;
        }

        const buffer = new Uint8Array(pixelData.buffer, pixelData.byteOffset, pixelData.byteLength).slice();
        const decoded = await decode(buffer);
        return decoded?.data;
    }
}


export default JPEGLS;