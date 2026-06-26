import Image from "next/image";
import { Container } from "@/components/ui/container";
import { MuxBg } from "@/components/mux-bg";
import { Parallax } from "@/components/scroll/parallax";
import { MaskReveal } from "@/components/scroll/mask-reveal";

export function PageHero({
  eyebrow,
  title,
  lead,
  image,
  logo,
  videoPlaybackId,
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
  image?: string;
  logo?: string;
  videoPlaybackId?: string;
}) {
  return (
    <section className="relative isolate overflow-hidden bg-navy text-white">
      {videoPlaybackId ? (
        <>
          <div className="absolute inset-0 opacity-45">
            <MuxBg playbackId={videoPlaybackId} poster={image} />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/75 to-navy/50" />
        </>
      ) : image ? (
        <>
          <Image
            src={image}
            alt=""
            fill
            priority
            sizes="100vw"
            className="animate-kenburns object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/70 to-navy/40" />
        </>
      ) : null}
      <Parallax speed={-0.08} className="relative z-10">
        <Container className="pb-16 pt-36 sm:pb-20">
          {logo && (
            <Image
              src={logo}
              alt=""
              width={260}
              height={72}
              className="mb-6 h-14 w-auto object-contain sm:h-16"
            />
          )}
          {eyebrow && (
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-brand">
              {eyebrow}
            </p>
          )}
          <MaskReveal
            as="h1"
            className="display text-5xl sm:text-6xl lg:text-7xl"
            lines={[title]}
          />
          {lead && (
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/80">
              {lead}
            </p>
          )}
        </Container>
      </Parallax>
    </section>
  );
}
