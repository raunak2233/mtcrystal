/**
 * Renders a structured-data block. Kept as one component so every schema on the
 * site is serialised the same way, with `<` escaped to close off script-tag
 * injection through admin-editable fields such as product descriptions.
 */
export function JsonLd({ data, id }: { data: unknown; id?: string }) {
  return (
    <script
      type="application/ld+json"
      id={id}
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
