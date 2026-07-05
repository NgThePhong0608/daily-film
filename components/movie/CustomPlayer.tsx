"use client";

import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Maximize, Minimize, SkipBack, SkipForward } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
  const [mounted, setMounted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeEpisode, setActiveEpisode] = useState<ServerData>(() => ({
    name: props.episodeName,
    slug: props.episodeSlug,
    filename: "",
    link_embed: props.embedUrl,
    link_m3u8: props.hlsUrl ?? "",
  }));

  const { saveHistory } = useWatchHistory();
  const episodes = useMemo(
    () => props.episodes?.length ? props.episodes : [activeEpisode],
    [activeEpisode, props.episodes]
  );
  const activeEpisodeIndex = episodes.findIndex((episode) => episode.slug === activeEpisode.slug);
  const previousEpisode = activeEpisodeIndex > 0 ? episodes[activeEpisodeIndex - 1] : undefined;
  const nextEpisode = activeEpisodeIndex >= 0 && activeEpisodeIndex + 1 < episodes.length
    ? episodes[activeEpisodeIndex + 1]
    : undefined;

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
  }, [props.embedUrl, props.episodeName, props.episodeSlug, props.episodes, props.hlsUrl]);

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", onFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", onFullscreenChange);
    };
  }, []);

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
    if (!isFullscreen && activeEpisode.slug !== props.episodeSlug) {
      router.replace(`/xem-phim/${movieSlug}/${activeEpisode.slug}`);
    }
  }, [activeEpisode.slug, isFullscreen, movieSlug, props.episodeSlug, router]);

  const navigateToEpisode = useCallback((episode: ServerData | undefined) => {
    if (!episode) return;

    const nextUrl = `/xem-phim/${movieSlug}/${episode.slug}`;

    if (isFullscreen) {
      setActiveEpisode(episode);
      window.history.pushState(null, "", nextUrl);
      document.title = `Xem phim ${props.movieTitle} - Tập ${episode.name}`;
      return;
    }

    router.push(nextUrl);
  }, [isFullscreen, movieSlug, props.movieTitle, router]);

  const handlePrevious = useCallback(() => {
    navigateToEpisode(previousEpisode);
  }, [navigateToEpisode, previousEpisode]);

  const handleNext = useCallback(() => {
    navigateToEpisode(nextEpisode);
  }, [navigateToEpisode, nextEpisode]);

  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message} (${err.name})`);
      });
    } else {
      document.exitFullscreen();
    }
  }, []);

  if (!mounted) {
    return <div className="aspect-video w-full bg-black rounded-lg animate-pulse" />;
  }

  return (
    <div className="space-y-4">
      <div
        ref={containerRef}
        className={cn(
          "relative w-full bg-black shadow-lg group overflow-hidden",
          isFullscreen ? "h-screen w-screen rounded-none" : "aspect-video rounded-lg"
        )}
      >
        <iframe
          src={activeEpisode.link_embed}
          className="absolute inset-0 z-0 h-full w-full border-0"
          title={`Xem phim ${movieSlug}`}
        />

        {/* Episode controls */}
        <div className={cn(
          "absolute bottom-[5px] right-28 z-[2147483647] flex gap-1 md:right-40"
        )}>
          {previousEpisode && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={handlePrevious}
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 p-0 bg-black/80 text-white hover:bg-white/20 hover:text-white"
                >
                  <SkipBack className="h-3.5 w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Tập trước</p>
              </TooltipContent>
            </Tooltip>
          )}
          {nextEpisode && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={handleNext}
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 p-0 bg-black/80 text-white hover:bg-white/20 hover:text-white"
                >
                  <SkipForward className="h-3.5 w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Tập tiếp theo</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>

        <div className="absolute bottom-[5px] right-3 z-[2147483647] hidden h-10 w-10 items-center justify-center bg-black/80 md:flex">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={toggleFullscreen}
                variant="ghost"
                size="icon"
                className="h-8 w-8 p-0 text-white hover:bg-white/20 hover:text-white"
              >
                {isFullscreen ? <Minimize className="h-3.5 w-3.5" /> : <Maximize className="h-3.5 w-3.5" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{isFullscreen ? "Thoát toàn màn hình" : "Toàn màn hình"}</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>

      {/* Controls Bar Below Video (Hidden in fullscreen via CSS or just naturally hidden if container is FS) */}
      {/* Controls Bar Below Video */}
      <div className={cn("flex items-center justify-end gap-3 px-1", isFullscreen && "hidden")}>
        <span className="text-xs text-muted-foreground mr-auto">
          Nếu không xem được, hãy thử đổi Server khác hoặc reload lại trang.
        </span>
      </div>
    </div >
  );
}
