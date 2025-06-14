import React from 'react'
import { AboutGate, AboutHead, AboutServices, AboutValues, AboutUser, AboutStart, AboutPlan } from './about-us.chunks'

export default function page() {
  return (
    <>
      <AboutHead />
      <AboutGate />
      <AboutStart />
      <AboutServices />
      <AboutValues />
      <AboutUser />
      <AboutPlan />
    </>
  )
}
