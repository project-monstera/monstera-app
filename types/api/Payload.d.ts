import { GeoJsonObject } from "geojson"
import { SoilType } from "../enums"

export type Payload = {
  // coordinates: GeoJsonObject // Format GeoJSON
  coordinates: [number, number]
  soil_type: SoilType // Type de sol
}
