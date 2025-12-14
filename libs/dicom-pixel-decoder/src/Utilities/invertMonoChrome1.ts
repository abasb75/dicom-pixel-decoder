import DecodedImage from "../DecodedImage";

function invertMonochrome1(
    image:DecodedImage
){

    const {min,max} = image.getMinMax();
    for(let i=0;i<image.pixelData.length;i++){
        image.pixelData[i] = max - (image.pixelData[i]+min);
    }

    return image.pixelData;
}

export default invertMonochrome1;