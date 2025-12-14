# DICOM Parser

A lightweight and simple DICOM parser designed for browser and Node.js environments.  
This library extracts metadata and pixel information from raw DICOM files using a clean and intuitive API.

---

## 📦 Installation

```bash
npm install @abasb75/dicom-parser
```

## 🚀 Usage

To use this library, you must provide the ArrayBuffer of a DICOM file.

```js
import { parse } from '@abasb75/dicom-parser';

const dataset = parse(dicomBuffer as ArrayBuffer);

console.log({ dataset });
```