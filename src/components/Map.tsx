import React, { useEffect, useRef, useState } from "react"
import * as L from "leaflet"
import { Payload } from "../../types/api/Payload"
import { ResponseOpenMeteo } from "../../types/api/Response"
import { SoilType } from "../../types/enums"
import { handleClientScriptLoad } from "next/script"

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
  const [coordinates, setCoordinates] = useState<[number, number]>()
  const $map = useRef<HTMLDivElement>(null)
  const map = useRef<L.Map | undefined>()
  const markers = useRef<L.Marker[]>([])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
  }

  const clearMapMarkers = () => {
    if (!map.current) return
    markers.current
      .map((marker) => {
        marker.remove()
        return undefined
      })
      .filter((marker) => !!marker)
  }
  useEffect(() => {
    if (!$map.current) return
    if (map.current) return
    map.current = L.map($map.current, { zoomControl: false }).setView(
      [48.86, 2.33],
      13
    )
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(
      map.current
    )
    map.current.on("click", async (e) => {
      setCoordinates(() => [
        Math.round(e.latlng.lat * 100) / 100,
        Math.round(e.latlng.lng * 100) / 100,
      ])
      if (!map?.current) return
      clearMapMarkers()
      markers.current.push(
        L.marker([e.latlng.lat, e.latlng.lng], {
          icon: L.icon({
            iconUrl: "/marker.svg",
            iconRetinaUrl: "/marker.svg",
            iconSize: [50, 50],
            iconAnchor: [25, 50],
            shadowUrl: "",
            shadowRetinaUrl: "",
          }),
        }).addTo(map.current)
      )

      // const response = await sendRequest({
      //   coordinates,
      //   soil_type: SoilType.Clay,
      // })

      // console.log(response)
    })
  }, [])

  return (
    <>
      <div className="w-screen h-screen" ref={$map} />
      <form
        className="w-64 rounded-lg shadow-md absolute top-9 left-8 p-4 z-[500] bg-white flex flex-col gap-4"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col">
          <label className="text-sm text-gray-500 mb-1" htmlFor="soil-type">
            Type de sol
          </label>
          <select className="rounded-md border border-gray-300 p-1 pr-2">
            <option value={SoilType.Clay}>Argile</option>
            <option value={SoilType.Chalky}>Cailloux</option>
            <option value={SoilType.Sandy}>Sableux</option>
            <option value={SoilType.Silt}>Limoneux</option>
          </select>
        </div>
        <div className="flex justify-start gap-4">
          <div>
            <span className="text-sm text-gray-500">Lat</span>{" "}
            {coordinates?.[0]}
          </div>
          <div>
            <span className="text-sm text-gray-500">Lng</span>{" "}
            {coordinates?.[1]}
          </div>
        </div>
      </form>
    </>
  )
}
export default MapLeafLet
