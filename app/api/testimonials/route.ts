import { NextRequest } from "next/server";
import { getSessionUser } from "@/lib/server/auth";
import { badRequest, forbidden, ok } from "@/lib/server/http";
import { readTestimonials, writeTestimonials } from "@/lib/server/store";
import { normalizeTestimonial, validateTestimonial } from "@/lib/server/validators";

export async function GET() {
  const testimonials = await readTestimonials();
  return ok({ testimonials });
}

export async function POST(request: NextRequest) {
  const user = await getSessionUser();
  if (!user?.isAdmin) {
    return forbidden();
  }

  const testimonials = await readTestimonials();
  const testimonial = normalizeTestimonial({
    sortOrder: testimonials.length,
    ...(await request.json()),
  });

  const validationError = validateTestimonial(testimonial);
  if (validationError) {
    return badRequest(validationError);
  }

  if (testimonials.some((item) => item.id === testimonial.id)) {
    return badRequest("A review with this id already exists", 409);
  }

  testimonials.push(testimonial);
  await writeTestimonials(testimonials);
  return ok({ testimonial }, { status: 201 });
}
