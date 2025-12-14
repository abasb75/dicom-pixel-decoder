interface MetadataElement {
  vr: string|null;
  tagName: string|null;
  length?: number;
  value: any;
  valueOffset?: number;
}

type CommonMetaKeys = {
  FileMetaInformationGroupLength?: MetadataElement;
  FileMetaInformationVersion?: MetadataElement;
  MediaStorageSOPClassUID?: MetadataElement;
  MediaStorageSOPInstanceUID?: MetadataElement;
  TransferSyntaxUID?: MetadataElement;
  ImplementationClassUID?: MetadataElement;
  ImplementationVersionName?: MetadataElement;
  SourceApplicationEntityTitle?: MetadataElement;
  SendingApplicationEntityTitle?: MetadataElement;
  ReceivingApplicationEntityTitle?: MetadataElement;
  PrivateInformationCreatorUID?: MetadataElement;
  PrivateInformation?: MetadataElement;
};

type Metadata = CommonMetaKeys & Record<string, MetadataElement>;

export type { 
    Metadata,
    MetadataElement,
};
