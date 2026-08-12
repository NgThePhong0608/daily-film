"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { logMovieEvent } from "@/app/actions/analytics";
import { useWatchHistory } from "@/hooks/use-watch-history";
import type { ServerData } from "@/types/movie";

interface CustomPlayerProps {
  hlsUrl?: string;
  embedUrl: string;
  movieSlug: string;
  movieTitle: string;
  posterUrl: string;
  episodeSlug: string;
  episodeName: string;
  episodes?: ServerData[];
}

export default function CustomPlayer(props: CustomPlayerProps) {
  const {
    movieSlug,
  } = props;
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [mounted, setMounted] = useState(false);
  const [useEmbedPlayer, setUseEmbedPlayer] = useState(false);
  const [activeEpisode, setActiveEpisode] = useState<ServerData>(() => ({
    name: props.episodeName,
    slug: props.episodeSlug,
    filename: "",
    link_embed: props.embedUrl,
    link_m3u8: props.hlsUrl ?? "",
  }));

  const { saveHistory } = useWatchHistory();
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    const episode = props.episodes?.find((item) => item.slug === props.episodeSlug);

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setActiveEpisode(episode ?? {
      name: props.episodeName,
      slug: props.episodeSlug,
      filename: "",
      link_embed: props.embedUrl,
      link_m3u8: props.hlsUrl ?? "",
    });
    setUseEmbedPlayer(false);
  }, [props.embedUrl, props.episodeName, props.episodeSlug, props.episodes, props.hlsUrl]);

  useEffect(() => {
    // 1. Save to Watch History immediately
    saveHistory({
      movieSlug,
      movieTitle: props.movieTitle,
      posterUrl: props.posterUrl,
      episodeSlug: activeEpisode.slug,
      episodeName: activeEpisode.name,
      currentTime: 0,
      duration: 0,
    }).catch(err => console.error("History save failed", err));

    // 2. Log 'play' event after 30 seconds
    const timer = setTimeout(() => {
      const username = localStorage.getItem("username");
      if (username) {
        logMovieEvent(username, movieSlug, "play").catch(err => console.error("Event log failed", err));
      }
    }, 30000);

    return () => {
      clearTimeout(timer);
    };
  }, [activeEpisode.name, activeEpisode.slug, movieSlug, props.movieTitle, props.posterUrl, saveHistory]);

  useEffect(() => {
    if (activeEpisode.slug !== props.episodeSlug) {
      router.replace(`/xem-phim/${movieSlug}/${activeEpisode.slug}`);
    }
  }, [activeEpisode.slug, movieSlug, props.episodeSlug, router]);

  useEffect(() => {
    const video = videoRef.current;
    const hlsUrl = activeEpisode.link_m3u8?.trim();

    if (!mounted || !video || !hlsUrl || useEmbedPlayer) return;

    video.pause();
    video.removeAttribute("src");
    video.load();

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = hlsUrl;
      return;
    }

    let destroyed = false;
    let hlsInstance: import("hls.js").default | null = null;

    import("hls.js")
      .then(({ default: Hls }) => {
        if (destroyed) return;

        if (!Hls.isSupported()) {
          if (activeEpisode.link_embed) {
            setUseEmbedPlayer(true);
          }
          return;
        }

        const hls = new Hls();
        hlsInstance = hls;
        hls.loadSource(hlsUrl);
        hls.attachMedia(video);
        hls.on(Hls.Events.ERROR, (_, data) => {
          if (data.fatal && activeEpisode.link_embed) {
            setUseEmbedPlayer(true);
          }
        });
      })
      .catch(() => {
        if (activeEpisode.link_embed) {
          setUseEmbedPlayer(true);
        }
      });

    return () => {
      destroyed = true;
      hlsInstance?.destroy();
    };
  }, [activeEpisode.link_embed, activeEpisode.link_m3u8, mounted, useEmbedPlayer]);

  const handleVideoError = useCallback(() => {
    const hlsUrl = activeEpisode.link_m3u8?.trim();

    if (!hlsUrl) return;

    if (activeEpisode.link_embed) {
      setUseEmbedPlayer(true);
    }
  }, [activeEpisode.link_embed, activeEpisode.link_m3u8]);

  if (!mounted) {
    return <div className="aspect-video w-full bg-black rounded-lg animate-pulse" />;
  }

  return (
    <div className="space-y-4">
      <div
        ref={containerRef}
        className={cn(
          "relative w-full bg-black shadow-lg group overflow-hidden",
          "aspect-video rounded-lg"
        )}
      >
        {useEmbedPlayer && activeEpisode.link_embed ? (
          <iframe
            src={activeEpisode.link_embed}
            className="absolute inset-0 z-0 h-full w-full border-0"
            title={`Xem phim ${movieSlug}`}
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            referrerPolicy="no-referrer"
          />
        ) : activeEpisode.link_m3u8 ? (
          <video
            key={activeEpisode.link_m3u8}
            ref={videoRef}
            className="absolute inset-0 z-0 h-full w-full"
            controls
            playsInline
            poster={props.posterUrl}
            title={`Xem phim ${movieSlug}`}
            onError={handleVideoError}
          />
        ) : activeEpisode.link_embed ? (
          <iframe
            src={activeEpisode.link_embed}
            className="absolute inset-0 z-0 h-full w-full border-0"
            title={`Xem phim ${movieSlug}`}
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="absolute inset-0 z-0 flex items-center justify-center px-6 text-center text-sm text-white/80">
            Tập phim này chưa có nguồn phát khả dụng.
          </div>
        )}
      </div>
    </div >
  );
}
