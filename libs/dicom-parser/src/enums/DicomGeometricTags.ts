export const dicomGeometricTags = [
  {
    name: "PixelSpacing",
    root: [0x0028, 0x0030],
    sharedFG: { seq: [0x0028, 0x9110], tag: "PixelSpacing" },
    perFrameFG: { seq: [0x0028, 0x9110], tag: "PixelSpacing" },
    frameDependent: false
  },
  {
    name: "SliceThickness",
    root: [0x0018, 0x0050],
    sharedFG: { seq: [0x0028, 0x9110], tag: "SliceThickness" },
    perFrameFG: { seq: [0x0028, 0x9110], tag: "SliceThickness" },
    frameDependent: false
  },
  {
    name: "SpacingBetweenSlices",
    root: [0x0018, 0x0088],
    sharedFG: { seq: [0x0028, 0x9110], tag: "SpacingBetweenSlices" },
    perFrameFG: { seq: [0x0028, 0x9110], tag: "SpacingBetweenSlices" },
    frameDependent: false
  },
  {
    name: "ImageOrientationPatient",
    root: [0x0020, 0x0037],
    sharedFG: { seq: [0x0028, 0x9220], tag: "ImageOrientationPatient" },
    perFrameFG: { seq: [0x0028, 0x9220], tag: "ImageOrientationPatient" },
    frameDependent: true
  },
  {
    name: "ImagePositionPatient",
    root: [0x0020, 0x0032],
    sharedFG: { seq: [0x0028, 0x9210], tag: "ImagePositionPatient" },
    perFrameFG: { seq: [0x0028, 0x9210], tag: "ImagePositionPatient" },
    frameDependent: true
  },
  {
    name: "SliceLocation",
    root: [0x0020, 0x1041],
    sharedFG: { seq: [0x0028, 0x9210], tag: "SliceLocation" },
    perFrameFG: { seq: [0x0028, 0x9210], tag: "SliceLocation" },
    frameDependent: true
  },
  {
    name: "RescaleSlope",
    root: [0x0028, 0x1053],
    sharedFG: { seq: [0x0028, 0x9145], tag: "RescaleSlope" },
    perFrameFG: { seq: [0x0028, 0x9145], tag: "RescaleSlope" },
    frameDependent: true
  },
  {
    name: "RescaleIntercept",
    root: [0x0028, 0x1052],
    sharedFG: { seq: [0x0028, 0x9145], tag: "RescaleIntercept" },
    perFrameFG: { seq: [0x0028, 0x9145], tag: "RescaleIntercept" },
    frameDependent: true
  },
  {
    name: "RescaleType",
    root: [0x0028, 0x1054],
    sharedFG: { seq: [0x0028, 0x9145], tag: "RescaleType" },
    perFrameFG: { seq: [0x0028, 0x9145], tag: "RescaleType" },
    frameDependent: true
  }
];
