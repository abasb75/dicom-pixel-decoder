// import charls from '@abasb75/charls-decoder';
// import JLSDecoder from './JPEGLS2';
// import decode from "../wasms/charls/index";
// import decode from "../../../../../charls-js/src/decode";
// import encode from "../../../../../charls-js/src/encode";

//@ts-ignore
import CharLSDecoder from "@abasb75/charls/decode";
//@ts-ignore
import CharLSEncoder from "@abasb75/charls/encode";
import decoderUrl from "@abasb75/charls/jls_decoder.wasm?url"; 
import encoderUrl from "@abasb75/charls/jls_encoder.wasm?url"; 

var decoder:any=null;
var encoder:any=null;

var decode:any = null;
var encode:any = null;

class JPEGLS{

    static async decode(pixelData: DataView) {
        if(!decoder || !decode){
            decoder = await CharLSDecoder({
                locateFile: (path:any) => {
                    console.log({path});
                    return new URL(decoderUrl, import.meta.url).href;
                }
            });
            decode = decoder.decode;
        }

        if(!encoder || !encode){
            encoder = await CharLSEncoder({
                locateFile: (path:any) => {
                    console.log({path});
                    return new URL(encoderUrl, import.meta.url).href;
                }
            });
            encode = encoder.encode;
        }

        const buffer = new Uint8Array(pixelData.buffer, pixelData.byteOffset, pixelData.byteLength).slice();
        const decoded = await decode(buffer);
        console.log({decoded});
        
        const encoded = await encode(
            decoded.data,
            decoded.width,
            decoded.height,
            decoded.components,
            decoded.bitsPerSample ,
            decoded.interleave_mode,
            decoded.nearLossless
        );

        const decoded2 = await decode(encoded.data);
        return decoded2.data;
    }
}


export default JPEGLS;