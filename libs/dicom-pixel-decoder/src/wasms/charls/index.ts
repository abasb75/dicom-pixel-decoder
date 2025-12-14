import OpenJPEGWASM from "./jls_decoder"

let openjpegjs:any;
let decodeFile:any = null;

async function decode(imageBuffer:Uint8Array) {

    if(!openjpegjs){
      if(!openjpegjs){
        openjpegjs = await OpenJPEGWASM();
        decodeFile = openjpegjs.decode;
      }
    }

    const decoded = await decodeFile(imageBuffer);
    return decoded.data;
    console.log({decoded});
    
   
}

export default decode;