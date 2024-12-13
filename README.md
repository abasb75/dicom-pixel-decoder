## @abasb75/dicom-pixel-decoder
a javascript powerfull dicom decoder

## Demo

<a href="https://abasb75.github.io/dicom-pixel-decoder/">demo link</a>


## Supported transfer syntax

#Transfer Syntax UID | #Transfer Syntax name | #support	 
--- | --- | ---
1.2.840.10008.1.2	 |  Implicit VR Endian: Default Transfer Syntax for DICOM | Yes 
1.2.840.10008.1.2.1	 |  Explicit VR Little Endian | Yes
1.2.840.10008.1.2.1.99 | Deflated Explicit VR Little Endian | Yes
1.2.840.10008.1.2.2 | Explicit VR Big Endian | Yes
1.2.840.10008.1.2.4.50 | JPEG Baseline (Process 1) | Yes 
1.2.840.10008.1.2.4.90 | JPEG 2000 Image Compression (Lossless Only) | Yes 
1.2.840.10008.1.2.4.91 | JPEG 2000 Image Compression	 | Yes
1.2.840.10008.1.2.4.51 | JPEG Baseline (Processes 2 & 4) | No	 
1.2.840.10008.1.2.4.52 | JPEG Extended (Processes 3 & 5) | No
1.2.840.10008.1.2.4.53 | JPEG Spectral Selection, Nonhierarchical (Processes 6 & 8)	| No	
1.2.840.10008.1.2.4.54 | JPEG Spectral Selection, Nonhierarchical (Processes 7 & 9)	| No	
1.2.840.10008.1.2.4.55 | JPEG Full Progression, Nonhierarchical (Processes 10 & 12)	| No	
1.2.840.10008.1.2.4.56 | JPEG Full Progression, Nonhierarchical (Processes 11 & 13)	| No	
1.2.840.10008.1.2.4.57 | JPEG Lossless, Nonhierarchical (Processes 14)	 	| No	
1.2.840.10008.1.2.4.58 | JPEG Lossless, Nonhierarchical (Processes 15)	Retired	| No	
1.2.840.10008.1.2.4.59 | JPEG Extended, Hierarchical (Processes 16 & 18)	Retired	| No	
1.2.840.10008.1.2.4.60 | JPEG Extended, Hierarchical (Processes 17 & 19)	Retired
1.2.840.10008.1.2.4.61 | JPEG Spectral Selection, Hierarchical (Processes 20 & 22)	| No	
1.2.840.10008.1.2.4.62 | JPEG Spectral Selection, Hierarchical (Processes 21 & 23)	| No	
1.2.840.10008.1.2.4.63 | JPEG Full Progression, Hierarchical (Processes 24 & 26)	| No	
1.2.840.10008.1.2.4.64 | JPEG Full Progression, Hierarchical (Processes 25 & 27)	| No	
1.2.840.10008.1.2.4.65 | JPEG Lossless, Nonhierarchical (Process 28) | No	
1.2.840.10008.1.2.4.66 | JPEG Lossless, Nonhierarchical (Process 29) | No	
1.2.840.10008.1.2.4.70 | JPEG Lossless, Nonhierarchical, First- Order Prediction | No
1.2.840.10008.1.2.4.80 | JPEG-LS Lossless Image Compression	 | No
1.2.840.10008.1.2.4.81 | JPEG-LS Lossy (Near- Lossless) Image Compression | No
1.2.840.10008.1.2.4.92 | JPEG 2000 Part 2 Multicomponent Image Compression (Lossless Only) | No
1.2.840.10008.1.2.4.93 | JPEG 2000 Part 2 Multicomponent Image Compression | No
1.2.840.10008.1.2.4.94 | JPIP Referenced	 	| No	
1.2.840.10008.1.2.4.95 | JPIP Referenced Deflate	 	| No	
1.2.840.10008.1.2.5	| RLE Lossless	 	| No	
1.2.840.10008.1.2.6.1 | RFC 2557 MIME Encapsulation	 	| No	
1.2.840.10008.1.2.4.100 | MPEG2 Main Profile Main Level	| No
1.2.840.10008.1.2.4.102 | MPEG-4 AVC/H.264 High Profile / Level 4.1 | No
1.2.840.10008.1.2.4.103 | MPEG-4 AVC/H.264 BD-compatible High Profile / Level 4.1	 | No
1.2.840.10008.1.2.4.201 | High-Throughput JPEG 2000 Image Compression (Lossless Only)	 | No
1.2.840.10008.1.2.4.202 | High-Throughput JPEG 2000 with RPCL Options Image Compression (Lossless Only) | No
1.2.840.10008.1.2.4.203 | High-Throughput JPEG 2000 Image Compression | No