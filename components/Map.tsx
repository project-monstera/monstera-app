import React, { useEffect, useRef, useState } from "react"
import * as L from "leaflet"
import type { Payload } from "../types/api/Payload"
import type { ResponseOpenMeteo, SoilTypeList } from "../types/api/Response"
import Loader from "./Loader"

const sendRequest = async (payload: Payload) => {
  const res = await fetch("/api/monstera", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
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
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const $map = useRef<HTMLDivElement>(null)
  const map = useRef<L.Map | undefined>()
  const markers = useRef<L.Marker[]>([])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsLoading(true)
    e.preventDefault()
    if (!coordinates) return
    const form = new FormData(e.target as HTMLFormElement)
    const formData = Object.fromEntries(form)
    const res = await sendRequest({
      coordinates,
      soil_type: formData["soil-type"]
    })
    console.log(res)
    setIsLoading(false)
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
      if (!map?.current) return
      setCoordinates(() => [e.latlng.lat, e.latlng.lng])
      clearMapMarkers()
      markers.current.push(
        L.marker([e.latlng.lat, e.latlng.lng], {
          icon: L.icon({
            iconUrl: "/marker.svg",
            iconRetinaUrl: "/marker.svg",
            iconSize: [50, 50],
            iconAnchor: [25, 50],
            shadowUrl: "",
            shadowRetinaUrl: ""
          })
        }).addTo(map.current)
      )
    })
    return () => {
      map.current?.remove()
    }
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
          <select
            name="soil-type"
            className="rounded-md border border-gray-300 p-1 pr-2"
          >
            <option value="clay">Argile</option>
            <option value="chalky">Cailloux</option>
            <option value="sandy">Sableux</option>
            <option value="silt">Limoneux</option>
          </select>
        </div>
        <div className="flex flex-col justify-start gap-4">
          <div>
            <span className="text-sm text-gray-500">Lat</span>{" "}
            {coordinates?.[0]}
          </div>
          <div>
            <span className="text-sm text-gray-500">Lng</span>{" "}
            {coordinates?.[1]}
          </div>
        </div>
        <button
          className="w-full text-white font-semibold bg-green-500 p-2 rounded-md"
          type="submit"
        >
          <span className="flex justify-center items-center">
            {isLoading ? <Loader /> : "Ask the AI"}
          </span>
        </button>
      </form>
    </>
  )
}
export default MapLeafLet
