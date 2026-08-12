"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Server } from "lucide-react";
import { cn } from "@/lib/utils";
import { logMovieEvent } from "@/app/actions/analytics";
import { useWatchHistory } from "@/hooks/use-watch-history";
import type { ServerData } from "@/types/movie";

interface CustomPlayerProps {
  hlsUrl?: string; // Kept for compatibility but unused
  embedUrl: string;
  movieSlug: string;
  movieTitle: string;
  posterUrl: string;
  episodeSlug: string;
  episodeName: string;
  episodes?: ServerData[];
  previousEpisodeSlug?: string;
  nextEpisodeSlug?: string;
  initialTime?: number; // Kept for compatibility but unused
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
  const [playerError, setPlayerError] = useState<{
    url: string;
    message: string;
  } | null>(null);
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
          setPlayerError({
            url: hlsUrl,
            message: "Trình duyệt này không hỗ trợ phát video HLS.",
          });
          return;
        }

        const hls = new Hls();
        hlsInstance = hls;
        hls.loadSource(hlsUrl);
        hls.attachMedia(video);
        hls.on(Hls.Events.ERROR, (_, data) => {
          if (data.fatal) {
            if (activeEpisode.link_embed) {
              setUseEmbedPlayer(true);
            }
            setPlayerError({
              url: hlsUrl,
              message: "Không tải được luồng phim. Vui lòng thử lại sau.",
            });
          }
        });
      })
      .catch(() => {
        setPlayerError({
          url: hlsUrl,
          message: "Không tải được trình phát video.",
        });
      });

    return () => {
      destroyed = true;
      hlsInstance?.destroy();
    };
  }, [activeEpisode.link_embed, activeEpisode.link_m3u8, mounted, useEmbedPlayer]);

  const handleVideoError = useCallback(() => {
    const hlsUrl = activeEpisode.link_m3u8?.trim();

    if (!hlsUrl) return;

    setPlayerError({
      url: hlsUrl,
      message: "Trình duyệt không phát được nguồn này. Hãy thử server gốc.",
    });

    if (activeEpisode.link_embed) {
      setUseEmbedPlayer(true);
    }
  }, [activeEpisode.link_embed, activeEpisode.link_m3u8]);

  const activePlayerError =
    playerError?.url === activeEpisode.link_m3u8?.trim()
      ? playerError.message
      : null;

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

        {activePlayerError && (
          <div className="absolute inset-x-4 top-4 z-10 rounded-md bg-red-950/90 px-4 py-3 text-sm text-white">
            {activePlayerError}
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-end gap-3 px-1">
        <span className="mr-auto text-xs text-muted-foreground">
          Nếu không xem được, hãy thử server gốc hoặc reload lại trang.
        </span>
        {activeEpisode.link_embed && (
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="gap-2"
            onClick={() => setUseEmbedPlayer((current) => !current)}
          >
            <Server className="h-4 w-4" />
            {useEmbedPlayer ? "Dùng HLS" : "Server gốc"}
          </Button>
        )}
      </div>
    </div >
  );
}
