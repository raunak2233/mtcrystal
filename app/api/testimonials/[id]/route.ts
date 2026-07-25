import { NextRequest } from "next/server";
import { getSessionUser } from "@/lib/server/auth";
import { badRequest, forbidden, notFound, ok } from "@/lib/server/http";
import { readTestimonials, writeTestimonials } from "@/lib/server/store";
import { normalizeTestimonial, validateTestimonial } from "@/lib/server/validators";

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const user = await getSessionUser();
  if (!user?.isAdmin) {
    return forbidden();
  }

  const { id } = await context.params;
  const testimonials = await readTestimonials();
  const index = testimonials.findIndex((item) => item.id === id);

  if (index === -1) {
    return notFound("Review not found");
  }

  const testimonial = normalizeTestimonial({
    ...testimonials[index],
    ...(await request.json()),
    id,
  });

  const validationError = validateTestimonial(testimonial);
  if (validationError) {
    return badRequest(validationError);
  }

  testimonials[index] = testimonial;
  await writeTestimonials(testimonials);
  return ok({ testimonial });
}

export async function DELETE(_: NextRequest, context: { params: Promise<{ id: string }> }) {
  const user = await getSessionUser();
  if (!user?.isAdmin) {
    return forbidden();
  }

  const { id } = await context.params;
  const testimonials = await readTestimonials();
  const remaining = testimonials.filter((item) => item.id !== id);

  if (remaining.length === testimonials.length) {
    return notFound("Review not found");
  }

  await writeTestimonials(remaining);
  return ok({ success: true });
}
