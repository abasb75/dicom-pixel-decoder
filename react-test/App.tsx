
import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';

import { loadAndParseFromFiles, loadAndParseFromUrl } from '@abasb75/dicom-parser';

import {decode} from '@abasb75/dicom-pixel-decoder';
import Canvas2D from './draw/Canvas2D';
import { useDropzone } from 'react-dropzone';
import { DecodeOptions } from '@abasb75/dicom-pixel-decoder/types';
import Dataset from '@abasb75/dicom-parser/Dataset';
import OverlayLayout from './Overlay';

function App() {

  const [inputHasText,setInputHasText] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [isLoading,setIsLoading] = useState(false);
  const [errorMessage,setErrorMessage] = useState("");
  const [testFiles,setTestFiles] = useState<string[]|null>(null);
  const [currentFileIndex,setCurrentFileIndex] = useState(15);
  const [dataset,setDataset] = useState<Dataset|undefined>();

  const [decodeTime,setDecodeTime] = useState(0);
  const [paintTime,setPaintTime] = useState(0);

  useEffect(()=>{
    if(!testFiles || testFiles.length < currentFileIndex+1){
      return;
    }
    parseInputUrl(
      `/dicom-pixel-decoder/test-files/${testFiles[currentFileIndex]}`
    );
  },[testFiles,currentFileIndex]);


  const loadTestFiles = ()=>{
    if(isLoading){
      return;
    }
    if(testFiles && testFiles?.length>0){
      return;
    }
    setIsLoading(true);
    fetch('/dicom-pixel-decoder/data.json')
    .then(r=>r.json())
    .then(data=>{
      if(Array.isArray(data)){
        setTestFiles(data);
        setErrorMessage("")
      }else{
        setErrorMessage("Error!");
      }
    }).catch(()=>{
      setErrorMessage("Error!");
    }).finally(()=>{
      setIsLoading(false);
    })
  }

  const onDrop = useCallback((acceptedFiles:any) => {
    setIsLoading(true);
    setErrorMessage("");
    if(!acceptedFiles && acceptedFiles.length<1){
      return;
    }
    const dcmFile = acceptedFiles[0];
    handleDcmfile(dcmFile);
    
  }, []);

  const {getRootProps, getInputProps} = useDropzone({onDrop})
  
  const parseInputUrl = (urlAruments?:string)=>{
    setIsLoading(true);
    setErrorMessage("");
    const url = urlAruments || inputRef.current?.value;
    if(!url){
      return;
    }

    loadAndParseFromUrl(url).then((dataset)=>{
      handleDataset(dataset);
    }).catch((e)=>{
      console.log({e});
      setIsLoading(false);
      setErrorMessage("Error!")
    });
  }

  const fileInputChange = (event:ChangeEvent<HTMLInputElement>)=>{
    setIsLoading(true);
    setErrorMessage("");
    if (event.target.files && event.target.files[0] ) {
      const dcmFile = event.target.files[0];
      handleDcmfile(dcmFile);
    }
  }

  const handleDcmfile = (dcmFile:File) => {
    loadAndParseFromFiles(dcmFile).then(async (dataset)=>{
      handleDataset(dataset);
    });
  }

  const handleDataset = async (dataset:Dataset|null)=>{
    if(!dataset){
      setIsLoading(false);
      setErrorMessage('Error on parse file');
      return;
    }
    if(!canvasRef.current) {
      setIsLoading(false);
      setErrorMessage('Canvas is not loaded');
    };

    setDataset(dataset);
    
    const pixelData = await dataset.getPixelData(0);
    
    

    const start = Date.now();

    const image = await decode(
        pixelData,
        {
          ...dataset.getPixelModule(),
          ...dataset.getScalingModule(),
          ...dataset.getVOILutModule(),
          littleEndian:dataset.littleEndian,
          transferSyntaxUID:dataset.transferSyntaxUID,
          isFloat:dataset.getPixelTypes()===Dataset.Float,
        } as DecodeOptions
    );

    if(!image || !image.pixelData){
        return;
    }

    if(image?.pixelModule?.photometricInterpretation === 'PALETTE COLOR'){
      image.applyPaletteColor(dataset.getPaletteColorData());
    }

    const end = Date.now();
    setDecodeTime(end - start);

    console.log({image});

    image.applySpacing();

    // const blob = new Blob([image.pixelData], { type: "application/octet-stream" });
    // const url = URL.createObjectURL(blob);
    // const a = document.createElement("a");
    // a.href = url;
    // a.download = "pixel.raw";
    // document.body.appendChild(a);
    // a.click();

    // URL.revokeObjectURL(url);
    // document.body.removeChild(a);

    if(image && canvasRef.current){
      const start = Date.now();
      await Canvas2D.draw(canvasRef.current,image);
      const end = Date.now();
      setPaintTime(end - start);
      setIsLoading(false);

    }
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
                    className='flex-1 h-full w-full bg-slate-700 text-gray-400 font-semibold px-4 text-sm '
                    placeholder='Paste Your Dicom Url or Drag and drop file to black box ...'
                    ref={inputRef}
                    onChange={(e)=>setInputHasText( ()=>(e.target.value)!=='' )}
                  />
                  {inputHasText ? (<button 
                    className='bg-slate-800 text-white px-2'
                    onClick={()=>parseInputUrl()}
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
              <div className='bg-red w-full h-[calc(100%_-_50px)] flex items-center justify-center relative pb-10'>
                <canvas id="xac" ref={canvasRef} className='w-full h-full object-contain' />
                {dataset && <OverlayLayout 
                  paint={paintTime}
                  decode={decodeTime}
                  dataset={dataset} 
                  fileName={testFiles?testFiles[currentFileIndex]:""}
                />}
                {isLoading && <div 
                  className='absolute w-full h-full top-0 left-0 bg-black flex justify-center items-center text-blue-400'
                >
                  Loading ...
                </div>}
                {errorMessage && <div 
                  className='absolute text-[tomato] w-full h-full top-0 left-0 bg-black flex justify-center items-center'
                >
                  {errorMessage}
                </div>}
                <div className='absolute bottom-0 left-0 w-full h-10 bg-slate-800 flex items-center justify-between px-2'>
                  <button 
                    className='h-8 bg-slate-950 px-2 rounded-sm text-sm text-slate-300'
                    onClick={loadTestFiles}
                  >
                    load test files
                  </button>
                  {testFiles &&<div className='flex items-center gap-2'>
                    <button 
                      className='h-8 bg-slate-950 px-2 rounded-sm text-sm text-slate-300'
                      onClick={()=>setCurrentFileIndex(prev=>{
                        if(prev===0) return 0;
                        return prev-1;
                      })}
                    >
                      Prev
                    </button>
                    {`${currentFileIndex+1} / ${testFiles?.length || 0}`}
                    <button 
                      className='h-8 bg-slate-950 px-2 rounded-sm text-sm text-slate-300'
                      onClick={()=>setCurrentFileIndex(prev=>{
                        if(prev===testFiles.length-1) return prev;
                        return prev+1;
                      })}
                    >
                      Next
                    </button>
                  </div>}
                </div>
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
