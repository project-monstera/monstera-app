import dynamic from "next/dynamic"
import "leaflet/dist/leaflet.css"
import Head from "next/head"

const MapLeafLet = dynamic(() => import("../src/components/Map"), {
  ssr: false,
})

const MapWrapper = () => {
  return (
    <main>
      <Head>
        <title>Home</title>
      </Head>
      {!!MapLeafLet ? <MapLeafLet /> : <div>Loading</div>}
    </main>
  )
}

export default MapWrapper
