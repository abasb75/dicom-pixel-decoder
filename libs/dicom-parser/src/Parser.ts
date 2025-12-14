import * as Pako from "pako";
import Dataset from "./Dataset";
import Value from "./Value";
import getTagKey from "./utils/getTagKey";
import { readUint16, readUint32 } from "./utils/read";
import DICOMParseError from "./utils/DicomParserError";
import { Elements } from "./types/ElementInfo";
import { Metadata } from "./types/Metadata";


class Parser {

    private arrayBuffer:ArrayBuffer|null = null;
    private byteArray:Uint8Array|null = null;
    private prefix:string = "";
    private offset:number;
    private metadata:any = null;
    private LONG_VRS = ["OB","OW","SQ","UN","UT","OF","UC","OD","OL","UR","OV","SV","UV"];
    private littleEndian:boolean=true;
    private implicit:boolean=false;
    private deflated:boolean = false;
    private transferSyntaxUID:string|undefined|null = null;

    constructor(arrayBuffer?:ArrayBuffer){
        this.arrayBuffer = arrayBuffer ? arrayBuffer : null;
        this.offset = 0;
    }

    parse(arrayBuffer?:ArrayBuffer) : Dataset{

        if(arrayBuffer ){
            this.arrayBuffer = arrayBuffer;
        }

        if(!this.arrayBuffer){
            throw new DICOMParseError("No data to parse",this.offset);
        }

        this.byteArray = new Uint8Array(this.arrayBuffer);
        if(!this.byteArray){
            throw new DICOMParseError("No data to parse",this.offset);
        }

        if (this.byteArray.length >= 132) {
            this.prefix = String.fromCharCode.apply(
                null,
                Array.from(this.byteArray.slice(128, 132))
            );
            if (this.prefix === "DICM") {
                this.offset = 132;
            }
        }

        if(this.prefix !== "DICM"){
            this.offset = 0;
            while(Value.getString(
                new Uint8Array(this.byteArray.buffer, this.offset, 1)
            )===""){
                this.offset++;
            }
        }

        this.readMetadatas();

        this.transferSyntaxUID = this.metadata?.TransferSyntaxUID?.value;

        if(this.transferSyntaxUID){
            this.getTransferSyntaxProperties();
        }else{
            this.findAutoProperties();
        }

        if (this.deflated) {
            const compressedData = this.byteArray.slice(this.offset);
            const decompressedData = Pako.inflateRaw(compressedData);
            
            if (this.offset > 0) {
                const metaDataaArray = this.byteArray.slice(0, this.offset);
                this.byteArray = new Uint8Array(metaDataaArray.length + decompressedData.length);
                this.byteArray.set(metaDataaArray, 0);
                this.byteArray.set(decompressedData, metaDataaArray.length);
            } else {
                this.byteArray = decompressedData;
            }
        }

        // /** load tags value */
        const dataset = this.readDataSet();

        return dataset;

    }

