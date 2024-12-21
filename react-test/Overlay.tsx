import Dataset from "@abasb75/dicom-parser/Dataset";

function OverlayLayout({
    dataset,
    fileName,
}:{
    dataset:Dataset;
    fileName:string;
}){
    const {
        rows,
        columns,
        bitsAllocated,
        photometricInterpretation,
    } = dataset.pixelModule;
    return (<div
        className='absolute w-full h-full top-0 left-0 flex justify-center items-center text-blue-400 text-sm'
    >
        <div className="absolute top-2 left-2">
            <div>{`${columns || 0} x ${rows || 0}`}</div>
            <div>bits: {bitsAllocated}</div>
            <div>{photometricInterpretation}</div>
            <div>pixels: {dataset.getPixelTypes()}</div>
        </div>

        <div className="absolute bottom-12 left-2">
            <div>{fileName}</div>
            <div>transferUID: {dataset?.transferSyntaxUID}</div>
        </div>
    </div>);
}

export default OverlayLayout;