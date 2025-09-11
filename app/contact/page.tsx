"use client";

import type React from "react";
import { useRef } from "react";
import emailjs from "emailjs-com";
import { useState } from "react";
import { Mail, MapPin, Phone } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const formRef = useRef<HTMLFormElement>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formRef.current) return;

    emailjs
      .sendForm(
        "service_hmu5yn7",
        "template_60t9owd",
        formRef.current,
        "2CifoUy79CalgD-En"
      )
      .then(
        (result) => {
          console.log("Success:", result.text);
          toast({
            title: "Message Sent",
            description:
              "Thank you for contacting us. We'll get back to you soon!",
          });
          setFormData({
            name: "",
            email: "",
            subject: "",
            message: "",
          });
        },
        (error) => {
          console.error("Error:", error.text);
          toast({
            title: "Error",
            description: "Failed to send message. Please try again later.",
            variant: "destructive",
          });
        }
      );
  };

  return (
    <div className="flex flex-col min-h-screen">
      <section className="w-full py-12 md:py-24 bg-purple-50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                Contact Us
              </h1>
              <p className="max-w-[700px] text-gray-500 md:text-xl">
                Have questions or need assistance? We're here to help you find
                the perfect crystal bracelet.
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
                We'd love to hear from you! Whether you have questions about our
                products, need help choosing the right crystal, or want to share
                your experience, please don't hesitate to reach out.
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
                      <a
                        href="mailto:miracletouchcrystals@gmail.com"
                        className="hover:underline"
                      >
                        miracletouchcrystals@gmail.com
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
                        +91 88823 12076
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
                      94, Street No 4
                      <br />
                      Samaypur, North West Delhi - 110042
                      <br />
                      Delhi, India
                    </CardDescription>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-bold">Business Hours</h3>
                <p className="text-gray-500">
                  Monday - Friday: 9:00 AM - 6:00 PM
                </p>
                <p className="text-gray-500">Saturday: 10:00 AM - 4:00 PM</p>
                <p className="text-gray-500">Sunday: Closed</p>
              </div>
            </div>

            <div>
              <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
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
                <Button
                  type="submit"
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  Send Message
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