    readDataSet(maxOffset:number|undefined = undefined) : Dataset {
        
        if(!this.byteArray){
            throw new DICOMParseError("No data to parse",this.offset);
        }

        const elements:Elements = {};
        const baseOffset = this.offset;
        const endOffset = maxOffset !== undefined ? maxOffset : this.byteArray.length;
        while (this.offset + 4 <= endOffset) {
            const { group , element } = this.readNextTag();

            const {tagKey,tagName,vr:impilcitedVR} = getTagKey(group,element);

            if (tagKey === "(FFFE,E00D)" || tagKey === "(FFFE,E0DD)") {
                const { group , element } = this.readNextTag();
                const {tagKey} = getTagKey(group,element);
                if(tagKey !== "(0000,0000)"){
                    this.offset -= 4;
                }
                return new Dataset({
                    littleEndian:this.littleEndian,
                    implicit:this.implicit,
                    elements,
                    bytes:this.byteArray,
                    prefix: this.prefix,
                    metadata: this.metadata,
                    deflated: this.deflated,
                    transferSyntaxUID:this.metadata?.TransferSyntaxUID
                });
            }

            let vr = this.implicit
                ? (impilcitedVR || "UN") 
                : String.fromCharCode(this.byteArray[this.offset], this.byteArray[this.offset + 1]);

            let length;
            let value;
            
            if(!this.implicit && !/^[A-Za-z]{2}$/.exec(vr)){
                this.implicit = true;
                this.offset = baseOffset;
                return this.readDataSet();
            } else if (!this.implicit) {
                this.offset += 2; // for vr t
                const isLongVR = this.LONG_VRS.includes(vr);
                if (isLongVR) {
                    this.offset += 2;
                    length = readUint32(this.byteArray,this.offset,this.littleEndian);
                    this.offset += 4;
                } else {
                    length = readUint16(this.byteArray,this.offset,this.littleEndian);
                    this.offset += 2;
                }
            } else {
                length = readUint32(this.byteArray,this.offset,this.littleEndian);
                this.offset += 4;
            }

            const undefinedLength = length === 0xFFFFFFFF;
            const valueOffset = this.offset;

            if (["(7FE0,0010)","(7FE0,0008)","(7FE0,0009)"].includes(tagKey)) {
                if (length !== 0xFFFFFFFF) {
                    value = {
                        encapsulated: false,
                        rawData: this.byteArray.slice(this.offset, this.offset + length),
                        vr: vr,
                        length: length,
                        offset: this.offset,
                    };
                    this.offset += length;
                }
                else if (length === 0xFFFFFFFF) {
                    const fragments:Uint8Array[] = [];
                    let offsetTable:number[] = [];
                    let hasOffsetTable = false;
                    let rowIndex = 0;
                    while (true) {
                        if (this.offset + 8 > this.byteArray.length) break;

                        const {group:itemGroup,element:itemElement} = this.readNextTag();

                        const {tagKey:itemTag} = getTagKey(itemGroup,itemElement);
                        if (itemTag === "(FFFE,E0DD)") {
                            this.offset += 4;
                            break;
                        }

                        if (itemTag !== "(FFFE,E000)") {
                            console.warn("Invalid item in Pixel Data:", itemTag);
                            this.offset -= 4;
                            break;
                        }

                        const itemLength = readUint32(this.byteArray, this.offset, this.littleEndian);
                        this.offset += 4;

                        if (rowIndex === 0) {
                            if (itemLength === 0) {
                                hasOffsetTable = false;
                                offsetTable = [this.offset];
                            } else {
                                hasOffsetTable = true;
                                offsetTable = this.generateOffsetTable(
                                    this.byteArray,
                                    this.offset,
                                    itemLength,
                                    this.littleEndian
                                );
                            }
                            this.offset += itemLength;
                            rowIndex++;
                            continue; 
                        }

                        const fragment = this.byteArray.slice(this.offset, this.offset + itemLength);
                        fragments.push(fragment);
                        this.offset += itemLength;
                    }

                    value = {
                        encapsulated: true,
                        hasOffsetTable: hasOffsetTable,
                        offsetTable: offsetTable,
                        fragments: fragments,
                        totalSize: fragments.reduce((sum, f) => sum + f.length, 0),
                        endOffset:this.offset,
                    };
                }
            } else if (vr === "SQ") {
                value = [];
                const seqEnd = undefinedLength ? endOffset : this.offset + length;

                while (this.offset < seqEnd) {

                    const {group:itemGroup,element:itemElement} = this.readNextTag();

                    const {tagKey:itemTag} = getTagKey(itemGroup,itemElement);                

                    if(itemTag === "(FFFE,E0DD)"){
                        const {group:itemGroup,element:itemElement} = this.readNextTag();
                        const {tagKey:itemTag} = getTagKey(itemGroup,itemElement);
                        if(itemTag !== "(0000,0000)"){
                            this.offset -= 4;
                        }
                        break;
                    }

                    if (itemTag !== "(FFFE,E000)") {
                        console.warn(`Unexpected item tag in sequence: ${itemTag} at offset ${this.offset - 8}`);
                        this.offset -= 4;
                        break;
                    }

                    const itemLength = readUint32(this.byteArray,this.offset,this.littleEndian);
                    this.offset += 4;
                    const itemEnd = itemLength === 0xFFFFFFFF ? undefined : this.offset + itemLength;

                    const dataset = this.readDataSet(
                        itemEnd
                    );

                    value.push(dataset);

                }

            } else {
                
                value = this.byteArray.slice(this.offset, this.offset + length);
                this.offset += length;
            }

            elements[tagKey] = {
                vr: vr,
                name: tagName || "Unknown Tag",
                length: length,
                value: value,
                valueOffset:valueOffset,
            };
            
            if(tagName){
                elements[tagName] = elements[tagKey];
            }
            
        }

        return new Dataset({
            littleEndian:this.littleEndian,
            implicit:this.implicit,
            elements,
            bytes:this.byteArray,
            prefix: this.prefix,
            metadata: this.metadata,
            deflated: this.deflated,
            transferSyntaxUID:this.transferSyntaxUID,
        });
    }

    readMetadatas() {

        const metadata:Metadata = {};
        const baseOffset = this.offset;
        if(!this.byteArray){
            throw new DICOMParseError("No data to parse",this.offset);
        }

        while (this.offset + 4 <= this.byteArray.length) {

            const {group, element} = this.readNextTag();
            if (group !== 0x0002) {
                this.offset -= 4;
                break;
            }
            
            const {tagKey,tagName} = getTagKey(group,element);

            let vr;
            if(!this.implicit){
                vr = this.readNextVR();
                // if vr not valid, switch to implicit mode
                if(!/^[A-Za-z]{2}$/.exec(vr)){
                    this.offset = baseOffset;
                    this.implicit = true;
                    this.readMetadatas();
                    return;
                }
            }else{
                let {vr:tagVR} = getTagKey(group,element);
                vr = tagVR;
            }

            let length = this.readLength(vr as string);

            const value = Value.byVr(
                new DataView(this.byteArray.buffer),
                this.offset,
                length,
                vr as string,
                this.littleEndian
            );
            this.offset += length;

            metadata[tagKey] = { value, vr , tagName };
            if(tagName){
                metadata[tagName] = metadata[tagKey];
            }
            
        }

        this.metadata = metadata;
    }

