interface Segment {
    startIndex:number;
    stopIndex:number;
}

class DicomRLEDicoder {
    static SUPPORTED_BITS_ALLOCATED = [8,16];
    pixelData:DataView;
    rows:number;
    columns:number;
    samplesPerPixel:number;
    bitsAllocated:number;
    planarConfiguration:boolean|undefined;
    pixelRepresentation:number|undefined;
    segmentCounts:number;
    segments:Segment[] = [];
    input:Int8Array;
    output:Int8Array;
    currentSegmentIndex:number = 0;

    constructor(
        pixelData:ArrayBuffer,
        rows:number,
        columns:number,
        samplesPerPixel:number,
        bitsAllocated:number,
        planarConfiguration:boolean|undefined,
        pixelRepresentation:number|undefined,
    ){
        this.pixelData = new DataView(pixelData);
        this.rows = rows;
        this.columns = columns;
        this.samplesPerPixel = samplesPerPixel;
        this.bitsAllocated = bitsAllocated;
        this.planarConfiguration = planarConfiguration;
        this.pixelRepresentation = pixelRepresentation;

        if(!DicomRLEDicoder.SUPPORTED_BITS_ALLOCATED.includes(this.bitsAllocated)){
            throw new Error("Unsupported bits allowcated");
        }

        this.segmentCounts = this.pixelData.getInt32(0,true);        
        for(let i=1;i<=this.segmentCounts;i++){
            const startIndex = this.pixelData.getUint32(i*4,true);
            let stopIndex = this.pixelData.getUint32((i+1)*4,true);
            if(stopIndex===0 || i>16){
                stopIndex = this.pixelData.byteLength;
            }
            this.segments.push({startIndex,stopIndex})
        }

        this.input = new Int8Array(this.pixelData.buffer);
        this.output = new Int8Array(this.rows * this.columns * this.samplesPerPixel * (this.bitsAllocated/8));

    }

    decode(){
        for(let i=0;i<this.segmentCounts;i++){
            this.currentSegmentIndex = i;
            if(this.planarConfiguration){
                if(this.bitsAllocated === 16){
                    this.decodeSegment16Planer(this.segments[i]);
                }
                this.decodeSegment8Planer(this.segments[i]);
            }
            if(this.bitsAllocated === 16){
                this.decodeSegment16(this.segments[i]);
            }
            this.decodeSegment8(this.segments[i]);
        }
        if(this.bitsAllocated === 16){
            if(this.pixelRepresentation === 0){
                return new Uint16Array(this.output.buffer);
            }
            return new Int16Array(this.output.buffer);
        }
        return new Uint8Array(this.output.buffer);

    }

    decodeSegment8(segment:Segment){

    }

    decodeSegment16(segment:Segment){
        const { startIndex,stopIndex } = segment;
        let inputIndex = startIndex;
        let outputIndex = (this.currentSegmentIndex===0) ? 1 : 0;
        while(inputIndex < stopIndex){
            const n = this.input[inputIndex];
            inputIndex++;
            if(n>=0 && n<=127){
                for(let i=1;i<=n+1;i++){
                    this.output[outputIndex] = this.input[inputIndex];
                    outputIndex += 2;
                    inputIndex++;
                }
            }else if(n<0 && n>=-127){
                for(let i=1;i<=Math.abs(n)+1;i++){
                    this.output[outputIndex] = this.input[inputIndex];
                    outputIndex += 2;
                }
                inputIndex++;
            }
        }
        console.log('outputIndex',outputIndex,inputIndex);
    }

    decodeSegment8Planer(segment:Segment){

    }

    decodeSegment16Planer(segment:Segment){

    }

}

export default DicomRLEDicoder;