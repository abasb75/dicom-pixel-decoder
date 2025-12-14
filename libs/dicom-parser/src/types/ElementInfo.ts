interface ElementInfo {
  vr: string;
  name: string;
  length: number;
  value: any;
  valueOffset: number;
}



interface ElementInfo {
  vr: string;
  name: string;
  length: number;
  value: any;
  valueOffset: number;
}

type CommonDicomKeys = {
  // --- Patient ---
  PatientName?: ElementInfo;
  PatientID?: ElementInfo;
  PatientBirthDate?: ElementInfo;
  PatientSex?: ElementInfo;
  PatientAge?: ElementInfo;
  PatientWeight?: ElementInfo;
  PatientPosition?: ElementInfo;

  // --- Study ---
  StudyInstanceUID?: ElementInfo;
  StudyID?: ElementInfo;
  StudyDate?: ElementInfo;
  StudyTime?: ElementInfo;
  ReferringPhysicianName?: ElementInfo;
  AccessionNumber?: ElementInfo;

  // --- Series ---
  SeriesInstanceUID?: ElementInfo;
  SeriesNumber?: ElementInfo;
  Modality?: ElementInfo;
  BodyPartExamined?: ElementInfo;
  ProtocolName?: ElementInfo;
  Laterality?: ElementInfo;

  // --- Image ---
  InstanceNumber?: ElementInfo;
  ImagePositionPatient?: ElementInfo;
  ImageOrientationPatient?: ElementInfo;
  FrameOfReferenceUID?: ElementInfo;
  SamplesPerPixel?: ElementInfo;
  PhotometricInterpretation?: ElementInfo;
  Rows?: ElementInfo;
  Columns?: ElementInfo;
  BitsAllocated?: ElementInfo;
  BitsStored?: ElementInfo;
  HighBit?: ElementInfo;
  PixelRepresentation?: ElementInfo;
  PixelSpacing?: ElementInfo;
  SliceThickness?: ElementInfo;
  SliceLocation?: ElementInfo;

  // --- Pixel Data ---
  PixelData?: ElementInfo;
  PlanarConfiguration?: ElementInfo;
  WindowCenter?: ElementInfo;
  WindowWidth?: ElementInfo;
  RescaleIntercept?: ElementInfo;
  RescaleSlope?: ElementInfo;

  // --- Equipment ---
  Manufacturer?: ElementInfo;
  InstitutionName?: ElementInfo;
  StationName?: ElementInfo;
  SoftwareVersions?: ElementInfo;

  // --- SOP / Meta ---
  SOPClassUID?: ElementInfo;
  SOPInstanceUID?: ElementInfo;
  TransferSyntaxUID?: ElementInfo;
  MediaStorageSOPClassUID?: ElementInfo;
  MediaStorageSOPInstanceUID?: ElementInfo;
  ImplementationClassUID?: ElementInfo;
  ImplementationVersionName?: ElementInfo;

  // --- Acquisition Parameters ---
  AcquisitionDate?: ElementInfo;
  AcquisitionTime?: ElementInfo;
  AcquisitionNumber?: ElementInfo;
  ExposureTime?: ElementInfo;
  XRayTubeCurrent?: ElementInfo;
  KVP?: ElementInfo;
  Exposure?: ElementInfo;

  // --- CT-specific ---
  CTDIvol?: ElementInfo;
  DistanceSourceToDetector?: ElementInfo;
  DistanceSourceToPatient?: ElementInfo;

  // --- MR-specific ---
  EchoTime?: ElementInfo;
  RepetitionTime?: ElementInfo;
  InversionTime?: ElementInfo;
  MagneticFieldStrength?: ElementInfo;
  FlipAngle?: ElementInfo;

};

type Elements = CommonDicomKeys & Record<string, ElementInfo>;

export type {
    Elements,
    ElementInfo
}