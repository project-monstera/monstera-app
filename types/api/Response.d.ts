import { FoodType, Season, SoilType } from "../enums"

export type ResponseOpenMeteo = {
  latitude: number
  longitude: number
  generationtime_ms: number
  utc_offset_seconds: 0
  timezone: "GMT"
  timezone_abbreviation: "GMT"
  elevation: number
  hourly_units: {
    time: "unixtime"
    temperature_2m: "°C"
    precipitation: "mm"
    rain: "mm"
    snowfall: "cm"
    cloudcover: "%"
    windspeed_10m: "km/h"
    soil_temperature_0_to_7cm: "°C"
  }
  hourly: {
    time: number[]
    temperature_2m: number[]
    precipitation: number[]
    rain: number[]
    snowfall: number[]
    cloudcover: number[]
    windspeed_10m: number[]
    soil_temperature_0_to_7cm: number[]
  }
}

export type RequestOpenMeteo = {
  latitude: number
  longitude: number
  start_date: string
  end_date: string
  hourly: string
  timeformat: string
}

export type Response = {
  climate_type?: number // Récupérer depuis Hortipedia
  garden: {
    month: Season
    plants: {
      compatibily_rank?: number // De 0 à 100
      maintenance_rank?: number // De 0 à 100
      name?: string
      preferred_soil_types?: SoilType[]
      description?: string
      is_eatable?: boolean
      food_type?: FoodType
      height?: string
      plant_type?: string[]
      temperature_zone?: number // Récupérer depuis Hortipedia
    }[]
  }[]
}
