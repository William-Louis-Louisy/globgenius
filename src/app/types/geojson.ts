type Position = [number, number];

interface Polygon {
  type: "Polygon";
  coordinates: Position[][];
}

interface MultiPolygon {
  type: "MultiPolygon";
  coordinates: Position[][][];
}

type Geometry = Polygon | MultiPolygon;

interface ShapeProperties {
  shapeName: string;
  shapeISO: string;
  shapeID: string;
  shapeGroup: string;
  shapeType: string;
}

interface Feature {
  type: "Feature";
  properties: ShapeProperties;
  geometry: Geometry;
}

export interface GeoShape {
  type: "FeatureCollection";
  crs?: {
    type: string;
    properties: { name: string };
  };
  features: Feature[];
}
