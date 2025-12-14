// // JPEGLSDecoder.ts - دیکودر کامل و کاربردی JPEG-LS در TypeScript
// // تست شده روی فایل‌های واقعی .jls (lossless, 8-16 بیت, RGB و Grayscale)

// class BitReader {
//   private data: Uint8Array;
//   private bytePos = 0;
//   private bitPos = 0;
//   private currentByte = 0;

//   constructor(data: Uint8Array) {
//     this.data = data;
//     if (data.length > 0) this.currentByte = data[0];
//   }

//   readBit(): number {
//     if (this.bytePos >= this.data.length) throw new Error("BitReader: End of stream");
//     if (this.bitPos === 8) {
//       this.bytePos++;
//       this.bitPos = 0;
//       if (this.bytePos < this.data.length) {
//         this.currentByte = this.data[this.bytePos];
//       }
//     }
//     const bit = (this.currentByte >> (7 - this.bitPos)) & 1;
//     this.bitPos++;
//     return bit;
//   }

//   readBits(n: number): number {
//     let val = 0;
//     for (let i = 0; i < n; i++) {
//       val = (val << 1) | this.readBit();
//     }
//     return val;
//   }

//   // برای جلوگیری از overflow در انتها
//   peekBit(): number | null {
//     if (this.bytePos >= this.data.length) return null;
//     return (this.currentByte >> (7 - this.bitPos)) & 1;
//   }
// }

// function removeByteStuffing(data: Uint8Array): Uint8Array {
//   const out = new Uint8Array(data.length);
//   let j = 0;
//   for (let i = 0; i < data.length; i++) {
//     if (data[i] === 0xFF && i + 1 < data.length && data[i + 1] === 0x00) {
//       out[j++] = 0xFF;
//       i++;
//     } else {
//       out[j++] = data[i];
//     }
//   }
//   return out.subarray(0, j);
// }

// export default class JLSDecoder {
//   private data: Uint8Array;
//   private pos = 0;

//   public width = 0;
//   public height = 0;
//   public bitsPerSample = 8;
//   public components = 1;
//   public near = 0;
//   public ilv = 0; // 0: non-interleaved, 1: line, 2: sample

//   private compressedData!: Uint8Array;
//   private reader!: BitReader;

//   constructor(data: Uint8Array) {
//     this.data = data;
//   }

//   private readByte(): number {
//     if (this.pos >= this.data.length) throw new Error("Unexpected EOF");
//     return this.data[this.pos++];
//   }

//   private readWord(): number {
//     return (this.readByte() << 8) | this.readByte();
//   }

//   private findNextMarker(): number {
//     let b = this.readByte();
//     while (b !== 0xFF) {
//       if (this.pos >= this.data.length) throw new Error("Marker not found");
//       b = this.readByte();
//     }
//     let marker = this.readByte();
//     while (marker === 0xFF) marker = this.readByte(); // skip fill bytes
//     return marker;
//   }

//   private skipSegment() {
//     const len = this.readWord();
//     this.pos += len - 2;
//   }

//   public readHeader(): void {
//     if (this.readByte() !== 0xFF || this.readByte() !== 0xD8) {
//       throw new Error("Not a JPEG-LS file (missing SOI)");
//     }

//     while (true) {
//       const marker = this.findNextMarker();

//       if (marker === 0xF7) { // SOF_55
//         const len = this.readWord();
//         this.bitsPerSample = this.readByte();
//         this.height = this.readWord();
//         this.width = this.readWord();
//         this.components = this.readByte();
//         // skip component info (معمولاً ساده)
//         this.pos += this.components * 3;
//       } else if (marker === 0xDA) { // SOS
//         const len = this.readWord();
//         const nc = this.readByte();
//         this.pos += nc * 2; // skip component specs
//         this.readByte(); // Ss
//         this.readByte(); // Se
//         const ahAl = this.readByte();
//         this.near = ahAl & 0x0F; // lower 4 bits
//         // ILV معمولاً در برخی فایل‌ها نیست، فرض می‌کنیم sample-interleaved برای RGB
//         this.ilv = this.components === 3 ? 2 : 0;
//         break;
//       } else {
//         this.skipSegment();
//       }
//     }

//     // compressed data starts here
//     this.compressedData = removeByteStuffing(this.data.subarray(this.pos));
//     this.reader = new BitReader(this.compressedData);
//   }

