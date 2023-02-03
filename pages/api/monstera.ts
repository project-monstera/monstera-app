import mysql from "mysql2"
import axios, { AxiosResponse } from "axios"
import type { NextApiRequest, NextApiResponse } from "next"
import type {
  RequestOpenMeteo,
  ResponseOpenMeteo
} from "../../types/api/Response"
import { Response } from "../../types/api/Response"
import { averageValueFromList } from "../../utils/processing"

// create the connection to database
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD
})

// simple query
connection.query(
  "SELECT * FROM `hortipediadata` LIMIT 1",
  function (err, results, fields) {
    console.log({ err })

    console.log({ results }) // results contains rows returned by server
    console.log({ fields }) // fields contains extra meta data about results, if available
  }
)

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseOpenMeteo | { error: string }>
) => {
  const { body, method } = req
  const { coordinates, soil_type } = body
  console.log("body", body)

  const endDate = new Date()
  const startDate = new Date()
  startDate.setFullYear(endDate.getFullYear() - 1)

  const params = {
    latitude: coordinates[0],
    longitude: coordinates[1],
    start_date: startDate.toISOString().split("T")[0],
    end_date: endDate.toISOString().split("T")[0],
    hourly:
      "temperature_2m,precipitation,rain,snowfall,cloudcover,windspeed_10m,soil_temperature_0_to_7cm,soil_moisture_0_to_7cm",
    timeformat: "unixtime"
  }

  const responseWeatherApi = await axios
    .get<ResponseOpenMeteo, AxiosResponse<ResponseOpenMeteo>, RequestOpenMeteo>(
      "https://archive-api.open-meteo.com/v1/era5",
      { params }
    )
    .catch((err) => console.warn(err.response))

  if (!responseWeatherApi?.data) {
    return res.status(500).json({ error: "No data from weather API" })
  }

  const averageTemperature = averageValueFromList(
    responseWeatherApi.data.hourly.temperature_2m
  )
  const averagePrecipitation = averageValueFromList(
    responseWeatherApi.data.hourly.precipitation
  )

  switch (method) {
    case "POST":
      res.status(200).json(responseWeatherApi.data)
      break
    default:
      res.status(405).end(`Method ${method} Not Allowed`)
      break
  }
}

export default handler
