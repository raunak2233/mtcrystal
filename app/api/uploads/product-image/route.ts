import { getSessionUser } from "@/lib/server/auth";
import { uploadImages } from "@/lib/server/image-upload";
import { badRequest, forbidden, ok, serverError } from "@/lib/server/http";

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user?.isAdmin) {
    return forbidden();
  }

  try {
    const formData = await request.formData();
    const files = formData
      .getAll("images")
      .concat(formData.getAll("image"))
      .filter((item): item is File => item instanceof File);

    if (!files.length) {
      return badRequest("Please choose an image to upload");
    }
    const imageUrls = await uploadImages(files);

    return ok({
      imageUrl: imageUrls[0],
      imageUrls,
    });
  } catch (error) {
    console.error("Product image upload failed", error);
    return serverError(error instanceof Error ? error.message : "Unable to upload image");
  }
}
