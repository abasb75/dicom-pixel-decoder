import Dataset from "../Dataset";
import DICOMParseError from "./DicomParserError";
import getTagKey from "./getTagKey";
import { readTag, readUint32 } from "./read";

class PixelData {

    dataset:Dataset;

    constructor(dataset:Dataset){
        console.log({dataset});
        this.dataset = dataset;
    }

    static get(dataset:Dataset,frameIndex=0){
        const pixels = new this(dataset);
        return pixels.get(frameIndex);
    }

    get(frameIndex=0){
        const pixelDataElement = this.fetchPixelElement();

        if(!pixelDataElement){
            throw new Error("dicom has not pixels");
        }

        if(pixelDataElement?.value?.hasOffsetTable){
            return this.fetchPixelFrame(pixelDataElement,frameIndex);
        } else if (pixelDataElement.length === 0xFFFFFFFF){
            return this.fetchEncapsulatedFrame(pixelDataElement,frameIndex);
        } else {
            return this.fetchUncompressedFrame(pixelDataElement,frameIndex);
        }

    }

    fetchUncompressedFrame(pixelDataElement:any,frameIndex:number){
        const numberOfFrames = parseInt(this.dataset.get(0x0028,0x0008)) || 1;
        const rows = this.dataset.get(0x0028,0x0010);
        const cols = this.dataset.get(0x0028,0x0011);
        const samplesPerPixel = this.dataset.get(0x0028,0x0002) || 1;
        const bitsAllocated = this.dataset.get(0x0028,0x0100);
        const bytesAllocated = this.bitToByte(bitsAllocated);
        const photometricInterpretation = this.dataset.get(0x0028,0x0004);


        const length = pixelDataElement.length;
        const offset = pixelDataElement.value.offset;

        let frameLen;
        if(photometricInterpretation === 'YBR_FULL_422'){
            frameLen = length / numberOfFrames;
        } else {
            frameLen = rows * cols * samplesPerPixel * bytesAllocated 
        }

        const start = offset + (frameIndex * frameLen);
        return new DataView(this.dataset.bytes.slice(start,start+frameLen).buffer);
    }

    fetchEncapsulatedFrame(pixelDataElement:any,frameIndex:number=0){
        const numberOfFrames = parseInt(this.dataset.get(0x0028,0x0008)) || 1;
        console.log({pixelDataElement,numberOfFrames});
        const bytes = this.dataset.bytes;
        const offset =pixelDataElement.value.offsetTable[0];
        const nextOffsetTable = pixelDataElement.value.endOffset ;
        const litleEndian = this.dataset.littleEndian;
        
        let cursor = offset;
        const fragments = [];
        while(cursor < nextOffsetTable){
            const { group, element } = readTag(bytes,cursor,litleEndian);
            const { tagKey } = getTagKey(group,element);
            if(['(FFFE,E000)','(FFFE,E0DD)','(FFFE,E00D)'].indexOf(tagKey) === -1){
                throw new DICOMParseError(`Unexpected tag ${tagKey} found in pixel data fragment`,cursor);
            }
            cursor += 4;
            const length = readUint32(bytes,cursor,litleEndian);
            cursor += 4;
            if(length>0){
                fragments.push(bytes.slice(cursor,cursor+length));
            }
            cursor += length;
        }

        console.log({numberOfFrames,fragments});
        
        if(numberOfFrames > 1 && numberOfFrames == fragments.length){
            return new DataView(fragments[frameIndex].buffer);
        }

        const frame = this.concatFragments(fragments);
        return new DataView(frame.buffer);

    }

    fetchPixelFrame(pixelDataElement:any,frameIndex:number){

        const offsetTable = pixelDataElement.value.offsetTable;
        const bytes = this.dataset.bytes;
        const offset = offsetTable[frameIndex];
        const litleEndian = this.dataset.littleEndian;
        const nextOffsetTable = (frameIndex < offsetTable.length-1) 
            ? offsetTable[frameIndex+1]
            : pixelDataElement.value.endOffset ;

        let cursor = offset;
        const fragments = [];
        while(cursor < nextOffsetTable){
            const { group, element } = readTag(bytes,cursor,litleEndian);
            const { tagKey } = getTagKey(group,element);
            if(['(FFFE,E000)','(FFFE,E0DD)','(FFFE,E00D)'].indexOf(tagKey) === -1){
                throw new DICOMParseError(`Unexpected tag ${tagKey} found in pixel data fragment`,cursor);
            }
            cursor += 4;
            const length = readUint32(bytes,cursor,litleEndian);
            cursor += 4;
            fragments.push(bytes.slice(cursor,cursor+length));
            cursor += length;
        }

        const frame = this.concatFragments(fragments);
        console.log({isJPEGLS:this.isJPEGLS(frame)});
        return new DataView(frame.buffer);
    }

    fetchPixelElement(){
        let key = null;
        if(this.dataset.elements['(7FE0,0008)']){
            key = '(7FE0,0008)';
        } else if(this.dataset.elements['(7FE0,0009)']){
            key = '(7FE0,0009)';
        } else if(this.dataset.elements['(7FE0,0010)']){
            key = '(7FE0,0010)';
        } else {
            return null;
        }
        return this.dataset.elements[key];
    }

    concatFragments(arrays:Uint8Array[]):Uint8Array{
        const totalLength = arrays.reduce((acc, arr) => acc + arr.length, 0);
        const result = new Uint8Array(totalLength);
        let offset = 0;
        for (const arr of arrays) {
            result.set(arr, offset);
            offset += arr.length;
        }
        return result;
    }

    bitToByte(bit:number){
        if(bit <= 8){
            return bit/8;
        }
        return Math.ceil(bit/8);
    }

    private isJPEGLS(uint8array:Uint8Array) {
        for (let i = 0; i < uint8array.length - 1; i++) {
            if (uint8array[i] === 0xFF && uint8array[i + 1] === 0xF7) {
            return true;
            }
        }
        return false;
    }

}

export default PixelData;