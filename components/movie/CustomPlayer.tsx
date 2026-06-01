"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { SkipForward, Maximize, Minimize } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { logMovieEvent } from "@/app/actions/analytics";
import { useWatchHistory } from "@/hooks/use-watch-history";

interface CustomPlayerProps {
  hlsUrl?: string; // Kept for compatibility but unused
  embedUrl: string;
  movieSlug: string;
  movieTitle: string;
  posterUrl: string;
  episodeSlug: string;
  episodeName: string;
  nextEpisodeSlug?: string;
  initialTime?: number; // Kept for compatibility but unused
}

export default function CustomPlayer(props: CustomPlayerProps) {
  const {
    embedUrl,
    movieSlug,
    nextEpisodeSlug,
  } = props;
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>(null);

  const { saveHistory } = useWatchHistory();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const handleInteraction = useCallback(() => {
    if (!isFullscreen) return;

    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }

    // Auto-hide after 3s
    controlsTimeoutRef.current = setTimeout(() => {
      setShowControls(false);
    }, 3000);
  }, [isFullscreen]);

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
      episodeSlug: props.episodeSlug,
      episodeName: props.episodeName,
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
  }, [movieSlug, props.movieTitle, props.posterUrl, props.episodeSlug, props.episodeName, saveHistory]);

  // Reset interaction timer when entering fullscreen
  useEffect(() => {
    if (isFullscreen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      handleInteraction();
    } else {
      setShowControls(true);
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    }
  }, [isFullscreen, handleInteraction]);

  const handleNext = () => {
    if (nextEpisodeSlug) {
      router.push(`/xem-phim/${movieSlug}/${nextEpisodeSlug}`);
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message} (${err.name})`);
      });
    } else {
      document.exitFullscreen();
    }
  };

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
        onMouseMove={handleInteraction}
        onClick={handleInteraction}
      >
        <iframe
          src={embedUrl}
          className="absolute inset-0 h-full w-full border-0"
          allowFullScreen
          title={`Xem phim ${movieSlug}`}
        />

        {/* Overlays - Bottom Right */}
        <div className={cn(
          "absolute bottom-0 right-28 md:bottom-1 md:right-40 transition-opacity duration-300 opacity-100"
        )}>
          {nextEpisodeSlug && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button onClick={handleNext} variant="ghost" size="icon">
                  <SkipForward className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Tập tiếp theo</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </div>

      {/* Controls Bar Below Video (Hidden in fullscreen via CSS or just naturally hidden if container is FS) */}
      {/* Controls Bar Below Video */}
      <div className={cn("flex items-center justify-end px-1", isFullscreen && "hidden")}>
        <span className="text-xs text-muted-foreground mr-auto">
          Nếu không xem được, hãy thử đổi Server khác hoặc reload lại trang.
        </span>
      </div>
    </div >
  );
}
