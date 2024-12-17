import { DecodeOptions } from "./types";
import JPEGBaselineLossyProcess1_8bit from "./JPEGBaselineLossyProcess1_8bit";

class JPEGBaselineLossyProcess2_12bit extends JPEGBaselineLossyProcess1_8bit{
    static async decode(pixelData:DataView,options:DecodeOptions){
        return this.jpegJS(pixelData,options);
    }
}

export default JPEGBaselineLossyProcess2_12bit;