import dynamic from "next/dynamic"
import "leaflet/dist/leaflet.css"
import Head from "next/head"

const MapLeafLet = dynamic(() => import("../components/Map"), {
  ssr: false
})

const MapWrapper = () => {
  return (
    <>
      <Head>
        <title>Home</title>
      </Head>
      {MapLeafLet ? <MapLeafLet /> : <div>Loading</div>}
    </>
  )
}

export default MapWrapper
