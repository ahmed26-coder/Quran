import React from 'react'
import { ContactHead, ContactFAQ  } from './contact-us.chunks'
import { ContactForm } from './contact-us.client'


export default function page() {
  return (
    <>
      <ContactHead />
      <ContactForm />
      <ContactFAQ />
    </>
  )
}
