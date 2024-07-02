export enum ApplicationDocumentType {
  RA = 1,
  RO = 2,
  KML = 3,
}

export const BucketByDocumentType = {
  [ApplicationDocumentType.RA]: 'aeroguard-ra',
  [ApplicationDocumentType.RO]: 'aeroguard-ro',
  [ApplicationDocumentType.KML]: 'aeroguard-kml',
};
