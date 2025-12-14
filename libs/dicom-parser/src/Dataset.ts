import { dicomGeometricTags } from "./enums/DicomGeometricTags";
import getTagKey from "./utils/getTagKey";
import PaletteColor from "./utils/PaletteColor";
import PixelData from "./utils/PixelData";
import Value from "./Value";

import { 
    DicomPatientModule, 
    DicomPixelModule, 
    DicomScalingModule, 
    DicomVOILutModule
 } from "./types/index";


interface DatasetProperties {
    littleEndian: boolean;
    implicit: boolean;
    elements: {[key:string]:any};
    bytes: Uint8Array;
    transferSyntaxUID?: string|undefined|null;
    prefix?: string|undefined|null;
    metadata?: {[key:string]:any}|undefined|null;
    deflated?: boolean|undefined|null;
}

class Dataset {

    static Float = 'Float';
    static Integer = 'Integer';
    
    littleEndian: boolean;
    implicit: boolean;
    elements: {[key:string]:any};
    transferSyntaxUID: string|null|undefined;
    prefix?: string|undefined|null;
    metadata?: {[key:string]:any}|undefined|null;
    deflated?: boolean|undefined|null;
    bytes: Uint8Array;

    /** modules */
    voiLUTModule:DicomVOILutModule|null = null;
    patientModule:DicomPatientModule|null = null;
    pixelModule:DicomPixelModule|null = null;
    scalingModule:DicomScalingModule|null = null;

    constructor(properties:DatasetProperties){
        this.littleEndian = properties.littleEndian;
        this.implicit = properties.implicit;
        this.elements = properties.elements;;
        this.transferSyntaxUID = properties.transferSyntaxUID || null;
        this.prefix = properties.prefix;
        this.metadata = properties.metadata;
        this.deflated = properties.deflated;
        this.bytes = properties.bytes;
    }

    get(group:number|string,element:number|null|undefined=null){
        let key;
            
        if(typeof group === 'string'){
            key=group;
        }else{
            const {tagKey} = getTagKey(group,element as number);
            key=tagKey;
        }
            
        let v = this.elements[key];
        if(v?.vr == "SQ"){
            return v.value;
        } else if(v){
            return Value.byVr(
                new DataView(v.value.buffer),
                0,
                v.value.length,
                v.vr,
                this.littleEndian
            );
        }

        return v;
    }

    date(group:number,element:number){
        const dateValue = this.get(group,element);
        
        if(/^[0-9]{4}\-[0-9]{2}\-[0-9]{2}$/.exec(dateValue)){
            const dateVaues = dateValue.split('-');
            return {
                year:dateVaues[0],
                month:dateVaues[1],
                day:dateVaues[2],
            };
        }
        return dateValue;
    }

    int(group:number,element:number):number|number[]{
        let value = this.get(group,element);
        if(Array.isArray(value)){
            value.forEach((v,i) => {
                value[i] = parseInt(v as any);
            });
        } else if(typeof value === "string"){
            const parts = Array.isArray(value) 
                ? value 
                : (value?.toString().split("\\") ?? []);

            const numbers = parts
                .map(s => s?.toString().trim())
                .filter(s => s !== "" && s !== undefined)
                .map(s => parseInt(s, 10))
                .map(n => isNaN(n) ? 0 : n);

            return numbers.length === 1 ? numbers[0] : numbers;
        }
        return value;
    }

    float(group: number, element: number): number | number[] {
        const value = this.get(group, element);

        if(Array.isArray(value)){
            value.forEach((v,i) => {
                value[i] = parseFloat(v as any);
            });
        } else if(typeof value === "string"){
            const parts: string[] = Array.isArray(value)
                ? value.map(String)
                : value != null 
                    ? String(value).split("\\")
                    : [];

            const numbers = parts
                .map(s => s.trim())
                .filter(s => s !== "" && s !== "null" && s !== "undefined")
                .map(s => parseFloat(s))
                .map(n => isNaN(n) ? 0 : n);

            return numbers.length === 1 ? numbers[0] : numbers;
        }
        return value;

    }

    time(group:number,element:number){
        const dateValue = this.get(group,element);
        
        if(/^[0-9]{2}\:[0-9]{2}\:[0-9]{2}$/.exec(dateValue)){
            const dateVaues = dateValue.split(':');
            return {
                hour:dateVaues[0],
                minute:dateVaues[1],
                second:dateVaues[2],
            };
        }
        return dateValue;
    }
    
    getGeometricTags(tagName:string,frameIndex=0){

        const geometricTag = dicomGeometricTags.find(dgt=>dgt.name === tagName);
        if(!geometricTag){
            return this.get(tagName);
        }

        //
        // 1) Classic single-frame DICOM → (0028,0030)
        //
        const tagData = this.get(
            geometricTag.root[0],
            geometricTag.root[1],
        );
            
        if(tagData || tagData===0) {
            return tagData;
        }

        //
        // 2) Enhanced DICOM – Shared Functional Groups
        //
        const sharedFunctionalGroupsSequence = this.get(0x5200, 0x9229);
        if (sharedFunctionalGroupsSequence) {
            const sq = sharedFunctionalGroupsSequence[0]?.get(
                geometricTag.sharedFG.seq[0],
                geometricTag.sharedFG.seq[1],
            );
            if (sq) {
                const tagData = sq[0]?.get(geometricTag.sharedFG.tag);
                if(tagData || tagData===0){
                    return tagData;
                }
            }
        }

        //
        // 3) Enhanced Multi-Frame – Per-Frame Functional Groups (frame-based)
        //
        const perFrameFunctionalGroupsSequence = this.get(0x5200,0x9230); // 
        if (perFrameFunctionalGroupsSequence) {
            const frameItem = perFrameFunctionalGroupsSequence[
                geometricTag.frameDependent? frameIndex : 0
            ];
                
            if (frameItem) {
                const sq = frameItem?.get(
                    geometricTag.perFrameFG.tag[0],
                    geometricTag.perFrameFG.tag[1]
                );
                if (sq) {
                    const tagData = sq[0]?.get(geometricTag.perFrameFG.tag);
                    if(tagData || tagData===0){
                        return tagData;
                    }
                }
            }
        }

        //
        // 4) Fallback: Estimated spacing using SpacingBetweenSlices
        //
        return null;


    }

