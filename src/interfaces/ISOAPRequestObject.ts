export interface IRequestObject {
  reqObject: {
    LatestFlag: string;
    ApplicableForFlag: string;
    ToDate: string;
    FromDate: string;
    DateType: string;
    PublicationObjectNameList: {
      string: string[];
    };
  };
}
