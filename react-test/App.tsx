
import { ChangeEvent, useCallback, useRef, useState } from 'react';

// import { loadAndParseFromFiles, loadAndParseFromUrl } from '../../dicom-parser/lib/index'; 
import { loadAndParseFromFiles, loadAndParseFromUrl } from '@abasb75/dicom-parser'; 
import decode from '@lib/index';
import Canvas2D from './draw/Canvas2D';
import { useDropzone } from 'react-dropzone';
import { DecodeOptions } from '@lib/types';
import PaletteColor from './draw/PaletteColor';
import Dataset from '@abasb75/dicom-parser/Dataset';

function App() {

  const [inputHasText,setInputHasText] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const onDrop = useCallback((acceptedFiles:any) => {
    if(!acceptedFiles && acceptedFiles.length<1){
      return;
    }
    const dcmFile = acceptedFiles[0];
    handleDcmfile(dcmFile);
    
  }, [])
  const {getRootProps, getInputProps} = useDropzone({onDrop})
  
  const parseInputUrl = ()=>{
    const url = inputRef.current?.value;
    if(!url){
      return;
    }
    
    loadAndParseFromUrl(url).then(()=>{

    }).catch(()=>{
      
    });
  }

  const fileInputChange = (event:ChangeEvent<HTMLInputElement>)=>{
    if (event.target.files && event.target.files[0] ) {
      const dcmFile = event.target.files[0];
      handleDcmfile(dcmFile);
    }
  }

  const handleDcmfile = (dcmFile:File) => {
    const start = Date.now();
    loadAndParseFromFiles(dcmFile).then(async (dataset)=>{
      console.log({dataset});
      if(!canvasRef.current) return;
      if(!dataset.hasPixelData()){
        alert("dicom file has no pixel data!");
        return;
      }
      const pixelData = await dataset.getPixelData(0);

      const endParse = Date.now();
      console.log(`parse time: ${endParse - start}`);
      console.log('cz',dataset.littleEndian,)
      const image = await decode(
        pixelData,
        {
          ...dataset.pixelModule,
          ...dataset.scalingModule,
          ...dataset.voiLUTModule,
          littleEndian:dataset.littleEndian,
          transferSyntaxUID:dataset.transferSyntaxUID,
          isFloat:dataset.getPixelTypes()===Dataset.Float,
        } as DecodeOptions
      );



      if(!image || !image.pixelData){
        alert('failed to decode');
        return;
      }

      image.pixelModule = dataset.pixelModule;
      console.log('image pixel  data',image.pixelData)
      if(image?.pixelModule?.photometricInterpretation === 'PALETTE COLOR'){
        
        const paleteData = dataset.getPaletteColorData();

        console.log({paleteData})

        if(paleteData){
          image.pixelData = PaletteColor.applyPaletteColor(
            image.pixelData,
            paleteData,
          );
        }
        
      }
      

      if(image){
        await Canvas2D.draw(canvasRef.current,image);
      }
      
    });
  }

  return (
    <div {...getRootProps({
      onClick: event => event.stopPropagation(),
    })}>
      <input {...getInputProps()} />
      <div className='w-full h-[100vh] bg-slate-950 flex items-center justify-center flex-col'>
        <div 
          className='w-full h-full max-w-[95%] max-h-[95%]'
        >
          <div className='w-full bg-black rounded border-slate-600 border-2 h-[calc(100%_-_60px)] flex flex-row'>
            <div className='w-full'>
              <div className='h-[50px] w-full bg-black flex'>
                  <input 
                    type='text' 
                    className='flex-1 h-full w-full bg-slate-700 text-gray-400 font-semibold px-4 '
                    placeholder='Paste Your Dicom Url ...'
                    ref={inputRef}
                    onChange={(e)=>setInputHasText( ()=>(e.target.value)!=='' )}
                  />
                  {inputHasText ? (<button 
                    className='bg-slate-800 text-white px-2'
                    onClick={parseInputUrl}
                  >
                    Parse Dicom
                  </button>) : (<>
                    <input 
                      type='file' 
                      ref={fileInputRef} 
                      id="file-input" 
                      accept='' 
                      className='hidden' 
                      onChange={fileInputChange}
                    />
                    <label 
                    className='bg-slate-800 text-white px-2 leading-[50px] cursor-pointer'
                    htmlFor='file-input'
                    
                    >
                      Use Local File
                    </label>

                  </>)}
              </div>
              <div className='bg-red w-full h-[calc(100%_-_50px)] flex items-center justify-center'>
                <canvas id="xac" ref={canvasRef} className='w-full h-full object-contain' />
            </div>
            </div>
          </div>
          <div className='text-center py-2 h-14'>
            <a href='https://abasbagheri.ir' className='opacity-50 transition-all hover:opacity-90 underline text-xs font-light text-yellow-50' >Abbas Bagheri</a>
          </div>
        </div>
      </div>
    </div>
  );

}


export default App