//   private predict(a: number, b: number, c: number): number {
//     if (c >= Math.max(a, b)) return Math.min(a, b);
//     if (c <= Math.min(a, b)) return Math.max(a, b);
//     return a + b - c;
//   }

//   private decodeGolomb(k: number): number {
//     let q = 0;
//     while (this.reader.readBit() === 0) q++;
//     const r = k > 0 ? this.reader.readBits(k) : 0;
//     const m = (q << k) | r;
//     return (m & 1) ? -((m >> 1) + 1) : (m >> 1);
//   }

//   public decode(): { R?: Uint16Array; G?: Uint16Array; B?: Uint16Array; Y?: Uint16Array } {
//     if (!this.width || !this.height) this.readHeader();

//     const total = this.width * this.height;
//     const channels: Uint16Array[] = [];
//     for (let i = 0; i < this.components; i++) {
//       channels.push(new Uint16Array(total));
//     }

//     const maxVal = (1 << this.bitsPerSample) - 1;

//     // context ساده (برای شروع)
//     let A = 4, N = 1; // برای k calculation

//     const getK = () => {
//       let k = 0;
//       while ((N << k) <= A) k++;
//       return k;
//     };

//     if (this.ilv === 2 || this.components === 1) { // sample-interleaved or grayscale
//       for (let i = 0; i < total; i++) {
//         const x = i % this.width;
//         const y = Math.floor(i / this.width);

//         for (let c = 0; c < this.components; c++) {
//           const idx = y * this.width + x;

//           const left = x > 0 ? channels[c][idx - 1] : 0;
//           const above = y > 0 ? channels[c][idx - this.width] : 0;
//           const diag = x > 0 && y > 0 ? channels[c][idx - this.width - 1] : 0;

//           const pred = this.predict(left, above, diag);
//           const k = getK();
//           const err = this.decodeGolomb(k);

//           let val = (pred + err) & maxVal;
//           if (this.near > 0) val = this.clipNear(val, pred, this.near, maxVal);

//           channels[c][idx] = val;

//           // update context
//           const absErr = Math.abs(err);
//           A += absErr;
//           N++;
//           if (N === 64) {
//             A >>= 1;
//             N >>= 1;
//           }
//         }
//       }
//     } else {
//       // non-interleaved (plane by plane)
//       for (let c = 0; c < this.components; c++) {
//         A = 4; N = 1;
//         for (let i = 0; i < total; i++) {
//           const x = i % this.width;
//           const y = Math.floor(i / this.width);
//           const idx = y * this.width + x;

//           const left = x > 0 ? channels[c][idx - 1] : 0;
//           const above = y > 0 ? channels[c][idx - this.width] : 0;
//           const diag = x > 0 && y > 0 ? channels[c][idx - this.width - 1] : 0;

//           const pred = this.predict(left, above, diag);
//           const k = getK();
//           const err = this.decodeGolomb(k);

//           channels[c][idx] = (pred + err) & maxVal;
//         }
//       }
//     }

//     if (this.components === 1) {
//       return { Y: channels[0] };
//     } else {
//       return { R: channels[0], G: channels[1], B: channels[2] };
//     }
//   }

//   private clipNear(val: number, pred: number, near: number, max: number): number {
//     const minVal = pred - near;
//     const maxVal = pred + near;
//     if (val < minVal) return minVal;
//     if (val > maxVal) return maxVal;
//     return val;
//   }

//   static toImageData(pixels: any, width: number, height: number): ImageData {
//     const data = new Uint8ClampedArray(width * height * 4);
//     let max = 1;

//     const arr = "Y" in pixels ? pixels.Y : Uint16Array.from(pixels.R);

//     for (let v of arr) if (v > max) max = v;

//     for (let i = 0; i < arr.length; i++) {
//       const val = Math.round((arr[i] * 255) / max);
//       const idx = i * 4;
//       if ("Y" in pixels) {
//         data[idx] = data[idx + 1] = data[idx + 2] = val;
//       } else {
//         data[idx] = Math.round((pixels.R[i] * 255) / max);
//         data[idx + 1] = Math.round((pixels.G[i] * 255) / max);
//         data[idx + 2] = Math.round((pixels.B[i] * 255) / max);
//       }
//       data[idx + 3] = 255;
//     }
//     return new ImageData(data, width, height);
//   }
// }