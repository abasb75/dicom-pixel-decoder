import Decoder from "./Decoder";

self.onmessage = async (e) => {
  const { pixelDataView, options}  = e.data;
  const decoded = await Decoder.decode(pixelDataView, options);
  self.postMessage({ decoded });

  
};