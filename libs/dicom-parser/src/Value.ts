class Value{

    static byVr(dataView:DataView,offset:number,len:number,vr:string,littleEndian:boolean){
        switch(vr){
            case "AT":
                return Value.AT(dataView,offset,len,littleEndian);
            case "CS":
                return Value.CS(dataView,offset,len);
            case "US":
                return Value.US(dataView,offset,len,littleEndian);
            case "SS":
                return Value.SS(dataView,offset,len,littleEndian);
            case "SL":
                return Value.SL(dataView,offset,len,littleEndian);
            case "UL":
                return Value.UL(dataView,offset,len,littleEndian);
            case "IS":
                return Value.IS(dataView,offset,len);
            case "DS":
                return Value.DS(dataView,offset,len);
            case "DA":
                return Value.DA(dataView,offset,len);
            case "TM":
                return Value.TM(dataView,offset,len);
            case "FL":
                return Value.FL(dataView,offset,len,littleEndian);
            case "FD":
                return Value.FD(dataView,offset,len,littleEndian);
            case "OW":
            case "OB":
            case "OD":
            case "OF":
            case "OL":
            case "OV":
            case "UN":
                return Value.OW(dataView,offset,len);
            case "UI":
            case "SH":
            case "LO":
            case "DT":
            case "AE":
            case "AS":
            case "LT":
            case "PN":
            case "ST":
            case "UC":
            case "UR":
            case "UT":
            default:
                return Value.getString(new Uint8Array(dataView.buffer,offset,len));
        }
    }

    static FD(dataView:DataView, offset:number, len: number, littleEndian:boolean = true) {
        if (len === 8) {
            return dataView.getFloat64(offset, littleEndian);
        } else if (len > 8) {
            const values = [];
            for (let i = offset; i < offset + len; i += 8) {
                values.push(dataView.getFloat64(i, littleEndian));
            }
            return values;
        }
    }

    static FL(dataView:DataView, offset:number, len: number, littleEndian:boolean = true) {
        if (len === 4) {
            return dataView.getFloat32(offset, littleEndian);
        } else if (len > 4) {
            const values = [];
            for (let i = offset; i < offset + len; i += 4) {
                values.push(dataView.getFloat32(i, littleEndian));
            }
            return values;
        }
    }

    static AT(dataView:DataView, offset:number, len: number, littleEndian: boolean = true) {
        const tags: string[] = [];
        for (let i = offset; i < offset + len; i += 4) {
            const group = dataView.getUint16(i, littleEndian);
            const element = dataView.getUint16(i + 2, littleEndian);
            tags.push(`(${group.toString(16).padStart(4, '0')},${element.toString(16).padStart(4, '0')})`);
        }
        if (tags.length === 1) return tags[0];
        return tags;
    }

    static CS(dataView:DataView,offset:number,len:number){
        let value = Value.getString(new Uint8Array(dataView.buffer,offset,len));
        const values = value.split("\\");
        if(values.length === 0){
            return value;
        }else if(values.length === 1){
            return values[0];
        }else{
            return values;
        }
        
    }

    static IS(dataView:DataView,offset:number,len:number){
        const value = Value.getString(new Uint8Array(dataView.buffer,offset,len));
        if(/^[0-9]+$/.exec(value)){
            return parseInt(value);
        }
        return value;
    }

    static DA(dataView:DataView,offset:number,len:number){
        const value = Value.getString(new Uint8Array(dataView.buffer,offset,len));
        if(/^[0-9]{8}$/.exec(value)){
            return `${value.slice(0,4)}-${value.slice(4,6)}-${value.slice(6,8)}`;
        }
        return value;
    }

    static DS(dataView:DataView,offset:number,len:number){
        let value = Value.getString(new Uint8Array(dataView.buffer,offset,len));
        const values = value.split("\\").map(v=>{
            if(/^[0-9\-\+]+$/.exec(v)){
                return parseInt(v);
            }else if(/^[0-9\-\+]+\.[0-9]+$/.exec(v)){
                return parseFloat(v);
            }
            return v;
        });
        if(values.length === 0){
            return value;
        }else if(values.length === 1){
            return values[0];
        }else{
            return values;
        }
        
    }

    static TM(dataView:DataView,offset:number,len:number){
        let value = Value.getString(new Uint8Array(dataView.buffer,offset,len)).trim().split('.')[0];
        if(![2,4,6].includes(value.length)){
            return value;
        }
        if(value.length === 4){
            value += "00";
        }else if(value.length === 2){
            value += "0000";
        }
        return `${value.slice(0,2)}:${value.slice(2,4)}:${value.slice(4,6)}`;
    }

    static US(dataView:DataView,offset:number,len:number,littleEndian:boolean=true){
        if(len === 2){
            const value = dataView.getUint16(offset,littleEndian);
            return value;
        }else if(len>2){
            const values = [];
            for(let i=offset;i<offset+len;i+=2){
                values.push(dataView.getUint16(i,littleEndian));
            }
            return values;
        }
    }

    static SS(dataView:DataView,offset:number,len:number,littleEndian:boolean=true){
        if(len === 2){
            return dataView.getInt16(offset,littleEndian);
        }else if(len>2){
            const values = [];
            for(let i=offset;i<offset+len;i+=2){
                values.push(dataView.getInt16(i,littleEndian));
            }
            return values;
        }
    }

    static SL(dataView:DataView,offset:number,len:number,littleEndian:boolean=true){
        if(len === 4){
            return dataView.getInt32(offset,littleEndian);
        }else if(len>4){
            const values = [];
            for(let i=offset;i<offset+len;i+=4){
                values.push(dataView.getInt32(i,littleEndian));
            }
            return values;
        }
    }

    static UL(dataView:DataView,offset:number,len:number,littleEndian:boolean=true){
        if(len === 4){
            return dataView.getUint32(offset,littleEndian);
        }else if(len>4){
            const values = [];
            for(let i=offset;i<offset+len;i+=4){
                values.push(dataView.getUint32(i,littleEndian));
            }
            return values;
        }
    }

    static OW(dataView:DataView,offset:number,len:number){
        const buffer = dataView.buffer.slice(offset,offset+len);
        return new DataView(buffer);
    }
    
    static getString(bytes:Uint8Array|Int8Array|ArrayBuffer){
        const decoder = new TextDecoder("utf-8");
        return decoder.decode(bytes).replace(/\0+$/,"").trim();
    }
    
}



export default Value;