export interface GeoShape {
  width: number;
  height: number;
  viewBox: string;
  paths: string[];
  fillRule?: "nonzero" | "evenodd";
}
