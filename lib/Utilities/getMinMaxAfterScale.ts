function getMinMaxAfterScale(
    min:number,
    max:number,
    rescaleSlope:number|undefined,
    rescaleIntercept:number|undefined,
    // modality:string
){
    if(typeof rescaleSlope !== "number" || typeof rescaleIntercept !== "number"){
        return {min,max}
    }
    return {
        minAfterScale: min * rescaleSlope + rescaleIntercept,
        maxAfterScale: max * rescaleSlope + rescaleIntercept,
    }
}

export  default getMinMaxAfterScale;