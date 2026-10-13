import assert from "node:assert/strict";
import test from "node:test";
import { WELCOME_BANNER_SLIDES, POPULAR_HIGHLIGHTS_DATA } from "@/app/data/lobbyMockData";
import { LOBBY_ANNOUNCEMENT_MESSAGES } from "@/app/data/lobbyAnnouncementMockData";
import { HALL_OF_FAME_DATA } from "@/app/data/hallOfFameMockData";
import {
  fetchHallOfFame,
  fetchHomeBanners,
  fetchHomeHighlights,
  fetchLobbyAnnouncements,
  loadLobbyContent,
} from "./lobby";

test("lobby readers resolve the current mocks", async () => {
  const banners = await fetchHomeBanners();
  assert.ok(banners.ok && banners.data.welcomeSlides === WELCOME_BANNER_SLIDES);
  const highlights = await fetchHomeHighlights();
  assert.ok(highlights.ok && highlights.data.highlights === POPULAR_HIGHLIGHTS_DATA);
  const announcements = await fetchLobbyAnnouncements();
  assert.ok(announcements.ok && announcements.data === LOBBY_ANNOUNCEMENT_MESSAGES);
  const hof = await fetchHallOfFame();
  assert.ok(hof.ok && hof.data === HALL_OF_FAME_DATA);
});

test("loadLobbyContent bundles every lobby section", async () => {
  const content = await loadLobbyContent();
  assert.equal(content.banners.welcomeSlides, WELCOME_BANNER_SLIDES);
  assert.equal(content.announcements, LOBBY_ANNOUNCEMENT_MESSAGES);
  assert.equal(content.hallOfFame, HALL_OF_FAME_DATA);
  assert.ok(content.games.sections.length > 0);
});