    readNextTag() {
        if(!this.byteArray){
            throw new DICOMParseError("No data to parse",this.offset);
        }
        const group = this.littleEndian
            ? this.byteArray[this.offset] + (this.byteArray[this.offset+1]<<8)
            : (this.byteArray[this.offset]<<8) + this.byteArray[this.offset+1];

        const element = this.littleEndian
            ? this.byteArray[this.offset+2] + (this.byteArray[this.offset+3]<<8)
            : (this.byteArray[this.offset+2]<<8) + this.byteArray[this.offset+3];
        
        this.offset += 4;

        return { group, element };
    }

    readNextVR() {
        if(!this.byteArray){
            throw new DICOMParseError("No data to parse",this.offset);
        }
        const vr = String.fromCharCode(
            this.byteArray[this.offset],
            this.byteArray[this.offset+1]
        );
        this.offset += 2;
        return vr as string;

    }

    readLength(vr:string) : number {

        if(!this.byteArray){
            throw new DICOMParseError("No data to parse",this.offset);
        }

        let length = 0;
        if(this.implicit){
            length = readUint32(this.byteArray,this.offset,this.littleEndian);
            this.offset += 4;
        }
        else if (this.LONG_VRS.includes(vr)) {
            length = readUint32(this.byteArray,this.offset+2,this.littleEndian);
            this.offset += 6;
        } else {
            length = readUint16(this.byteArray,this.offset,this.littleEndian);
            this.offset += 2;
        }

        return length;
    }

    getTransferSyntaxProperties() {

        if(!this.transferSyntaxUID){
            throw new DICOMParseError("No Transfer Syntax UID found",this.offset);
        }

        this.littleEndian = true;
        this.implicit = false;
        this.deflated = false;

        switch (this.transferSyntaxUID) {
            // Implicit VR Little Endian
            case "1.2.840.10008.1.2":
            case "1.2.840.113619.5.2":
                this.littleEndian = true;
                this.implicit = true;
                break;

            // Explicit VR Little Endian
            case "1.2.840.10008.1.2.1":
                this.littleEndian = true;
                this.implicit = false;
                break;

            // Deflated Explicit VR Little Endian
            case "1.2.840.10008.1.2.1.99":
                this.littleEndian = true;
                this.implicit = false;
                this.deflated = true;
                break;

            // Explicit VR Big Endian
            case "1.2.840.10008.1.2.2":
                this.littleEndian = false;
                this.implicit = false;
                break;

            // Lossless JPEG, JPEG2000, RLE
            case "1.2.840.10008.1.2.4.50": // JPEG Baseline
            case "1.2.840.10008.1.2.4.51": // JPEG Extended
            case "1.2.840.10008.1.2.4.57": // JPEG Lossless
            case "1.2.840.10008.1.2.4.70": // JPEG Lossless Non-Hierarchical
            case "1.2.840.10008.1.2.4.80": // JPEG-LS Lossless
            case "1.2.840.10008.1.2.4.81": // JPEG-LS Lossy
            case "1.2.840.10008.1.2.4.90": // JPEG 2000 Lossless
            case "1.2.840.10008.1.2.4.91": // JPEG 2000 Lossy
            case "1.2.840.10008.1.2.5":  // RLE Lossless
                this.littleEndian = true;
                this.implicit = false;
                break;

            default:
                console.warn(
                    "Unknown Transfer Syntax UID.",
                    this.transferSyntaxUID,
                );
                this.littleEndian = true;
                this.implicit = false;
        }

    }

    generateOffsetTable(bytes:Uint8Array,offset:number,itemLength:number,littleEndian:boolean){
        const offsets:number[] = [];
        for( let i=0;i<itemLength; i=i+4 ){
            const frameOffset = readUint32(bytes,offset+i,littleEndian) + offset + itemLength;
            offsets.push(frameOffset);
        }
        return offsets;
    }

    findAutoProperties(){

        console.warn("No Transfer Syntax UID found, attempting to auto-detect properties.");

        this.littleEndian = true;
        this.implicit = false;
        this.deflated = false;

        const baseOffset = this.offset;

        let { group: littleEndianGroup } = this.readNextTag();
        this.offset -= 4;
        let { group: bigEndianGroup } = this.readNextTag();

        if (littleEndianGroup > 0x00FF && bigEndianGroup <= 0x00FF) {
            this.littleEndian = false;
        }

        const vr = this.readNextVR();
        if(!/^[A-Za-z]{2}$/.exec(vr)){
            this.implicit = true;
        }

        this.offset = baseOffset;
    }

}

export default Parser;