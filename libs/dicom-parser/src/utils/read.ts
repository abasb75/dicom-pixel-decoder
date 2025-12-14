export function readTag(bytes:Uint8Array, offset:number, littleEndian = true) {
    const group = littleEndian
        ? bytes[offset] + (bytes[offset+1]<<8)
        : (bytes[offset]<<8) + bytes[offset+1];

    const element = littleEndian
        ? bytes[offset+2] + (bytes[offset+3]<<8)
        : (bytes[offset+2]<<8) + bytes[offset+3];

    return { group, element };
}

export function readUint16(byteArray:Uint8Array, offset:number, littleEndian = true) {
    const sliceBytes = byteArray.slice(offset, offset + 2);
    const view = new DataView(sliceBytes.buffer);
    return view.getUint16(0, littleEndian);
}

export function readUint32(byteArray:Uint8Array, offset:number, littleEndian = true) {
    const sliceBytes = byteArray.slice(offset, offset + 4);
    const view = new DataView(sliceBytes.buffer);
    return view.getUint32(0, littleEndian);
}