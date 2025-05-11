import React from 'react'
import { HomeSection, Sheikhs, Studies, Supplications, Team } from "./home.chunks"
export default function page() {
  return (
    <>
      <HomeSection />
      <Studies />
      <Sheikhs />
      <Supplications />
      <Team />
    </>
  )
}
