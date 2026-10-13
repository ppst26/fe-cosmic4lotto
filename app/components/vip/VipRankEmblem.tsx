"use client";

import React, { useEffect, useRef, useState } from "react";
import type { VipRankId } from "@/app/types/vip";
import { getVipRankStackedSrc, getVipRankTier, getVipRankVideoSrc } from "@/app/data/vipMockData";
import { StackedAlphaVideo, needsStackedAlpha } from "./StackedAlphaVideo";
import { Lock as LockIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * มือถือหลายตัวไม่ใช้ alpha ของ WebM — มุมเฟรมกลายเป็นดำทึบ
 * ถ้ามุมโปร่งอยู่แล้ว แปลว่าเบราว์เซอร์เก็บบางไว้ ไม่ต้อง blend
 */
function videoFrameLostAlpha(video: HTMLVideoElement): boolean | null {
  if (video.videoWidth === 0) return null;
  const size = 12;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return null;
  ctx.drawImage(video, 0, 0, size, size);
  const data = ctx.getImageData(0, 0, size, size).data;
  let transparent = 0;
  let opaqueBlack = 0;
  let subject = 0;
  for (let i = 0; i < data.length; i += 4) {
    const alpha = data[i + 3] ?? 0;
    const luma = (data[i] ?? 0) + (data[i + 1] ?? 0) + (data[i + 2] ?? 0);
    if (alpha < 20) transparent += 1;
    else if (luma < 28) opaqueBlack += 1;
    else subject += 1;
  }
  const total = size * size;
  if (transparent > total * 0.12) return false;
  if (opaqueBlack > total * 0.15 && subject > 0) return true;
  return null;
}

/**
 * ตราแรงค์ VIP — วิดีโอ webm จาก public/rank (fallback เป็น hex SVG)
 * ใช้ใน modal แท็บระดับของฉัน / แร็งค์ / ตารางสิทธิประโยชน์
 */
export function VipRankEmblem({
  rankId,
  size = "lg",
  inactive = false,
  /** false = หยุดที่เฟรมแรก (carousel ข้างๆ / ตารางสิทธิ) */
  playing = true,
}: {
  rankId: VipRankId;
  size?: "xs" | "sm" | "lg" | "xl";
  inactive?: boolean;
  playing?: boolean;
}) {
  const tier = getVipRankTier(rankId);
  const videoSrc = getVipRankVideoSrc(rankId);
  const videoRef = useRef<HTMLVideoElement>(null);
  const alphaSettledRef = useRef(false);
  const [preferStatic, setPreferStatic] = useState(false);
  /** true เมื่อมือถือทิ้ง alpha แล้วโชว์พื้นดำ — ใช้ screen blend เจาะดำ */
  const [knockOutBlack, setKnockOutBlack] = useState(false);
  /** Safari/iOS — ใช้ MP4 stacked-alpha + canvas แทน WebM */
  const [useStacked, setUseStacked] = useState(false);

  const dim =
    size === "xl"
      ? "h-32 w-32 sm:h-36 sm:w-36"
      : size === "lg"
        ? "h-[88px] w-[88px]"
        : size === "sm"
          ? "h-12 w-12"
          : "h-8 w-8";
  const gem =
    size === "xl"
      ? "h-10 w-10"
      : size === "lg"
        ? "h-7 w-7"
        : size === "sm"
          ? "h-4 w-4"
          : "h-3 w-3";
  const lockLg = size === "xl" || size === "lg";
  const gradId = React.useId().replace(/:/g, "");

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setPreferStatic(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    // ตรวจ UA ได้เฉพาะฝั่ง client
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUseStacked(needsStackedAlpha());
  }, []);

  /** วิดีโอใหม่ → ยกเลิกโหมดเจาะดำระหว่าง render · ref รีเซ็ตใน effect (ห้ามเขียน ref ตอน render) */
  const [prevVideoSrc, setPrevVideoSrc] = useState(videoSrc);
  if (prevVideoSrc !== videoSrc) {
    setPrevVideoSrc(videoSrc);
    setKnockOutBlack(false);
  }

  useEffect(() => {
    alphaSettledRef.current = false;
  }, [videoSrc]);

  useEffect(() => {
    const el = videoRef.current;
    if (!el || preferStatic || !videoSrc) return;
    const shouldPlay = playing && !inactive;
    if (shouldPlay) {
      el.play().catch(() => undefined);
    } else {
      el.pause();
    }
  }, [playing, inactive, preferStatic, videoSrc]);

  const inspectAlpha = () => {
    if (alphaSettledRef.current) return;
    const el = videoRef.current;
    if (!el) return;
    const lost = videoFrameLostAlpha(el);
    if (lost === null) return;
    alphaSettledRef.current = true;
    if (lost) setKnockOutBlack(true);
  };

  const stackedSrc = getVipRankStackedSrc(rankId);

  if (videoSrc && !preferStatic && useStacked && stackedSrc) {
    return (
      <div
        className={`relative flex ${dim} items-center justify-center ${
          inactive ? "opacity-45 grayscale-[0.85]" : ""
        } ${playing && !inactive ? "drop-shadow-[0_4px_16px_rgba(255,209,92,0.25)]" : ""}`}
        aria-hidden="true"
      >
        <StackedAlphaVideo
          src={stackedSrc}
          playing={playing && !inactive}
          className="h-full w-full object-contain"
        />
        {inactive && lockLg && (
          <span className="absolute inset-0 flex items-center justify-center">
            <LockIcon
              className={`text-[var(--text-muted)] ${size === "xl" ? "h-7 w-7" : "h-5 w-5"}`}
            />
          </span>
        )}
      </div>
    );
  }

  if (videoSrc && !preferStatic) {
    return (
      <div
        className={`relative flex ${dim} items-center justify-center ${
          inactive ? "opacity-45 grayscale-[0.85]" : ""
        } ${playing && !inactive ? "drop-shadow-[0_4px_16px_rgba(255,209,92,0.25)]" : ""}`}
        aria-hidden="true"
      >
        <video
          ref={videoRef}
          src={videoSrc}
          loop
          muted
          playsInline
          preload={playing && !inactive ? "auto" : "metadata"}
          onLoadedData={inspectAlpha}
          onTimeUpdate={inspectAlpha}
          className={cn(
            "h-full w-full bg-transparent object-contain",
            knockOutBlack && "mix-blend-screen",
          )}
        />
        {inactive && lockLg && (
          <span className="absolute inset-0 flex items-center justify-center">
            <LockIcon
              className={`text-[var(--text-muted)] ${size === "xl" ? "h-7 w-7" : "h-5 w-5"}`}
            />
          </span>
        )}
      </div>
    );
  }

  return (
    <div
      className={`relative flex ${dim} items-center justify-center ${
        inactive ? "opacity-45 grayscale-[0.85]" : ""
      }`}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 100 100"
        className={`absolute inset-0 h-full w-full ${
          inactive ? "" : "drop-shadow-[0_4px_16px_rgba(255,209,92,0.35)]"
        }`}
      >
        <polygon
          points="50,4 92,28 92,72 50,96 8,72 8,28"
          fill={`url(#${gradId})`}
          stroke={tier.accent}
          strokeWidth="2"
        />
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fff3c4" />
            <stop offset="50%" stopColor="#ffd15c" />
            <stop offset="100%" stopColor="#b8860b" />
          </linearGradient>
        </defs>
      </svg>
      <span
        className={`${gem} rounded-full bg-gradient-to-br from-amber-100 via-[#ffd15c] to-amber-600 ${
          inactive ? "shadow-none" : "shadow-[0_0_12px_rgba(255,209,92,0.6)]"
        }`}
      />
      {inactive && lockLg && (
        <span className="absolute inset-0 flex items-center justify-center">
          <LockIcon
            className={`text-[var(--text-muted)] ${size === "xl" ? "h-7 w-7" : "h-5 w-5"}`}
          />
        </span>
      )}
    </div>
  );
}