    getPixelTypes(){
        if(
            this.elements['(7FE0,0008)'] 
            || this.elements['(7FE0,0009)']
        ){
            return 'Float';
        }else if(this.elements['(7FE0,0010)'] ){
                return  'Integer';
        }
        return null;
    }

    hasPixelData():boolean{
        if(this.getPixelTypes()){
            return true;
        }
        return false;
    }

    getPixelData(frameIndex=0){
        return PixelData.get(this,frameIndex);
    }

    getPaletteColorData() {
        return PaletteColor.get(this);
    }

    /** module geter */

    getPatientModule():DicomPatientModule{
        if(!this.patientModule) {
            this.patientModule = {
                patientName:this.get(0x0010,0x0010),
                patientID:this.get(0x0010,0x0020),
                typeofPatientID:this.get(0x0010,0x0022),
                patientSex:this.get(0x0010,0x0040),
                patientBirthDate:this.get(0x0010,0x0030),
                patientAge:this.get(0x0010,0x1010),
                patientSize:this.get(0x0010,0x1020),
                otherPatientIDs:this.get(0x0010,0x1000),
                otherPatientNames:this.get(0x0010,0x1001),
                patientWeight:this.get(0x0010,0x1030),
            }	
        }
        return this.patientModule;
    }

    getVOILutModule(): DicomVOILutModule {
        if(!this.voiLUTModule) {
            this.voiLUTModule = {
                voiLUTFunction:this.get(0x0028,0x1056),
                windowWidth:this.get(0x0028,0x1051),
                windowCenter:this.get(0x0028,0x1050),
                voiLUTSequence:this.get(0x0028,0x3010),
                lutDescriptor:this.get(0x0028,0x3002),
                lutExplanation:this.get(0x0028,0x3003),
                lutData:this.get(0x0028,0x3006),
                windowCenterAndWidthExplanation:this.get(0x0028,0x1055),
            }
        }
        return this.voiLUTModule;
    }
    
    getScalingModule():DicomScalingModule{
        if(!this.scalingModule) {
            this.scalingModule = {
                rescaleSlope: this.getGeometricTags('RescaleSlope'), 
                rescaleIntercept: this.getGeometricTags("RescaleIntercept"),
                rescaleType: this.getGeometricTags('RescaleType'),
                modality: this.get(0x0008,0x0060),
            }
        }
        return this.scalingModule;
    }

    getPixelModule(frameIndex=0):DicomPixelModule{
        if(!this.pixelModule) {
            this.pixelModule = {
                pixelMeasuresSequence: this.get(0x0028,0x9110),
                photometricInterpretation:this.get(0x0028,0x0004),
                numberOfFrames:this.get(0x0028,0x0008),
                pixelRepresentation : this.get(0x0028,0x0103),

                pixelSpacing: this.getGeometricTags('PixelSpacing',frameIndex),
                spacingBetweenSlices: this.getGeometricTags('SpacingBetweenSlices',frameIndex),

                rows:this.get(0x0028,0x0010),
                columns:this.get(0x0028,0x0011),
                bitsAllocated:this.get(0x0028,0x0100),
                highBit:this.get(0x0028,0x0102),
                bitsStored:this.get(0x0028,0x0101),
                samplesPerPixel:this.get(0x0028,0x0002),
                pixelDataProviderURL:this.get(0x0028,0x7FE0),
                pixelPaddingRangeLimit:this.get(0x0028,0x0121),
                extendedOffsetTable:this.get(0x7FE0,0x0001),
                extendedOffsetTableLengths:this.get(0x7FE0,0x0002),
                pixelAspectRatio:this.get(0x0028,0x0034),
                planarConfiguration:this.get(0x0028,0x0006),
                redPaletteColorLookupTableDescriptor:this.get(0x0028,0x1101),
                greenPaletteColorLookupTableDescriptor:this.get(0x0028,0x1102),
                bluePaletteColorLookupTableDescriptor:this.get(0x0028,0x1103),
                alphaPaletteColorLookupTableDescriptor:this.get(0x0028,0x1104),
                redPaletteColorLookupTableData:this.get(0x0028,0x1201),
                greenPaletteColorLookupTableData:this.get(0x0028,0x1202),
                bluePaletteColorLookupTableData:this.get(0x0028,0x1203),
                alphaPaletteColorLookupTableData:this.get(0x0028,0x1204),
                segmentedRedPaletteColorLookupTableData:this.get(0x0028,0x1221),
                segmentedGreenPaletteColorLookupTableData:this.get(0x0028,0x1222),
                segmentedBluePaletteColorLookupTableData:this.get(0x0028,0x1223),
                segmentedAlphaPaletteColorLookupTableData:this.get(0x0028,0x1224),
            }
        }
        return this.pixelModule;
    }

    recalculeModules(){
        this.getPatientModule();
        this.getVOILutModule();
        this.getScalingModule();
        this.getPixelModule();
    }

}

export default Dataset;