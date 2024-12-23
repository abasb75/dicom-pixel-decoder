import Decoder from "./Decoder";
import { DecodeOptions } from "./types";

async function decode(pixelData:DataView|ArrayBuffer,options:DecodeOptions){

    let pixelDataView;
    if(pixelData instanceof ArrayBuffer){
        pixelDataView = new DataView(pixelData);
    }else{
        pixelDataView = pixelData; 
    }
    return await Decoder.decode(pixelDataView,options);

}


export default decode;