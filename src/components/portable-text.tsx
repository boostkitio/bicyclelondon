import {
  PortableText as PT,
  type PortableTextComponents,
} from "@portabletext/react";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="mt-5 leading-relaxed text-black/75">{children}</p>
    ),
    h2: ({ children }) => (
      <h2 className="display mt-12 text-3xl sm:text-4xl">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-9 font-display text-2xl font-bold uppercase">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="mt-7 font-display text-xl font-bold">{children}</h4>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-8 border-l-4 border-brand pl-6 font-display text-xl font-bold uppercase leading-snug">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="mt-5 list-disc space-y-2 pl-6 text-black/75">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="mt-5 list-decimal space-y-2 pl-6 text-black/75">
        {children}
      </ol>
    ),
  },
  marks: {
    strong: ({ children }) => (
      <strong className="font-semibold text-ink">{children}</strong>
    ),
    em: ({ children }) => <em>{children}</em>,
    link: ({ value, children }) => (
      <a
        href={value?.href}
        target={value?.blank ? "_blank" : undefined}
        rel={value?.blank ? "noopener noreferrer" : undefined}
        className="text-brand-ink underline underline-offset-2"
      >
        {children}
      </a>
    ),
  },
  types: {
    image: ({ value }) =>
      value?.asset ? (
        <figure className="my-8">
          <Image
            src={urlFor(value).width(1400).fit("max").url()}
            alt={value.alt || ""}
            width={1400}
            height={900}
            className="h-auto w-full rounded-2xl"
          />
          {value.caption && (
            <figcaption className="mt-2 text-sm text-black/50">
              {value.caption}
            </figcaption>
          )}
        </figure>
      ) : null,
  },
};

export function PortableText({ value }: { value?: unknown }) {
  if (!value) return null;
  return (
    <div className="text-lg">
      <PT value={value as never} components={components} />
    </div>
  );
}
