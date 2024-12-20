import DecodedImage from "@lib/DecodedImage";

class Canvas2D {

    static draw(canvas:HTMLCanvasElement,image:DecodedImage){

        if(!image.pixelData?.length) return;

        let pixelData =image.pixelData;



        

        const {min,max,windowCenter,windowWidth} = image.getLUT();
        canvas.width = image.width;
        canvas.height = image.height;

        const context = canvas.getContext('2d');
        const imageData = context?.createImageData(canvas.width,canvas.height);
    
        if(imageData){
            if(imageData.data.length === pixelData.length){
                for(let i = 0; i < pixelData.length; i++) {
                    imageData.data[i] = Canvas2D._calcPixel(pixelData[i],min,max,windowWidth,windowCenter);
                }
            }else if(imageData.data.length/4 === pixelData.length){
                for(let i = 0; i < pixelData.length; i++) {
                    imageData.data[4*i] = Canvas2D._calcPixel(pixelData[i],min,max,windowWidth,windowCenter);
                    imageData.data[4*i+1] = Canvas2D._calcPixel(pixelData[i],min,max,windowWidth,windowCenter);
                    imageData.data[4*i+2] = Canvas2D._calcPixel(pixelData[i],min,max,windowWidth,windowCenter);
                    imageData.data[4*i+3] = 255;
                }
            }else if((3*imageData.data.length)/4 === pixelData.length){
                let imageDataIndex = 0;
                for(let i = 0; i < pixelData.length; i+=3) {
                    imageData.data[imageDataIndex++] = Canvas2D._calcPixel(pixelData[i],min,max,windowWidth,windowCenter);
                    imageData.data[imageDataIndex++] = Canvas2D._calcPixel(pixelData[i+1],min,max,windowWidth,windowCenter);
                    imageData.data[imageDataIndex++] = Canvas2D._calcPixel(pixelData[i+2],min,max,windowWidth,windowCenter);
                    imageData.data[imageDataIndex++] = 255;
                }
            }
            
            context?.putImageData(imageData,0,0);
        }

    }

    private static _calcPixel(pixel:number,min:number,max:number,windowWidth:number,windowCenter:number){
        // return pixel;
        if(max <= pixel) return 255;
        else if( min >= pixel) return 0;
        else return ((pixel - windowCenter)/(windowWidth)+0.5)*255;
    }

}

export default Canvas2D;