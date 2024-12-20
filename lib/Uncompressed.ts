
class UncompressedDecoder{

    static  decode(pixelData:DataView){        
        let arrayBuffer = pixelData.buffer;
        console.log({pixelData})
        return new Uint8Array(arrayBuffer);
    }

    

}

export  default UncompressedDecoder;