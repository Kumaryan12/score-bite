import type { Database } from "../types/db";

type MatchInsert = Database["public"]["Tables"]["matches"]["Insert"];

const groupPages = Array.from({ length: 12 }, (_, index) => {
  const group = String.fromCharCode("A".charCodeAt(0) + index);
  return {
    groupName: `Group ${group}`,
    stage: "Group Stage",
    url: `https://en.wikipedia.org/wiki/2026_FIFA_World_Cup_Group_${group}`
  };
});

const knockoutPage = {
  groupName: null,
  stage: "Knockout Stage",
  url: "https://en.wikipedia.org/wiki/2026_FIFA_World_Cup_knockout_stage"
};

const groupMatchNumbers: Record<string, number[]> = {
  "Group A": [1, 2, 25, 28, 53, 54],
  "Group B": [3, 8, 26, 27, 51, 52],
  "Group C": [7, 5, 30, 29, 49, 50],
  "Group D": [4, 6, 32, 31, 59, 60],
  "Group E": [10, 9, 33, 34, 55, 56],
  "Group F": [11, 12, 35, 36, 57, 58],
  "Group G": [16, 15, 39, 40, 63, 64],
  "Group H": [14, 13, 38, 37, 65, 66],
  "Group I": [17, 18, 42, 41, 61, 62],
  "Group J": [19, 20, 43, 44, 69, 70],
  "Group K": [23, 24, 47, 48, 71, 72],
  "Group L": [22, 21, 45, 46, 67, 68]
};

function decodeHtml(value: string) {
  return value
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCharCode(parseInt(code, 16)))
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, "\"")
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function textFromHtml(value = "") {
  return decodeHtml(value)
    .replace(/<style[\s\S]*?<\/style>/g, "")
    .replace(/<script[\s\S]*?<\/script>/g, "")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function extract(pattern: RegExp, value: string) {
  return value.match(pattern)?.[1] ?? "";
}

function fallbackOffsetForVenue(venue: string) {
  if (/Vancouver|Seattle|Santa Clara|Inglewood|Los Angeles|San Francisco/i.test(venue)) {
    return -7;
  }

  if (/Mexico City|Guadalajara|Zapopan|Guadalupe|Monterrey/i.test(venue)) {
    return -6;
  }

  if (/Houston|Arlington|Dallas|Kansas City/i.test(venue)) {
    return -5;
  }

  if (/Toronto|Atlanta|Miami|Philadelphia|East Rutherford|Foxborough|Boston/i.test(venue)) {
    return -4;
  }

  return null;
}

function parseKickoff(date: string, timeHtml: string, venue: string) {
  const time = textFromHtml(timeHtml);
  const timeMatch = time.match(/(\d{1,2}):(\d{2})\s*([ap])\.m\./i);
  const offsetMatch = time.match(/UTC\s*([+−-])\s*(\d{1,2})(?::?(\d{2}))?/i);

  if (!timeMatch) {
    throw new Error(`Could not parse kickoff time: ${date} ${time}`);
  }

  let hour = Number(timeMatch[1]);
  const minute = Number(timeMatch[2]);
  const period = timeMatch[3].toLowerCase();

  if (period === "p" && hour !== 12) {
    hour += 12;
  }

  if (period === "a" && hour === 12) {
    hour = 0;
  }

  const fallbackOffset = fallbackOffsetForVenue(venue);

  if (!offsetMatch && fallbackOffset === null) {
    throw new Error(`Could not parse kickoff timezone: ${date} ${time} ${venue}`);
  }

  const offsetSign = offsetMatch ? (offsetMatch[1] === "+" ? 1 : -1) : Math.sign(fallbackOffset!);
  const offsetHours = offsetMatch ? Number(offsetMatch[2]) : Math.abs(fallbackOffset!);
  const offsetMinutes = offsetMatch ? Number(offsetMatch[3] ?? 0) : 0;
  const offsetMs = offsetSign * ((offsetHours * 60 + offsetMinutes) * 60_000);
  const [year, month, day] = date.split("-").map(Number);
  const utcMs = Date.UTC(year, month - 1, day, hour, minute) - offsetMs;

  return new Date(utcMs).toISOString();
}

function stageFromMatchNumber(matchNumber: number | null, fallbackStage: string) {
  if (!matchNumber || matchNumber <= 72) {
    return fallbackStage;
  }

  if (matchNumber <= 88) {
    return "Round of 32";
  }

  if (matchNumber <= 96) {
    return "Round of 16";
  }

  if (matchNumber <= 100) {
    return "Quarterfinal";
  }

  if (matchNumber <= 102) {
    return "Semifinal";
  }

  if (matchNumber === 103) {
    return "Third-place Match";
  }

  return "Final";
}

function parseBoxes(html: string, page: { groupName: string | null; stage: string }) {
  const boxes = [
    ...html.matchAll(
      /<div itemscope="" itemtype="http&#58;\/\/schema\.org\/SportsEvent" class="footballbox"[\s\S]*?(?=<div itemscope="" itemtype="http&#58;\/\/schema\.org\/SportsEvent" class="footballbox"|<div class="mw-heading mw-heading2"|<h2|$)/g
    )
  ].map((match) => match[0]);

  return boxes.map<MatchInsert>((box, index) => {
    const date = extract(/<span class="bday[^"]*">(\d{4}-\d{2}-\d{2})<\/span>/, box);
    const timeHtml = extract(/<div class="ftime">([\s\S]*?)<\/div>/, box);
    const homeHtml = extract(/<th class="fhome"[\s\S]*?>([\s\S]*?)<\/th>/, box);
    const awayHtml = extract(/<th class="faway"[\s\S]*?>([\s\S]*?)<\/th>/, box);
    const scoreText = textFromHtml(extract(/<th class="fscore">([\s\S]*?)<\/th>/, box));
    const venue = textFromHtml(extract(/<span itemprop="name address">([\s\S]*?)<\/span>/, box));
    const scoreMatch = scoreText.match(/^(\d+)[–-](\d+)/);
    const matchNumber =
      Number(scoreText.match(/Match\s+(\d+)/)?.[1] ?? 0) ||
      (page.groupName ? groupMatchNumbers[page.groupName]?.[index] : null) ||
      null;

    return {
      match_number: matchNumber,
      tournament: "FIFA World Cup 2026",
      stage: stageFromMatchNumber(matchNumber, page.stage),
      group_name: page.groupName,
      team_a: textFromHtml(homeHtml) || `${page.stage} Team ${index + 1}A`,
      team_b: textFromHtml(awayHtml) || `${page.stage} Team ${index + 1}B`,
      kickoff_time: parseKickoff(date, timeHtml, venue),
      venue,
      team_a_score: scoreMatch ? Number(scoreMatch[1]) : null,
      team_b_score: scoreMatch ? Number(scoreMatch[2]) : null,
      status: scoreMatch ? "completed" : "scheduled"
    };
  });
}

export async function fetchWorldCup2026Matches() {
  const pages = [...groupPages, knockoutPage];
  const results = await Promise.all(
    pages.map(async (page) => {
      const response = await fetch(page.url, {
        headers: {
          "user-agent": "ScoreBite schedule importer"
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch ${page.url}: ${response.status}`);
      }

      return parseBoxes(await response.text(), page);
    })
  );

  const matches = results.flat().sort((a, b) => {
    return new Date(a.kickoff_time).getTime() - new Date(b.kickoff_time).getTime();
  });

  if (matches.length !== 104) {
    throw new Error(`Expected 104 World Cup matches, found ${matches.length}.`);
  }

  return matches;
}
