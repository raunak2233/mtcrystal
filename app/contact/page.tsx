"use client"

import type React from "react"

import { useState } from "react"
import { Mail, MapPin, Phone } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/hooks/use-toast"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real application, you would send this data to your server
    console.log(formData)
    toast({
      title: "Message Sent",
      description: "Thank you for contacting us. We'll get back to you soon!",
    })
    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    })
  }

  return (
    <div className="flex flex-col min-h-screen">
      <section className="w-full py-12 md:py-24 bg-purple-50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">Contact Us</h1>
              <p className="max-w-[700px] text-gray-500 md:text-xl">
                Have questions or need assistance? We're here to help you find the perfect crystal bracelet.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="grid gap-10 lg:grid-cols-2">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Get in Touch</h2>
              <p className="text-gray-500">
                We'd love to hear from you! Whether you have questions about our products, need help choosing the right
                crystal, or want to share your experience, please don't hesitate to reach out.
              </p>

              <div className="grid gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2">
                      <Mail className="h-5 w-5 text-purple-600" />
                      Email
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>
                      <a href="mailto:info@mtcrystals.com" className="hover:underline">
                        info@mtcrystals.com
                      </a>
                    </CardDescription>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2">
                      <Phone className="h-5 w-5 text-purple-600" />
                      Phone
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>
                      <a href="tel:+15551234567" className="hover:underline">
                        (555) 123-4567
                      </a>
                    </CardDescription>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-purple-600" />
                      Address
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>
                      123 Crystal Lane
                      <br />
                      Serenity Valley, CA 90210
                      <br />
                      United States
                    </CardDescription>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-bold">Business Hours</h3>
                <p className="text-gray-500">Monday - Friday: 9:00 AM - 6:00 PM</p>
                <p className="text-gray-500">Saturday: 10:00 AM - 4:00 PM</p>
                <p className="text-gray-500">Sunday: Closed</p>
              </div>
            </div>

            <div>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Your name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Your email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    name="subject"
                    placeholder="Subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Your message"
                    required
                    className="min-h-[150px]"
                    value={formData.message}
                    onChange={handleChange}
                  />
                </div>
                <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700">
                  Send Message
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
