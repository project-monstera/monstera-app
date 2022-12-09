"use client"
import React, { useEffect } from "react"

type Props = {}

const HomePage = (props: Props) => {
  useEffect(() => {
    fetch("/api/monstera", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "Monstera",
        price: 10,
      }),
    })
  }, [])
  return <h2>Home</h2>
}

export default HomePage
