export default class DICOMParseError extends Error {
    offset: number;
    constructor(message: string, offset: number) {
        super(message);
        this.name = "DICOMParseError";
        this.offset = offset;
    }
}