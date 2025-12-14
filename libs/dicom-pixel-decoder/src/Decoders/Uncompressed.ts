
class UncompressedDecoder{

    // only convert dataview to uint8 now
    static decode(pixelData:DataView){        
        let arrayBuffer = pixelData.buffer;
        return new Uint8Array(arrayBuffer);
    }

}

export  default UncompressedDecoder;