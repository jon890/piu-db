import { ChartType, PiuVersion, SongType } from "@prisma/client";

export type SongData = {
  name: string;
  artist: string;
  bpm: string;
  version: PiuVersion;
  songType: SongType;
  charts: { level: number; chartType: ChartType }[];
};

export const FIRST_ZERO_SONGS: SongData[] = [
  {
    // 1
    name: "디그니티 - FULL SONG",
    artist: "크래쉬",
    bpm: "195",
    version: "FIRST_ZERO",
    songType: "FULL_SONG",
    charts: [
      { level: 15, chartType: "SINGLE" },
      { level: 19, chartType: "SINGLE" },
      { level: 18, chartType: "DOUBLE" },
      { level: 22, chartType: "DOUBLE" },
    ],
  },

  {
    // 2
    name: "디그니티",
    artist: "크래쉬",
    bpm: "195",
    version: "FIRST_ZERO",
    songType: "ARCADE",
    charts: [
      { level: 4, chartType: "SINGLE" },
      { level: 6, chartType: "SINGLE" },
      { level: 15, chartType: "SINGLE" },
      { level: 17, chartType: "SINGLE" },
      { level: 21, chartType: "SINGLE" },
      { level: 22, chartType: "SINGLE" },
      { level: 17, chartType: "DOUBLE" },
      { level: 20, chartType: "DOUBLE" },
      { level: 24, chartType: "DOUBLE" },
      { level: 26, chartType: "DOUBLE" },
    ],
  },

  {
    // 3
    name: "슬램",
    artist: "노바소닉",
    bpm: "131.99",
    version: "FIRST_ZERO",
    songType: "ARCADE",
    charts: [
      { level: 5, chartType: "SINGLE" },
      { level: 7, chartType: "SINGLE" },
      { level: 9, chartType: "SINGLE" },
      { level: 18, chartType: "SINGLE" },
      { level: 15, chartType: "DOUBLE" },
      { level: 20, chartType: "SINGLE" },
      { level: 9, chartType: "DOUBLE" },
      { level: 22, chartType: "DOUBLE" },
      { level: 24, chartType: "DOUBLE" },
    ],
  },

  {
    // 4
    name: "또다른 진심",
    artist: "노바소닉",
    bpm: "136",
    version: "FIRST_ZERO",
    songType: "ARCADE",
    charts: [
      { level: 4, chartType: "SINGLE" },
      { level: 6, chartType: "SINGLE" },
      { level: 8, chartType: "SINGLE" },
      { level: 16, chartType: "SINGLE" },
      { level: 9, chartType: "DOUBLE" },
      { level: 18, chartType: "DOUBLE" },
      { level: 19, chartType: "DOUBLE" },
      { level: 21, chartType: "DOUBLE" },
      { level: 50, chartType: "CO_OP" },
    ],
  },

  {
    // 5
    name: "비트 오브 더 워 2",
    artist: "반야",
    bpm: "120-190",
    version: "FIRST_ZERO",
    songType: "ARCADE",
    charts: [
      { level: 4, chartType: "SINGLE" },
      { level: 5, chartType: "SINGLE" },
      { level: 7, chartType: "SINGLE" },
      { level: 11, chartType: "SINGLE" },
      { level: 17, chartType: "SINGLE" },
      { level: 21, chartType: "SINGLE" },
      { level: 15, chartType: "DOUBLE" },
      { level: 20, chartType: "DOUBLE" },
    ],
  },

  {
    // 6
    name: "월광",
    artist: "반야",
    bpm: "180",
    version: "FIRST_ZERO",
    songType: "ARCADE",
    charts: [
      { level: 4, chartType: "SINGLE" },
      { level: 8, chartType: "SINGLE" },
      { level: 11, chartType: "SINGLE" },
      { level: 18, chartType: "SINGLE" },
      { level: 19, chartType: "SINGLE" },
      { level: 12, chartType: "DOUBLE" },
      { level: 20, chartType: "DOUBLE" },
      { level: 21, chartType: "DOUBLE" },
    ],
  },

  {
    // 7
    name: "위치닥터",
    artist: "반야",
    bpm: "195",
    version: "FIRST_ZERO",
    songType: "ARCADE",
    charts: [
      { level: 4, chartType: "SINGLE" },
      { level: 6, chartType: "SINGLE" },
      { level: 11, chartType: "SINGLE" },
      { level: 17, chartType: "SINGLE" },
      { level: 19, chartType: "SINGLE" },
      { level: 21, chartType: "SINGLE" },
      { level: 19, chartType: "DOUBLE" },
      { level: 22, chartType: "DOUBLE" },
      { level: 23, chartType: "DOUBLE" },
    ],
  },

  {
    // 8
    name: "러브 이즈 어 데인저 존 pt.2",
    artist: "반야",
    bpm: "162",
    version: "FIRST_ZERO",
    songType: "ARCADE",
    charts: [
      { level: 4, chartType: "SINGLE" },
      { level: 7, chartType: "SINGLE" },
      { level: 11, chartType: "SINGLE" },
      { level: 15, chartType: "SINGLE" },
      { level: 22, chartType: "SINGLE" },
      { level: 18, chartType: "DOUBLE" },
      { level: 24, chartType: "DOUBLE" },
    ],
  },

  {
    // 9
    name: "팬텀",
    artist: "반야",
    bpm: "136",
    version: "FIRST_ZERO",
    songType: "ARCADE",
    charts: [
      { level: 2, chartType: "SINGLE" },
      { level: 7, chartType: "SINGLE" },
      { level: 13, chartType: "SINGLE" },
      { level: 18, chartType: "SINGLE" },
      { level: 19, chartType: "SINGLE" },
      { level: 15, chartType: "DOUBLE" },
      { level: 19, chartType: "DOUBLE" },
      { level: 21, chartType: "DOUBLE" },
    ],
  },

  {
    // 10
    name: "파파 곤잘레스",
    artist: "반야",
    bpm: "145",
    version: "FIRST_ZERO",
    songType: "ARCADE",
    charts: [
      { level: 4, chartType: "SINGLE" },
      { level: 6, chartType: "SINGLE" },
      { level: 8, chartType: "SINGLE" },
      { level: 16, chartType: "SINGLE" },
      { level: 22, chartType: "SINGLE" },
      { level: 19, chartType: "DOUBLE" },
      { level: 24, chartType: "DOUBLE" },
    ],
  },

  {
    // 11
    name: "점프",
    artist: "반야",
    bpm: "96",
    version: "FIRST_ZERO",
    songType: "ARCADE",
    charts: [
      { level: 4, chartType: "SINGLE" },
      { level: 7, chartType: "SINGLE" },
      { level: 12, chartType: "SINGLE" },
      { level: 16, chartType: "SINGLE" },
      { level: 18, chartType: "DOUBLE" },
    ],
  },

  {
    // 12
    name: "러브 이즈 어 데인저 존 2 (try to B.P.M.)",
    artist: "반야",
    bpm: "140-169",
    version: "FIRST_ZERO",
    songType: "REMIX",
    charts: [
      { level: 16, chartType: "SINGLE" },
      { level: 21, chartType: "SINGLE" },
      { level: 17, chartType: "DOUBLE" },
      { level: 23, chartType: "DOUBLE" },
    ],
  },

  {
    // 13
    name: "러브 이즈 어 데인저 존 pt.2 어나더",
    artist: "반야",
    bpm: "162",
    version: "FIRST_ZERO",
    songType: "ARCADE",
    charts: [
      { level: 17, chartType: "SINGLE" },
      { level: 19, chartType: "SINGLE" },
      { level: 50, chartType: "CO_OP" },
    ],
  },

  {
    // 14
    name: "제이 봉",
    artist: "반야",
    bpm: "140",
    version: "FIRST_ZERO",
    songType: "ARCADE",
    charts: [
      { level: 3, chartType: "SINGLE" },
      { level: 5, chartType: "SINGLE" },
      { level: 7, chartType: "SINGLE" },
      { level: 8, chartType: "SINGLE" },
      { level: 15, chartType: "SINGLE" },
      { level: 17, chartType: "DOUBLE" },
    ],
  },

  {
    // 15
    name: "하이 바이",
    artist: "반야",
    bpm: "145",
    version: "FIRST_ZERO",
    songType: "ARCADE",
    charts: [
      { level: 5, chartType: "SINGLE" },
      { level: 8, chartType: "SINGLE" },
      { level: 16, chartType: "SINGLE" },
      { level: 19, chartType: "SINGLE" },
      { level: 11, chartType: "DOUBLE" },
      { level: 20, chartType: "DOUBLE" },
      { level: 21, chartType: "DOUBLE" },
    ],
  },

  {
    // 16
    name: "무혼",
    artist: "반야",
    bpm: "136",
    version: "FIRST_ZERO",
    songType: "ARCADE",
    charts: [
      { level: 4, chartType: "SINGLE" },
      { level: 8, chartType: "SINGLE" },
      { level: 9, chartType: "SINGLE" },
      { level: 18, chartType: "SINGLE" },
      { level: 20, chartType: "DOUBLE" },
      { level: 21, chartType: "DOUBLE" },
    ],
  },

  {
    // 17
    name: "캐논 디",
    artist: "반야",
    bpm: "160",
    version: "FIRST_ZERO",
    songType: "ARCADE",
    charts: [
      { level: 3, chartType: "SINGLE" },
      { level: 7, chartType: "SINGLE" },
      { level: 11, chartType: "SINGLE" },
      { level: 17, chartType: "SINGLE" },
      { level: 20, chartType: "SINGLE" },
      { level: 21, chartType: "SINGLE" },
      { level: 12, chartType: "DOUBLE" },
      { level: 17, chartType: "DOUBLE" },
      { level: 23, chartType: "DOUBLE" },
      { level: 50, chartType: "CO_OP" },
    ],
  },

  {
    // 18
    name: "트림 북 오브 더 워",
    artist: "반야",
    bpm: "184-202",
    version: "FIRST_ZERO",
    songType: "REMIX",
    charts: [
      { level: 14, chartType: "SINGLE" },
      { level: 19, chartType: "SINGLE" },
      { level: 17, chartType: "DOUBLE" },
      { level: 22, chartType: "DOUBLE" },
    ],
  },

  {
    // 19
    name: "반야 클래식 리믹스",
    artist: "반야",
    bpm: "162-170",
    version: "FIRST_ZERO",
    songType: "REMIX",
    charts: [
      { level: 13, chartType: "SINGLE" },
      { level: 19, chartType: "SINGLE" },
      { level: 15, chartType: "DOUBLE" },
      { level: 21, chartType: "DOUBLE" },
    ],
  },

  {
    // 20
    name: "반야 힙합 리믹스",
    artist: "반야",
    bpm: "99",
    version: "FIRST_ZERO",
    songType: "REMIX",
    charts: [
      { level: 6, chartType: "SINGLE" },
      { level: 8, chartType: "SINGLE" },
      { level: 21, chartType: "DOUBLE" },
    ],
  },

  {
    // 21
    name: "캐논디 - FULL SONG",
    artist: "반야",
    bpm: "160",
    version: "FIRST_ZERO",
    songType: "FULL_SONG",
    charts: [
      { level: 15, chartType: "SINGLE" },
      { level: 17, chartType: "SINGLE" },
      { level: 23, chartType: "DOUBLE" },
      { level: 24, chartType: "DOUBLE" },
    ],
  },

  {
    // 22
    name: "파이놀 오디션 3",
    artist: "반야",
    bpm: "130.5",
    version: "FIRST_ZERO",
    songType: "ARCADE",
    charts: [
      { level: 2, chartType: "SINGLE" },
      { level: 5, chartType: "SINGLE" },
      { level: 8, chartType: "SINGLE" },
      { level: 9, chartType: "SINGLE" },
      { level: 16, chartType: "SINGLE" },
      { level: 17, chartType: "SINGLE" },
      { level: 18, chartType: "DOUBLE" },
      { level: 19, chartType: "DOUBLE" },
    ],
  },

  {
    // 23
    name: "태동",
    artist: "반야",
    bpm: "129",
    version: "FIRST_ZERO",
    songType: "ARCADE",
    charts: [
      { level: 9, chartType: "SINGLE" },
      { level: 15, chartType: "SINGLE" },
      { level: 26, chartType: "DOUBLE" },
      { level: 20, chartType: "DOUBLE" },
    ],
  },

  {
    // 24
    name: "몽키 핑거즈",
    artist: "반야",
    bpm: "186",
    version: "FIRST_ZERO",
    songType: "ARCADE",
    charts: [
      { level: 4, chartType: "SINGLE" },
      { level: 6, chartType: "SINGLE" },
      { level: 10, chartType: "SINGLE" },
      { level: 15, chartType: "SINGLE" },
      { level: 17, chartType: "DOUBLE" },
    ],
  },

  {
    // 25
    name: "블레이징",
    artist: "반야",
    bpm: "158",
    version: "FIRST_ZERO",
    songType: "ARCADE",
    charts: [
      { level: 4, chartType: "SINGLE" },
      { level: 7, chartType: "SINGLE" },
      { level: 9, chartType: "SINGLE" },
      { level: 17, chartType: "SINGLE" },
      { level: 20, chartType: "SINGLE" },
      { level: 21, chartType: "DOUBLE" },
    ],
  },

  {
    // 26
    name: "펌프 미 아마데우스",
    artist: "반야",
    bpm: "170",
    version: "FIRST_ZERO",
    songType: "ARCADE",
    charts: [
      { level: 3, chartType: "SINGLE" },
      { level: 6, chartType: "SINGLE" },
      { level: 13, chartType: "SINGLE" },
      { level: 18, chartType: "SINGLE" },
      { level: 15, chartType: "DOUBLE" },
      { level: 19, chartType: "DOUBLE" },
      { level: 21, chartType: "DOUBLE" },
      { level: 24, chartType: "DOUBLE" },
    ],
  },

  {
    // 27
    name: "엑스트림",
    artist: "반야",
    bpm: "162",
    version: "FIRST_ZERO",
    songType: "ARCADE",
    charts: [
      { level: 5, chartType: "SINGLE" },
      { level: 8, chartType: "SINGLE" },
      { level: 12, chartType: "SINGLE" },
      { level: 15, chartType: "SINGLE" },
      { level: 18, chartType: "SINGLE" },
      { level: 15, chartType: "DOUBLE" },
      { level: 20, chartType: "DOUBLE" },
    ],
  },

  {
    // 28
    name: "겟 업!",
    artist: "반야",
    bpm: "180",
    version: "FIRST_ZERO",
    songType: "ARCADE",
    charts: [
      { level: 5, chartType: "SINGLE" },
      { level: 10, chartType: "SINGLE" },
      { level: 15, chartType: "SINGLE" },
      { level: 21, chartType: "SINGLE" },
      { level: 15, chartType: "DOUBLE" },
      { level: 19, chartType: "DOUBLE" },
      { level: 23, chartType: "DOUBLE" },
    ],
  },

  {
    // 29
    name: "비",
    artist: "반야",
    bpm: "160",
    version: "FIRST_ZERO",
    songType: "ARCADE",
    charts: [
      { level: 7, chartType: "SINGLE" },
      { level: 10, chartType: "SINGLE" },
      { level: 12, chartType: "SINGLE" },
      { level: 17, chartType: "SINGLE" },
      { level: 19, chartType: "SINGLE" },
      { level: 15, chartType: "DOUBLE" },
      { level: 20, chartType: "DOUBLE" },
      { level: 23, chartType: "DOUBLE" },
      { level: 24, chartType: "DOUBLE" },
    ],
  },

  {
    // 30
    name: "디갱",
    artist: "반야",
    bpm: "150",
    version: "FIRST_ZERO",
    songType: "ARCADE",
    charts: [
      { level: 5, chartType: "SINGLE" },
      { level: 6, chartType: "SINGLE" },
      { level: 11, chartType: "SINGLE" },
      { level: 18, chartType: "SINGLE" },
      { level: 9, chartType: "DOUBLE" },
      { level: 15, chartType: "DOUBLE" },
      { level: 18, chartType: "DOUBLE" },
    ],
  },

  {
    // 31
    name: "헬로우",
    artist: "반야",
    bpm: "140",
    version: "FIRST_ZERO",
    songType: "ARCADE",
    charts: [
      { level: 11, chartType: "SINGLE" },
      { level: 17, chartType: "SINGLE" },
      { level: 18, chartType: "DOUBLE" },
    ],
  },

  {
    // 32
    name: "비트 오브 더 워",
    artist: "반야",
    bpm: "140-202",
    version: "FIRST_ZERO",
    songType: "ARCADE",
    charts: [
      { level: 3, chartType: "SINGLE" },
      { level: 6, chartType: "SINGLE" },
      { level: 9, chartType: "SINGLE" },
      { level: 16, chartType: "SINGLE" },
      { level: 18, chartType: "SINGLE" },
      { level: 21, chartType: "SINGLE" },
      { level: 20, chartType: "DOUBLE" },
      { level: 24, chartType: "DOUBLE" },
    ],
  },

  {
    // 33
    name: "컴 투 미",
    artist: "반야",
    bpm: "100-107",
    version: "FIRST_ZERO",
    songType: "ARCADE",
    charts: [
      { level: 4, chartType: "SINGLE" },
      { level: 6, chartType: "SINGLE" },
      { level: 11, chartType: "SINGLE" },
      { level: 13, chartType: "SINGLE" },
      { level: 17, chartType: "SINGLE" },
      { level: 14, chartType: "DOUBLE" },
      { level: 15, chartType: "DOUBLE" },
    ],
  },

  {
    // 34
    name: "닥터 엠",
    artist: "반야",
    bpm: "145",
    version: "FIRST_ZERO",
    songType: "ARCADE",
    charts: [
      { level: 3, chartType: "SINGLE" },
      { level: 6, chartType: "SINGLE" },
      { level: 9, chartType: "SINGLE" },
      { level: 10, chartType: "SINGLE" },
      { level: 14, chartType: "SINGLE" },
      { level: 16, chartType: "SINGLE" },
      { level: 14, chartType: "DOUBLE" },
      { level: 18, chartType: "DOUBLE" },
    ],
  },

  {
    // 35
    name: "엠페러",
    artist: "반야",
    bpm: "150",
    version: "FIRST_ZERO",
    songType: "ARCADE",
    charts: [
      { level: 2, chartType: "SINGLE" },
      { level: 8, chartType: "SINGLE" },
      { level: 12, chartType: "SINGLE" },
      { level: 16, chartType: "SINGLE" },
      { level: 17, chartType: "DOUBLE" },
      { level: 50, chartType: "CO_OP" },
    ],
  },

  {
    // 36
    name: "겟 유어 그르부 온",
    artist: "반야",
    bpm: "96",
    version: "FIRST_ZERO",
    songType: "ARCADE",
    charts: [
      { level: 4, chartType: "SINGLE" },
      { level: 7, chartType: "SINGLE" },
      { level: 12, chartType: "SINGLE" },
      { level: 10, chartType: "DOUBLE" },
      { level: 22, chartType: "DOUBLE" },
    ],
  },

  {
    // 37
    name: "러브 이즈 어 데인저 존",
    artist: "반야",
    bpm: "140",
    version: "FIRST_ZERO",
    songType: "ARCADE",
    charts: [
      { level: 4, chartType: "SINGLE" },
      { level: 8, chartType: "SINGLE" },
      { level: 11, chartType: "SINGLE" },
      { level: 17, chartType: "SINGLE" },
      { level: 19, chartType: "SINGLE" },
      { level: 11, chartType: "DOUBLE" },
      { level: 17, chartType: "DOUBLE" },
      { level: 21, chartType: "DOUBLE" },
      { level: 50, chartType: "CO_OP" },
    ],
  },

  {
    // 38
    name: "마리아",
    artist: "반야",
    bpm: "136",
    version: "FIRST_ZERO",
    songType: "ARCADE",
    charts: [
      { level: 7, chartType: "SINGLE" },
      { level: 12, chartType: "SINGLE" },
      { level: 16, chartType: "SINGLE" },
      { level: 18, chartType: "SINGLE" },
      { level: 16, chartType: "DOUBLE" },
      { level: 21, chartType: "DOUBLE" },
    ],
  },

  {
    // 39
    name: "미션 파서블",
    artist: "반야",
    bpm: "124",
    version: "FIRST_ZERO",
    songType: "ARCADE",
    charts: [
      { level: 5, chartType: "SINGLE" },
      { level: 7, chartType: "SINGLE" },
      { level: 19, chartType: "SINGLE" },
    ],
  },

  {
    // 40
    name: "마이 웨이",
    artist: "반야",
    bpm: "118",
    version: "FIRST_ZERO",
    songType: "ARCADE",
    charts: [
      { level: 4, chartType: "SINGLE" },
      { level: 6, chartType: "SINGLE" },
      { level: 6, chartType: "SINGLE" },
      { level: 8, chartType: "SINGLE" },
      { level: 15, chartType: "SINGLE" },
      { level: 16, chartType: "DOUBLE" },
      { level: 18, chartType: "DOUBLE" },
    ],
  },
];
