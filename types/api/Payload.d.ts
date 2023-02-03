import { GeoJsonObject } from "geojson"

export type Payload = {
  // coordinates: GeoJsonObject // Format GeoJSON
  coordinates: [number, number]
  soil_type: SoilTypeList // Type de sol
}
