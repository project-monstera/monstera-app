import axios from "axios"
import type { NextApiRequest, NextApiResponse } from "next"
import type { ResponseOpenMeteo } from "../../types/api/Response";
import { Response } from "../../types/api/Response"

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
  // const centerPosition = turf.center(
  //   turf.points([
  //     [30.0, 10.0],
  //     [40.0, 40.0],
  //     [20.0, 40.0],
  //     [10.0, 20.0],
  //     [30.0, 10.0],
  //   ])
  // )

  const params = {
    latitude: coordinates[0],
    longitude: coordinates[1],
    start_date: startDate.toISOString().split("T")[0],
    end_date: endDate.toISOString().split("T")[0],
    hourly:
      "temperature_2m,precipitation,rain,snowfall,cloudcover,windspeed_10m,soil_temperature_0_to_7cm",
    timeformat: "unixtime"
  }

  const responseWeatherApi = await axios
    .get<ResponseOpenMeteo>("https://archive-api.open-meteo.com/v1/era5", {
      params
    })
    .catch((err) => console.warn(err.response))

  if (!responseWeatherApi?.data) {
    return res.status(500).json({ error: "No data from weather API" })
  }

  // const api = await fetch(
  //   "https://archive-api.open-meteo.com/v1/era5?latitude=52.52&longitude=13.41&start_date=2021-12-02&end_date=2022-12-02&hourly=temperature_2m,precipitation,rain,windspeed_10m,soil_temperature_0_to_7cm&daily=temperature_2m_max,temperature_2m_min&timezone=auto&timeformat=unixtime"
  // )
  // const data = await api.json()
  // console.log(data)

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
