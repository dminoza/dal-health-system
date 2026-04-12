export type RecordItem = {
  id: string;
  year: number;
  value: number;
};


export type Barangay = {
  id: string;
  name: string;
  cases: number;
  coordinates?: {
    x: number;
    y: number;
  };
  records: RecordItem[];
};
