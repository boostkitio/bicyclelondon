import {
  PortableText as PT,
  type PortableTextComponents,
} from "@portabletext/react";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="mt-6 text-lg leading-[1.85] text-black/80">{children}</p>
    ),
    h2: ({ children }) => (
      <h2 className="display mt-16 text-3xl sm:text-4xl">{children}</h2>
    ),
    // Narrative section markers: a short green tab sets each section apart and
    // breaks the long read into scannable beats.
    h3: ({ children }) => (
      <h3 className="mt-14 font-display text-xl font-bold uppercase tracking-wide before:mb-4 before:block before:h-1 before:w-12 before:bg-brand">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="mt-9 font-display text-base font-bold uppercase tracking-[0.15em] text-black/55">
        {children}
      </h4>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-12 border-l-4 border-brand pl-6 font-display text-2xl font-bold uppercase leading-[1.15] text-navy sm:text-3xl">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="mt-6 space-y-2.5 pl-1 text-lg text-black/80 [&>li]:relative [&>li]:pl-6 [&>li]:before:absolute [&>li]:before:left-0 [&>li]:before:top-[0.7em] [&>li]:before:h-1.5 [&>li]:before:w-1.5 [&>li]:before:rounded-full [&>li]:before:bg-brand-ink">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="mt-6 list-decimal space-y-2.5 pl-6 text-lg text-black/80 marker:font-display marker:font-bold marker:text-brand-ink">
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
        className="font-medium text-brand-ink underline underline-offset-4 transition hover:text-ink"
      >
        {children}
      </a>
    ),
  },
  types: {
    image: ({ value }) =>
      value?.asset ? (
        <figure className="my-12">
          <Image
            src={urlFor(value).width(1400).fit("max").url()}
            alt={value.alt || ""}
            width={1400}
            height={900}
            sizes="(max-width: 800px) 100vw, 768px"
            className="h-auto w-full rounded-2xl"
          />
          {value.caption && (
            <figcaption className="mt-3 text-sm text-black/50">
              {value.caption}
            </figcaption>
          )}
        </figure>
      ) : null,
  },
};

export function PortableText({ value }: { value?: unknown }) {
  if (!value) return null;
  return <PT value={value as never} components={components} />;
}
