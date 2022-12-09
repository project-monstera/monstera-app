import React, { useEffect, useRef } from "react"
import * as L from "leaflet"
import { Payload } from "../../types/api/Payload"
import { Response, ResponseOpenMeteo } from "../../types/api/Response"
import { SoilType } from "../../types/enums"

const sendRequest = async (payload: Payload) => {
  const res = await fetch("/api/monstera", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })
  const data = (await res.json()) as ResponseOpenMeteo
  console.log(
    "req",
    { lat: payload.coordinates[0], lng: payload.coordinates[1] },
    "res",
    { lat: data.latitude, lng: data.longitude }
  )
  return data
}

const MapLeafLet = () => {
  const $map = useRef<HTMLDivElement>(null)
  const map = useRef<L.Map | undefined>()
  useEffect(() => {
    if (!$map.current) return
    if (map.current) return
    map.current = L.map($map.current).setView([48.86, 2.33], 13)
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(
      map.current
    )
    map.current.on("click", async (e) => {
      const coordinates = [
        Math.round(e.latlng.lat * 100) / 100,
        Math.round(e.latlng.lng * 100) / 100,
      ] as [number, number]

      const response = await sendRequest({
        coordinates,
        soil_type: SoilType.Clay,
      })

      console.log(response)
    })
  }, [])

  return (
    <div
      style={{
        width: "100%",
        height: "100vw",
      }}
      ref={$map}
    />
  )
}
export default MapLeafLet
