import type { Page } from "@/lib/types";

/** Renders a stored page — title, short description, and the main text — as plain text. */
export function StoredPage({ page }: { page: Page }) {
  return (
    <div className="mx-auto max-w-3xl px-4">
      <h1 className="text-3xl font-bold">{page.title}</h1>
      {page.description ? (
        <p className="mt-4 text-lg text-gray-600">{page.description}</p>
      ) : null}
      {page.body ? (
        <div className="mt-6 whitespace-pre-wrap text-lg leading-relaxed text-gray-700">
          {page.body}
        </div>
      ) : null}
    </div>
  );
}
