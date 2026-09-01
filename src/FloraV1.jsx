import React, { useState, useEffect, useRef } from "react";
import {
  Home, BookOpen, ClipboardList, BarChart3, FolderHeart, Library,
  Files, Settings as Cog, MessageCircle, Mail, Sun, Play, Pause, RotateCcw, Check, Star,
  Upload, Link2, ChevronRight, ChevronLeft, ChevronDown, Leaf, Camera, Video, KeyRound,
  ShieldCheck, Download, Info, Sparkles, GripVertical, X, Plus, Minus, SkipForward, Menu,
  ClipboardPaste, Eye, EyeOff, Lock, FileText, Pencil, Heart, Smartphone, HardDrive, Trash2, Sticker, LayoutTemplate, CalendarDays, AlertCircle
} from "lucide-react";

/* ───────────────────────── palette ───────────────────────── */
const C = {
  ink: "#2f3a2c", soft: "#5c6b56", muted: "#8d9686",
  green: "#6b8259", deep: "#41512f", blush: "#d99878", gold: "#c9a76a",
  cream: "#fdfbf6", wash: "#f5f2e9", sand: "#efe6d5",
  card: "#ffffff", line: "#e4dfd1",
};
const serif = "'Cormorant Garamond', Georgia, serif";

/* muted, Flora-aligned subject shades — earth and garden, nothing neon */
const SUBJ_COLOR = {
  "Araling Panlipunan": "#b3985c", "Social Studies": "#b3985c", "Social Studies / Art": "#b3985c",
  "Character Education": "#7f9aa3", "Values Education": "#7f9aa3",
  "EPP / TLE": "#bb8168", "Physical Education & Health": "#bb8168",
  "Physical Education": "#b0876f",
  "Music": "#c79a6b", "Music & Arts": "#c79a6b",
  "Arts": "#a08aa0",
  "Mathematics": "#bd8b96", "Math": "#bd8b96",
  "Science": "#829c6a", "Science / Art": "#829c6a",
  "Filipino": "#8c8aab", "Filipino Literature": "#8c8aab", "Filipino Language": "#807fa2",
  "English": "#7d8aa8", "Language": "#8c8aab",
};
const subjColor = s => SUBJ_COLOR[s] || C.green;

/* CM practices — a quieter tonal set that sits inside the subject ring */
const PRAC_COLOR = {
  "Read aloud": "#8e83a6", "Read Aloud / Prayer": "#8e83a6",
  "Copywork": "#6f6f66", "Practice reading": "#a37065", "Memory work": "#71849a",
  "Mental math": "#7d7a72", "Manipulatives": "#b795a1", "Q and A": "#7d7a72",
  "Music appreciation": "#c2a077", "Chores": "#9d8a6f", "Picture study": "#8fa478",
  "Handicraft": "#7f9a7c", "Life skill": "#b0877a", "Project": "#9d8aa0",
  "Nature study": "#77926a", "Sing": "#bda06d", "Painting": "#9d8aa0",
};
const pracColor = p => PRAC_COLOR[p] || C.muted;

/* ── real data from Actual Activities Done ── */
const RD = {"total":399,"days":28,"subjects":[["Mathematics",83],["Filipino",60],["EPP / TLE",55],["Character Education",45],["Music",44],["Araling Panlipunan",33],["English",29],["Science",27],["Arts",17],["Physical Education",6]],"practices":[["Read aloud",135],["Chores",55],["Manipulatives",46],["Music appreciation",44],["Mental math",37],["Copywork",23],["Practice reading",22],["Memory work",16],["Picture study",9],["Life skill",6],["Handicraft",4],["Project",2]],"nest":{"Arts":[["Picture study",9],["Handicraft",4],["Read aloud",2],["Project",2]],"Filipino":[["Read aloud",19],["Practice reading",16],["Copywork",14],["Memory work",11]],"EPP / TLE":[["Chores",55]],"Mathematics":[["Manipulatives",46],["Mental math",37]],"Music":[["Music appreciation",44]],"Science":[["Read aloud",27]],"Araling Panlipunan":[["Read aloud",33]],"Character Education":[["Read aloud",45]],"English":[["Copywork",9],["Read aloud",9],["Practice reading",6],["Memory work",5]],"Physical Education":[["Life skill",6]]},"books":[["Bible Stories",45],["Nature Stories",14],["First Look Series",13],["Little Sisters",11],["In-Story Land",10],["Bandila",7],["First Around the Globe",5]],"byday":[["2026-07-13",14],["2026-07-14",23],["2026-07-15",20],["2026-07-16",5],["2026-07-17",1],["2026-07-19",1],["2026-07-20",15],["2026-07-21",19],["2026-07-22",13],["2026-07-24",2],["2026-07-26",1],["2026-07-27",15],["2026-07-28",21],["2026-07-29",21],["2026-07-30",12],["2026-08-02",4],["2026-08-03",25],["2026-08-04",22],["2026-08-06",2],["2026-08-07",3],["2026-08-10",2],["2026-08-11",27],["2026-08-12",23],["2026-08-13",22],["2026-08-16",23],["2026-08-17",22],["2026-08-18",24],["2026-08-19",17]]};

/* ───────────────── provider registry (data, not code) ───────────────── */
/* The fifteen practices on the Kindergarten CM Feast wheel, as the
   provider publishes them. Applying the provider code offers these; the
   parent can still rename, remove or add her own. */
const LLH_KINDER_FEAST = ["Read Aloud", "Living Books", "Nature Lore Books", "Story Telling", "Reading",
  "Poetry", "Nursery Rhymes", "Handwriting", "Living Math", "Drawing", "Art Appreciation",
  "Music Appreciation", "Handicrafts", "Life Skills", "Foreign Language"];

const PROVIDERS = {
  "LLH-KINDER-2627": {
    id: "llh-k", name: "Living Learning Homeschool", short: "LLH",
    level: "Kindergarten", sy: "2026–2027", termWord: "Semester",
    terms: ["First Semester", "Second Semester"],
    requiresGrades: false,
    requiresExamRecording: false,
    subjects: ["Values Education", "Social Studies", "Filipino", "English", "Mathematics",
      "Science", "Music & Arts", "Physical Education & Health"],
    feast: LLH_KINDER_FEAST,
    sections: ["cover", "about", "curriculum", "coverage", "books", "highlights", "subjects", "attainments", "reflection"],
    required: ["cover", "curriculum", "highlights", "subjects"],
    optional: ["about", "books", "coverage", "reflection", "attainments"],
    logFreq: "quarterly",
    notes: [
      "Exam recordings are optional at this level.",
      "Ratings are observational and carry no academic weight.",
      "Keep linked files reachable for at least two school years.",
    ],
  },
  "FLORA-OPEN": {
    id: "open", name: "No provider (independent)", short: "Open",
    level: "Kindergarten", sy: "2026–2027", termWord: "Quarter",
    terms: ["First Quarter", "Second Quarter", "Third Quarter", "Fourth Quarter"],
    requiresGrades: false, requiresExamRecording: false,
    subjects: ["Values Education", "Social Studies", "Filipino", "English", "Mathematics",
      "Science", "Music & Arts", "Physical Education & Health"],
    sections: ["cover", "about", "curriculum", "coverage", "books", "highlights", "subjects", "reflection"],
    required: ["cover"],
    optional: ["about", "curriculum", "coverage", "books", "highlights", "subjects", "reflection", "attainments"],
    logFreq: "daily",
    notes: ["No provider requirements loaded — every section is yours to choose."],
  },
};

const SECTION_META = {
  cover:       { label: "Portfolio cover",        hint: "Portrait, name, level, term" },
  about:       { label: "All About Me",           hint: "Your child, in their own words" },
  curriculum:  { label: "Curriculum & plan",      hint: "Paste it from your sheet" },
  coverage:    { label: "Subject coverage",       hint: "Drawn from what you logged" },
  books:       { label: "Books & materials",      hint: "Gathered automatically" },
  highlights:  { label: "Photo highlights",       hint: "Up to nine a page, balanced" },
  subjects:    { label: "A page per subject",     hint: "One lovely page each" },
  attainments: { label: "Attainments & habits",   hint: "Rated at term's end" },
  reflection:  { label: "Parent's reflection",    hint: "Only you can write this" },
};

/* ───────────────────────── today's plan ───────────────────────── */
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const DAY_FULL = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

/* the family's real rhythm — each row carries the days it runs (0=Sun … 6=Sat) */
const BASE_PLAN = [
  { id: "a1", m: 10, book: "Bible for Children", topic: "", subj: "Values Education", feast: "Read Aloud / Prayer", music: "", link: "https://www.gutenberg.org/ebooks/search/?query=bible+stories+children", days: [1, 2, 3, 4, 5] },
  { id: "a2", m: 10, book: "Lupang Hinirang", topic: "", subj: "Social Studies", feast: "Sing", music: "", link: "", days: [1, 2, 3, 4] },
  { id: "a3", m: 10, book: "Aking Ulap", topic: "Filipino Poem", subj: "Filipino Literature", feast: "Read Aloud", music: "", link: "", days: [1, 3] },
  { id: "a4", m: 10, book: "Psalm 103 verses 1–5", topic: "", subj: "Values Education", feast: "Memory Work", music: "", link: "", days: [1, 3] },
  { id: "a5", m: 10, book: "", topic: "Count 1–20", subj: "Math", feast: "Manipulatives", music: "", link: "", days: [1, 2, 3, 4] },
  { id: "a6", m: 10, book: "Lupang Hinirang", topic: "", subj: "Filipino Language", feast: "Copywork", music: "Folk Songs", link: "", days: [1, 3] },
  { id: "a7", m: 10, book: "Bandila", topic: "", subj: "Social Studies", feast: "Read Aloud", music: "", link: "", days: [1] },
  { id: "a8", m: 10, book: "Arithmetic For Young Children", topic: "", subj: "Math", feast: "Q and A", music: "", link: "https://archive.org/search?query=arithmetic+for+young+children", days: [1, 2, 3, 4] },
  { id: "a9", m: 10, book: "In Land Story", topic: "", subj: "Social Studies", feast: "Read Aloud", music: "", link: "", days: [1, 3] },
  { id: "a10", m: 10, book: "First Look Series (Fish)", topic: "", subj: "Science / Art", feast: "Read Aloud / Painting", music: "Orchestra", link: "", days: [1, 3] },
  { id: "a11", m: 10, book: "", topic: "History / Culture Keeping", subj: "Social Studies / Art", feast: "Painting", music: "", link: "", days: [1] },
  { id: "a12", m: 10, book: "Little Sisters", topic: "", subj: "Social Studies", feast: "Read Aloud", music: "", link: "", days: [2, 4] },
  { id: "a13", m: 10, book: "English Poem", topic: "Nursery Rhymes", subj: "English", feast: "Read Aloud", music: "", link: "", days: [2, 4] },
  { id: "a14", m: 8, book: "English Copywork", topic: "", subj: "English", feast: "Copywork", music: "", link: "", days: [2, 4] },
  { id: "a15", m: 10, book: "Nature Stories", topic: "", subj: "Science", feast: "Read Aloud", music: "", link: "", days: [2, 4] },
  { id: "a16", m: 15, book: "", topic: "Life Skills", subj: "Physical Education & Health", feast: "Life skill", music: "", link: "", days: [5] },
  { id: "a17", m: 30, book: "", topic: "Nature Walk & Journal", subj: "Science", feast: "Nature study", music: "", link: "", days: [6] },
];

/* Derived from SUBJECTS below so the picker can never drift from what the
   Subjects page shows. The colour, the report slice and the portfolio page
   all key off the same names. */
const SUBJ_OPTIONS = ["Language", "Mathematics", "Science", "Social Studies",
  "Values Education", "Music & Arts", "Physical Education & Health"];
const FEAST_OPTIONS = ["Read Aloud", "Read Aloud / Prayer", "Read Aloud / Painting", "Copywork", "Practice reading",
  "Memory Work", "Sing", "Manipulatives", "Q and A", "Mental math", "Nature study", "Picture study",
  "Music appreciation", "Painting", "Handicraft", "Life skill", "Chores", "Project"];

const SUBJECTS = [
  { s: "Social Studies", a: "Filipino Folk Songs · Philippine Studies · Philippine Culture · World Studies · Geography" },
  { s: "Values Education", a: "Bible or Religious Text · Habit Training" },
  { s: "Physical Education & Health", a: "Sports · Exercise · Daily Routine · Life Skills · Chores" },
  { s: "Music & Arts", a: "Folk Songs · Art Study · Handicrafts · Drawing · Composer Study · Hymns" },
  { s: "Mathematics", a: "Math Guide / Curriculum & Additional Mental Math" },
  { s: "Science", a: "Nature Study · Outdoor Play · Science · Nature Lore Books" },
  { s: "Language", a: "Read Aloud · Copywork · Poetry · Nursery Rhymes · Handwriting · Storytelling" },
];
const HABITS = [
  { h: "Obedience", items: ["Understands obedience", "Recognises rules and authority"] },
  { h: "Attentiveness", items: ["Focuses on a given task", "Observes long enough to notice details", "Carries tasks to completion"] },
  { h: "Truthfulness or Honesty", items: ["States facts without exaggerating", "Tells true from false"] },
];
const RATING = ["Evident", "Emerging", "Not yet"];
const EBOOKS = [
  { t: "Bible for Children", a: "Read aloud · daily", c: "#7d6a4f", u: "https://www.gutenberg.org/ebooks/search/?query=bible+stories+children" },
  { t: "Ang Mabait na Kalabaw", a: "Filipino first words", c: "#6b8259", u: "https://archive.org/search?query=philippine+children+folk+tales" },
  { t: "Isang Mayang Uhaw", a: "Filipino literature", c: "#a3663f", u: "https://archive.org/search?query=philippine+children+stories" },
  { t: "Si Jan Pawikan", a: "Filipino literature", c: "#4f7a63", u: "https://archive.org/search?query=philippine+children+stories" },
  { t: "Arithmetic For Young Children", a: "Mental math", c: "#5d6f8a", u: "https://archive.org/search?query=arithmetic+for+young+children" },
  { t: "A First Look — Fishes", a: "Nature lore", c: "#3f7080", u: "https://archive.org/search?query=first+look+at+fishes" },
  { t: "Nature Stories for Young Readers", a: "Science · nature", c: "#7a8a4a", u: "https://www.gutenberg.org/ebooks/search/?query=nature+stories+young+readers" },
  { t: "In-Story Land", a: "Read aloud", c: "#8a5f6d", u: "https://www.gutenberg.org/ebooks/search/?query=in+story+land" },
];
const NAV = [
  { k: "home", label: "Home", icon: Home }, { k: "week", label: "Weekly Plan", icon: ClipboardList },
  { k: "calendar", label: "Calendar", icon: CalendarDays },
  { k: "subjects", label: "Subjects", icon: BookOpen }, { k: "outputs", label: "Outputs", icon: Camera },
  { k: "reports", label: "Reports", icon: BarChart3 }, { k: "portfolio", label: "Portfolio", icon: FolderHeart },
  { k: "library", label: "E-Library", icon: Library }, { k: "others", label: "Others", icon: Files },
  { k: "settings", label: "Settings", icon: Cog }, { k: "feedback", label: "Feedback", icon: MessageCircle },
];

/* ───────────────────────── CM motifs ───────────────────────── */
const Motif = ({ kind, color, size = 46, style }) => {
  const p = { fill: "none", stroke: color, strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round" };
  const arts = {
    rabbit: <><ellipse cx="32" cy="42" rx="12" ry="13" {...p} /><circle cx="32" cy="26" r="8.5" {...p} /><path d="M27 19c-1.5-7 0-12 2-12s3.5 5 2.5 11" {...p} /><path d="M37 19c1.5-7 0-12-2-12s-3.5 5-2.5 11" {...p} /><circle cx="29" cy="26" r="1.1" fill={color} stroke="none" /><circle cx="35" cy="26" r="1.1" fill={color} stroke="none" /><path d="M32 29v1.5M30 31h4" {...p} /></>,
    fern: <><path d="M32 56V12" {...p} /><path d="M32 20c-6-3-10-1-11 2 3 2 8 2 11-2zM32 20c6-3 10-1 11 2-3 2-8 2-11-2z" {...p} /><path d="M32 30c-7-3-12-1-13 2 4 2 9 2 13-2zM32 30c7-3 12-1 13 2-4 2-9 2-13-2z" {...p} /><path d="M32 41c-6-3-11-1-12 2 4 2 9 2 12-2zM32 41c6-3 11-1 12 2-4 2-9 2-12-2z" {...p} /></>,
    bird: <><path d="M18 38c0-8 7-14 15-14 8 0 13 5 13 11 0 7-6 12-14 12-9 0-14-4-14-9z" {...p} /><path d="M46 33l8-4-6 8" {...p} /><circle cx="40" cy="31" r="1.2" fill={color} stroke="none" /><path d="M24 34c4 4 10 5 15 3" {...p} /><path d="M28 47l-2 8M36 48l2 7" {...p} /></>,
    acorn: <><path d="M20 26c0-4 5-7 12-7s12 3 12 7c0 2-1 3-3 3H23c-2 0-3-1-3-3z" {...p} /><path d="M23 29c0 10 4 20 9 20s9-10 9-20" {...p} /><path d="M32 19v-6" {...p} /></>,
    butterfly: <><path d="M32 24v20" {...p} /><path d="M32 27c-4-8-14-11-16-6s3 13 9 15c-5 4-4 11 0 12s7-6 7-12" {...p} /><path d="M32 27c4-8 14-11 16-6s-3 13-9 15c5 4 4 11 0 12s-7-6-7-12" {...p} /><path d="M32 24l-3-6M32 24l3-6" {...p} /></>,
    wreath: <><circle cx="32" cy="32" r="18" strokeDasharray="3 4" {...p} /><path d="M20 22c3-3 7-3 9 0-3 3-7 3-9 0zM44 22c-3-3-7-3-9 0 3 3 7 3 9 0z" {...p} /><path d="M17 34c4-2 8-1 9 2-4 2-8 1-9-2zM47 34c-4-2-8-1-9 2 4 2 8 1 9-2z" {...p} /><path d="M26 47c2-4 6-5 8-2-2 4-6 5-8 2z" {...p} /></>,
    mushroom: <><path d="M16 32c0-9 7-15 16-15s16 6 16 15c0 2-2 3-4 3H20c-2 0-4-1-4-3z" {...p} /><path d="M27 35c0 8-1 14-2 18h14c-1-4-2-10-2-18" {...p} /><circle cx="25" cy="26" r="2.4" {...p} /><circle cx="38" cy="24" r="2" {...p} /></>,
    nest: <><path d="M14 36c0-6 8-10 18-10s18 4 18 10c0 7-8 12-18 12s-18-5-18-12z" {...p} /><ellipse cx="26" cy="34" rx="5" ry="4" {...p} /><ellipse cx="37" cy="35" rx="5" ry="4" {...p} /><path d="M14 40c6 2 12 3 18 3s12-1 18-3" {...p} /></>,
  };
  return <svg width={size} height={size} viewBox="0 0 64 64" style={style} aria-hidden="true">{arts[kind]}</svg>;
};
const MOTIFS = ["rabbit", "fern", "bird", "acorn", "butterfly", "wreath", "mushroom", "nest"];

/* ───────────────── stickers — original Flora artwork ───────────────── */
const STICKERS = {
  cottage: { label: "Home Sweet Homeschool", w: 132, art: (c, a) => (
    <>
      <path d="M18 56 L46 34 L74 56 V88 H18Z" fill="#fbf8f1" stroke={c} strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M12 57 L46 30 L80 57" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="38" y="66" width="16" height="22" rx="1.5" fill={a} stroke={c} strokeWidth="1.3" />
      <rect x="24" y="62" width="11" height="11" rx="1.2" fill="#fff" stroke={c} strokeWidth="1.3" />
      <rect x="57" y="62" width="11" height="11" rx="1.2" fill="#fff" stroke={c} strokeWidth="1.3" />
      <path d="M63 44V32h6v17" fill="#fbf8f1" stroke={c} strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M8 88h76" stroke={c} strokeWidth="1.6" strokeLinecap="round" />
      <path d="M12 88c1-6 5-9 8-9s7 3 8 9" fill={a} stroke={c} strokeWidth="1.2" />
      <path d="M76 88c-1-5-4-8-7-8" fill="none" stroke={c} strokeWidth="1.2" strokeLinecap="round" />
    </>) },
  trees: { label: "Not All Classrooms Have Four Walls", w: 172, art: (c, a) => (
    <>
      <path d="M26 78V60M26 60l-11 2 11-16 11 16z" fill={a} stroke={c} strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M26 46l-8 1 8-13 8 13z" fill={a} stroke={c} strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M52 82V56M52 56l-14 3 14-21 14 21z" fill={a} stroke={c} strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M52 40l-10 2 10-17 10 17z" fill={a} stroke={c} strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M76 78V62M76 62l-9 2 9-14 9 14z" fill={a} stroke={c} strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M10 84c14-4 28-5 42-5s28 1 42 5" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="88" cy="30" r="7" fill="none" stroke={c} strokeWidth="1.4" />
    </>) },
  books: { label: "Read Alouds", w: 118, art: (c, a) => (
    <>
      <path d="M14 74c12-7 24-7 32 0 8-7 20-7 32 0V38c-12-7-24-7-32 0-8-7-20-7-32 0z" fill="#fbf8f1" stroke={c} strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M46 38v36" stroke={c} strokeWidth="1.5" />
      <path d="M22 48h16M22 56h16M54 48h16M54 56h16" stroke={c} strokeWidth="1.1" strokeLinecap="round" opacity=".6" />
      <path d="M46 30c0-5 4-8 8-8s7 3 7 7" fill="none" stroke={c} strokeWidth="1.3" strokeLinecap="round" />
      <circle cx="62" cy="27" r="3.4" fill={a} stroke={c} strokeWidth="1.2" />
    </>) },
  tea: { label: "Tea Time", w: 112, art: (c, a) => (
    <>
      <path d="M20 46h44v18c0 10-8 17-22 17s-22-7-22-17z" fill="#fbf8f1" stroke={c} strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M64 52h7a7 7 0 010 14h-7" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M14 84h56" stroke={c} strokeWidth="1.6" strokeLinecap="round" />
      <path d="M34 36c0-5-4-6-4-10s4-5 4-9M46 36c0-5-4-6-4-10s4-5 4-9" fill="none" stroke={c} strokeWidth="1.3" strokeLinecap="round" opacity=".75" />
      <path d="M28 60c4 3 10 4 16 2" fill="none" stroke={a} strokeWidth="2.4" strokeLinecap="round" />
    </>) },
  basket: { label: "Nature Walks", w: 124, art: (c, a) => (
    <>
      <path d="M20 54h48l-5 30H25z" fill={a} stroke={c} strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M20 54h48M27 62h34M26 71h32" stroke={c} strokeWidth="1.1" opacity=".65" />
      <path d="M30 54c0-9 6-14 14-14s14 5 14 14" fill="none" stroke={c} strokeWidth="1.5" />
      <path d="M44 40c-6-8-14-9-18-6 2 7 10 10 18 6zM44 40c5-9 13-11 17-8-1 7-9 11-17 8z" fill="#fbf8f1" stroke={c} strokeWidth="1.4" strokeLinejoin="round" />
      <circle cx="60" cy="30" r="4" fill={a} stroke={c} strokeWidth="1.2" />
    </>) },
  palette: { label: "Art + Music", w: 122, art: (c, a) => (
    <>
      <path d="M44 22c16 0 28 11 28 24 0 8-6 10-11 10h-6c-4 0-7 2-7 6 0 5 3 5 3 10 0 4-3 7-8 7-16 0-28-13-28-29S28 22 44 22z" fill="#fbf8f1" stroke={c} strokeWidth="1.6" strokeLinejoin="round" />
      <circle cx="32" cy="38" r="4" fill={a} stroke={c} strokeWidth="1.1" />
      <circle cx="48" cy="34" r="4" fill="none" stroke={c} strokeWidth="1.1" />
      <circle cx="26" cy="54" r="4" fill={a} stroke={c} strokeWidth="1.1" />
      <path d="M74 30l4-10 4 10-4 34z" fill={a} stroke={c} strokeWidth="1.4" strokeLinejoin="round" />
    </>) },
  yarn: { label: "Handicrafts", w: 118, art: (c, a) => (
    <>
      <circle cx="40" cy="56" r="24" fill={a} stroke={c} strokeWidth="1.6" />
      <path d="M22 42c10 6 20 16 26 28M30 34c10 7 22 20 27 32M52 34c-8 6-16 18-20 30" fill="none" stroke={c} strokeWidth="1.2" opacity=".75" />
      <path d="M64 56c8-2 14 2 14 8s-6 9-11 6" fill="none" stroke={c} strokeWidth="1.4" strokeLinecap="round" />
      <path d="M70 26l-6 22" stroke={c} strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="70" cy="24" r="2.6" fill="#fbf8f1" stroke={c} strokeWidth="1.2" />
    </>) },
  mom: { label: "Homeschool Mom", w: 116, art: (c, a) => (
    <>
      <circle cx="42" cy="28" r="10" fill="#fbf8f1" stroke={c} strokeWidth="1.5" />
      <path d="M32 26c0-8 5-12 10-12s10 4 10 12c-3-3-6-4-10-4s-7 1-10 4z" fill={a} stroke={c} strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M26 68c0-11 7-19 16-19s16 8 16 19" fill="#fbf8f1" stroke={c} strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M18 74c10-5 20-5 24 0 4-5 14-5 24 0v10c-10-5-20-5-24 0-4-5-14-5-24 0z" fill={a} stroke={c} strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M42 74v10" stroke={c} strokeWidth="1.3" />
    </>) },
};
const STICKER_KEYS = Object.keys(STICKERS);

const StickerArt = ({ kind, color, accent, size = 96, showLabel = true }) => {
  const st = STICKERS[kind];
  if (!st) return null;
  return (
    <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
      <svg width={size} height={size} viewBox="0 0 96 96" style={{ filter: "drop-shadow(1px 2px 2px rgba(60,70,55,.18))" }} aria-hidden="true">
        {st.art(color, accent)}
      </svg>
      {showLabel && <span style={{ fontFamily: serif, fontSize: Math.max(9, size * .115), color, textAlign: "center",
        lineHeight: 1.2, maxWidth: size * 1.5 }}>{st.label}</span>}
    </div>
  );
};

/* ───────────────────────── UI atoms ───────────────────────── */
/* right padding keeps the heading clear of the student chip, which is
   pinned level with it */
const Title = ({ children, sub }) => (
  <div style={{ marginBottom: 20, paddingRight: 210 }}>
    <h1 style={{ fontFamily: serif, fontSize: 30, fontWeight: 600, color: C.deep, lineHeight: 1.2 }}>{children}</h1>
    {sub && <p style={{ fontSize: 13.5, color: C.soft, marginTop: 5, lineHeight: 1.6 }}>{sub}</p>}
  </div>
);
const Panel = ({ title, right, children, pad = 20 }) => (
  <div style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: 14, marginBottom: 16, overflow: "hidden" }}>
    {title && <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "13px 18px", borderBottom: `1px solid ${C.line}`, background: C.wash }}>
      <span style={{ fontSize: 11, letterSpacing: 1.8, textTransform: "uppercase", fontWeight: 700, color: C.deep }}>{title}</span>{right}</div>}
    <div style={{ padding: pad }}>{children}</div>
  </div>
);
const Btn = ({ children, onClick, tone = "solid", small, disabled }) => {
  const t = { solid: { background: C.green, color: "#fff", border: "1px solid transparent" },
    quiet: { background: C.card, color: C.soft, border: `1px solid ${C.line}` },
    warm: { background: C.blush, color: "#fff", border: "1px solid transparent" } }[tone];
  return <button onClick={onClick} disabled={disabled} style={{ ...t, borderRadius: 9, fontWeight: 600,
    fontSize: small ? 12.5 : 13.5, padding: small ? "7px 13px" : "10px 17px", cursor: disabled ? "default" : "pointer",
    opacity: disabled ? .5 : 1, display: "inline-flex", alignItems: "center", gap: 7 }}>{children}</button>;
};
const Note = ({ children, icon: Icon = Info, tone = "sand" }) => (
  <div style={{ display: "flex", gap: 10, padding: "11px 14px", borderRadius: 10, marginBottom: 12,
    background: tone === "sand" ? C.sand : "#fdf4ee", border: `1px solid ${tone === "sand" ? "#e3d6bd" : "#f0dbcd"}` }}>
    <Icon size={15} style={{ color: tone === "sand" ? C.gold : C.blush, flexShrink: 0, marginTop: 2 }} />
    <div style={{ fontSize: 12.8, color: C.soft, lineHeight: 1.6 }}>{children}</div></div>
);
const A = ({ href, children }) => (
  <a href={href} target="_blank" rel="noreferrer" style={{ color: C.green, textDecoration: "none",
    borderBottom: `1px solid ${C.line}`, display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12.8 }}>{children}<Link2 size={11} /></a>
);
const Pill = ({ children, color }) => (
  <span style={{ fontSize: 10.5, padding: "3px 9px", borderRadius: 20, whiteSpace: "nowrap",
    background: color ? color + "22" : C.wash, color: color || C.soft,
    border: `1px solid ${color ? color + "40" : "transparent"}` }}>{children}</span>
);
const SmallField = ({ label, children }) => (
  <div><div style={{ fontSize: 10, letterSpacing: 1.2, textTransform: "uppercase", color: C.muted, fontWeight: 700, marginBottom: 5 }}>{label}</div>{children}</div>
);
const inp = { border: `1px solid ${C.line}`, borderRadius: 8, padding: "9px 11px", fontSize: 13.5, width: "100%", background: "#fff", color: C.ink };
/* Philippine holidays.
   2026 is official — Proclamation No. 1006. 2027 is not yet proclaimed, so those
   are marked provisional: the statutory dates are fixed by law, but the movable and
   "additional" special days are confirmed by proclamation each year. */
const PH_HOLIDAYS = [
  // ─ 2026, official ─
  { d: "2026-08-31", t: "National Heroes Day", type: "Regular holiday" },
  { d: "2026-11-01", t: "All Saints' Day", type: "Special non-working" },
  { d: "2026-11-02", t: "All Souls' Day", type: "Special non-working" },
  { d: "2026-11-30", t: "Bonifacio Day", type: "Regular holiday" },
  { d: "2026-12-08", t: "Feast of the Immaculate Conception", type: "Special non-working" },
  { d: "2026-12-24", t: "Christmas Eve", type: "Special non-working" },
  { d: "2026-12-25", t: "Christmas Day", type: "Regular holiday" },
  { d: "2026-12-30", t: "Rizal Day", type: "Regular holiday" },
  { d: "2026-12-31", t: "Last Day of the Year", type: "Special non-working" },
  // ─ 2027, provisional until proclaimed ─
  { d: "2027-01-01", t: "New Year's Day", type: "Regular holiday", prov: true },
  { d: "2027-02-17", t: "Chinese New Year", type: "Special non-working", prov: true },
  { d: "2027-02-25", t: "EDSA People Power Anniversary", type: "Special day", prov: true },
  { d: "2027-03-25", t: "Maundy Thursday", type: "Regular holiday", prov: true },
  { d: "2027-03-26", t: "Good Friday", type: "Regular holiday", prov: true },
  { d: "2027-03-27", t: "Black Saturday", type: "Special non-working", prov: true },
  { d: "2027-04-09", t: "Araw ng Kagitingan", type: "Regular holiday", prov: true },
  { d: "2027-05-01", t: "Labor Day", type: "Regular holiday", prov: true },
  { d: "2027-06-12", t: "Independence Day", type: "Regular holiday", prov: true },
];
const holidayEvents = () => PH_HOLIDAYS.map((h, i) => ({
  id: "ph" + i, title: h.t, start: h.d, end: "", kind: "holiday",
  remind: [1], email: false, auto: true, prov: !!h.prov,
  note: h.prov ? `${h.type} · provisional until proclaimed` : h.type,
}));

const REMIND_STEPS = [
  { d: 7, label: "1 week before" },
  { d: 3, label: "3 days before" },
  { d: 1, label: "Tomorrow" },
  { d: 0, label: "On the day" },
];

/* seeded from the school year — descriptive, so any provider's calendar fits */
/* 09:30 -> 9:30am; a range collapses to "9:30am–11am" */
const clockLabel = (start, end) => {
  const one = t => {
    if (!t) return "";
    const [h, m] = t.split(":").map(Number);
    const ap = h >= 12 ? "pm" : "am";
    const h12 = h % 12 === 0 ? 12 : h % 12;
    return m ? `${h12}:${String(m).padStart(2, "0")}${ap}` : `${h12}${ap}`;
  };
  if (!start) return "";
  return end ? `${one(start)}\u2013${one(end)}` : one(start);
};

const SEED_EVENTS = [
  // ─ from the provider's school-year calendar ─
  { id: "e0", title: "First semester ends", start: "2026-11-06", end: "", kind: "school", remind: [7, 1], email: false, note: "" },
  { id: "e1", title: "First semester ratings and portfolio due", start: "2026-11-16", end: "2026-11-21", kind: "school", remind: [7, 3, 1, 0], email: true, note: "Submit the portfolio and encode ratings." },
  { id: "e2", title: "Second semester begins", start: "2026-11-16", end: "", kind: "school", remind: [7, 1], email: false, note: "" },
  { id: "e3", title: "Portfolio showcase", start: "2026-11-27", end: "", kind: "school", remind: [7, 3, 1], email: false, note: "" },
  { id: "e4", title: "Christmas break", start: "2026-12-21", end: "2027-01-01", kind: "school", remind: [7], email: false, note: "" },
  { id: "e5", title: "Reflection day", start: "2027-01-15", end: "", kind: "school", remind: [3, 1], email: false, note: "" },
  { id: "e6", title: "Early childhood evaluation window", start: "2027-02-24", end: "2027-03-07", kind: "school", remind: [7, 3, 1], email: true, note: "" },
  { id: "e7", title: "Term break", start: "2027-03-12", end: "2027-03-15", kind: "school", remind: [7], email: false, note: "" },
  { id: "e8", title: "Holy Week break", start: "2027-03-22", end: "2027-03-26", kind: "school", remind: [7], email: false, note: "" },
  { id: "e9", title: "Second semester ends", start: "2027-04-02", end: "", kind: "school", remind: [7, 1], email: false, note: "" },
  { id: "e10", title: "Second semester ratings and portfolio due", start: "2027-04-05", end: "2027-04-10", kind: "school", remind: [7, 3, 1, 0], email: true, note: "Submit the portfolio and encode ratings." },
  { id: "e11", title: "Year-end thanksgiving", start: "2027-05-28", end: "", kind: "school", remind: [7, 1], email: false, note: "" },
  // ─ your own ─
  { id: "p1", title: "Nature walk at the park", start: "2026-08-29", end: "", kind: "personal", remind: [3, 1, 0], email: false, note: "Bring the journals and pencils." },
  { id: "p2", title: "Co-op meet-up", start: "2026-09-05", end: "", kind: "personal", remind: [7, 1], email: false, note: "" },
];

const dayMs = 86400000;
const startOfDay = d => { const x = new Date(d); x.setHours(0, 0, 0, 0); return x; };
const daysUntil = (iso, from) => Math.round((startOfDay(iso) - startOfDay(from)) / dayMs);
const fmtDate = iso => new Date(iso + "T00:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "short" });
const fmtLong = iso => new Date(iso + "T00:00:00").toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
const untilLabel = n => n === 0 ? "today" : n === 1 ? "tomorrow" : `in ${n} days`;
/* the nearest reminder step that has already come round */
const activeStep = (evt, now) => {
  const n = daysUntil(evt.start, now);
  if (n < 0) return null;
  const due = (evt.remind || []).filter(r => r >= n).sort((a, b) => a - b)[0];
  return due === undefined ? null : { n, due };
};

const UPLOAD_DEST = {
  youtube: { label: "YouTube", url: "https://studio.youtube.com/channel/UC/videos/upload",
    hint: "Set the video to Unlisted, then paste the link back here." },
  drive:   { label: "Google Drive", url: "https://drive.google.com/drive/my-drive",
    hint: "Share as \u201canyone with the link can view\u201d, then paste the link." },
};

const mmss = s => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

/* month-two storage maths: a phone original vs what Flora keeps */
const gb = mb => mb >= 1024 ? `${(mb / 1024).toFixed(2)} GB` : `${Math.round(mb)} MB`;

/* balanced photo rows — never stretched, never a lonely giant */
const layoutRows = n => ({ 1: [1], 2: [2], 3: [3], 4: [2, 2], 5: [3, 2], 6: [3, 3], 7: [3, 2, 2], 8: [3, 3, 2], 9: [3, 3, 3] }[Math.min(n, 9)] || [3, 3, 3]);

/* file input styled as a button — capture="environment" opens the
   camera on a phone; multiple lets a mom add a batch on a Friday */
function AddPhoto({ entryId, onAdded, small, block, icon, label = "Add photo" }) {
  const [busy, setBusy] = React.useState(false);
  const [err, setErr] = React.useState("");
  const ref = React.useRef(null);

  const pick = async e => {
    const files = [...e.target.files];
    e.target.value = "";
    if (!files.length) return;
    setBusy(true); setErr("");
    let failed = 0;
    for (const f of files) {
      try { await addPhoto(entryId, f); } catch { failed++; }
    }
    setBusy(false);
    if (failed) setErr(`${failed} photo${failed === 1 ? "" : "s"} couldn't be read. Try a JPEG.`);
    onAdded && onAdded();
  };

  const hidden = {
    position: "absolute", width: 1, height: 1, opacity: 0, overflow: "hidden",
    clip: "rect(0 0 0 0)", whiteSpace: "nowrap", border: 0, padding: 0, margin: -1,
  };

  if (icon) {
    return (
      <span style={{ position: "relative", display: "inline-block", flexShrink: 0 }}>
        <input ref={ref} type="file" accept="image/*,.heic,.heif" multiple disabled={busy}
          onChange={pick} style={hidden} />
        <button type="button" disabled={busy} title="Add a photo"
          onClick={() => ref.current && ref.current.click()}
          style={{ width: 52, height: 52, borderRadius: 9, flexShrink: 0,
            cursor: busy ? "default" : "pointer", border: `1px dashed ${C.blush}`,
            background: "#fdf4ee", display: "flex", alignItems: "center",
            justifyContent: "center", padding: 0, opacity: busy ? .5 : 1 }}>
          <Camera size={17} style={{ color: C.blush }} /></button>
        {err && (
        <div style={{ fontSize: 11.5, color: "#a4553b", marginTop: 6, lineHeight: 1.5,
          background: "#fbeee6", border: "1px solid #edcdb8", borderRadius: 7, padding: "7px 9px" }}>
          Couldn't add that photo — {err}
        </div>)}
      </span>);
  }

  return (
    <span style={{ display: block ? "block" : "inline-block", position: "relative" }}>
      {/* NOT display:none — some mobile browsers (and in-app browsers like
          Messenger's) won't forward the tap to a hidden input. No `capture`
          either, so the phone offers Camera, Photo Library and Files. */}
      <input ref={ref} type="file" accept="image/*,.heic,.heif" multiple disabled={busy}
        onChange={pick}
        style={hidden} />
      <button type="button" disabled={busy}
        onClick={() => ref.current && ref.current.click()}
        style={{ display: block ? "flex" : "inline-flex", width: block ? "100%" : undefined,
          justifyContent: "center", alignItems: "center", gap: 7,
          cursor: busy ? "default" : "pointer", background: C.card, color: C.soft,
          border: `1px solid ${C.line}`, borderRadius: 9, fontWeight: 600,
          fontSize: small ? 12.5 : 13.5, padding: small ? "9px 14px" : "12px 17px",
          minHeight: 44, opacity: busy ? .5 : 1 }}>
        <Camera size={small ? 13 : 15} /> {busy ? "Saving…" : label}
      </button>
      {err && (
        <div style={{ fontSize: 11.5, color: "#a4553b", marginTop: 6, lineHeight: 1.5,
          background: "#fbeee6", border: "1px solid #edcdb8", borderRadius: 7, padding: "7px 9px" }}>
          Couldn't add that photo — {err}
        </div>)}
    </span>);
}

/* thumbnails for one entry, with a way to remove one */
function EntryPhotos({ entryId, version, onChange, size = 44, locked, day }) {
  const items = useEntryPhotos(entryId, version, day);
  if (!items.length) return null;
  return (
    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 8 }}>
      {items.map(p => (
        <div key={p.id} style={{ position: "relative", width: size, height: size }}>
          <PhotoImg rec={p} url={p.url}
            style={{ borderRadius: 7, border: `1px solid ${C.line}`, background: C.wash }} />
          {!locked && <button title="Remove this photo"
            onClick={async () => { await deletePhoto(p.id); releaseURL(p.id); onChange && onChange(); }}
            style={{ position: "absolute", top: -5, right: -5, width: 17, height: 17, borderRadius: "50%",
              border: `1px solid ${C.line}`, background: "#fff", cursor: "pointer", padding: 0,
              display: "flex", alignItems: "center", justifyContent: "center" }}>
            <X size={9} style={{ color: C.muted }} /></button>}
        </div>))}
    </div>);
}

/* full-size preview, with the tools a parent actually needs on a photo
   she is about to submit: turn it, change how it sits in the frame,
   fix the caption, or drop it */
function PhotoLightbox({ photo, caption, onCaption, fit, onFit, onRotate, onCrop, onDelete, onClose }) {
  const [cropping, setCropping] = React.useState(false);
  const [sel, setSel] = React.useState(null);        // in the image's own pixels
  const [busy, setBusy] = React.useState(false);
  const boxRef = React.useRef(null);
  const drag = React.useRef(null);

  React.useEffect(() => {
    const k = e => { if (e.key === "Escape") { if (cropping) setCropping(false); else onClose(); } };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [onClose, cropping]);

  /* a fresh photo (after a rotate, say) invalidates any selection */
  React.useEffect(() => { setSel(null); }, [photo && photo.width, photo && photo.height]);

  if (!photo) return null;

  const iw = photo.width || 1, ih = photo.height || 1;

  const startCrop = () => {
    const inset = 0.12;
    setSel({ x: iw * inset, y: ih * inset, w: iw * (1 - inset * 2), h: ih * (1 - inset * 2) });
    setCropping(true);
  };

  /* the image is letterboxed inside the box, so map between the two */
  const layout = () => {
    const el = boxRef.current;
    if (!el) return null;
    const r = el.getBoundingClientRect();
    const scale = Math.min(r.width / iw, r.height / ih);
    return { r, scale, offX: (r.width - iw * scale) / 2, offY: (r.height - ih * scale) / 2 };
  };

  const onPointerDown = (e, mode) => {
    e.preventDefault(); e.stopPropagation();
    const L = layout(); if (!L || !sel) return;
    drag.current = { mode, startX: e.clientX, startY: e.clientY, sel: { ...sel }, scale: L.scale };
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };

  const onPointerMove = e => {
    const d = drag.current; if (!d) return;
    const dx = (e.clientX - d.startX) / d.scale;
    const dy = (e.clientY - d.startY) / d.scale;
    let { x, y, w, h } = d.sel;
    if (d.mode === "move") {
      x = Math.min(Math.max(0, x + dx), iw - w);
      y = Math.min(Math.max(0, y + dy), ih - h);
    } else {
      w = Math.min(Math.max(40, w + dx), iw - x);
      h = Math.min(Math.max(40, h + dy), ih - y);
    }
    setSel({ x, y, w, h });
  };

  const onPointerUp = () => { drag.current = null; };

  const L = boxRef.current ? layout() : null;
  const selBox = (cropping && sel && L)
    ? { left: L.offX + sel.x * L.scale, top: L.offY + sel.y * L.scale,
        width: sel.w * L.scale, height: sel.h * L.scale }
    : null;

  return (
    <div className="no-print"
      style={{ position: "fixed", inset: 0, background: "rgba(47,58,44,.72)", zIndex: 60,
        display: "flex", alignItems: "center", justifyContent: "center", padding: 18 }}>
      {/* deliberately not click-to-dismiss: a stray tap on the backdrop
          while typing a caption would throw the edit away */}
      <div style={{ background: C.cream, borderRadius: 14, padding: 16, maxWidth: 720, width: "100%",
        maxHeight: "92vh", overflowY: "auto", position: "relative" }}>
        <button onClick={onClose} title="Close" aria-label="Close"
          style={{ position: "absolute", top: 10, right: 10, width: 30, height: 30, borderRadius: "50%",
            border: `1px solid ${C.line}`, background: "#fff", cursor: "pointer", zIndex: 3,
            display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}>
          <X size={14} style={{ color: C.muted }} /></button>

        <div ref={boxRef}
          onPointerMove={cropping ? onPointerMove : undefined}
          onPointerUp={cropping ? onPointerUp : undefined}
          style={{ background: "#fff", border: `1px solid ${C.line}`, borderRadius: 10, position: "relative",
            height: "52vh", display: "flex", alignItems: "center", justifyContent: "center",
            overflow: "hidden", touchAction: cropping ? "none" : "auto" }}>
          <PhotoImg rec={photo} url={photoURL(photo)}
            fit={cropping ? "contain" : (fit === "cover" ? "cover" : "contain")} />

          {selBox && (
            <>
              <div onPointerDown={e => onPointerDown(e, "move")}
                style={{ position: "absolute", ...selBox, border: "2px solid #fff",
                  boxShadow: "0 0 0 9999px rgba(47,58,44,.45)", cursor: "move", touchAction: "none" }}>
                <div onPointerDown={e => onPointerDown(e, "resize")}
                  style={{ position: "absolute", right: -9, bottom: -9, width: 22, height: 22,
                    borderRadius: "50%", background: "#fff", border: `2px solid ${C.green}`,
                    cursor: "nwse-resize", touchAction: "none" }} />
              </div>
            </>)}
        </div>

        {cropping ? (
          <>
            <div style={{ fontSize: 12.5, color: C.soft, marginTop: 11, lineHeight: 1.6 }}>
              Drag the frame to move it, or the circle in the corner to resize.
              {sel && ` Keeping ${Math.round(sel.w)} × ${Math.round(sel.h)} pixels.`}
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 11 }}>
              <Btn small disabled={busy}
                onClick={async () => { setBusy(true); await onCrop(sel); setBusy(false); setCropping(false); }}>
                <Check size={13} /> {busy ? "Cropping…" : "Apply crop"}</Btn>
              <Btn small tone="quiet" onClick={() => setCropping(false)}>Cancel</Btn>
            </div>
            <div style={{ fontSize: 11.5, color: C.muted, marginTop: 9, lineHeight: 1.6 }}>
              Cropping permanently trims the photo. Your weekly backup keeps whatever you had before.
            </div>
          </>
        ) : (
          <>
            {onCaption && (
              <input value={caption || ""} onChange={e => onCaption(e.target.value)}
                placeholder="Caption — what was happening here?"
                style={{ ...inp, marginTop: 12, minHeight: 44 }} />)}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 12, alignItems: "center" }}>
              <Btn small tone="quiet" disabled={busy}
                onClick={async () => { setBusy(true); await onRotate(-90); setBusy(false); }}>
                <RotateCcw size={13} /> Turn left</Btn>
              <Btn small tone="quiet" disabled={busy}
                onClick={async () => { setBusy(true); await onRotate(90); setBusy(false); }}>
                <RotateCcw size={13} style={{ transform: "scaleX(-1)" }} /> Turn right</Btn>
              {onCrop && <Btn small tone="quiet" onClick={startCrop}><Sticker size={13} /> Crop</Btn>}
              <Btn small tone="quiet" onClick={onFit}>
                {fit === "cover" ? "Show the whole photo" : "Crop to fill the frame"}</Btn>
              <span style={{ flex: 1 }} />
              <Btn small tone="quiet" onClick={onDelete}><Trash2 size={13} /> Remove</Btn>
              <Btn small onClick={onClose}>Done</Btn>
            </div>
            <div style={{ fontSize: 11.5, color: C.muted, marginTop: 9, lineHeight: 1.6 }}>
              Turning and cropping are saved into the photo itself, so they carry through to your portfolio
              and your backup. "Crop to fill" only changes how it sits on the page — nothing is trimmed.
            </div>
          </>)}
      </div>
    </div>);
}

/* up to three little thumbs beside a finished task, so the day's
   record reads as evidence rather than a checklist */
function DoneThumbs({ entryId, version, size = 30, day }) {
  const items = useEntryPhotos(entryId, version, day);
  if (!items.length) return null;
  return (
    <span style={{ display: "inline-flex", gap: 4, flexShrink: 0 }}>
      {items.slice(0, 3).map(p => (
        <span key={p.id} style={{ width: size, height: size, borderRadius: 6, overflow: "hidden",
          border: `1px solid ${C.line}`, display: "block" }}>
          <PhotoImg rec={p} url={p.url} /></span>))}
      {items.length > 3 && (
        <span style={{ fontSize: 10.5, color: C.muted, alignSelf: "center" }}>+{items.length - 3}</span>)}
    </span>);
}

/* first photo for a row, or the empty placeholder */
function OutputThumb({ entryId, version }) {
  const items = useEntryPhotos(entryId, version);
  const p = items[0];
  return (
    <div style={{ width: 44, height: 44, borderRadius: 8, background: C.wash,
      border: p ? `1px solid ${C.line}` : `1px dashed ${C.line}`, overflow: "hidden",
      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      {p ? <PhotoImg rec={p} url={p.url} />
         : <Camera size={15} style={{ color: C.muted }} />}
    </div>);
}

function PhotoGrid({ items, t, photoFit = {}, setPhotoFit, onOpen, editable, caps, setCaps }) {
  const rows = layoutRows(items.length);
  let i = 0;
  return (
    <div style={{ display: "grid", gap: 8 }}>
      {rows.map((n, r) => {
        const slice = items.slice(i, i + n); i += n;
        return (
          <div key={r} style={{ display: "grid", gridTemplateColumns: `repeat(${n},1fr)`, gap: 8,
            justifyContent: "center", maxWidth: n === 2 ? "70%" : n === 1 ? "48%" : "100%", margin: "0 auto", width: "100%" }}>
            {slice.map((p, k) => (
              <div key={p.key || p.id || k}>
                <div onClick={() => p.url && onOpen && onOpen(p)}
                  title={p.url && onOpen ? "Open to turn, crop or caption" : undefined}
                  style={{ aspectRatio: "4 / 3", borderRadius: 7, background: "#fff",
                    cursor: p.url && onOpen ? "zoom-in" : "default",
                    border: `1px solid ${t.soft}`, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                  {p.url
                    ? <PhotoImg rec={p.rec} url={p.url} fit={photoFit[p.key] || "cover"} />
                    : <Camera size={15} style={{ color: t.soft }} />}
                </div>
                {p.url && setPhotoFit && (
                  <button className="no-print"
                    title={(photoFit[p.key] || "cover") === "cover" ? "Show the whole photo" : "Crop to fill the frame"}
                    onClick={() => setPhotoFit({ ...photoFit,
                      [p.key]: (photoFit[p.key] || "cover") === "cover" ? "contain" : "cover" })}
                    style={{ marginTop: 3, background: "none", border: "none", cursor: "pointer", padding: 0,
                      fontSize: 9, letterSpacing: .4, color: t.soft, textDecoration: "underline" }}>
                    {(photoFit[p.key] || "cover") === "cover" ? "cropped — show whole" : "whole — crop to fill"}
                  </button>)}
                {editable && setCaps ? (
                  <input value={caps[p.id] || ""} onChange={e => setCaps({ ...caps, [p.id]: e.target.value })}
                    placeholder="Add a caption…"
                    style={{ width: "100%", marginTop: 4, border: "none", borderBottom: `1px dashed ${t.soft}`,
                      outline: "none", background: "transparent", fontSize: 9.5, fontStyle: "italic",
                      textAlign: "center", color: t.ink, padding: "2px 0" }} />
                ) : p.caption ? (
                  <div style={{ fontSize: 9.5, color: t.ink, opacity: .68, marginTop: 4,
                    fontStyle: "italic", textAlign: "center", lineHeight: 1.35 }}>{p.caption}</div>
                ) : null}
              </div>))}
          </div>);
      })}
    </div>
  );
}

/* ───────────────────────── storage ─────────────────────────
   Claude artifacts expose window.storage; a normal browser does not.
   This tries the artifact API first and falls back to localStorage,
   so a logged week survives a refresh either way.                    */
const store = {
  async get(key) {
    try {
      if (typeof window !== "undefined" && window.storage?.get) return await window.storage.get(key);
      const v = localStorage.getItem(key);
      return v == null ? null : { key, value: v };
    } catch { return null; }
  },
  async set(key, value) {
    try {
      if (typeof window !== "undefined" && window.storage?.set) return await window.storage.set(key, value);
      localStorage.setItem(key, value);
      return { key, value };
    } catch { return null; }
  },
};

/* ───────────────── writing a zip ─────────────────
   A backup a parent can't open is a backup she won't trust. This writes a
   real .zip she can double-click: a folder of ordinary .jpg files named by
   date and activity, plus the records Flora needs to restore.

   Stored, not deflated — JPEGs are already compressed, so there is nothing
   to gain and it keeps this to a few dozen lines with no dependency. */
const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1;
    t[i] = c >>> 0;
  }
  return t;
})();

function crc32(bytes) {
  let c = 0xFFFFFFFF;
  for (let i = 0; i < bytes.length; i++) c = CRC_TABLE[(c ^ bytes[i]) & 0xFF] ^ (c >>> 8);
  return (c ^ 0xFFFFFFFF) >>> 0;
}

function dosTime(d) {
  return { t: ((d.getHours() << 11) | (d.getMinutes() << 5) | (d.getSeconds() / 2)) & 0xFFFF,
           d: (((d.getFullYear() - 1980) << 9) | ((d.getMonth() + 1) << 5) | d.getDate()) & 0xFFFF };
}

async function makeZip(files) {
  const enc = new TextEncoder();
  const parts = [], central = [];
  let offset = 0;
  const now = new Date();
  const { t, d } = dosTime(now);

  for (const f of files) {
    const nameBytes = enc.encode(f.name);
    const data = f.data instanceof Blob ? new Uint8Array(await f.data.arrayBuffer())
      : (typeof f.data === "string" ? enc.encode(f.data) : new Uint8Array(f.data));
    const crc = crc32(data);

    const local = new DataView(new ArrayBuffer(30));
    local.setUint32(0, 0x04034b50, true);
    local.setUint16(4, 20, true); local.setUint16(6, 0, true);
    local.setUint16(8, 0, true);                       // stored
    local.setUint16(10, t, true); local.setUint16(12, d, true);
    local.setUint32(14, crc, true);
    local.setUint32(18, data.length, true);
    local.setUint32(22, data.length, true);
    local.setUint16(26, nameBytes.length, true); local.setUint16(28, 0, true);
    parts.push(new Uint8Array(local.buffer), nameBytes, data);

    const cen = new DataView(new ArrayBuffer(46));
    cen.setUint32(0, 0x02014b50, true);
    cen.setUint16(4, 20, true); cen.setUint16(6, 20, true);
    cen.setUint16(8, 0, true); cen.setUint16(10, 0, true);
    cen.setUint16(12, t, true); cen.setUint16(14, d, true);
    cen.setUint32(16, crc, true);
    cen.setUint32(20, data.length, true); cen.setUint32(24, data.length, true);
    cen.setUint16(28, nameBytes.length, true);
    cen.setUint32(42, offset, true);
    central.push(new Uint8Array(cen.buffer), nameBytes);
    offset += 30 + nameBytes.length + data.length;
  }

  const centralSize = central.reduce((a, b) => a + b.length, 0);
  const end = new DataView(new ArrayBuffer(22));
  end.setUint32(0, 0x06054b50, true);
  end.setUint16(8, files.length, true); end.setUint16(10, files.length, true);
  end.setUint32(12, centralSize, true); end.setUint32(16, offset, true);

  return new Blob([...parts, ...central, new Uint8Array(end.buffer)], { type: "application/zip" });
}

/* keeps filenames friendly and safe on every operating system */
const safeName = str => (str || "untitled").replace(/[\\/:*?"<>|]/g, "-").replace(/\s+/g, " ").trim().slice(0, 60);

/* ───────────────── Google Drive backup ─────────────────
   Uses the drive.file scope, which grants access ONLY to files this app
   creates. Flora can never see the rest of the parent's Drive, and the
   folder it makes is the only place it can write.

   Honest limit: a browser app cannot upload while it is closed. "Auto"
   means Flora sends the backup the next time it is opened, if a week has
   passed. Tokens also last about an hour, so a re-consent tap is needed
   from time to time. Everything still works without Drive — the manual
   backup file is unchanged. */
const DRIVE_SCOPE = "https://www.googleapis.com/auth/drive.file";
const GIS_SRC = "https://accounts.google.com/gsi/client";

let gisPromise = null;
function loadGIS() {
  if (gisPromise) return gisPromise;
  gisPromise = new Promise((resolve, reject) => {
    if (window.google?.accounts?.oauth2) return resolve(window.google);
    const el = document.createElement("script");
    el.src = GIS_SRC; el.async = true; el.defer = true;
    el.onload = () => resolve(window.google);
    el.onerror = () => reject(new Error("blocked"));
    document.head.appendChild(el);
  });
  return gisPromise;
}

let tokenCache = { token: null, expires: 0 };

/* `silent` asks for a token without showing anything; it succeeds only if
   the parent is signed in and has already granted the folder. */
async function driveToken(clientId, silent = false) {
  if (tokenCache.token && Date.now() < tokenCache.expires - 60000) return tokenCache.token;
  const g = await loadGIS();
  return new Promise((resolve, reject) => {
    const client = g.accounts.oauth2.initTokenClient({
      client_id: clientId,
      scope: DRIVE_SCOPE,
      prompt: silent ? "none" : "",
      callback: resp => {
        if (resp.error || !resp.access_token) return reject(new Error(resp.error || "no token"));
        tokenCache = { token: resp.access_token, expires: Date.now() + (resp.expires_in || 3600) * 1000 };
        resolve(resp.access_token);
      },
      error_callback: err => reject(new Error(err?.type || "consent needed")),
    });
    client.requestAccessToken();
  });
}

async function driveFolder(token, name) {
  const q = encodeURIComponent(
    `name='${name.replace(/'/g, "\\'")}' and mimeType='application/vnd.google-apps.folder' and trashed=false`);
  const found = await fetch(`https://www.googleapis.com/drive/v3/files?q=${q}&fields=files(id,name)`,
    { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json());
  if (found.files?.length) return found.files[0].id;
  const made = await fetch("https://www.googleapis.com/drive/v3/files?fields=id", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ name, mimeType: "application/vnd.google-apps.folder" }),
  }).then(r => r.json());
  if (!made.id) throw new Error("folder failed");
  return made.id;
}

async function driveUpload(token, folderId, filename, blob) {
  const meta = { name: filename, parents: [folderId] };
  const body = new FormData();
  body.append("metadata", new Blob([JSON.stringify(meta)], { type: "application/json" }));
  body.append("file", blob);
  const res = await fetch(
    "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink",
    { method: "POST", headers: { Authorization: `Bearer ${token}` }, body });
  if (!res.ok) throw new Error(`upload failed (${res.status})`);
  return res.json();
}

/* keeps the folder tidy — a term of weekly backups, then the oldest go */
async function drivePrune(token, folderId, keep = 12) {
  try {
    const q = encodeURIComponent(`'${folderId}' in parents and trashed=false`);
    const list = await fetch(
      `https://www.googleapis.com/drive/v3/files?q=${q}&orderBy=createdTime desc&fields=files(id,createdTime)`,
      { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json());
    const extra = (list.files || []).slice(keep);
    for (const f of extra) {
      await fetch(`https://www.googleapis.com/drive/v3/files/${f.id}`,
        { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
    }
  } catch {}
}

/* ───────────────── per-day records ─────────────────
   A rhythm row repeats: "Bible for Children" is the same row every
   Monday. Keying a tick, a note or a caption by the row alone means
   today's entry silently overwrites yesterday's — the whole point of
   Flora, lost. Records are therefore keyed by row AND day.

   Older records saved before this change have no day in the key, so
   reads fall back to the bare id and writes always use the new form.
   Nothing already logged is thrown away. */
const isoDay = d => {
  const x = d instanceof Date ? d : new Date(d);
  return `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, "0")}-${String(x.getDate()).padStart(2, "0")}`;
};
const dk = (id, day) => `${id}::${day}`;
const readDay = (map, id, day) => {
  const v = map[dk(id, day)];
  return v !== undefined ? v : map[id];
};
const writeDay = (map, id, day, value) => {
  const next = { ...map, [dk(id, day)]: value };
  delete next[id];                 // retire the undated form once rewritten
  return next;
};
const clearDay = (map, id, day) => {
  const next = { ...map };
  delete next[dk(id, day)];
  delete next[id];
  return next;
};
/* "a1::2026-08-26" -> { id: "a1", day: "2026-08-26" } */
const splitKey = k => {
  const i = k.indexOf("::");
  return i === -1 ? { id: k, day: null } : { id: k.slice(0, i), day: k.slice(i + 2) };
};

/* ───────────────────────── photos ─────────────────────────
   Image bytes live in IndexedDB on the parent's own device.
   Blobs, not base64 — base64 is ~33% larger and would fill the
   quota far sooner. Only the bytes live here; which entry a photo
   belongs to is carried on the record itself.                  */

const PDB = "flora-photos", PSTORE = "photos";
let pdbPromise = null;

function openPhotoDB() {
  if (pdbPromise) return pdbPromise;
  pdbPromise = new Promise((resolve, reject) => {
    const req = indexedDB.open(PDB, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(PSTORE)) {
        const s = db.createObjectStore(PSTORE, { keyPath: "id" });
        s.createIndex("entryId", "entryId", { unique: false });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
  return pdbPromise;
}

function ptx(mode, fn) {
  return openPhotoDB().then(db => new Promise((resolve, reject) => {
    const t = db.transaction(PSTORE, mode);
    let out;
    try { out = fn(t.objectStore(PSTORE)); } catch (e) { reject(e); return; }
    t.oncomplete = () => resolve(out && out.result !== undefined ? out.result : out);
    t.onerror = () => reject(t.error);
    t.onabort = () => reject(t.error);
  }));
}

/* Sized against the provider's 15MB portfolio cap. A term might carry
   30–40 images, so each needs to land near 300KB. 1600px on the long
   edge at quality 0.75 does that and still prints cleanly.
   Don't raise these without redoing the arithmetic. */
const MAX_EDGE = 1600, QUALITY = 0.75;

/* createImageBitmap is fast but refuses HEIC in several browsers, and
   iPhones shoot HEIC by default. Fall back to an <img>, which Safari
   decodes natively. */
async function decodeImage(file) {
  try {
    const bmp = await createImageBitmap(file);
    return { src: bmp, width: bmp.width, height: bmp.height, close: () => bmp.close?.() };
  } catch {
    const url = URL.createObjectURL(file);
    try {
      const img = await new Promise((res, rej) => {
        const i = new Image();
        i.onload = () => res(i);
        i.onerror = () => rej(new Error("decode failed"));
        i.src = url;
      });
      return { src: img, width: img.naturalWidth, height: img.naturalHeight,
        close: () => URL.revokeObjectURL(url) };
    } catch (e) { URL.revokeObjectURL(url); throw e; }
  }
}

async function compressImage(file) {
  const img = await decodeImage(file);
  const scale = Math.min(1, MAX_EDGE / Math.max(img.width, img.height));
  const w = Math.max(1, Math.round(img.width * scale)), h = Math.max(1, Math.round(img.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = w; canvas.height = h;
  canvas.getContext("2d").drawImage(img.src, 0, 0, w, h);
  img.close();
  const blob = await new Promise(res => canvas.toBlob(res, "image/jpeg", QUALITY));
  if (!blob) throw new Error("encode failed");
  return { blob, w, h };
}

async function addPhoto(entryId, file) {
  const { blob, w, h } = await compressImage(file);
  const rec = {
    id: `p_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    entryId, blob, width: w, height: h, day: isoDay(new Date()),
    bytes: blob.size, originalBytes: file.size, addedAt: Date.now(),
  };
  await ptx("readwrite", s => s.put(rec));
  return rec.id;
}

/* Rotation re-encodes the stored image rather than applying a CSS
   transform, so the portfolio, the print output and the backup all
   inherit it without any of them needing to know about rotation. */
async function rotatePhoto(id, degrees = 90) {
  const rec = await ptx("readonly", st => st.get(id));
  if (!rec) return null;
  const img = await decodeImage(rec.blob);
  const swap = degrees % 180 !== 0;
  const w = swap ? img.height : img.width;
  const h = swap ? img.width : img.height;
  const canvas = document.createElement("canvas");
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext("2d");
  ctx.translate(w / 2, h / 2);
  ctx.rotate(degrees * Math.PI / 180);
  ctx.drawImage(img.src, -img.width / 2, -img.height / 2);
  img.close();
  const blob = await new Promise(res => canvas.toBlob(res, "image/jpeg", QUALITY));
  if (!blob) return null;
  const updated = { ...rec, blob, width: w, height: h, bytes: blob.size };
  await ptx("readwrite", st => st.put(updated));
  releaseURL(id);
  return updated;
}

/* Manual crop. The selection arrives in the image's own pixel space, so
   what the parent framed is exactly what gets written. */
async function cropPhoto(id, sel) {
  const rec = await ptx("readonly", st => st.get(id));
  if (!rec) return null;
  const img = await decodeImage(rec.blob);
  const sx = Math.max(0, Math.round(sel.x));
  const sy = Math.max(0, Math.round(sel.y));
  const sw = Math.max(1, Math.min(Math.round(sel.w), img.width - sx));
  const sh = Math.max(1, Math.min(Math.round(sel.h), img.height - sy));
  const canvas = document.createElement("canvas");
  canvas.width = sw; canvas.height = sh;
  canvas.getContext("2d").drawImage(img.src, sx, sy, sw, sh, 0, 0, sw, sh);
  img.close();
  const blob = await new Promise(res => canvas.toBlob(res, "image/jpeg", QUALITY));
  if (!blob) return null;
  const updated = { ...rec, blob, width: sw, height: sh, bytes: blob.size };
  await ptx("readwrite", st => st.put(updated));
  releaseURL(id);
  return updated;
}

const getPhotosFor = entryId => ptx("readonly", s => s.index("entryId").getAll(entryId));
const getAllPhotos = () => ptx("readonly", s => s.getAll());
const deletePhoto = id => ptx("readwrite", s => s.delete(id));

async function photoStats() {
  const rows = await getAllPhotos().catch(() => []);
  const held = rows.reduce((a, r) => a + (r.bytes || 0), 0);
  const original = rows.reduce((a, r) => a + (r.originalBytes || 0), 0);
  return {
    count: rows.length,
    heldMB: held / 1048576,
    originalMB: original / 1048576,
    freedMB: Math.max(0, (original - held) / 1048576),
  };
}

/* Browsers can evict IndexedDB under disk pressure unless the origin
   is marked persistent. Without this, a term of photos can vanish
   with no warning and no error. */
async function requestPersistence() {
  try {
    if (!navigator.storage?.persist) return false;
    if (await navigator.storage.persisted()) return true;
    return await navigator.storage.persist();
  } catch { return false; }
}

const blobToDataURL = blob => new Promise(res => {
  const r = new FileReader();
  r.onload = () => res(r.result);
  r.readAsDataURL(blob);
});

const dataURLToBlob = async url => (await fetch(url)).blob();

/* One file holding records and every photo. No dependencies, so it
   works the same in a browser or an artifact. Base64 makes the file
   bigger than a zip would, but a weekly download can afford that. */
/* reads a stored-method zip — the only kind Flora writes */
function readZip(buf) {
  const dv = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
  const out = [];
  let i = 0;
  while (i < buf.length - 4) {
    if (dv.getUint32(i, true) !== 0x04034b50) break;
    const nameLen = dv.getUint16(i + 26, true);
    const extraLen = dv.getUint16(i + 28, true);
    const size = dv.getUint32(i + 18, true);
    const start = i + 30 + nameLen + extraLen;
    const name = new TextDecoder().decode(buf.subarray(i + 30, i + 30 + nameLen));
    out.push({ name, data: buf.subarray(start, start + size) });
    i = start + size;
  }
  return out;
}

async function importBackup(file, restoreRecords) {
  const buf = new Uint8Array(await file.arrayBuffer());
  const isZip = buf[0] === 0x50 && buf[1] === 0x4B;

  if (!isZip) {
    /* the older single-file format, so early backups still restore */
    const payload = JSON.parse(new TextDecoder().decode(buf));
    if (payload.records) restoreRecords(payload.records);
    for (const p of payload.photos || []) {
      const blob = await dataURLToBlob(p.data);
      await ptx("readwrite", st => st.put({ id: p.id, entryId: p.entryId, blob, day: p.day,
        bytes: p.bytes || blob.size, originalBytes: p.originalBytes || blob.size,
        addedAt: p.addedAt || Date.now() }));
    }
    return { photos: (payload.photos || []).length };
  }

  const entries = readZip(buf);
  const recFile = entries.find(e => e.name === "flora-records.json");
  if (!recFile) throw new Error("that doesn't look like a Flora backup");
  const meta = JSON.parse(new TextDecoder().decode(recFile.data));
  if (meta.records) restoreRecords(meta.records);

  let n = 0;
  for (const item of meta.index || []) {
    const f = entries.find(e => e.name === item.file);
    if (!f) continue;
    const blob = new Blob([f.data], { type: "image/jpeg" });
    await ptx("readwrite", st => st.put({ id: item.id, entryId: item.entryId, blob, day: item.day,
      bytes: item.bytes || blob.size, originalBytes: item.originalBytes || blob.size,
      addedAt: item.addedAt || Date.now() }));
    n++;
  }
  return { photos: n };
}

/* One object URL per photo, created once and reused.

   Revoking inside an effect cleanup looks tidy but breaks: React
   re-runs effects (twice on mount under StrictMode, and again whenever
   the photo version changes), so the cleanup kills a URL that is still
   sitting in state — and the <img> renders as a broken icon. Caching by
   photo id removes the race entirely. Memory stays bounded because a
   term holds tens of photos, not thousands, and the URL is released
   the moment the photo is deleted. */
const urlCache = new Map();

function photoURL(rec) {
  let u = urlCache.get(rec.id);
  if (!u) { u = URL.createObjectURL(rec.blob); urlCache.set(rec.id, u); }
  return u;
}

function releaseURL(id) {
  const u = urlCache.get(id);
  if (u) { URL.revokeObjectURL(u); urlCache.delete(id); }
}

/* Some hosts block blob: URLs in img-src via Content-Security-Policy —
   sandboxed iframes are the common case. The upload succeeds, the blob
   is fine, but the <img> refuses to load and shows a broken icon.
   So: try the blob URL, and if it fails, fall back to a data URL, which
   is inline and survives a stricter policy. */
function PhotoImg({ rec, url, alt = "", style, fit = "cover" }) {
  const [src, setSrc] = React.useState(url);
  const [tried, setTried] = React.useState(false);

  React.useEffect(() => { setSrc(url); setTried(false); }, [url]);

  const onError = async () => {
    if (tried || !rec?.blob) return;
    setTried(true);
    try {
      const data = await new Promise(res => {
        const r = new FileReader();
        r.onload = () => res(r.result);
        r.onerror = () => res(null);
        r.readAsDataURL(rec.blob);
      });
      if (data) setSrc(data);
    } catch {}
  };

  return <img src={src} alt={alt} onError={onError}
    style={{ width: "100%", height: "100%", objectFit: fit, display: "block", ...style }} />;
}

/* the child's portrait lives in the same store under a reserved id */
const PROFILE_ID = "__profile__";
/* photos uploaded in bulk have no planned activity behind them */
const BULK_ID = "__past__";

function useProfilePhoto(version) {
  const items = useEntryPhotos(PROFILE_ID, version);
  return items[items.length - 1] || null;   // most recent wins
}

/* a portrait photo is usually taller than wide; a nature-walk shot is
   usually wider. Slots are landscape, so a portrait photo has to be
   cropped to fill one — unless the parent asks to keep the whole frame. */
function fitFor(rec, override) {
  if (override) return override;
  return "cover";
}

/* pass `day` to see only that day's photos for a repeating activity;
   omit it (Outputs, Portfolio) to see every photo ever taken for it */
function useEntryPhotos(entryId, version, day) {
  const [items, setItems] = React.useState([]);
  React.useEffect(() => {
    let cancelled = false;
    getPhotosFor(entryId)
      .then(rows => {
        if (cancelled) return;
        const keep = day ? rows.filter(r => !r.day || r.day === day) : rows;
        setItems(keep.map(r => ({ ...r, url: photoURL(r) })));
      })
      .catch(() => { if (!cancelled) setItems([]); });
    return () => { cancelled = true; };
  }, [entryId, version, day]);
  return items;
}

/* The mark is embedded rather than loaded from a file, so it shows even
   when Flora runs as a single file with nothing beside it. When the app
   is properly deployed the larger icon file is used instead. */
const LOGO_SMALL = "data:image/webp;base64,UklGRnYFAABXRUJQVlA4IGoFAABQGACdASpIAEgAPmEqkkYkIiGhKPtqOIAMCWUAyBhVftMNebPTDt4+fIsbigTc1PtyVSSl/l+HPat3iDIXagegv198zvirqAH5j9DbOu9XewR+t++2M+kQTsgkDiRNFbXfvU9ZS3g8+a0CRBMPPcW5+rcUp61Es/020/fDxsortYRtzqb6wPDkUiyYOPqGPQObe/a526Y0Zo5NZMuLxMv/tgF/AFff1A4BwiH4gMBExjcudqFIYoHytAiClGHQOyAm9GrRTQFEx05VUAD+/itOuvITItdy9dmV6JDjFNyUiyh45EepTgORp12kG5VsKEV0t5skncM2o0Q4JekXnMgnyluMDf+NaznFWDOYPy6q4hcXbrUl7t5gASQUKn6HMySfDbC0sQBZIL31i7p18GpyQPJILmO+v8dkHgdUm5pt9mk63oiyNUy5xOXGW3VwmdOBIXM8XagBUHi5iSZpSc6+waurtIfP8l/9a2ZSkSMcU2QS+8mzuFODckI38yvt2nnSR5SBNuEpRTRvBWMmYyflnyFfQQD5Drbd4CC57/ciPca2Kd6/0Eyq26llmFr9no4RN7Ar70RZJ1WYzRVip6o2QNLFX0NkA7eN1/JTdrJqP7btYMLYh2Sawgaq2eFLHhkTCdt93ixixhllWZg6T/CGF+todlLEbr9ulcZWwki+Hf+rK3ClYUwrSU3VMg+V8kR06M51VdbtwKxnG5z2fF3D5AgHeix/oHxJszdANfYThrObG1zStJ9klcgXUce37XSwgj8fvf1N2MRhh2H7Q1gx+CN13qU+8hv/wHT5TORCBsYQvDyTtyXYkn5Gj3Q6YqNsbZjgHrI6gZqLJN5OgYmpGIhYOSX+mubvREj5dNX4aJCjlGl4eP2YM6k1m6uGOq8/dPt/QQV7AOfpWh8H9Oy3e/eGutu5gVHkvbOEHn6WNJglEsch7a9BNm3n9p8NG4CODoayPKFpLPmTl8qWWiwvYH4q1ZrnGt3y44yOgDZdaiYjL2ylR8ft2oBJr5i8dZZ3tqu4UHROejKdtozY5NBfPWvQd8XQ79fCd9DsWNiQnviPcSZoJz8nc+1zaS1aSCXIDtJaibAMoYs1IDufmkZK+ztpGerkzzb0Q5NaLhsKEHYG1I0Hn8dzn7iZi0v39umWdGWqts/XAghkeXOvsJyCxx4cX2P2Bzm4voBpELU8IyeFMCrTBq+vZpB+5S6M25s04NpeQ1GWEEM3tY8ZEns9/XKIsJRTDCyxdQVlpFdWPTTtg9MwMU5UzRgwQhzmLWlKPxbgCvCntRmEmjXlGLO3AzXnp2QbJLm4HpDftGgPWZPcPl475CwtcCcxHo52PVHb6g98lL8TH0ZJYJMMqFVoOqQ/joi6//nok1K0fYR5Dd2sio08nSzRlGL0vRftDmLgTqFsLZuZz/rBHLmPhtU0TfpEvY2lWvJEQ/NIu853PgX3H02GiMTZ/x8bezaF+OPl7W88NpzTldu2EQUtA7iML5Mj1bq1QB3mluxaeJh86G3lPGhP7eYfi0bYcpBmx2DgIM0x/ATXhVm8Zb2Ilk4D+J3JL3Ax4v1IHx/qKw3WdNve+ynNK86DEvtt/fYeLbft7jaHX6hEUsg5SbFq6XHf5y7wBu5Z9hnVopLg222wq/qyWZ1hApeITeJB+8m3D3kIuq0FNtYnzB4fpVtb6NHh7inOnh7vcYwOgOxsr9XK/CUETeDyn2/15b2HoOtf1OfPpvJZey/ihGVuxWCJCZX7ZdoGsrEioumNEuBKPrmrTWZGyMcfBu3WcqJL0wFvz0z73JY2QTx6VGMzorzkXUh4xzjnwk9lmdH5pTu0n6TQz01uAQjyJ0fAAAA=";

function FloraMark({ size = 22, radius = 6 }) {
  const [src, setSrc] = React.useState("icons/icon-192.png");
  return (
    <img src={src} alt="Flora" width={size} height={size}
      onError={() => { if (src !== LOGO_SMALL) setSrc(LOGO_SMALL); }}
      style={{ width: size, height: size, borderRadius: radius, display: "block",
        flexShrink: 0, objectFit: "cover", background: "#fdf8f2" }} />);
}

/* ───────────────── installed or not ─────────────────
   Safari clears a site's storage if the site hasn't been opened for about
   seven days — a semester break is enough to lose a term. Adding Flora to
   the home screen makes iOS treat it as an installed app instead, which
   is exempt. This is the single largest cause of data loss on iPhone, so
   Flora asks for it rather than hoping the parent knows. */
function useInstalled() {
  const [v, setV] = React.useState(() => {
    try {
      return window.matchMedia?.("(display-mode: standalone)")?.matches
        || window.navigator.standalone === true;
    } catch { return false; }
  });
  React.useEffect(() => {
    const mq = window.matchMedia?.("(display-mode: standalone)");
    const on = () => setV(mq?.matches || window.navigator.standalone === true);
    mq?.addEventListener?.("change", on);
    return () => mq?.removeEventListener?.("change", on);
  }, []);
  return v;
}

const isIOS = () => {
  try {
    return /iPad|iPhone|iPod/.test(navigator.userAgent)
      || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  } catch { return false; }
};

function InstallPrompt({ dismissed, onDismiss, compact }) {
  const installed = useInstalled();
  const [open, setOpen] = React.useState(false);
  if (installed || dismissed) return null;
  const ios = isIOS();

  return (
    <div className="no-print" style={{ background: C.sand, border: "1px solid #e3d6bd",
      borderRadius: 12, padding: "13px 16px", marginBottom: 16 }}>
      <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
        <ShieldCheck size={17} style={{ color: C.gold, flexShrink: 0, marginTop: 2 }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13.5, fontWeight: 600, color: C.ink }}>
            Add Flora to your home screen</div>
          <div style={{ fontSize: 12.5, color: C.soft, lineHeight: 1.65, marginTop: 3 }}>
            Right now Flora is running as a web page, and a phone can clear a web page's storage —
            after a long break, or if you clear your browsing data. Adding it to your home screen makes
            your phone treat Flora as a proper app, and your term stays put.
          </div>

          {open && (
            <div style={{ marginTop: 11, background: "#fff", border: `1px solid ${C.line}`,
              borderRadius: 9, padding: "11px 13px" }}>
              {(ios
                ? ["Tap the Share button at the bottom of Safari — the square with an arrow.",
                   "Scroll down and tap \u201cAdd to Home Screen\u201d.",
                   "Tap Add. Flora appears with the other apps.",
                   "From now on, open Flora from that icon rather than Safari."]
                : ["Tap the three dots at the top right of your browser.",
                   "Tap \u201cInstall app\u201d or \u201cAdd to Home screen\u201d.",
                   "Confirm. Flora appears with the other apps.",
                   "From now on, open Flora from that icon."]
              ).map((t, i) => (
                <div key={i} style={{ display: "flex", gap: 9, padding: "5px 0", fontSize: 12.8,
                  color: C.soft, lineHeight: 1.6 }}>
                  <span style={{ fontWeight: 700, color: C.green, flexShrink: 0 }}>{i + 1}.</span>
                  <span>{t}</span></div>))}
              <div style={{ fontSize: 11.5, color: C.muted, marginTop: 7, lineHeight: 1.55 }}>
                It doesn't download anything, and it doesn't take up space beyond what you've already logged.
              </div>
            </div>)}
        </div>
        <div style={{ display: "flex", flexDirection: compact ? "column" : "row", gap: 7, flexShrink: 0 }}>
          <Btn small onClick={() => setOpen(o => !o)}>{open ? "Hide" : "Show me how"}</Btn>
          <Btn small tone="quiet" onClick={onDismiss}>Later</Btn>
        </div>
      </div>
    </div>);
}

/* ───────────────── what's actually working here ─────────────────
   Photos depend on several things a phone browser can quietly refuse:
   local storage for the image bytes, blob URLs for showing them, and a
   canvas for resizing. When something fails there's usually no error —
   just an empty square. This reports the facts instead. */
function useDiagnostics(photoVersion) {
  const [d, setD] = React.useState(null);
  React.useEffect(() => {
    let dead = false;
    (async () => {
      const out = {
        width: window.innerWidth,
        screen: window.screen ? `${window.screen.width}\u00d7${window.screen.height}` : "?",
        framed: window.self !== window.top,
        touch: (navigator.maxTouchPoints || 0) > 0,
        idb: false, photos: null, blobOK: false, canvasOK: false,
        persisted: false, quotaMB: null, usedMB: null, error: "",
      };
      try {
        const rows = await getAllPhotos();
        out.idb = true;
        out.photos = rows.length;
        if (rows.length) {
          const url = URL.createObjectURL(rows[0].blob);
          out.blobOK = await new Promise(res => {
            const i = new Image();
            i.onload = () => res(true); i.onerror = () => res(false);
            i.src = url;
            setTimeout(() => res(false), 2500);
          });
          URL.revokeObjectURL(url);
        }
      } catch (e) { out.error = String(e.message || e).slice(0, 90); }
      try {
        const c = document.createElement("canvas");
        c.width = c.height = 8;
        c.getContext("2d").fillRect(0, 0, 8, 8);
        out.canvasOK = await new Promise(res => c.toBlob(bl => res(!!bl), "image/jpeg", .8));
      } catch {}
      try {
        out.persisted = await navigator.storage?.persisted?.() || false;
        const est = await navigator.storage?.estimate?.();
        if (est) { out.quotaMB = est.quota / 1048576; out.usedMB = est.usage / 1048576; }
      } catch {}
      if (!dead) setD(out);
    })();
    return () => { dead = true; };
  }, [photoVersion]);
  return d;
}

/* a plain statement of whether this is running as an app or a page */
function InstallStatus() {
  const installed = useInstalled();
  const [show, setShow] = React.useState(false);
  return (
    <Panel title={installed ? "Flora is installed on this device" : "Flora is running as a web page"}
      right={installed
        ? <span style={{ fontSize: 11.5, color: C.green, fontWeight: 600 }}>Protected</span>
        : <span style={{ fontSize: 11.5, color: "#a4553b", fontWeight: 600 }}>At risk</span>}>
      {installed ? (
        <div style={{ fontSize: 13, color: C.soft, lineHeight: 1.7 }}>
          Your phone treats Flora as a proper app, so it won't clear your term during a long break.
          Keep opening it from the home screen icon rather than the browser.
        </div>
      ) : (
        <>
          <div style={{ fontSize: 13, color: C.soft, lineHeight: 1.7 }}>
            A phone can clear a web page's storage when it needs space, or if a site hasn't been opened
            for a week or two — a semester break is long enough. Adding Flora to your home screen makes
            it exempt. It takes about fifteen seconds.
          </div>
          <div style={{ marginTop: 11 }}>
            <Btn small onClick={() => setShow(v => !v)}>{show ? "Hide" : "Show me how"}</Btn>
          </div>
          {show && (
            <div style={{ marginTop: 11 }}>
              <InstallPrompt dismissed={false} onDismiss={() => {}} />
            </div>)}
        </>)}
    </Panel>);
}

function DiagnosticsPanel({ photoVersion }) {
  const d = useDiagnostics(photoVersion);
  const [copied, setCopied] = React.useState(false);
  const [trial, setTrial] = React.useState(null);
  if (!d) return <Panel title="Checking this device…"><div style={{ fontSize: 13, color: C.muted }}>One moment.</div></Panel>;

  const rows = [
    ["Screen", `${d.width}px wide \u00b7 device ${d.screen}${d.touch ? " \u00b7 touch" : ""}`, true],
    ["Shown inside another page", d.framed ? "yes" : "no", true],
    ["Photo storage on this device", d.idb ? "working" : "BLOCKED", d.idb],
    ["Photos held here", d.photos === null ? "—" : String(d.photos), d.photos !== 0],
    ["Showing a saved photo", d.photos ? (d.blobOK ? "working" : "BLOCKED") : "no photo to test", d.photos ? d.blobOK : true],
    ["Resizing a new photo", d.canvasOK ? "working" : "BLOCKED", d.canvasOK],
    ["Storage kept safe from clearing", d.persisted ? "yes" : "not granted", true],
    ["Space used", d.usedMB == null ? "—" : `${d.usedMB.toFixed(1)} MB of ${(d.quotaMB / 1024).toFixed(1)} GB`, true],
  ];
  const text = rows.map(([k, v]) => `${k}: ${v}`).join("\n") + (d.error ? `\nError: ${d.error}` : "");

  return (
    <Panel title="Is everything working on this device?">
      <div style={{ fontSize: 12.8, color: C.soft, lineHeight: 1.7, marginBottom: 12 }}>
        If photos aren't appearing, this says why. Anything marked BLOCKED is your browser refusing —
        usually private browsing, or Flora being shown inside another page.
      </div>
      {rows.map(([k, v, ok]) => (
        <div key={k} style={{ display: "flex", justifyContent: "space-between", gap: 12,
          padding: "8px 0", borderBottom: `1px solid ${C.line}`, fontSize: 12.8 }}>
          <span style={{ color: C.soft }}>{k}</span>
          <span style={{ fontWeight: 600, color: ok ? C.ink : "#a4553b", textAlign: "right" }}>{v}</span>
        </div>))}
      {d.error && <div style={{ fontSize: 11.5, color: "#a4553b", marginTop: 9 }}>Error: {d.error}</div>}
      <div style={{ marginTop: 13, display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
        <Btn small tone="quiet" onClick={() => {
          navigator.clipboard?.writeText(text + (trial ? "\nTest: " + trial.join(" | ") : ""))
            .then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
        }}>{copied ? "Copied" : "Copy this to send"}</Btn>

        {/* runs the exact path a real photo takes, and says which step
            fails — far more useful than "it didn't work" */}
        <label style={{ display: "inline-flex", alignItems: "center", gap: 7, cursor: "pointer",
          background: C.card, color: C.soft, border: `1px solid ${C.line}`, borderRadius: 9,
          fontWeight: 600, fontSize: 12.5, padding: "9px 14px", minHeight: 40 }}>
          <input type="file" accept="image/*,.heic,.heif" style={{ position: "absolute", width: 1, height: 1,
            opacity: 0, clip: "rect(0 0 0 0)" }}
            onChange={async e => {
              const f = e.target.files[0]; e.target.value = "";
              if (!f) return;
              const log = [`file ${(f.size / 1048576).toFixed(1)}MB ${f.type || "unknown type"}`];
              let id = null;
              try {
                const img = await decodeImage(f);
                log.push(`opened ${img.width}\u00d7${img.height} \u2713`);
                img.close();
              } catch (err) { log.push(`OPENING FAILED: ${err.message}`); setTrial(log); return; }
              try {
                id = await addPhoto("__selftest__", f);
                log.push("saved \u2713");
              } catch (err) { log.push(`SAVING FAILED: ${err.message}`); setTrial(log); return; }
              try {
                const rows = await getPhotosFor("__selftest__");
                const rec = rows.find(r => r.id === id);
                const url = URL.createObjectURL(rec.blob);
                const shown = await new Promise(res => {
                  const i = new Image();
                  i.onload = () => res(true); i.onerror = () => res(false);
                  i.src = url; setTimeout(() => res(false), 3000);
                });
                URL.revokeObjectURL(url);
                log.push(shown ? "displayed \u2713" : "DISPLAYING FAILED (browser blocked the image)");
                await deletePhoto(id);
                log.push("tidied up \u2713");
              } catch (err) { log.push(`READING BACK FAILED: ${err.message}`); }
              setTrial(log);
            }} />
          <Camera size={13} /> Test a photo now
        </label>
      </div>

      {trial && (
        <div style={{ marginTop: 11, background: C.wash, border: `1px solid ${C.line}`,
          borderRadius: 9, padding: "10px 12px" }}>
          {trial.map((l, i) => (
            <div key={i} style={{ fontSize: 12.3, lineHeight: 1.7,
              color: l.includes("FAILED") ? "#a4553b" : C.soft,
              fontWeight: l.includes("FAILED") ? 700 : 400 }}>{l}</div>))}
          <div style={{ fontSize: 11, color: C.muted, marginTop: 6 }}>
            Nothing is kept from this test — the photo is removed straight afterwards.
          </div>
        </div>)}
    </Panel>);
}

/* An activity can sit under two DepEd subjects — a Filipino folk song is
   both Filipino and Music, and a nature walk is Science and PE. Rather
   than force a choice, a row carries an optional second subject that
   counts in reports and lands on both portfolio pages. */
const subjectsOf = r => [r.subj, r.subj2].filter(Boolean);

function SubjectPills({ r, size }) {
  return (
    <span style={{ display: "inline-flex", gap: 4, flexWrap: "wrap" }}>
      {subjectsOf(r).map(sub => <Pill key={sub} color={subjColor(sub)}>{sub}</Pill>)}
    </span>);
}

/* ───────────────── suggested descriptions ─────────────────
   A parent looking at forty photos at quarter end can't face writing forty
   captions. Flora offers one it can see in the photo — she keeps it, edits
   it, or ignores it. Nothing is written into the portfolio without her
   pressing Use, because the caption goes out under her name. */
async function describePhoto(blob, context = {}) {
  const dataUrl = await new Promise(res => {
    const r = new FileReader();
    r.onload = () => res(r.result);
    r.readAsDataURL(blob);
  });
  const base64 = dataUrl.split(",")[1];
  const media = (dataUrl.match(/^data:([^;]+)/) || [])[1] || "image/jpeg";

  const hint = [context.subject && `Subject: ${context.subject}`,
                context.title && `Activity: ${context.title}`]
    .filter(Boolean).join(". ");

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 1000,
      messages: [{
        role: "user",
        content: [
          { type: "image", source: { type: "base64", media_type: media, data: base64 } },
          { type: "text", text:
`This is a photo from a Filipino Charlotte Mason homeschool portfolio. ${hint}

Write one sentence a parent could use as the caption, describing what the child is doing or what the work shows. Plain, warm, factual. Under 18 words.

Only describe what you can actually see. Don't name the child, don't guess an age, and don't praise. If the photo is unclear, say what is visible and nothing more.

Reply with the sentence only — no quotes, no preamble.` },
        ],
      }],
    }),
  });
  if (!res.ok) throw new Error("couldn't reach the description service");
  const data = await res.json();
  const text = (data.content || []).map(c => c.text || "").join(" ").trim();
  if (!text) throw new Error("no description came back");
  return text.replace(/^["']|["']$/g, "");
}

function SuggestCaption({ photo, subject, title, current, onUse }) {
  const [state, setState] = React.useState("idle");   // idle | working | ready | error
  const [text, setText] = React.useState("");
  const [msg, setMsg] = React.useState("");

  const run = async () => {
    setState("working"); setMsg("");
    try {
      const t = await describePhoto(photo.blob, { subject, title });
      setText(t); setState("ready");
    } catch (e) { setMsg(String(e.message || e)); setState("error"); }
  };

  if (state === "ready") {
    return (
      <div style={{ marginTop: 8, background: "#f4f6f0", border: `1px solid #dde5d4`,
        borderRadius: 9, padding: "10px 12px" }}>
        <div style={{ fontSize: 10, letterSpacing: 1.2, textTransform: "uppercase",
          color: C.muted, fontWeight: 700, marginBottom: 5 }}>Suggested</div>
        <textarea value={text} onChange={e => setText(e.target.value)} rows={2}
          style={{ ...inp, fontSize: 13, resize: "vertical", background: "#fff" }} />
        <div style={{ display: "flex", gap: 7, marginTop: 8, flexWrap: "wrap", alignItems: "center" }}>
          <Btn small onClick={() => { onUse(text); setState("idle"); }}>
            <Check size={13} /> {current ? "Replace caption" : "Use this"}</Btn>
          <Btn small tone="quiet" onClick={run}>Try again</Btn>
          <Btn small tone="quiet" onClick={() => setState("idle")}>Discard</Btn>
        </div>
        <div style={{ fontSize: 10.5, color: C.muted, marginTop: 7, lineHeight: 1.5 }}>
          Written by AI from the photo. Read it before you use it — it goes into your portfolio
          under your name.
        </div>
      </div>);
  }

  return (
    <div style={{ marginTop: 6 }}>
      <Btn small tone="quiet" disabled={state === "working"} onClick={run}>
        <Sparkles size={12} /> {state === "working" ? "Looking…" : "Suggest a description"}</Btn>
      {state === "error" && (
        <div style={{ fontSize: 11, color: "#a4553b", marginTop: 5 }}>{msg}</div>)}
    </div>);
}

/* ───────────────── student chip ─────────────────
   Portfolios are per child and per term. Without this on screen it's
   easy to log a whole morning against the wrong one — so who and which
   term stays visible everywhere. */
function StudentChip({ about, prov, term, photoVersion, photoFit = {}, onClick, compact }) {
  const p = useProfilePhoto(photoVersion);
  const initials = (about.name || "?").trim().split(/\s+/).map(w => w[0]).slice(0, 2).join("").toUpperCase();
  const size = compact ? 32 : 40;
  return (
    <button onClick={onClick} title="Student and term — tap to change"
      style={{ display: "flex", alignItems: "center", gap: compact ? 8 : 10, cursor: "pointer",
        background: compact ? "transparent" : C.card, border: compact ? "none" : `1px solid ${C.line}`,
        borderRadius: 11, padding: compact ? 0 : "7px 13px 7px 7px", minHeight: 44 }}>
      <div style={{ width: size, height: size, borderRadius: "50%", overflow: "hidden", flexShrink: 0,
        background: compact ? "#55663f" : C.wash,
        border: compact ? "1.5px solid #6f8054" : `1px solid ${C.line}`,
        display: "flex", alignItems: "center", justifyContent: "center" }}>
        {p ? <PhotoImg rec={p} url={p.url} fit={photoFit[p.id] || "cover"} />
           : <span style={{ fontSize: compact ? 12 : 13.5, fontWeight: 700,
               color: compact ? "#dfe6d4" : C.muted }}>{initials}</span>}
      </div>
      <div style={{ textAlign: "left", lineHeight: 1.25 }}>
        <div style={{ fontSize: compact ? 12.5 : 13.5, fontWeight: 600,
          color: compact ? "#fff" : C.ink, whiteSpace: "nowrap" }}>
          {about.name || "Add your child"}</div>
        <div style={{ fontSize: compact ? 10 : 11, color: compact ? "#a8b79a" : C.muted, whiteSpace: "nowrap" }}>
          {prov ? prov.level : "Kindergarten"} · {term}</div>
      </div>
    </button>);
}

/* ───────────────────────── viewport ───────────────────────── */
/* Phones get a different shell, not a squeezed desktop: a bottom tab
   bar, stacked cards, and 44px tap targets. The heavy screens
   (portfolio assembly, reports) stay reachable but are meant for a
   laptop — which matches how families actually work: capture on the
   phone, assemble on the computer. */
/* window.innerWidth alone is not enough. Inside an embedded frame a phone
   can report a desktop-sized width, which hands the parent the sidebar
   layout squeezed onto a 6-inch screen — the wide, unscrollable page.
   screen.width still reports the real device, so a coarse pointer on a
   small screen counts as mobile whatever the frame claims. */
function detectMobile(breakpoint) {
  if (typeof window === "undefined") return false;
  const narrow = window.innerWidth < breakpoint;
  let coarse = false, small = false;
  try {
    coarse = window.matchMedia?.("(pointer: coarse)")?.matches
      || navigator.maxTouchPoints > 0;
    const sw = window.screen ? Math.min(window.screen.width, window.screen.height) : 9999;
    small = sw < 820;
  } catch {}
  return narrow || (coarse && small);
}

function useIsMobile(breakpoint = 760) {
  const [m, setM] = React.useState(() => detectMobile(breakpoint));
  React.useEffect(() => {
    const on = () => setM(detectMobile(breakpoint));
    on();
    window.addEventListener("resize", on);
    window.addEventListener("orientationchange", on);
    return () => { window.removeEventListener("resize", on); window.removeEventListener("orientationchange", on); };
  }, [breakpoint]);
  return m;
}

/* four tabs is the most a thumb can reach comfortably */
const MOBILE_NAV = [
  { k: "home", label: "Today", icon: Sun },
  { k: "outputs", label: "Photos", icon: Camera },
  { k: "portfolio", label: "Portfolio", icon: FolderHeart },
  { k: "more", label: "More", icon: Menu },
];

/* Everything the four tabs don't reach. Without this the weekly plan,
   the calendar and the reports are simply unreachable on a phone. */
function PageMore({ go, prov }) {
  const items = NAV.filter(n => !["home", "outputs", "portfolio"].includes(n.k));
  return (
    <>
      <Title sub="Everything else in Flora.">More</Title>
      <Panel pad={0}>
        {items.map(n => (
          <button key={n.k} onClick={() => go(n.k)}
            style={{ width: "100%", display: "flex", alignItems: "center", gap: 13, minHeight: 58,
              padding: "14px 16px", background: "none", border: "none",
              borderBottom: `1px solid ${C.line}`, cursor: "pointer", textAlign: "left" }}>
            <n.icon size={19} style={{ color: C.green, flexShrink: 0 }} />
            <span style={{ flex: 1, fontSize: 15, color: C.ink }}>{n.label}</span>
            <ChevronRight size={16} style={{ color: C.muted }} />
          </button>))}
      </Panel>
      <div style={{ fontSize: 11.5, color: C.muted, textAlign: "center", marginTop: 14, lineHeight: 1.6 }}>
        {prov ? `${prov.short} · ${prov.level}` : "Kindergarten"} · Flora keeps everything on this device.
      </div>
    </>);
}

/* ═══════════════════════════ APP ═══════════════════════════ */
export default function FloraV1() {
  const [page, setPage] = useState("home");
  const [jumpTo, setJumpTo] = useState(null);      // where to land when a page opens
  const go = (p, target) => { setPage(p); setJumpTo(target || null); };
  const [plan, setPlan] = useState(BASE_PLAN);
  const [done, setDone] = useState({});
  const [fav, setFav] = useState({});
  const [caps, setCaps] = useState({});
  const [savedAt, setSavedAt] = useState({});   // entry id -> timestamp the parent pressed Save
  const [chores, setChores] = useState(["Clean up toys"]);
  const [code, setCode] = useState(null);
  const [about, setAbout] = useState({ name: "", hi: "", fav: "", proud: "", grow: "" });
  const [termIdx, setTermIdx] = useState(0);
  const [termSystem, setTermSystem] = useState(null);   // "semester" | "quarter" | null = follow the provider
  const [curric, setCurric] = useState([]);
  const [secOn, setSecOn] = useState(null);
  const [logFreq, setLogFreq] = useState("daily");
  const [stickers, setStickers] = useState(["basket"]);
  const [notes, setNotes] = useState({});
  const [vids, setVids] = useState({});
  const [uploadTo, setUploadTo] = useState("youtube");
  const [events, setEvents] = useState(SEED_EVENTS);
  const [email, setEmail] = useState("");
  const [emailOn, setEmailOn] = useState(true);
  const [showHolidays, setShowHolidays] = useState(true);
  const [mySubj, setMySubj] = useState([]);      // subjects the parent added
  const [myFeast, setMyFeast] = useState([]);    // CM activities the parent added
  const [hiddenFeast, setHiddenFeast] = useState([]);  // built-ins she's removed
  const [feastRenames, setFeastRenames] = useState({});// built-ins she's renamed
  const [ready, setReady] = useState(false);
  const isMobile = useIsMobile();
  const [photoFit, setPhotoFit] = useState({});   // photo id -> "contain" when the parent wants the whole frame
  const [photoMeta, setPhotoMeta] = useState({}); // photo id -> { subject, title, date } for photos with no activity
  const [photoVersion, setPhotoVersion] = useState(0);
  const bumpPhotos = () => setPhotoVersion(v => v + 1);
  const [lastBackup, setLastBackup] = useState(null);
  const [dismissedBackup, setDismissedBackup] = useState(null);
  const [installHidden, setInstallHidden] = useState(null);   // timestamp of "Later"
  const [drive, setDrive] = useState({ clientId: "", folder: "Flora Backups", on: false });
  const [lastDrive, setLastDrive] = useState(null);      // { at, name, link }
  const [driveNotice, setDriveNotice] = useState(null);  // the weekly heads-up

  /* without this, browsers can quietly evict a term of photos */
  useEffect(() => { requestPersistence(); }, []);

  /* without this a phone renders at desktop width and everything looks tiny */
  useEffect(() => {
    let m = document.querySelector('meta[name="viewport"]');
    if (!m) { m = document.createElement("meta"); m.name = "viewport"; document.head.appendChild(m); }
    m.content = "width=device-width, initial-scale=1, viewport-fit=cover";
  }, []);

  /* the pieces that turn a web page into something a phone will install:
     a manifest, icons, and a worker that keeps the app openable offline */
  useEffect(() => {
    const head = document.head;
    const link = (rel, href, extra = {}) => {
      if (head.querySelector(`link[rel="${rel}"][href="${href}"]`)) return;
      const el = document.createElement("link");
      el.rel = rel; el.href = href;
      Object.entries(extra).forEach(([k, v]) => el.setAttribute(k, v));
      head.appendChild(el);
    };
    const meta = (name, content, useProperty = false) => {
      const sel = useProperty ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let el = head.querySelector(sel);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(useProperty ? "property" : "name", name);
        head.appendChild(el);
      }
      el.content = content;
    };

    document.title = "Flora — Your Homeschool Companion";
    link("manifest", "manifest.webmanifest");
    link("icon", "icons/favicon-64.png", { sizes: "64x64", type: "image/png" });
    link("apple-touch-icon", "icons/apple-touch-icon.png");
    meta("theme-color", "#3f4d35");
    meta("apple-mobile-web-app-capable", "yes");
    meta("apple-mobile-web-app-title", "Flora");
    meta("apple-mobile-web-app-status-bar-style", "default");
    meta("description", "Log the day as it happens, and let the quarterly portfolio build itself.");

    if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
      navigator.serviceWorker.register("sw.js").catch(() => {});
    }
  }, []);

  /* one file: records plus every photo, the same shape either way */
  /* A zip the parent can actually open: real .jpg files in a folder,
     named by date and activity, plus what Flora needs to restore. */
  const buildBackup = async () => {
    const rec = await store.get("flora:v3");
    const rows = await getAllPhotos().catch(() => []);
    const files = [];
    const index = [];
    const used = {};

    for (const r of rows) {
      const row = plan.find(p2 => p2.id === r.entryId);
      const label = r.entryId === PROFILE_ID ? "Portrait"
        : row ? safeName(row.book || row.topic || row.subj)
        : (photoMeta[r.id]?.title ? safeName(photoMeta[r.id].title) : "Added photo");
      const day = r.day || (r.addedAt ? isoDay(r.addedAt) : "undated");
      const base = `${day} ${label}`;
      used[base] = (used[base] || 0) + 1;
      const name = `photos/${base}${used[base] > 1 ? ` (${used[base]})` : ""}.jpg`;
      files.push({ name, data: r.blob });
      index.push({ id: r.id, entryId: r.entryId, day: r.day, addedAt: r.addedAt,
        bytes: r.bytes, originalBytes: r.originalBytes, file: name });
    }

    files.push({ name: "flora-records.json",
      data: JSON.stringify({ version: 2, savedAt: Date.now(), records: rec?.value || "{}", index }) });

    const child = about?.name || "your child";
    files.push({ name: "READ ME.txt", data:
`Flora backup — ${new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}

${child} · ${prov ? prov.level : "Kindergarten"} · ${term}
${rows.length} photo${rows.length === 1 ? "" : "s"}

WHAT'S IN HERE
  photos/            every photo, as ordinary .jpg files you can open,
                     named by the day and the activity
  flora-records.json what Flora needs to put everything back

TO RESTORE
  Open Flora, go to Settings, and choose "Restore from a backup".
  Pick this zip file. Your photos, notes and ticks all come back.

Keep this file somewhere safe — your Google Drive, or anywhere that
isn't only on one device. The photos here are portfolio-sized copies,
not the full-resolution originals from your camera.
` });

    const blob = await makeZip(files);
    return { blob, photos: rows.length };
  };

  const sendToDrive = async ({ silent = false } = {}) => {
    if (!drive.clientId) return { ok: false, reason: "no-client-id" };
    try {
      const token = await driveToken(drive.clientId, silent);
      const folderId = await driveFolder(token, drive.folder || "Flora Backups");
      const { blob, photos } = await buildBackup();
      const name = `flora-backup-${new Date().toISOString().slice(0, 10)}.zip`;
      const file = await driveUpload(token, folderId, name, blob);
      await drivePrune(token, folderId);
      const info = { at: Date.now(), name, link: file.webViewLink || "", photos,
        sizeMB: blob.size / 1048576 };
      setLastDrive(info);
      setLastBackup(info.at);
      store.set("flora:lastBackup", String(info.at)).catch(() => {});
      return { ok: true, ...info };
    } catch (e) {
      return { ok: false, reason: String(e.message || e) };
    }
  };

  /* Flora can't upload while it's closed, so the weekly send happens the
     next time it's opened. Silent first — only nudge if consent lapsed. */
  useEffect(() => {
    if (!ready || !drive.on || !drive.clientId) return;
    const due = !lastDrive || (Date.now() - lastDrive.at) / 86400000 >= 7;
    if (!due) return;
    let cancelled = false;
    (async () => {
      const r = await sendToDrive({ silent: true });
      if (cancelled) return;
      setDriveNotice(r.ok
        ? { kind: "sent", ...r }
        : { kind: "needs-tap" });
    })();
    return () => { cancelled = true; };
  }, [ready, drive.on, drive.clientId]);

  const doBackup = async () => {
    try {
      const { blob, photos } = await buildBackup();
      const name = `flora-backup-${new Date().toISOString().slice(0, 10)}.zip`;
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url; link.download = name; link.click();
      URL.revokeObjectURL(url);
      const now = Date.now();
      setLastBackup(now);
      store.set("flora:lastBackup", String(now)).catch(() => {});
      return { photos, sizeMB: blob.size / 1048576, name };
    } catch (e) { return null; }
  };
  const doImport = async (file) => {
    const r = await importBackup(file, (recordsJSON) => {
      store.set("flora:v3", recordsJSON).catch(() => {});
    });
    bumpPhotos();
    return r;
  };
  useEffect(() => { store.get("flora:lastBackup").then(r => r && setLastBackup(Number(r.value))).catch(() => {}); }, []);

  const prov = code ? PROVIDERS[code] : null;
  /* LLH submits Kindergarten by semester and Grades 1+ by quarter, and
     other providers differ again — so the provider code sets a sensible
     default and the parent can still pick whichever applies to her. */
  const SEMESTERS = ["First Semester", "Second Semester"];
  const QUARTERS = ["First Quarter", "Second Quarter", "Third Quarter", "Fourth Quarter"];
  const providerSystem = prov ? (prov.termWord.toLowerCase() === "semester" ? "semester" : "quarter") : "quarter";
  const system = termSystem || providerSystem;
  const terms = system === "semester" ? SEMESTERS : QUARTERS;
  const term = terms[Math.min(termIdx, terms.length - 1)] || terms[0];
  const termWord = system === "semester" ? "Semester" : "Quarter";
  /* switching between semesters and quarters can leave the index out of
     range — clamp it rather than render an undefined term */
  useEffect(() => { if (termIdx > terms.length - 1) setTermIdx(0); }, [terms.length, termIdx]);

  useEffect(() => { (async () => {
    try { const r = await store.get("flora:v3");
      if (r) { const s = JSON.parse(r.value);
        setDone(s.done || {}); setFav(s.fav || {}); setCaps(s.caps || {}); setSavedAt(s.savedAt || {});
        setPhotoFit(s.photoFit || {}); setPhotoMeta(s.photoMeta || {});
        if (s.drive) setDrive(s.drive);
        if (s.installHidden) setInstallHidden(s.installHidden);
        if (s.lastDrive) setLastDrive(s.lastDrive);
        setChores(s.chores || ["Clean up toys"]); setCode(s.code || null);
        setAbout(s.about || { name: "", hi: "", fav: "", proud: "", grow: "" });
        setTermIdx(typeof s.termIdx === "number" ? s.termIdx : 0);
        setTermSystem(s.termSystem || null);
        setCurric(s.curric || []); setSecOn(s.secOn || null);
        setLogFreq(s.logFreq || "daily"); setStickers(s.stickers || ["basket"]);
        setNotes(s.notes || {}); setVids(s.vids || {}); setUploadTo(s.uploadTo || "youtube");
        setMySubj(s.mySubj || []); setMyFeast(s.myFeast || []);
        setHiddenFeast(s.hiddenFeast || []); setFeastRenames(s.feastRenames || {});
        if (Array.isArray(s.events)) setEvents(s.events);
        setEmail(s.email || ""); setEmailOn(s.emailOn !== false); setShowHolidays(s.showHolidays !== false);
        if (Array.isArray(s.plan) && s.plan.length) setPlan(s.plan); } } catch {}
    setReady(true); })(); }, []);
  useEffect(() => { if (!ready) return;
    store.set("flora:v3", JSON.stringify({ done, fav, caps, savedAt, photoFit, photoMeta, drive, lastDrive, installHidden, chores, code, about, termIdx, termSystem, curric, secOn, logFreq, stickers, notes, vids, uploadTo, mySubj, myFeast, hiddenFeast, feastRenames, events, email, emailOn, showHolidays, plan })).catch(() => {});
  }, [done, fav, caps, savedAt, photoFit, photoMeta, drive, lastDrive, installHidden, chores, code, about, termIdx, termSystem, curric, secOn, logFreq, stickers, notes, vids, uploadTo, mySubj, myFeast, hiddenFeast, feastRenames, events, email, emailOn, showHolidays, plan, ready]);

  const applyCode = (c) => {
    const key = c.trim().toUpperCase();
    if (!PROVIDERS[key]) return false;
    const P = PROVIDERS[key];
    setCode(key);
    /* strict by default: only what the provider requires is switched on */
    setSecOn(Object.fromEntries(Object.keys(SECTION_META).map(s => [s, P.required.includes(s)])));
    setLogFreq(P.logFreq || "daily");
    return true;
  };
  const upd = (id, patch) => setPlan(plan.map(p => p.id === id ? { ...p, ...patch } : p));
  const setMin = (id, m) => upd(id, { m: Math.max(1, Math.min(120, m)) });
  const addRow = (day) => setPlan([...plan, { id: "n" + Date.now() + Math.random().toString(36).slice(2, 6),
    m: 10, book: "", topic: "", subj: "Values Education", feast: "Read Aloud",
    music: "", link: "", cover: "", days: [day] }]);
  const delRow = (id) => setPlan(plan.filter(p => p.id !== id));
  /* the real clock — Home follows the actual day and rolls over at midnight */
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(n => {
      const d = new Date();
      return d.toDateString() === n.toDateString() ? n : d;   // only re-render when the day changes
    }), 30000);
    return () => clearInterval(t);
  }, []);
  const todayIdx = now.getDay();
  const sections = secOn || Object.fromEntries(Object.keys(SECTION_META).map(s => [s, true]));
  /* every photo Flora holds is a phone original the parent no longer has to keep */
  /* real figures, read from the photos actually stored */
  const [pstats, setPstats] = useState({ count: 0, heldMB: 0, originalMB: 0, freedMB: 0 });
  const noPhotosHere = pstats.count === 0;
  useEffect(() => { photoStats().then(setPstats).catch(() => {}); }, [photoVersion]);
  const photoCount = pstats.count;
  const freedMB = pstats.freedMB;

  /* holidays are official dates, not the parent's own entries — merged for display, never edited */
  const allEvents = showHolidays ? [...events, ...holidayEvents()] : events;

  const subjOpts = [...SUBJ_OPTIONS, ...mySubj];
  /* the provider's own wheel when a code is set, otherwise Flora's list —
     then the parent's own additions, minus anything she has removed, with
     her renames applied */
  const baseFeast = prov?.feast || FEAST_OPTIONS;
  const feastOpts = [...baseFeast, ...myFeast]
    .filter(f => !hiddenFeast.includes(f))
    .map(f => feastRenames[f] || f)
    .filter((f, i, a) => a.indexOf(f) === i);

  const addSubj = v => setMySubj(l => l.includes(v) || SUBJ_OPTIONS.includes(v) ? l : [...l, v]);
  const addFeast = v => setMyFeast(l => l.includes(v) || feastOpts.includes(v) ? l : [...l, v]);

  /* renaming carries through to every activity already using it, so a
     term of logging isn't orphaned by a change of wording */
  const renameFeast = (from, to) => {
    const name = to.trim();
    if (!name || name === from) return;
    if (myFeast.includes(from)) setMyFeast(l => l.map(x => x === from ? name : x));
    else setFeastRenames(m => ({ ...m, [from]: name }));
    setPlan(rows => rows.map(r => r.feast === from ? { ...r, feast: name } : r));
  };

  const removeFeast = name => {
    if (myFeast.includes(name)) setMyFeast(l => l.filter(x => x !== name));
    else {
      const original = Object.keys(feastRenames).find(k => feastRenames[k] === name) || name;
      setHiddenFeast(l => l.includes(original) ? l : [...l, original]);
    }
  };
  const feastInUse = name => plan.filter(r => r.feast === name).length;

  const shared = { plan, setPlan, upd, setMin, addRow, delRow, todayIdx, now, done, setDone, fav, setFav, caps, setCaps, notes, setNotes, vids, setVids, uploadTo, setUploadTo, subjOpts, feastOpts, addSubj, addFeast, renameFeast, removeFeast, feastInUse, events, setEvents, allEvents, email, setEmail, emailOn, setEmailOn, showHolidays, setShowHolidays, chores, setChores,
    go, jumpTo, setJumpTo, prov, code, applyCode, setCode, about, setAbout, curric, setCurric,
    sections, setSecOn, secOn, freedMB, photoCount, pstats, logFreq, setLogFreq, stickers, setStickers,
    photoVersion, bumpPhotos, doBackup, doImport, lastBackup, dismissedBackup, setDismissedBackup, isMobile,
    drive, setDrive, lastDrive, sendToDrive, driveNotice, setDriveNotice, noPhotosHere,
    installHidden, hideInstall: () => setInstallHidden(Date.now()),
    savedAt, setSavedAt, termIdx, setTermIdx, term, terms, termWord, system, termSystem, setTermSystem,
    providerSystem, photoFit, setPhotoFit, photoMeta, setPhotoMeta };

  return (
    <div className={isMobile ? "flora-mobile" : ""}
      style={{ background: C.cream, minHeight: 700, color: C.ink,
        fontFamily: "'Karla', system-ui, sans-serif",
        overflowX: isMobile ? "hidden" : "visible" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Karla:wght@300;400;500;600;700&display=swap');
        *{box-sizing:border-box} input,select,textarea{font-family:inherit}
        .frow:hover{background:#faf8f2}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.45}}
        @media print{.no-print{display:none!important}}
        @media (max-width: 760px){
          input,select,textarea{font-size:16px}   /* stops iOS zooming on focus */
          button{-webkit-tap-highlight-color:transparent}
        }
        /* keep the page from scrolling sideways without overriding every
           element's width, which broke grid columns */
        .flora-mobile{overflow-x:hidden;max-width:100vw}
        .flora-mobile img,.flora-mobile video,.flora-mobile canvas{max-width:100%;height:auto}
        .flora-mobile table{display:block;overflow-x:auto;max-width:100%}
        .flora-mobile pre{max-width:100%;overflow-x:auto}
      `}</style>
      <div style={{ display: "flex", minHeight: 700 }}>
        {!isMobile && <div className="no-print" style={{ width: 196, background: C.deep, flexShrink: 0, padding: "18px 12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "0 8px 16px" }}>
            <FloraMark size={30} radius={8} />
            <div><div style={{ fontFamily: serif, fontSize: 21, color: "#fff", letterSpacing: 3, lineHeight: 1 }}>FLORA</div>
              <div style={{ fontSize: 8, letterSpacing: 1.6, color: "#a8b79a", textTransform: "uppercase", marginTop: 2 }}>
                {prov ? prov.level : "Kindergarten"}</div></div>
          </div>
          {prov && (
            <div style={{ margin: "0 4px 12px", padding: "8px 10px", borderRadius: 8, background: "#4d5f3a" }}>
              <div style={{ fontSize: 9, letterSpacing: 1.3, textTransform: "uppercase", color: "#a8b79a" }}>Provider set</div>
              <div style={{ fontSize: 11.5, color: "#e8eadf", marginTop: 2, lineHeight: 1.35 }}>{prov.short} · {prov.termWord}s</div>
            </div>)}
          {NAV.map(n => { const on = page === n.k; return (
            <button key={n.k} onClick={() => go(n.k)} style={{ width: "100%", display: "flex", alignItems: "center",
              gap: 9, padding: "9px 10px", marginBottom: 2, borderRadius: 8, border: "none", cursor: "pointer",
              textAlign: "left", background: on ? C.green : "transparent", color: on ? "#fff" : "#b8c4aa",
              fontSize: 13, fontWeight: on ? 600 : 400 }}><n.icon size={15} />{n.label}</button>); })}

        </div>}

        {isMobile && (
          <div className="no-print" style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 40,
            background: C.deep, padding: "10px 14px", display: "flex", alignItems: "center", gap: 9 }}>
            <FloraMark size={26} radius={7} />
            <div style={{ fontFamily: serif, fontSize: 17, color: "#fff", letterSpacing: 2.4, lineHeight: 1 }}>FLORA</div>
            <div style={{ marginLeft: "auto" }}>
              <StudentChip about={about} prov={prov} term={term} photoVersion={photoVersion}
                photoFit={photoFit} onClick={() => go("settings", "student")} compact /></div>
          </div>)}

        <div style={{ flex: 1, minWidth: 0, position: "relative",
          padding: isMobile ? "54px 13px 84px" : "26px 30px 60px" }}>
          {/* sits level with the page heading rather than on a row of its
              own, so it costs no vertical space */}
          {!isMobile && (
            <div className="no-print" style={{ position: "absolute", top: 22, right: 30, zIndex: 20 }}>
              <StudentChip about={about} prov={prov} term={term} photoVersion={photoVersion}
                photoFit={photoFit} onClick={() => go("settings", "student")} />
            </div>)}
          {page === "home" && <PageHome {...shared} />}
          {page === "week" && <PageWeek {...shared} />}
          {page === "calendar" && <PageCalendar {...shared} />}
          {page === "subjects" && <PageSubjects {...shared} />}
          {page === "outputs" && <PageOutputs {...shared} />}
          {page === "reports" && <PageReports {...shared} />}
          {page === "portfolio" && <PagePortfolio {...shared} />}
          {page === "library" && <PageLibrary />}
          {page === "others" && <PageOthers />}
          {page === "settings" && <PageSettings {...shared} />}
          {page === "feedback" && <PageFeedback />}
          {page === "more" && <PageMore go={go} prov={prov} />}

          {isMobile && !MOBILE_NAV.some(n => n.k === page) && (
            <button onClick={() => go("more")} style={{ marginTop: 22, width: "100%", minHeight: 44,
              border: `1px solid ${C.line}`, background: C.card, color: C.soft, borderRadius: 10,
              fontSize: 13.5, fontWeight: 600, cursor: "pointer" }}>← Back to More</button>)}
        </div>

        {isMobile && (
          <div className="no-print" style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 40,
            background: C.deep, display: "flex", paddingBottom: "env(safe-area-inset-bottom)" }}>
            {MOBILE_NAV.map(n => {
              const on = n.k === "more"
                ? !["home", "outputs", "portfolio"].includes(page)
                : page === n.k;
              return (
                <button key={n.k} onClick={() => go(n.k)} style={{ flex: 1, minHeight: 58, border: "none",
                  background: "transparent", cursor: "pointer", display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "center", gap: 3, padding: "8px 0",
                  color: on ? "#fff" : "#8e9c7e" }}>
                  <n.icon size={19} />
                  <span style={{ fontSize: 10.5, fontWeight: on ? 700 : 500 }}>{n.label}</span>
                </button>);
            })}
          </div>)}
      </div>
    </div>
  );
}

/* ───────────────── minutes stepper ───────────────── */
function MinBox({ value, onChange }) {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", border: `1px solid ${C.line}`, borderRadius: 7, overflow: "hidden", background: "#fff" }}>
      <button onClick={() => onChange(value - 1)} style={{ border: "none", background: "none", padding: "3px 6px", cursor: "pointer", color: C.muted }}><Minus size={11} /></button>
      <input value={value} onChange={e => onChange(parseInt(e.target.value.replace(/\D/g, "") || "0", 10))}
        style={{ width: 26, border: "none", outline: "none", textAlign: "center", fontSize: 12.5, color: C.ink, padding: "3px 0" }} />
      <button onClick={() => onChange(value + 1)} style={{ border: "none", background: "none", padding: "3px 6px", cursor: "pointer", color: C.muted }}><Plus size={11} /></button>
    </div>);
}

/* ───────────────── save bar ─────────────────
   Everything already writes to storage as it's typed. But autosave is
   invisible, and invisible isn't reassuring — a parent recording her
   child's term wants to know it's kept. Pressing Save settles the
   fields into a quiet, read-only state so the entry visibly stops
   being a draft. Edit puts it back. */

/* muted styling for a field that has been saved */
const settled = on => on
  ? { background: "#f4f3ee", color: C.soft, borderColor: "#e9e6db", cursor: "default" }
  : {};

function SaveBar({ id, day, savedAt, setSavedAt, compact }) {
  const [flash, setFlash] = React.useState(false);
  const ts = day ? readDay(savedAt, id, day) : savedAt[id];

  const save = () => {
    setSavedAt(day ? writeDay(savedAt, id, day, Date.now()) : { ...savedAt, [id]: Date.now() });
    setFlash(true);
    setTimeout(() => setFlash(false), 2200);
  };
  const edit = () => {
    if (day) { setSavedAt(clearDay(savedAt, id, day)); return; }
    const next = { ...savedAt };
    delete next[id];
    setSavedAt(next);
  };

  if (ts) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 9, flexWrap: "wrap",
        marginTop: compact ? 9 : 12 }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12.5,
          color: C.green, fontWeight: 600 }}>
          <Check size={14} /> {flash ? "Saved" : `Saved ${new Date(ts).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}`}
        </span>
        <button type="button" onClick={edit}
          style={{ background: "none", border: "none", cursor: "pointer", padding: 0,
            fontSize: 12, color: C.muted, textDecoration: "underline" }}>Edit</button>
      </div>);
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap",
      marginTop: compact ? 9 : 12 }}>
      <Btn small onClick={save}><Check size={13} /> Save this entry</Btn>
      <span style={{ fontSize: 11.5, color: C.muted }}>Kept as you type — this just marks it finished.</span>
    </div>);
}

/* ───────────────── mobile activity cards ─────────────────
   On a phone the day is a stack of cards, not a nine-column table.
   One tap marks an activity done; the photo button is the largest
   thing on the card, because capture is the job a phone is for. */
function MobileDay({ rows, done, setDone, fav, setFav, caps, setCaps, notes, setNotes,
  photoVersion, bumpPhotos, savedAt, setSavedAt, day, dim }) {
  const [open, setOpen] = React.useState(null);
  if (!rows.length) return null;
  return (
    <div style={{ display: "grid", gap: 10, padding: "12px 12px 14px" }}>
      {rows.map(r => {
        const isDone = !!readDay(done, r.id, day), expanded = open === r.id;
        return (
          <div key={r.id} style={{ border: `1px solid ${C.line}`, borderRadius: 12, background: "#fff",
            overflow: "hidden", opacity: dim ? .62 : 1 }}>
            <div style={{ display: "flex", gap: 11, padding: "13px 13px 11px", alignItems: "flex-start" }}>
              <button onClick={() => setDone(isDone ? clearDay(done, r.id, day) : writeDay(done, r.id, day, Date.now()))}
                aria-label={isDone ? "Mark as not done" : "Mark as done"}
                style={{ width: 30, height: 30, minWidth: 30, borderRadius: "50%", marginTop: 1,
                  border: isDone ? "none" : `1.5px solid ${C.line}`, background: isDone ? C.green : "#fff",
                  cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}>
                {isDone && <Check size={15} style={{ color: "#fff" }} />}</button>

              <button onClick={() => setOpen(expanded ? null : r.id)}
                style={{ flex: 1, minWidth: 0, textAlign: "left", background: "none", border: "none",
                  padding: 0, cursor: "pointer" }}>
                <div style={{ fontSize: 15, fontWeight: 500, color: C.ink, lineHeight: 1.35,
                  textDecoration: isDone ? "line-through" : "none" }}>
                  {r.book || r.topic || "Untitled"}</div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center", marginTop: 6 }}>
                  <SubjectPills r={r} />
                  <span style={{ fontSize: 11.5, color: C.muted }}>{r.feast} · {r.m} min</span>
                </div>
              </button>

              <button onClick={() => setFav({ ...fav, [r.id]: !fav[r.id] })}
                aria-label="Include in the portfolio"
                style={{ background: "none", border: "none", cursor: "pointer", padding: 4, marginTop: -2 }}>
                <Star size={19} fill={fav[r.id] ? C.blush : "none"}
                  style={{ color: fav[r.id] ? C.blush : C.line }} /></button>
            </div>

            <div style={{ padding: "0 13px 13px" }}>
              {!readDay(savedAt, r.id, day) && <AddPhoto entryId={r.id} onAdded={bumpPhotos} block small
                label={fav[r.id] ? "Add photo for the portfolio" : "Add photo"} />}
              <EntryPhotos entryId={r.id} version={photoVersion} onChange={bumpPhotos} size={54} day={day}
                locked={!!readDay(savedAt, r.id, day)} />

              {expanded && (
                <div style={{ display: "grid", gap: 9, marginTop: 11 }}>
                  <input value={readDay(caps, r.id, day) || ""} readOnly={!!readDay(savedAt, r.id, day)}
                    onChange={e => setCaps(writeDay(caps, r.id, day, e.target.value))}
                    placeholder="Photo caption…"
                    style={{ ...inp, minHeight: 44, fontSize: 13.5, ...settled(!!readDay(savedAt, r.id, day)) }} />
                  <textarea rows={3} value={readDay(notes, r.id, day) || ""} readOnly={!!readDay(savedAt, r.id, day)}
                    onChange={e => setNotes(writeDay(notes, r.id, day, e.target.value))}
                    placeholder="What happened? Write it now — you won't remember on Thursday."
                    style={{ ...inp, resize: "vertical", fontSize: 13.5, ...settled(!!readDay(savedAt, r.id, day)) }} />
                  {r.link && <A href={r.link}>Open {r.book || "the book"}</A>}
                  <SaveBar id={r.id} day={day} savedAt={savedAt} setSavedAt={setSavedAt} compact />
                </div>)}

              {!expanded && (readDay(caps, r.id, day) || readDay(notes, r.id, day)) && (
                <div style={{ fontSize: 12, color: C.muted, fontStyle: "italic", marginTop: 8,
                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {readDay(notes, r.id, day) || readDay(caps, r.id, day)}</div>)}
            </div>
          </div>);
      })}
    </div>);
}

/* ───────────────────────── HOME ───────────────────────── */
/* a small book cover — uses a real image when the parent supplies one,
   otherwise draws a tidy cover from the title in the subject's colour */
function BookCover({ title, subj, cover, w = 34, dim }) {
  const h = Math.round(w * 1.32);
  const col = subjColor(subj);
  const words = (title || "").split(/\s+/).filter(Boolean);
  const lines = [];
  let cur = "";
  words.forEach(word => {
    if ((cur + " " + word).trim().length <= 11) cur = (cur + " " + word).trim();
    else { if (cur) lines.push(cur); cur = word; }
  });
  if (cur) lines.push(cur);
  const show = lines.slice(0, 3);

  if (cover) {
    return (
      <div style={{ width: w, height: h, borderRadius: "2px 4px 4px 2px", overflow: "hidden", flexShrink: 0,
        border: `1px solid ${C.line}`, borderLeft: `3px solid ${col}`, background: "#fff",
        opacity: dim ? .55 : 1, boxShadow: "1px 1px 3px rgba(60,70,55,.16)" }}>
        <img src={cover} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
      </div>);
  }
  return (
    <div style={{ width: w, height: h, borderRadius: "2px 4px 4px 2px", flexShrink: 0, position: "relative",
      background: col, borderLeft: "3px solid rgba(0,0,0,.2)", opacity: dim ? .5 : .95,
      boxShadow: "1px 1px 3px rgba(60,70,55,.2)", overflow: "hidden",
      display: "flex", alignItems: "center", justifyContent: "center", padding: "3px 3px 5px" }}>
      <div style={{ textAlign: "center", lineHeight: 1.14 }}>
        {show.map((l, i) => (
          <div key={i} style={{ fontFamily: serif, fontSize: Math.max(5.5, w * 0.155), color: "#fff",
            fontWeight: 600, letterSpacing: .1, wordBreak: "break-word" }}>{l}</div>))}
      </div>
      <div style={{ position: "absolute", bottom: 2.5, left: 0, right: 0, height: 1,
        background: "rgba(255,255,255,.4)", margin: "0 5px" }} />
    </div>);
}

/* an inline-editable text cell — click and type, no modal */
function EditCell({ value, onChange, placeholder, w, italic }) {
  return (
    <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      style={{ border: "1px solid transparent", borderRadius: 6, padding: "4px 6px", fontSize: 13,
        width: w || "100%", background: "transparent", color: value ? C.ink : C.muted,
        fontStyle: italic && !value ? "italic" : "normal", outline: "none" }}
      onFocus={e => { e.target.style.border = `1px solid ${C.line}`; e.target.style.background = "#fff"; }}
      onBlur={e => { e.target.style.border = "1px solid transparent"; e.target.style.background = "transparent"; }} />
  );
}
const ADD_NEW = "__add__";

/* a select that can grow — choosing "Add your own" turns it into a text field,
   and whatever is typed is remembered for every other row */
function EditSelect({ value, onChange, options, onAdd, label = "option", blankLabel }) {
  const [typing, setTyping] = useState(false);
  const [draft, setDraft] = useState("");
  const box = { border: `1px solid ${C.line}`, borderRadius: 6, padding: "4px 6px",
    fontSize: 12, background: "#fff", color: C.ink, width: "100%", maxWidth: 148 };

  const commit = () => {
    const v = draft.trim();
    if (v) { if (onAdd) onAdd(v); onChange(v); }
    setDraft(""); setTyping(false);
  };

  if (typing) {
    return (
      <span style={{ display: "inline-flex", alignItems: "center", gap: 3 }}>
        <input autoFocus value={draft} onChange={e => setDraft(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter") commit(); if (e.key === "Escape") { setDraft(""); setTyping(false); } }}
          onBlur={commit} placeholder={`New ${label}…`}
          style={{ ...box, borderColor: C.green, outline: "none" }} />
        <button onMouseDown={e => { e.preventDefault(); commit(); }} title="Add"
          style={{ background: "none", border: "none", cursor: "pointer", padding: 1 }}>
          <Check size={13} style={{ color: C.green }} /></button>
      </span>);
  }
  const opts = options.includes(value) || !value ? options : [value, ...options];
  return (
    <select value={value} style={box}
      onChange={e => { if (e.target.value === ADD_NEW) { setTyping(true); setDraft(""); } else onChange(e.target.value); }}>
      {opts.map(o => <option key={o} value={o}>{o === "" ? (blankLabel || "—") : o}</option>)}
      <option disabled>──────────</option>
      <option value={ADD_NEW}>+ Add your own…</option>
    </select>
  );
}
const DayToggles = ({ days, onChange }) => (
  <div style={{ display: "flex", gap: 3 }}>
    {DAYS.map((d, i) => {
      const on = days.includes(i);
      return (
        <button key={i} title={DAY_FULL[i]}
          onClick={() => onChange(on ? days.filter(x => x !== i) : [...days, i].sort())}
          style={{ width: 23, height: 23, borderRadius: "50%", cursor: "pointer", fontSize: 10, fontWeight: 600,
            border: on ? "none" : `1px solid ${C.line}`, background: on ? C.green : "#fff",
            color: on ? "#fff" : C.muted, padding: 0 }}>{d[0]}</button>);
    })}
  </div>
);

/* ───────────────────────── HOME — today, and the timer ───────────────────────── */
function PageHome({ plan, setPlan, upd, setMin, addRow, delRow, todayIdx, now, done, setDone, fav, setFav, caps, setCaps,
  photoVersion, bumpPhotos, lastBackup, doBackup, dismissedBackup, setDismissedBackup, isMobile,
  savedAt, setSavedAt, about, term, drive, driveNotice, setDriveNotice, sendToDrive,
  installHidden, hideInstall,
  notes, setNotes, vids, setVids, uploadTo, subjOpts, feastOpts, addSubj, addFeast, allEvents, chores, setChores, go, prov, freedMB }) {
  const [edit, setEdit] = useState(false);
  const [active, setActive] = useState(null);
  const [left, setLeft] = useState(0);
  const [running, setRunning] = useState(false);
  const [over, setOver] = useState(false);
  const [open, setOpen] = useState(null);
  const [drag, setDrag] = useState(null);
  const [overId, setOverId] = useState(null);
  const [reader, setReader] = useState(null);      // url open in the side-by-side reader
  const tick = useRef(null);

  const today = isoDay(now);
  const todays = plan.filter(p => p.days.includes(todayIdx));
  const remaining = todays.filter(p => !readDay(done, p.id, today));
  const finished = todays.filter(p => readDay(done, p.id, today));
  const totalMin = remaining.reduce((a, r) => a + r.m, 0);

  useEffect(() => {
    if (!running) { clearInterval(tick.current); return; }
    tick.current = setInterval(() => setLeft(x => { if (x <= 1) { setOver(true); return 0; } return x - 1; }), 1000);
    return () => clearInterval(tick.current);
  }, [running]);

  /* opening an activity only loads it — the parent presses Start when they're ready */
  const startAt = id => { const r = plan.find(p => p.id === id); setActive(id); setLeft(r.m * 60); setOver(false); setRunning(false); };
  const startDay = () => { if (remaining[0]) startAt(remaining[0].id); };
  const finish = () => {
    if (!active) return;
    setDone(writeDay(done, active, today, Date.now())); setRunning(false);
    const nxt = todays.find(p => !readDay(done, p.id, today) && p.id !== active);
    if (nxt) startAt(nxt.id); else { setActive(null); setOver(false); }
  };
  const skip = () => { const nxt = todays.find(p => !readDay(done, p.id, today) && p.id !== active); setRunning(false); if (nxt) startAt(nxt.id); else setActive(null); };

  const closeTimer = () => { setRunning(false); setActive(null); setOver(false); setReader(null); };
  const reorder = (fromId, toId) => {
    if (!fromId || !toId || fromId === toId) return;
    const next = [...plan];
    const f = next.findIndex(p => p.id === fromId);
    const t2 = next.findIndex(p => p.id === toId);
    const [moved] = next.splice(f, 1);
    next.splice(t2, 0, moved);
    setPlan(next);
  };

  const a = active ? plan.find(p => p.id === active) : null;
  /* "ready" = loaded but not yet started, so the ring stays quiet until Start */
  const ready = !!a && !running && !over && left === a.m * 60;

  /* the browser tab itself becomes the timer — readable from whatever tab the book is in */
  useEffect(() => {
    const base = "Flora — Your Homeschool Companion";
    if (a && running) document.title = `\u25CF ${mmss(left)} — ${a.book || a.topic}`;
    else if (a && over) document.title = `\u25CF Time's up — ${a.book || a.topic}`;
    else document.title = base;
    return () => { document.title = base; };
  }, [a, running, over, left]);
  const pct = a ? Math.max(0, Math.min(1, left / (a.m * 60))) : 0;
  const R = 52, CIRC = 2 * Math.PI * R;

  /* Friday nudge — a forgotten backup is a lost term, so this is a
     feature rather than something left to memory. Shown from Friday
     onward if the last backup was more than six days ago. */
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(null);
  const todayKey = now.toDateString();
  const daysSince = lastBackup ? (Date.now() - lastBackup) / 86400000 : Infinity;
  const showBackup = todayIdx >= 5 && daysSince > 6 && dismissedBackup !== todayKey
    && !(drive && drive.on) && !driveNotice;

  return (
    <>
      <div style={{ marginRight: isMobile ? 0 : 210 }}>
        <InstallPrompt compact={isMobile}
          dismissed={!!installHidden && (Date.now() - installHidden) < 14 * 86400000}
          onDismiss={hideInstall} />
      </div>

      {/* Never backed up and there is already work to lose. This one can't
          be dismissed — a first term lost is a family gone. */}
      {!lastBackup && (finished.length > 0 || Object.keys(done).length > 0) && (
        <div style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "14px 16px",
          borderRadius: 12, background: "#fbeee6", border: "1.5px solid #e0b79c", marginBottom: 16,
          marginRight: isMobile ? 0 : 210 }}>
          <ShieldCheck size={18} style={{ color: "#a4553b", flexShrink: 0, marginTop: 2 }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13.5, fontWeight: 700, color: "#8f4630" }}>
              Set up your backup before you log much more</div>
            <div style={{ fontSize: 12.5, color: C.soft, lineHeight: 1.65, marginTop: 3 }}>
              Everything you've logged is on this device only. One backup — to your Google Drive, or a
              file you keep — and it stops depending on one phone. It takes a minute and you only do it once.
            </div>
          </div>
          <div style={{ display: "flex", gap: 7, flexShrink: 0, flexWrap: "wrap" }}>
            <Btn small onClick={() => go("settings", "backup")}>Set it up</Btn>
          </div>
        </div>)}

      {driveNotice && (
        <div style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "13px 16px", borderRadius: 12,
          background: driveNotice.kind === "sent" ? "#f1f5ed" : C.sand,
          border: `1px solid ${driveNotice.kind === "sent" ? "#cfdcc4" : "#e3d6bd"}`, marginBottom: 16,
          marginRight: isMobile ? 0 : 210 }}>
          {driveNotice.kind === "sent"
            ? <ShieldCheck size={17} style={{ color: C.green, flexShrink: 0, marginTop: 2 }} />
            : <Info size={17} style={{ color: C.gold, flexShrink: 0, marginTop: 2 }} />}
          <div style={{ flex: 1, minWidth: 0 }}>
            {driveNotice.kind === "sent" ? (
              <>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: C.ink }}>
                  This week's backup is in your Drive</div>
                <div style={{ fontSize: 12.3, color: C.soft, lineHeight: 1.6, marginTop: 2 }}>
                  {driveNotice.name} · {driveNotice.photos} photo{driveNotice.photos === 1 ? "" : "s"} ·
                  {" "}{driveNotice.sizeMB?.toFixed(1)} MB. Nothing for you to do — this is just so you know.
                </div>
              </>
            ) : (
              <>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: C.ink }}>
                  Google needs a tap before Flora can send this week's backup</div>
                <div style={{ fontSize: 12.3, color: C.soft, lineHeight: 1.6, marginTop: 2 }}>
                  Sign-in lapses every so often. One tap and Flora carries on sending on its own.
                </div>
              </>)}
          </div>
          <div style={{ display: "flex", gap: 7, flexShrink: 0, flexWrap: "wrap" }}>
            {driveNotice.kind === "sent"
              ? (driveNotice.link && <Btn small tone="quiet" onClick={() => window.open(driveNotice.link, "_blank")}>
                  Open in Drive</Btn>)
              : <Btn small onClick={async () => {
                  const r = await sendToDrive();
                  setDriveNotice(r.ok ? { kind: "sent", ...r } : { kind: "needs-tap" });
                }}><Upload size={13} /> Send now</Btn>}
            <Btn small tone="quiet" onClick={() => setDriveNotice(null)}>Got it</Btn>
          </div>
        </div>)}

      {showBackup && (
        <div style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "13px 16px", borderRadius: 12,
          background: C.sand, border: `1px solid #e3d6bd`, marginBottom: 16,
          marginRight: isMobile ? 0 : 210 }}>
          <HardDrive size={17} style={{ color: C.gold, flexShrink: 0, marginTop: 2 }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13.5, fontWeight: 600, color: C.ink }}>Time for your weekly backup</div>
            <div style={{ fontSize: 12.3, color: C.soft, lineHeight: 1.6, marginTop: 2 }}>
              {lastBackup
                ? `Last saved ${Math.floor(daysSince)} days ago. `
                : "You haven't saved a backup yet. "}
              Flora keeps everything on this device — one file, saved to your Drive, and nothing can be lost.
            </div>
            {saved && <div style={{ fontSize: 12, color: C.green, marginTop: 6 }}>
              Saved {saved.photos} photo{saved.photos === 1 ? "" : "s"} · {saved.sizeMB.toFixed(1)} MB.
              Move it to your Drive now.</div>}
          </div>
          <div style={{ display: "flex", gap: 7, flexShrink: 0 }}>
            <Btn small disabled={saving}
              onClick={async () => { setSaving(true); const r = await doBackup(); setSaving(false); setSaved(r); }}>
              <Download size={13} /> {saving ? "Saving…" : "Back up now"}</Btn>
            <Btn small tone="quiet" onClick={() => setDismissedBackup(todayKey)}>Later</Btn>
          </div>
        </div>
      )}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap",
        gap: 14, marginBottom: isMobile ? 12 : 18 }}>
        <div>
          {!isMobile && <div style={{ fontSize: 10.5, letterSpacing: 2.4, textTransform: "uppercase", color: C.muted, fontWeight: 700 }}>Today's Learning Guide</div>}
          <h1 style={{ fontFamily: serif, fontSize: isMobile ? 26 : 34, fontWeight: 600, color: C.deep,
            margin: isMobile ? "0 0 2px" : "5px 0 3px" }}>{DAY_FULL[todayIdx]}</h1>
          <div style={{ fontSize: isMobile ? 12.5 : 13.5, color: C.soft }}>
            {now.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
            {todays.length > 0 && ` · about ${totalMin} minutes left`}</div>

        </div>
      </div>

      {/* running timer */}
      {a && (
        <div style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: 14, padding: 22, marginBottom: 16, position: "relative" }}>
          <button onClick={closeTimer} title="Close and go back to the planned sequence"
            style={{ position: "absolute", top: 12, right: 12, width: 26, height: 26, borderRadius: "50%",
              border: `1px solid ${C.line}`, background: "#fff", cursor: "pointer", display: "flex",
              alignItems: "center", justifyContent: "center", padding: 0, zIndex: 2 }}>
            <X size={13} style={{ color: C.muted }} /></button>
          <div style={{ display: "flex", gap: 22, alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ position: "relative", width: 128, height: 128, flexShrink: 0 }}>
            <svg width="128" height="128" viewBox="0 0 128 128">
              <circle cx="64" cy="64" r={R} fill="none" stroke={C.wash} strokeWidth="9" />
              <circle cx="64" cy="64" r={R} fill="none" stroke={over ? C.blush : ready ? C.line : subjColor(a.subj)} strokeWidth="9"
                strokeLinecap="round" strokeDasharray={CIRC} strokeDashoffset={CIRC * (1 - pct)}
                transform="rotate(-90 64 64)" style={{ transition: "stroke-dashoffset 1s linear" }} /></svg>
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <div style={{ fontFamily: serif, fontSize: 30, fontWeight: 600, color: over ? C.blush : C.deep,
                animation: over ? "pulse 2s infinite" : "none" }}>{mmss(left)}</div>
              <div style={{ fontSize: 10, color: C.muted, letterSpacing: 1 }}>
                {over ? "extra time" : ready ? "ready" : running ? "remaining" : "paused"}</div></div>
          </div>

          {/* the book itself — cover only, tap to open */}
          {a.book && (
            <div style={{ flexShrink: 0, textAlign: "center" }}>
              {a.link ? (
                <a href={a.link} target="_blank" rel="noreferrer" onClick={() => setReader(a.id)}
                  title={reader === a.id ? `Reopen ${a.book}` : `Open ${a.book}`} style={{ display: "block" }}>
                  <BookCover title={a.book} subj={a.subj} cover={a.cover} w={72} /></a>
              ) : <BookCover title={a.book} subj={a.subj} cover={a.cover} w={72} dim />}
              {a.link
                ? <div style={{ fontSize: 10.5, color: C.green, marginTop: 6, fontWeight: 700 }}>
                    {reader === a.id ? "reopen" : "tap to open"}</div>
                : <div style={{ fontSize: 10, color: C.muted, marginTop: 6 }}>no link yet</div>}
            </div>)}

          <div style={{ flex: 1, minWidth: 210 }}>
            <div style={{ fontSize: 10.5, letterSpacing: 2, textTransform: "uppercase", color: C.muted, fontWeight: 700 }}>Now</div>
            <div style={{ fontFamily: serif, fontSize: 26, color: C.deep, margin: "4px 0 5px" }}>{a.book || a.topic}</div>
            <div style={{ display: "flex", gap: 7, flexWrap: "wrap", marginBottom: 13 }}>
              <Pill color={subjColor(a.subj)}>{a.subj}</Pill><Pill color={pracColor(a.feast)}>{a.feast}</Pill>
              {a.music && <Pill color={C.blush}>{a.music}</Pill>}</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
              <Btn small onClick={() => setRunning(!running)}>
                {running ? <><Pause size={13} /> Pause</> : ready ? <><Play size={13} /> Start</> : <><Play size={13} /> Resume</>}</Btn>
              <Btn small tone="quiet" onClick={() => { setLeft(a.m * 60); setOver(false); }}><RotateCcw size={12} /> Reset</Btn>
              <Btn small tone="warm" onClick={finish}><Check size={13} /> Done</Btn>
              <Btn small tone="quiet" onClick={skip}><SkipForward size={12} /> Skip</Btn>
              <span style={{ display: "flex", alignItems: "center", gap: 6, marginLeft: 4 }}>
                <span style={{ fontSize: 11.5, color: C.muted }}>minutes</span>
                <MinBox value={a.m} onChange={m => { setMin(a.id, m); if (!running) setLeft(m * 60); }} /></span>
              {reader === a.id && a.link && (
                <a href={a.link} target="_blank" rel="noreferrer" style={{ textDecoration: "none", marginLeft: 2 }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12.5, fontWeight: 600,
                    color: C.soft, border: `1px solid ${C.line}`, borderRadius: 9, padding: "7px 13px", cursor: "pointer" }}>
                    <BookOpen size={13} /> Reopen the book<Link2 size={10} /></span></a>)}
            </div>
            {ready && <div style={{ fontSize: 12.5, color: C.muted, marginTop: 10 }}>
              Nothing is counting yet. Press Start when you're both settled.</div>}
            {over && <div style={{ fontSize: 12.5, color: C.blush, marginTop: 10 }}>Time's up — but if it's going well, keep reading. Flora will wait.</div>}
          </div>
          <Motif kind="fern" color={C.line} size={68} style={{ flexShrink: 0 }} />
          </div>

          {/* capture strip — everything optional, filled while it's fresh */}
          <div style={{ marginTop: 18, paddingTop: 16, borderTop: `1px solid ${C.line}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <span style={{ fontSize: 10, letterSpacing: 1.8, textTransform: "uppercase", color: C.muted, fontWeight: 700 }}>Keep something from this</span>
              <span style={{ fontSize: 10.5, color: C.muted, fontStyle: "italic" }}>— all optional</span>
              <span style={{ flex: 1, height: 1, background: C.line }} />
              <button onClick={() => setFav({ ...fav, [a.id]: !fav[a.id] })}
                style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center",
                  gap: 5, fontSize: 11.5, color: fav[a.id] ? C.blush : C.muted }}>
                <Star size={13} fill={fav[a.id] ? C.blush : "none"} /> {fav[a.id] ? "in the portfolio" : "add to portfolio"}</button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(230px,1fr))", gap: 13 }}>
              {/* photo */}
              <div>
                <SmallField label="Photo">
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    {!readDay(savedAt, a.id, today) && <AddPhoto entryId={a.id} onAdded={bumpPhotos} icon />}
                    <input value={readDay(caps, a.id, today) || ""} readOnly={!!readDay(savedAt, a.id, today)}
                      onChange={e => setCaps(writeDay(caps, a.id, today, e.target.value))}
                      placeholder="Caption — e.g. She loved this story"
                      style={{ ...inp, padding: "8px 10px", fontSize: 12.5, ...settled(!!readDay(savedAt, a.id, today)) }} />
                  </div>
                </SmallField>
                <EntryPhotos entryId={a.id} version={photoVersion} onChange={bumpPhotos} day={today}
                  size={68} locked={!!readDay(savedAt, a.id, today)} />
                <div style={{ fontSize: 10.5, color: C.muted, marginTop: 5, display: "flex", alignItems: "center", gap: 5 }}>
                  <ShieldCheck size={10} /> Kept in Flora as its own copy — hold on to the original until you've backed up</div>
              </div>

              {/* video link */}
              <SmallField label="Output video link">
                <div style={{ display: "flex", gap: 7, alignItems: "center" }}>
                  <Video size={15} style={{ color: C.muted, flexShrink: 0 }} />
                  <input value={readDay(vids, a.id, today) || ""} onChange={e => setVids(writeDay(vids, a.id, today, e.target.value))}
                    placeholder={`Paste the ${UPLOAD_DEST[uploadTo].label} link`}
                    style={{ ...inp, padding: "8px 10px", fontSize: 12.5 }} />
                  {readDay(vids, a.id, today) ? <A href={readDay(vids, a.id, today)}>open</A> : null}
                </div>
                <div style={{ display: "flex", gap: 7, alignItems: "center", marginTop: 7, flexWrap: "wrap" }}>
                  <a href={UPLOAD_DEST[uploadTo].url} target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11.5, fontWeight: 600,
                      color: C.soft, border: `1px solid ${C.line}`, borderRadius: 8, padding: "6px 11px", cursor: "pointer" }}>
                      <Upload size={12} /> Upload to {UPLOAD_DEST[uploadTo].label}<Link2 size={10} /></span></a>
                  <span style={{ fontSize: 10.5, color: C.muted }}>opens in a new tab</span>
                </div>
                <div style={{ fontSize: 10.5, color: C.muted, marginTop: 5, lineHeight: 1.5 }}>
                  {UPLOAD_DEST[uploadTo].hint} Not required at this level.</div>
              </SmallField>

              {/* parent's note */}
              <SmallField label="Parent's note">
                <textarea value={readDay(notes, a.id, today) || ""} readOnly={!!readDay(savedAt, a.id, today)}
                  onChange={e => setNotes(writeDay(notes, a.id, today, e.target.value))}
                  rows={2} placeholder="What did you do today? Anything you noticed…"
                  style={{ ...inp, padding: "8px 10px", fontSize: 12.5, resize: "vertical",
                    lineHeight: 1.55, ...settled(!!readDay(savedAt, a.id, today)) }} />
                <div style={{ fontSize: 10.5, color: C.muted, marginTop: 5 }}>
                  For the portfolio, or just to remember it by.</div>
              </SmallField>
            </div>
            <SaveBar id={a.id} day={today} savedAt={savedAt} setSavedAt={setSavedAt} day={today} />
          </div>
        </div>)}

      {!isMobile && (
        <div style={{ display: "flex", gap: 9, marginBottom: 18, flexWrap: "wrap" }}>
          {!a && <Btn onClick={startDay} disabled={remaining.length === 0}><Play size={14} /> Open today's first activity</Btn>}
          <Btn tone="quiet" onClick={() => go("outputs")} small><Camera size={13} /> Add an output</Btn>
          <Btn tone="quiet" onClick={() => go("week")} small><ClipboardList size={13} /> Weekly Plan</Btn>
        </div>)}

      {/* anything whose reminder window has opened */}
      {(() => {
        const due = (allEvents || [])
          .map(e => ({ e, s: activeStep(e, now) }))
          .filter(x => x.s)
          .sort((a, b) => a.s.n - b.s.n)
          .slice(0, 3);
        if (!due.length) return null;
        return (
          <div style={{ display: "grid", gap: 8, marginBottom: 16 }}>
            {due.map(({ e, s }) => (
              <div key={e.id} style={{ display: "flex", gap: 12, alignItems: "center", borderRadius: 12,
                padding: "11px 15px", border: `1px solid ${s.n === 0 ? "#e6cdbc" : C.line}`,
                background: s.n === 0 ? "#fdf4ee" : "#fff" }}>
                <CalendarDays size={16} style={{ color: e.kind === "school" ? C.green : C.blush, flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13.5, color: C.ink }}>
                    <strong>{e.title}</strong>
                    <span style={{ color: C.soft }}> — {untilLabel(s.n)}</span>
                  </div>
                  <div style={{ fontSize: 11.5, color: C.muted, marginTop: 2 }}>
                    {fmtLong(e.start)}{e.startTime ? ` \u00b7 ${clockLabel(e.startTime, e.endTime)}` : ""}{e.venue ? ` \u00b7 ${e.venue}` : ""}{e.note ? ` \u00b7 ${e.note}` : ""}</div>
                </div>
                {e.email && <Mail size={12} style={{ color: C.muted, flexShrink: 0 }} />}
                <Btn small tone="quiet" onClick={() => go("calendar")}>Calendar</Btn>
              </div>))}
          </div>);
      })()}

      <Panel title={`Today's activities — ${remaining.length} left of ${todays.length}`}
        right={isMobile ? null : <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 11, color: C.muted }}>drag to reorder · paste a link once and it stays</span>
          <Btn small tone={edit ? "solid" : "quiet"} onClick={() => setEdit(!edit)}>
            <Pencil size={12} /> {edit ? "Done editing" : "Edit"}</Btn></span>} pad={0}>
        {isMobile ? (
          <>
            <MobileDay rows={remaining} done={done} setDone={setDone} fav={fav} setFav={setFav}
              caps={caps} setCaps={setCaps} notes={notes} setNotes={setNotes}
              photoVersion={photoVersion} bumpPhotos={bumpPhotos}
              savedAt={savedAt} setSavedAt={setSavedAt} day={today} />
            {finished.length > 0 && (
              <>
                <div style={{ padding: "4px 14px 0", fontSize: 10.5, letterSpacing: 1.4,
                  textTransform: "uppercase", color: C.muted, fontWeight: 700 }}>Done today</div>
                <MobileDay rows={finished} done={done} setDone={setDone} fav={fav} setFav={setFav}
                  caps={caps} setCaps={setCaps} notes={notes} setNotes={setNotes}
                  photoVersion={photoVersion} bumpPhotos={bumpPhotos}
                  savedAt={savedAt} setSavedAt={setSavedAt} day={today} dim />
              </>)}
            {remaining.length === 0 && finished.length === 0 && (
              <div style={{ padding: 30, textAlign: "center", color: C.muted, fontSize: 13.5 }}>
                Nothing scheduled today.</div>)}
          </>
        ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 740 }}>
            <thead><tr style={{ background: C.wash }}>
              {["", "Mins", "Book / Materials", "E-book", "Topic", "Subject", "CM Feast", "Music", ""].map((h, i) => (
                <th key={i} style={{ textAlign: "left", padding: "9px 12px", fontSize: 10, letterSpacing: 1.1,
                  textTransform: "uppercase", color: C.muted, fontWeight: 700, borderBottom: `1px solid ${C.line}` }}>{h}</th>))}
            </tr></thead>
            <tbody>
              {remaining.map(r => (
                <React.Fragment key={r.id}>
                <tr className="frow" draggable
                  onDragStart={() => setDrag(r.id)}
                  onDragOver={e => { e.preventDefault(); setOverId(r.id); }}
                  onDragLeave={() => setOverId(o => o === r.id ? null : o)}
                  onDrop={e => { e.preventDefault(); reorder(drag, r.id); setDrag(null); setOverId(null); }}
                  onDragEnd={() => { setDrag(null); setOverId(null); }}
                  style={{ borderBottom: overId === r.id && drag !== r.id ? `2px solid ${C.green}` : `1px solid ${C.line}`,
                    background: active === r.id ? "#f4f8ef" : drag === r.id ? "#f7f6f0" : "transparent",
                    opacity: drag === r.id ? .5 : 1, cursor: "default" }}>
                  <td style={{ padding: "9px 8px 9px 12px", whiteSpace: "nowrap" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                      <GripVertical size={14} style={{ color: C.line, cursor: "grab" }} />
                      <button onClick={() => setDone(writeDay(done, r.id, today, Date.now()))} style={{ width: 21, height: 21,
                        borderRadius: "50%", border: `1.5px solid ${C.line}`, background: "#fff", cursor: "pointer", padding: 0 }} />
                    </span></td>
                  <td style={{ padding: "9px 12px" }}><MinBox value={r.m} onChange={m => setMin(r.id, m)} /></td>
                  <td style={{ padding: "6px 8px", minWidth: 150 }}>
                    {edit ? <EditCell value={r.book} onChange={v => upd(r.id, { book: v })} placeholder="Book or material" italic />
                          : <span style={{ fontSize: 13.5, fontWeight: 500 }}>{r.book || "—"}</span>}</td>

                  {/* e-book — the cover makes the right book findable at a glance */}
                  <td style={{ padding: "6px 8px", minWidth: 142 }}>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      {r.book ? (
                        r.link ? (
                          <a href={r.link} target="_blank" rel="noreferrer" title={`Open ${r.book}`}
                            style={{ display: "block", flexShrink: 0 }}>
                            <BookCover title={r.book} subj={r.subj} cover={r.cover} w={34} /></a>
                        ) : <BookCover title={r.book} subj={r.subj} cover={r.cover} w={34} dim />
                      ) : null}
                      {r.link ? (
                        <div style={{ display: "flex", flexDirection: "column", gap: 3, minWidth: 0 }}>
                          <a href={r.link} target="_blank" rel="noreferrer"
                            onClick={() => { if (active === r.id) setReader(r.id); }}
                            style={{ textDecoration: "none" }}>
                            <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11.5, fontWeight: 600,
                              color: "#fff", background: C.green, borderRadius: 7, padding: "5px 10px" }}>
                              <BookOpen size={11} /> Read</span></a>
                          <button onClick={() => upd(r.id, { link: "" })}
                            style={{ background: "none", border: "none", cursor: "pointer", padding: 0,
                              fontSize: 10, color: C.muted, textAlign: "left" }}>remove link</button>
                        </div>
                      ) : (
                        <input value={r.link} onChange={e => upd(r.id, { link: e.target.value })}
                          placeholder="paste e-book link"
                          style={{ border: `1px dashed ${C.line}`, borderRadius: 6, padding: "5px 7px", fontSize: 11,
                            width: "100%", minWidth: 0, background: "transparent", color: C.muted, fontStyle: "italic", outline: "none" }}
                          onFocus={e => { e.target.style.borderStyle = "solid"; e.target.style.background = "#fff"; }}
                          onBlur={e => { e.target.style.borderStyle = "dashed"; e.target.style.background = "transparent"; }} />
                      )}
                    </div></td>

                  <td style={{ padding: "6px 8px", minWidth: 120 }}>
                    {edit ? <EditCell value={r.topic} onChange={v => upd(r.id, { topic: v })} placeholder="Topic" italic />
                          : <span style={{ fontSize: 13, color: C.soft }}>{r.topic || "—"}</span>}</td>
                  <td style={{ padding: "6px 8px" }}>
                    {edit ? (
                      <span style={{ display: "inline-flex", flexDirection: "column", gap: 4 }}>
                        <EditSelect value={r.subj} onChange={v => upd(r.id, { subj: v })} options={subjOpts} onAdd={addSubj} label="subject" />
                        <EditSelect value={r.subj2 || ""} onChange={v => upd(r.id, { subj2: v })}
                          options={["", ...subjOpts.filter(x => x !== r.subj)]} onAdd={addSubj}
                          label="second subject" blankLabel="+ second subject" />
                      </span>)
                          : <SubjectPills r={r} />}</td>
                  <td style={{ padding: "6px 8px" }}>
                    {edit ? <EditSelect value={r.feast} onChange={v => upd(r.id, { feast: v })} options={feastOpts} onAdd={addFeast} label="activity" />
                          : <span style={{ fontSize: 12.5, color: C.soft }}>{r.feast}</span>}</td>
                  <td style={{ padding: "6px 8px", minWidth: 90 }}>
                    {edit ? <EditCell value={r.music} onChange={v => upd(r.id, { music: v })} placeholder="—" italic />
                          : (r.music ? <Pill color={C.blush}>{r.music}</Pill> : <span style={{ color: C.line }}>—</span>)}</td>
                  <td style={{ padding: "6px 8px", whiteSpace: "nowrap" }}>
                    {!edit && active !== r.id && <Btn small tone="quiet" onClick={() => startAt(r.id)}><Play size={11} /></Btn>}
                    <button onClick={() => setOpen(open === r.id ? null : r.id)} title="Notes and photo"
                      style={{ background: "none", border: "none", cursor: "pointer", padding: 3 }}>
                      {open === r.id ? <ChevronDown size={14} style={{ color: C.muted }} /> : <ChevronRight size={14} style={{ color: C.muted }} />}</button>
                    {edit && <button onClick={() => delRow(r.id)} title="Remove"
                      style={{ background: "none", border: "none", cursor: "pointer", padding: 3 }}>
                      <Trash2 size={13} style={{ color: C.muted }} /></button>}
                  </td>
                </tr>
                {open === r.id && (
                  <tr><td colSpan={9} style={{ background: C.wash, padding: "12px 18px 16px 46px", position: "relative" }}>
                    <button onClick={() => setOpen(null)} title="Close"
                      style={{ position: "absolute", top: 9, right: 12, width: 24, height: 24, borderRadius: "50%",
                        border: `1px solid ${C.line}`, background: "#fff", cursor: "pointer", display: "flex",
                        alignItems: "center", justifyContent: "center", padding: 0 }}>
                      <X size={12} style={{ color: C.muted }} /></button>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 12, marginBottom: 11, paddingRight: 30 }}>
                      <SmallField label="Photo caption">
                        <input value={readDay(caps, r.id, today) || ""} onChange={e => setCaps(writeDay(caps, r.id, today, e.target.value))}
                          placeholder="e.g. Her first full narration" style={{ ...inp, padding: "8px 10px", fontSize: 12.5 }} /></SmallField>
                      <SmallField label="Parent's note">
                        <input value={readDay(notes, r.id, today) || ""} onChange={e => setNotes(writeDay(notes, r.id, today, e.target.value))}
                          placeholder="What did you do today? (optional)" style={{ ...inp, padding: "8px 10px", fontSize: 12.5 }} /></SmallField>
                      <SmallField label="Output video link">
                        <input value={readDay(vids, r.id, today) || ""} onChange={e => setVids(writeDay(vids, r.id, today, e.target.value))}
                          placeholder="Drive or YouTube link (optional)" style={{ ...inp, padding: "8px 10px", fontSize: 12.5 }} /></SmallField>
                      <SmallField label="Book cover image">
                        <div style={{ display: "flex", gap: 9, alignItems: "center" }}>
                          <BookCover title={r.book} subj={r.subj} cover={r.cover} w={30} />
                          <input value={r.cover || ""} onChange={e => upd(r.id, { cover: e.target.value })}
                            placeholder="Paste an image link (optional)" style={{ ...inp, padding: "8px 10px", fontSize: 12.5 }} />
                        </div>
                        <div style={{ fontSize: 10.5, color: C.muted, marginTop: 4 }}>
                          Leave it empty and Flora draws a cover from the title.</div></SmallField>
                    </div>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                      <AddPhoto entryId={r.id} onAdded={bumpPhotos} small />
                      <button onClick={() => setFav({ ...fav, [r.id]: !fav[r.id] })}
                        style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: C.soft }}>
                        <Star size={14} fill={fav[r.id] ? C.blush : "none"} style={{ color: fav[r.id] ? C.blush : C.muted }} /> for the portfolio</button>
                      <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: C.muted }}>
                        <ShieldCheck size={11} /> Kept in Flora as its own copy — hold on to the original until you've backed up</span>
                    </div>
                    <EntryPhotos entryId={r.id} version={photoVersion} onChange={bumpPhotos} size={68} day={today} />
                  </td></tr>)}
                </React.Fragment>))}
              {remaining.length === 0 && (
                <tr><td colSpan={9} style={{ padding: "34px 12px", textAlign: "center", color: C.soft }}>
                  <Motif kind="wreath" color={C.blush} size={44} style={{ marginBottom: 6 }} />
                  <div style={{ fontFamily: serif, fontSize: 21, color: C.deep }}>That's everything for today.</div>
                  <div style={{ fontSize: 13, marginTop: 4 }}>Close the laptop — the rest of the day is yours.</div>
                </td></tr>)}
            </tbody>
          </table>
        </div>)}
        {edit && !isMobile && (
          <div style={{ padding: "11px 14px", borderTop: `1px solid ${C.line}`, background: C.wash }}>
            <Btn small tone="quiet" onClick={() => addRow(todayIdx)}><Plus size={13} /> Add an activity to today</Btn>
            <span style={{ fontSize: 11.5, color: C.muted, marginLeft: 10 }}>
              Changes here apply to your Weekly Plan too.</span>
          </div>)}
      </Panel>

      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 16 }}>
        <Panel title="Actual tasks done">
          {finished.length === 0 ? <div style={{ fontSize: 13, color: C.muted }}>Nothing checked yet today.</div>
            : finished.map(r => (
              <div key={r.id} style={{ display: "flex", alignItems: "center", gap: 9, padding: "8px 0", borderBottom: `1px solid ${C.line}` }}>
                <Check size={14} style={{ color: C.green, flexShrink: 0 }} />
                <span style={{ fontSize: 13.5, minWidth: 0 }}>{r.book || r.topic}</span>
                <DoneThumbs entryId={r.id} version={photoVersion} day={today} />
                {readDay(vids, r.id, today) && (
                  <a href={readDay(vids, r.id, today)} target="_blank" rel="noopener noreferrer"
                    title="Open the recording" onClick={e => e.stopPropagation()}
                    style={{ display: "inline-flex", alignItems: "center", gap: 4, flexShrink: 0,
                      fontSize: 11, fontWeight: 600, color: C.green, textDecoration: "none",
                      border: `1px solid ${C.line}`, borderRadius: 6, padding: "4px 7px", background: "#fff" }}>
                    <Video size={12} /> video</a>)}
                <span style={{ flex: 1 }} />
                <button onClick={() => setDone(clearDay(done, r.id, today))} title="Undo"
                  style={{ background: "none", border: "none", cursor: "pointer", fontSize: 11, color: C.muted }}>undo</button>
                <Pill color={subjColor(r.subj)}>{r.feast}</Pill></div>))}
        </Panel>
        <div>
          <Panel title="Chores">
            {chores.map((c, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 0" }}>
                <Check size={13} style={{ color: C.green }} />
                <EditCell value={c} onChange={v => setChores(chores.map((x, k) => k === i ? v : x))} />
                <button onClick={() => setChores(chores.filter((_, k) => k !== i))}
                  style={{ background: "none", border: "none", cursor: "pointer" }}><X size={11} style={{ color: C.muted }} /></button>
              </div>))}
            <Btn small tone="quiet" onClick={() => setChores([...chores, "New chore"])}><Plus size={12} /> Add</Btn>
          </Panel>
          <Panel title="Habits">
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <Motif kind="rabbit" color={C.green} size={40} />
              <div style={{ fontSize: 12.8, color: C.soft, lineHeight: 1.6 }}>
                This term's focus: <strong style={{ color: C.ink }}>Attentiveness</strong><br />Rate it at term's end.</div>
            </div></Panel>
        </div>
      </div>

      {/* appears once the book has been opened in another tab, so the time is never lost */}
      {a && reader === a.id && (
        <div style={{ position: "fixed", right: 22, bottom: 22, zIndex: 40, display: "flex", alignItems: "center",
          gap: 11, background: C.deep, borderRadius: 30, padding: "9px 9px 9px 17px",
          boxShadow: "0 6px 20px rgba(47,58,44,.28)" }}>
          <div>
            <div style={{ fontFamily: serif, fontSize: 20, fontWeight: 600, lineHeight: 1,
              color: over ? "#f0c3ac" : "#fff", animation: over ? "pulse 2s infinite" : "none" }}>{mmss(left)}</div>
            <div style={{ fontSize: 9, color: "#a8b79a", marginTop: 2, maxWidth: 122, overflow: "hidden",
              whiteSpace: "nowrap", textOverflow: "ellipsis" }}>{a.book || a.topic}</div>
          </div>
          <button onClick={() => setRunning(!running)} title={running ? "Pause" : "Start"}
            style={{ width: 32, height: 32, borderRadius: "50%", border: "none", background: C.green, color: "#fff",
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}>
            {running ? <Pause size={14} /> : <Play size={14} />}</button>
          <a href={a.link} target="_blank" rel="noreferrer" title="Reopen the book"
            style={{ width: 32, height: 32, borderRadius: "50%", background: "transparent", border: "1px solid #6f7d64",
              display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none", flexShrink: 0 }}>
            <BookOpen size={14} style={{ color: "#b8c4aa" }} /></a>
          <button onClick={finish} title="Done"
            style={{ width: 32, height: 32, borderRadius: "50%", border: "none", background: C.blush, color: "#fff",
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}>
            <Check size={15} /></button>
        </div>)}

      <div style={{ marginTop: 8 }}>
        {!prov && (
          <div style={{ display: "flex", gap: 12, alignItems: "center", background: C.sand, border: "1px solid #e3d6bd",
            borderRadius: 12, padding: "13px 16px", marginBottom: 10 }}>
            <KeyRound size={17} style={{ color: C.gold, flexShrink: 0 }} />
            <div style={{ flex: 1, fontSize: 13, color: C.soft, lineHeight: 1.55 }}>
              <strong style={{ color: C.ink }}>Have a provider code?</strong> Enter it once and Flora sets up your
              subjects, portfolio sections and requirements to match.</div>
            <Btn small tone="quiet" onClick={() => go("settings")}>Enter code</Btn>
          </div>)}

      </div>
    </>);
}

/* the column titles above the rhythm rows — same widths as WeekRow so they line up */
const WeekHead = ({ showDays }) => {
  const cell = { fontSize: 9.5, letterSpacing: 1.4, textTransform: "uppercase", color: C.muted, fontWeight: 700 };
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 9, padding: "9px 14px",
      background: C.wash, borderBottom: `1px solid ${C.line}` }}>
      <span style={{ width: 14, flexShrink: 0 }} />
      <span style={{ width: 26, flexShrink: 0, ...cell }}>Book</span>
      <span style={{ flex: 1, minWidth: 130, ...cell }}>Book / Materials · Topic</span>
      <span style={{ width: 148, flexShrink: 0, ...cell }}>Subject</span>
      <span style={{ width: 148, flexShrink: 0, ...cell }}>CM Feast</span>
      <span style={{ width: 96, flexShrink: 0, ...cell }}>Music</span>
      <span style={{ width: 82, flexShrink: 0, ...cell }}>Minutes</span>
      {showDays && <span style={{ width: 179, flexShrink: 0, ...cell }}>Days it runs</span>}
      <span style={{ width: 19, flexShrink: 0 }} />
    </div>
  );
};

/* module-level so React keeps the same component identity between renders —
   defined inside the page, every keystroke remounted the row and stole focus */
function WeekRow({ r, showDays, upd, setMin, delRow, drag, setDrag, overId, setOverId, reorder,
  subjOpts, feastOpts, addSubj, addFeast }) {
  return (
    <div draggable
      onDragStart={() => setDrag(r.id)}
      onDragOver={e => { e.preventDefault(); setOverId(r.id); }}
      onDragLeave={() => setOverId(o => o === r.id ? null : o)}
      onDrop={e => { e.preventDefault(); reorder(drag, r.id); setDrag(null); setOverId(null); }}
      onDragEnd={() => { setDrag(null); setOverId(null); }}
      style={{ display: "flex", alignItems: "center", gap: 9, padding: "9px 14px", background: drag === r.id ? "#f7f6f0" : "#fff",
        borderBottom: overId === r.id && drag !== r.id ? `2px solid ${C.green}` : `1px solid ${C.line}`,
        opacity: drag === r.id ? .5 : 1 }}>
      <span onMouseDown={e => e.stopPropagation()} style={{ display: "flex", flexShrink: 0 }}>
        <GripVertical size={14} style={{ color: C.line, cursor: "grab" }} /></span>
      {r.book
        ? <BookCover title={r.book} subj={r.subj} cover={r.cover} w={26} dim={!r.link} />
        : <div style={{ width: 6, height: 30, borderRadius: 3, background: subjColor(r.subj), flexShrink: 0 }} />}
      <div style={{ flex: 1, minWidth: 130 }} draggable={false} onDragStart={e => e.preventDefault()}>
        <EditCell value={r.book} onChange={v => upd(r.id, { book: v })} placeholder="Book or material" italic />
        <EditCell value={r.topic} onChange={v => upd(r.id, { topic: v })} placeholder="Topic (optional)" italic />
      </div>
      <span style={{ width: 148, flexShrink: 0 }}>
        <EditSelect value={r.subj} onChange={v => upd(r.id, { subj: v })} options={subjOpts} onAdd={addSubj} label="subject" />
        <EditSelect value={r.subj2 || ""} onChange={v => upd(r.id, { subj2: v })}
          options={["", ...subjOpts.filter(x => x !== r.subj)]} onAdd={addSubj}
          label="second subject" blankLabel="+ second subject" /></span>
      <span style={{ width: 148, flexShrink: 0 }}>
        <EditSelect value={r.feast} onChange={v => upd(r.id, { feast: v })} options={feastOpts} onAdd={addFeast} label="activity" /></span>
      <div style={{ width: 96, flexShrink: 0 }} draggable={false} onDragStart={e => e.preventDefault()}>
        <EditCell value={r.music} onChange={v => upd(r.id, { music: v })} placeholder="music" italic /></div>
      <span style={{ width: 82, flexShrink: 0 }}><MinBox value={r.m} onChange={m => setMin(r.id, m)} /></span>
      {showDays && <DayToggles days={r.days} onChange={d => upd(r.id, { days: d })} />}
      <button onClick={() => delRow(r.id)} title="Remove from the plan"
        style={{ background: "none", border: "none", cursor: "pointer", padding: 3, flexShrink: 0 }}>
        <Trash2 size={13} style={{ color: C.muted }} /></button>
    </div>
  );
}

/* ───────────────────────── WEEKLY PLAN — build the rhythm ───────────────────────── */
function PageWeek({ plan, setPlan, upd, setMin, addRow, delRow, todayIdx, go,
  subjOpts, feastOpts, addSubj, addFeast }) {
  const [view, setView] = useState("week");   // "week" | day index
  const [ratings, setRatings] = useState({});
  const [drag, setDrag] = useState(null);
  const [overId, setOverId] = useState(null);
  const reorder = (fromId, toId) => {
    if (!fromId || !toId || fromId === toId) return;
    const next = [...plan];
    const f = next.findIndex(p => p.id === fromId);
    const t2 = next.findIndex(p => p.id === toId);
    const [moved] = next.splice(f, 1);
    next.splice(t2, 0, moved);
    setPlan(next);
  };
  const dayRows = d => plan.filter(p => p.days.includes(d));
  const rowProps = { upd, setMin, delRow, drag, setDrag, overId, setOverId, reorder, subjOpts, feastOpts, addSubj, addFeast };
  const weekTotal = plan.reduce((a, p) => a + p.m * p.days.length, 0);

  return (
    <>
      <Title sub="Set the rhythm once and it carries the whole term. Everything here is editable — tap any field and type. Today's rows appear on Home automatically.">Weekly Plan</Title>

      <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap", alignItems: "center" }}>
        <button onClick={() => setView("week")} style={{ padding: "7px 14px", borderRadius: 8, fontSize: 12.5, fontWeight: 600,
          cursor: "pointer", border: `1px solid ${view === "week" ? "transparent" : C.line}`,
          background: view === "week" ? C.green : "#fff", color: view === "week" ? "#fff" : C.soft }}>Whole week</button>
        {DAY_FULL.map((d, i) => {
          const on = view === i, n = dayRows(i).length;
          return (
            <button key={i} onClick={() => setView(i)} title={n ? `${n} activities` : "No activities yet"}
              style={{ padding: "7px 12px", borderRadius: 8, fontSize: 12.5, position: "relative",
                cursor: "pointer", fontWeight: on || i === todayIdx ? 600 : 400,
                border: `1px solid ${on ? "transparent" : i === todayIdx ? C.green : C.line}`,
                background: on ? C.green : "#fff", color: on ? "#fff" : n ? C.soft : C.muted, opacity: n ? 1 : .6 }}>
              {d.slice(0, 3)}
              {i === todayIdx && !on && <span style={{ position: "absolute", top: 3, right: 5, fontSize: 8,
                letterSpacing: .4, color: C.green, fontWeight: 700 }}>today</span>}
            </button>);
        })}
        <span style={{ fontSize: 11.5, color: C.muted, marginLeft: "auto" }}>
          {plan.length} activities · {Math.round(weekTotal / 60 * 10) / 10} hrs a week
        </span>
      </div>

      {view === "week" ? (
        <Panel title="Your rhythm — every activity and the days it runs" pad={0}>
          <WeekHead showDays />
          {plan.map(r => <WeekRow key={r.id} r={r} showDays {...rowProps} />)}
          <div style={{ padding: "11px 14px", background: C.wash }}>
            <Btn small tone="quiet" onClick={() => addRow(todayIdx)}><Plus size={13} /> Add an activity</Btn>
            <span style={{ fontSize: 11.5, color: C.muted, marginLeft: 10 }}>
              Drag a row to reorder · toggle the day circles to set which days it runs.</span>
            <div style={{ fontSize: 11, color: C.muted, marginTop: 7, lineHeight: 1.55 }}>
              <strong style={{ color: C.soft }}>Subject</strong> is the DepEd name your records translate into ·
              <strong style={{ color: C.soft }}> CM Feast</strong> is what you actually do — read aloud, copywork,
              memory work, narration.
            </div>
          </div>
        </Panel>
      ) : (
        <Panel title={`${DAY_FULL[view]} — ${dayRows(view).length} activities · ${dayRows(view).reduce((a, r) => a + r.m, 0)} minutes`} pad={0}>
          <WeekHead />
          {dayRows(view).length === 0 ? (
            <div style={{ padding: "34px 16px", textAlign: "center", color: C.muted }}>
              <Motif kind="nest" color={C.line} size={40} style={{ marginBottom: 8 }} />
              <div style={{ fontSize: 13.5 }}>Nothing planned for {DAY_FULL[view]} — a rest day is a real choice.</div>
            </div>
          ) : dayRows(view).map(r => <WeekRow key={r.id} r={r} showDays {...rowProps} />)}
          <div style={{ padding: "11px 14px", background: C.wash }}>
            <Btn small tone="quiet" onClick={() => addRow(view)}><Plus size={13} /> Add to {DAY_FULL[view]}</Btn>
          </div>
        </Panel>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <Panel title="This week at a glance">
          {DAY_FULL.map((d, i) => {
            const rows = dayRows(i), mins = rows.reduce((a, r) => a + r.m, 0);
            const max = Math.max(...DAY_FULL.map((_, x) => dayRows(x).reduce((a, r) => a + r.m, 0)), 1);
            return (
              <div key={i} style={{ marginBottom: 9 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 12.8, color: i === todayIdx ? C.deep : C.soft, fontWeight: i === todayIdx ? 600 : 400 }}>{d}</span>
                  <span style={{ fontSize: 11.5, color: C.muted }}>{rows.length ? `${rows.length} · ${mins} min` : "rest"}</span></div>
                <div style={{ height: 7, background: C.wash, borderRadius: 4, overflow: "hidden", display: "flex" }}>
                  {rows.map(r => <div key={r.id} style={{ width: `${r.m / max * 100}%`, background: subjColor(r.subj), opacity: .85 }} />)}
                </div>
              </div>);
          })}
        </Panel>
        <Panel title="Habit and character">
          <Note icon={ShieldCheck}>Rated once at term's end. These observations carry no academic weight.</Note>
          {HABITS.map(g => (
            <div key={g.h} style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 13.5, fontWeight: 600, marginBottom: 6 }}>{g.h}</div>
              {g.items.map(it => (
                <div key={it} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
                  <span style={{ fontSize: 12.5, color: C.soft, flex: 1 }}>{it}</span>
                  <div style={{ display: "flex", gap: 3 }}>{RATING.map(rt => (
                    <button key={rt} onClick={() => setRatings({ ...ratings, [it]: rt })} style={{ fontSize: 10, padding: "3px 8px",
                      borderRadius: 14, cursor: "pointer", border: `1px solid ${ratings[it] === rt ? C.green : C.line}`,
                      background: ratings[it] === rt ? C.green : "#fff", color: ratings[it] === rt ? "#fff" : C.muted }}>{rt}</button>))}
                  </div></div>))}
            </div>))}
        </Panel>
      </div>
    </>);
}

/* ───────────────────────── CALENDAR ───────────────────────── */
function PageCalendar({ events, setEvents, allEvents, now, email, emailOn, go, isMobile }) {
  const [month, setMonth] = useState(() => new Date(now.getFullYear(), now.getMonth(), 1));
  const [draft, setDraft] = useState(null);

  const y = month.getFullYear(), m = month.getMonth();
  const first = new Date(y, m, 1).getDay();
  const len = new Date(y, m + 1, 0).getDate();
  const iso = d => `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
  const onDay = d => allEvents.filter(e => { const t = iso(d); return t >= e.start && t <= (e.end || e.start); });

  /* the list follows whichever month the calendar is showing, so it stays
     short instead of running to the end of the school year. Move the
     calendar and the list moves with it. */
  const monthTag = `${y}-${String(m + 1).padStart(2, "0")}`;
  const inMonth = e => {
    const from = e.start.slice(0, 7), to = (e.end || e.start).slice(0, 7);
    return from <= monthTag && to >= monthTag;      // spans into this month
  };
  const viewingNow = y === now.getFullYear() && m === now.getMonth();
  const upcoming = allEvents
    .filter(inMonth)
    .filter(e => !viewingNow || daysUntil(e.end || e.start, now) >= 0)
    .sort((a2, b2) => a2.start.localeCompare(b2.start));
  const laterCount = allEvents.filter(e => (e.start.slice(0, 7) > monthTag)).length;

  /* what's on the day the parent tapped, and what else is left in the
     month once that day is taken out */
  const selectedDayEvents = draft
    ? allEvents.filter(e => draft.start >= e.start && draft.start <= (e.end || e.start))
        .sort((x, z) => (x.startTime || "99").localeCompare(z.startTime || "99"))
    : [];
  const restOfMonth = draft
    ? upcoming.filter(e => !selectedDayEvents.some(se => se.id === e.id))
    : [];
  const monthName = month.toLocaleDateString("en-GB", { month: "long" });

  const blank = { id: "", title: "", start: iso(Math.min(now.getDate(), len)), end: "", kind: "personal",
    startTime: "", endTime: "", venue: "", remind: [3, 1, 0], email: false, note: "" };

  const save = () => {
    if (!draft.title.trim()) return;
    setEvents(draft.id ? events.map(e => e.id === draft.id ? draft : e)
                       : [...events, { ...draft, id: "u" + Date.now() }]);
    setDraft(null);
  };
  const remove = id => { setEvents(events.filter(e => e.id !== id)); setDraft(null); };

  return (
    <>
      <Title sub="School dates and your own plans in one place. Anything coming up appears on Home, and Flora can email you before it arrives.">Calendar</Title>

      {/* side by side on a laptop; stacked on a phone, or the month grid
          is squeezed into a column too narrow to read */}
      <div style={{ display: "grid", gap: 16,
        gridTemplateColumns: isMobile ? "minmax(0,1fr)" : "minmax(0,1.5fr) minmax(0,1fr)" }}>
        <Panel title={month.toLocaleDateString("en-GB", { month: "long", year: "numeric" })}
          right={<span style={{ display: "flex", gap: 5 }}>
            <Btn small tone="quiet" onClick={() => setMonth(new Date(y, m - 1, 1))}><ChevronLeft size={13} /></Btn>
            <Btn small tone="quiet" onClick={() => setMonth(new Date(now.getFullYear(), now.getMonth(), 1))}>Today</Btn>
            <Btn small tone="quiet" onClick={() => setMonth(new Date(y, m + 1, 1))}><ChevronRight size={13} /></Btn>
          </span>} pad={14}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7,minmax(0,1fr))", gap: 4, marginBottom: 6 }}>
            {DAYS.map(d => (
              <div key={d} style={{ textAlign: "center", fontSize: 9.5, letterSpacing: 1, textTransform: "uppercase",
                color: C.muted, fontWeight: 700, padding: "2px 0" }}>{d}</div>))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7,minmax(0,1fr))", gap: 4 }}>
            {Array.from({ length: first }).map((_, i) => <div key={"b" + i} />)}
            {Array.from({ length: len }, (_, i) => i + 1).map(d => {
              const evs = onDay(d);
              const isToday = y === now.getFullYear() && m === now.getMonth() && d === now.getDate();
              const isSel = draft && draft.start === iso(d);
              return (
                /* with the form already open, tapping another day only moves
                   the date — replacing the draft would throw away the title
                   and reminders already typed */
                <div key={d}
                  onClick={() => setDraft(dr => dr ? { ...dr, start: iso(d) } : { ...blank, start: iso(d) })}
                  style={{ minHeight: 58, borderRadius: 8, cursor: "pointer", padding: "5px 6px",
                    minWidth: 0, overflow: "hidden",
                    border: isSel ? `2px solid ${C.blush}` : `1px solid ${isToday ? C.green : C.line}`,
                    background: isSel ? "#fdf4ee" : isToday ? "#f1f5ed" : "#fff",
                    boxShadow: isSel ? "0 1px 6px rgba(217,152,120,.35)" : "none" }}>
                  <div style={{ fontSize: 11.5, fontWeight: isSel || isToday ? 700 : 500,
                    color: isSel ? "#a4653f" : isToday ? C.deep : C.soft }}>{d}</div>
                  {evs.slice(0, 2).map(e => (
                    <div key={e.id} title={e.auto ? `${e.title} — ${e.note}` : e.title}
                      onClick={ev => { ev.stopPropagation(); if (!e.auto) setDraft(e); }}
                      style={{ marginTop: 2, fontSize: 8.5, lineHeight: 1.25, borderRadius: 3, padding: "2px 3px",
                        background: e.kind === "school" ? "#e7ede1" : e.kind === "holiday" ? "#f0eadb" : "#fbeee6",
                        color: e.kind === "school" ? C.deep : e.kind === "holiday" ? "#8a7340" : "#a4653f", overflow: "hidden",
                        whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
                        {e.startTime ? `${clockLabel(e.startTime)} ` : ""}{e.title}</div>))}
                  {evs.length > 2 && <div style={{ fontSize: 8, color: C.muted, marginTop: 1 }}>+{evs.length - 2} more</div>}
                </div>);
            })}
          </div>
          <div style={{ display: "flex", gap: 14, marginTop: 12, fontSize: 11, color: C.muted, alignItems: "center", flexWrap: "wrap" }}>
            <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{ width: 9, height: 9, borderRadius: 2, background: "#cfdcc4" }} /> School</span>
            <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{ width: 9, height: 9, borderRadius: 2, background: "#f3d9c8" }} /> Personal</span>
            <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{ width: 9, height: 9, borderRadius: 2, background: "#e5dcc4" }} /> Holiday</span>
            <span style={{ marginLeft: "auto" }}>Tap any day to add something</span>
          </div>
        </Panel>

        <div>
          {draft && (
            <Panel title={new Date(draft.start + "T00:00:00").toLocaleDateString("en-GB",
              { weekday: "long", day: "numeric", month: "long" })} pad={0}
              right={<Btn small tone="quiet" onClick={() => setDraft(null)}>Close</Btn>}>
              {selectedDayEvents.length === 0 ? (
                <div style={{ padding: "16px 15px", fontSize: 13, color: C.muted, lineHeight: 1.6 }}>
                  Nothing on this day yet — fill in the form below to add something.
                </div>
              ) : selectedDayEvents.map(e => (
                <div key={e.id} onClick={() => { if (!e.auto) setDraft(e); }}
                  style={{ cursor: e.auto ? "default" : "pointer", borderBottom: `1px solid ${C.line}`,
                    background: draft.id === e.id ? "#fdf4ee" : "#fff",
                    padding: "11px 15px", display: "flex", gap: 11, alignItems: "flex-start" }}>
                  <div style={{ width: 4, borderRadius: 3, alignSelf: "stretch", flexShrink: 0,
                    background: e.kind === "school" ? C.green : e.kind === "holiday" ? "#c2ab77" : C.blush }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 500, color: C.ink }}>{e.title}</div>
                    <div style={{ fontSize: 11.5, color: C.muted, marginTop: 2 }}>
                      {e.startTime ? clockLabel(e.startTime, e.endTime) : "All day"}
                      {e.venue ? ` \u00b7 ${e.venue}` : ""}
                      {e.auto ? " \u00b7 from your provider" : ""}</div>
                    {e.note && <div style={{ fontSize: 11.5, color: C.soft, marginTop: 3 }}>{e.note}</div>}
                  </div>
                  {!e.auto && <Pencil size={12} style={{ color: C.muted, flexShrink: 0, marginTop: 3 }} />}
                </div>))}
              <div style={{ padding: "10px 15px" }}>
                <Btn small tone="quiet"
                  onClick={() => setDraft({ ...blank, start: draft.start })}>
                  <Plus size={12} /> Add another on this day</Btn>
              </div>
            </Panel>)}

          {draft ? (
            <Panel title={draft.id ? "Edit this event" : "New event"}>
              <div style={{ display: "grid", gap: 11 }}>
                <SmallField label="What is it">
                  <input autoFocus value={draft.title} onChange={e => setDraft({ ...draft, title: e.target.value })}
                    placeholder="e.g. Portfolio submission" style={inp} /></SmallField>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <SmallField label="Starts">
                    <input type="date" value={draft.start} onChange={e => setDraft({ ...draft, start: e.target.value })} style={inp} /></SmallField>
                  <SmallField label="Ends (optional)">
                    <input type="date" value={draft.end} onChange={e => setDraft({ ...draft, end: e.target.value })} style={inp} /></SmallField>
                </div>
                <SmallField label="Time (optional)">
                  <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                    <input type="time" value={draft.startTime || ""}
                      onChange={e => setDraft({ ...draft, startTime: e.target.value })}
                      style={{ ...inp, width: 130, minHeight: 42 }} />
                    <span style={{ fontSize: 12.5, color: C.muted }}>to</span>
                    <input type="time" value={draft.endTime || ""}
                      onChange={e => setDraft({ ...draft, endTime: e.target.value })}
                      style={{ ...inp, width: 130, minHeight: 42 }} />
                    {(draft.startTime || draft.endTime) && (
                      <button onClick={() => setDraft({ ...draft, startTime: "", endTime: "" })}
                        style={{ background: "none", border: "none", cursor: "pointer", padding: 0,
                          fontSize: 11.5, color: C.muted, textDecoration: "underline" }}>Clear</button>)}
                  </div>
                  <div style={{ fontSize: 11, color: C.muted, marginTop: 5 }}>
                    Leave blank for something that just happens on the day.
                  </div></SmallField>
                <SmallField label="Location (optional)">
                  <input value={draft.venue || ""} onChange={e => setDraft({ ...draft, venue: e.target.value })}
                    placeholder="e.g. Anahaw clubhouse, Taguig City" style={{ ...inp, minHeight: 42 }} /></SmallField>
                <SmallField label="Kind">
                  <div style={{ display: "flex", gap: 7 }}>
                    {[["school", "School"], ["personal", "Personal"]].map(([k, l]) => (
                      <button key={k} onClick={() => setDraft({ ...draft, kind: k })}
                        style={{ flex: 1, padding: "8px 10px", borderRadius: 8, fontSize: 12.5, cursor: "pointer",
                          fontWeight: draft.kind === k ? 600 : 400,
                          border: `1px solid ${draft.kind === k ? C.green : C.line}`,
                          background: draft.kind === k ? "#f1f5ed" : "#fff",
                          color: draft.kind === k ? C.deep : C.soft }}>{l}</button>))}
                  </div></SmallField>
                <SmallField label="Remind me">
                  <div style={{ display: "grid", gap: 5 }}>
                    {REMIND_STEPS.map(r => {
                      const on = draft.remind.includes(r.d);
                      return (
                        <button key={r.d}
                          onClick={() => setDraft({ ...draft, remind: on ? draft.remind.filter(x => x !== r.d) : [...draft.remind, r.d] })}
                          style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 10px", borderRadius: 8,
                            cursor: "pointer", textAlign: "left", fontSize: 12.5,
                            border: `1px solid ${on ? C.green : C.line}`, background: on ? "#f1f5ed" : "#fff",
                            color: on ? C.deep : C.soft }}>
                          <span style={{ width: 15, height: 15, borderRadius: 4, flexShrink: 0,
                            border: on ? "none" : `1.5px solid ${C.line}`, background: on ? C.green : "#fff",
                            display: "flex", alignItems: "center", justifyContent: "center" }}>
                            {on && <Check size={10} color="#fff" />}</span>
                          {r.label}</button>);
                    })}
                  </div></SmallField>
                <SmallField label="Note (optional)">
                  <textarea rows={2} value={draft.note} onChange={e => setDraft({ ...draft, note: e.target.value })}
                    placeholder="Anything to bring or prepare" style={{ ...inp, resize: "vertical" }} /></SmallField>
                <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12.5, color: C.soft, cursor: "pointer" }}>
                  <input type="checkbox" checked={draft.email} onChange={e => setDraft({ ...draft, email: e.target.checked })} />
                  Email me as well as showing it on Home</label>
                {draft.email && !email && (
                  <div style={{ fontSize: 11.5, color: "#a4553b", display: "flex", gap: 6, alignItems: "flex-start" }}>
                    <AlertCircle size={12} style={{ flexShrink: 0, marginTop: 1 }} />
                    <span>No email address saved yet.{" "}
                      <button onClick={() => go("settings", "email")}
                        style={{ background: "none", border: "none", padding: 0, cursor: "pointer",
                          color: C.green, fontWeight: 700, fontSize: 11.5, textDecoration: "underline" }}>
                        Add one now</button></span></div>)}
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <Btn small onClick={save} disabled={!draft.title.trim()}><Check size={13} /> Save</Btn>
                  <Btn small tone="quiet" onClick={() => setDraft(null)}>Cancel</Btn>
                  {draft.id && <Btn small tone="quiet" onClick={() => remove(draft.id)}><Trash2 size={12} /> Delete</Btn>}
                </div>
              </div>
            </Panel>
          ) : null}

          {draft && restOfMonth.length > 0 && (
            <Panel title={viewingNow ? "Also coming up this month" : `Rest of ${monthName}`} pad={0}>
              {restOfMonth.map(e => {
                const n = daysUntil(e.start, now);
                return (
                  <div key={e.id} onClick={() => { if (!e.auto) setDraft(e); else setDraft({ ...blank, start: e.start }); }}
                    style={{ cursor: "pointer", borderBottom: `1px solid ${C.line}`,
                      background: e.auto ? "#fcfbf6" : "#fff", padding: "10px 15px", display: "flex", gap: 11 }}>
                    <div style={{ width: 4, borderRadius: 3, flexShrink: 0,
                      background: e.kind === "school" ? C.green : e.kind === "holiday" ? "#c2ab77" : C.blush }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 500, color: C.ink }}>{e.title}</div>
                      <div style={{ fontSize: 11, color: C.muted, marginTop: 1 }}>
                        {fmtDate(e.start)}{e.startTime ? ` \u00b7 ${clockLabel(e.startTime)}` : ""}
                        {n >= 0 ? ` \u00b7 ${untilLabel(n)}` : ""}</div>
                    </div>
                  </div>);
              })}
            </Panel>)}

          {!draft && (
            <Panel title={viewingNow ? "Coming up this month" : monthName}
              right={<Btn small tone="quiet" onClick={() => setDraft(blank)}><Plus size={12} /> Add</Btn>} pad={0}>
              {upcoming.length === 0 ? (
                <div style={{ padding: "26px 16px", textAlign: "center", color: C.muted, fontSize: 13, lineHeight: 1.7 }}>
                  {viewingNow ? "Nothing left this month." : `Nothing in ${monthName}.`}
                  {laterCount > 0 && <><br />
                    <button onClick={() => setMonth(new Date(y, m + 1, 1))}
                      style={{ background: "none", border: "none", cursor: "pointer", padding: "6px 0 0",
                        fontSize: 12.5, color: C.green, fontWeight: 600, textDecoration: "underline" }}>
                      {laterCount} later on — look ahead a month</button></>}
                </div>
              ) : upcoming.map(e => {
                const n = daysUntil(e.start, now);
                return (
                  <div key={e.id} onClick={() => { if (!e.auto) setDraft(e); }}
                    style={{ cursor: e.auto ? "default" : "pointer", borderBottom: `1px solid ${C.line}`,
                      background: e.auto ? "#fcfbf6" : "#fff", padding: "11px 15px", display: "flex", gap: 11 }}>
                    <div style={{ width: 4, borderRadius: 3, flexShrink: 0,
                      background: e.kind === "school" ? C.green : e.kind === "holiday" ? "#c2ab77" : C.blush }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13.5, fontWeight: 500, color: C.ink }}>
                        {e.title}
                        {e.prov && <span style={{ marginLeft: 6, fontSize: 8.5, letterSpacing: .5,
                          textTransform: "uppercase", color: "#8a7340", background: "#f0eadb",
                          padding: "1px 5px", borderRadius: 4 }}>provisional</span>}</div>
                      <div style={{ fontSize: 11.5, color: C.muted, marginTop: 2 }}>
                        {fmtDate(e.start)}{e.end && e.end !== e.start ? ` \u2013 ${fmtDate(e.end)}` : ""}
                        {n >= 0 && ` \u00b7 ${untilLabel(n)}`}</div>
                    </div>
                    {e.email && <Mail size={12} style={{ color: C.muted, flexShrink: 0, marginTop: 3 }} />}
                  </div>);
              })}
              <div style={{ padding: "10px 15px", display: "flex", alignItems: "center", gap: 10,
                justifyContent: "space-between", flexWrap: "wrap" }}>
                <span style={{ fontSize: 11.5, color: C.muted }}>
                  {laterCount > 0 ? `${laterCount} more after ${monthName}` : "Nothing further ahead yet"}</span>
                <span style={{ display: "flex", gap: 6 }}>
                  <Btn small tone="quiet" onClick={() => setMonth(new Date(y, m - 1, 1))}>
                    <ChevronLeft size={12} /> {new Date(y, m - 1, 1).toLocaleDateString("en-GB", { month: "short" })}</Btn>
                  <Btn small tone="quiet" onClick={() => setMonth(new Date(y, m + 1, 1))}>
                    {new Date(y, m + 1, 1).toLocaleDateString("en-GB", { month: "short" })} <ChevronRight size={12} /></Btn>
                </span>
              </div>
            </Panel>)}

          <Panel title="Email reminders">
            <div style={{ fontSize: 12.8, color: C.soft, lineHeight: 1.6 }}>
              {email
                ? (emailOn
                    ? <>Reminders go to <strong style={{ color: C.ink }}>{email}</strong> on each date you tick.</>
                    : <>Email reminders are switched off. Turn them on in Settings.</>)
                : <>Add your email in Settings and Flora can send a note before each date.</>}
            </div>
            <div style={{ marginTop: 11 }}><Btn small tone="quiet" onClick={() => go("settings", "email")}><Cog size={12} /> Add your email</Btn></div>
          </Panel>
        </div>
      </div>
    </>);
}

function PageSubjects({ prov, feastOpts, addFeast, renameFeast, removeFeast, feastInUse }) {
  const [editing, setEditing] = useState(null);
  const [draftName, setDraftName] = useState("");
  const [adding, setAdding] = useState("");
  const [confirm, setConfirm] = useState(null);
  const guides = [
    { n: "DepEd Curriculum", d: "The subject list your records translate into", ok: true },
    { n: "Charlotte Mason Method", d: "The practices behind each activity", ok: true },
    { n: "Portfolio Guide", d: prov ? `Loaded from ${prov.short}` : "Upload yours, or enter a provider code", ok: !!prov },
    { n: "Exam Guide", d: "Not required at this level", ok: false },
    { n: "Grading Guide", d: "Coming in a later version", ok: false },
  ];
  return (
    <>
      <Title sub="Seven subjects and the Charlotte Mason activities that feed each one. These colours carry through every report and portfolio page.">Subjects</Title>
      <Panel title="Charlotte Mason feast"
        right={<span style={{ fontSize: 11.5, color: C.muted }}>{feastOpts.length} practices</span>}>
        <div style={{ fontSize: 13, color: C.soft, lineHeight: 1.7, marginBottom: 13 }}>
          {prov?.feast
            ? `These are the practices on ${prov.short}'s ${prov.level} feast wheel. Rename or remove any that don't fit your family, and add your own.`
            : "The practices you choose from when planning an activity. Rename or remove any you don't use, and add your own."}
        </div>

        <div style={{ display: "grid", gap: 6 }}>
          {feastOpts.map(f => {
            const used = feastInUse(f);
            const isEditing = editing === f;
            return (
              <div key={f} style={{ display: "flex", alignItems: "center", gap: 9, padding: "8px 11px",
                border: `1px solid ${C.line}`, borderRadius: 9, background: "#fff", flexWrap: "wrap" }}>
                {isEditing ? (
                  <>
                    <input value={draftName} autoFocus
                      onChange={e => setDraftName(e.target.value)}
                      onKeyDown={e => { if (e.key === "Enter") { renameFeast(f, draftName); setEditing(null); }
                                        if (e.key === "Escape") setEditing(null); }}
                      style={{ ...inp, flex: 1, minWidth: 140, minHeight: 38, fontSize: 13 }} />
                    <Btn small onClick={() => { renameFeast(f, draftName); setEditing(null); }}>Save</Btn>
                    <Btn small tone="quiet" onClick={() => setEditing(null)}>Cancel</Btn>
                  </>
                ) : (
                  <>
                    <span style={{ flex: 1, minWidth: 120, fontSize: 13.5, color: C.ink }}>{f}</span>
                    {used > 0 && (
                      <span style={{ fontSize: 11, color: C.muted }}>
                        used in {used} {used === 1 ? "activity" : "activities"}</span>)}
                    <button title="Rename" onClick={() => { setEditing(f); setDraftName(f); }}
                      style={{ background: "none", border: "none", cursor: "pointer", padding: 5 }}>
                      <Pencil size={13} style={{ color: C.muted }} /></button>
                    <button title="Remove" onClick={() => used > 0 ? setConfirm(f) : removeFeast(f)}
                      style={{ background: "none", border: "none", cursor: "pointer", padding: 5 }}>
                      <Trash2 size={13} style={{ color: C.muted }} /></button>
                  </>)}

                {confirm === f && (
                  <div style={{ width: "100%", marginTop: 7, background: "#fbeee6",
                    border: "1px solid #edcdb8", borderRadius: 8, padding: "9px 11px" }}>
                    <div style={{ fontSize: 12.5, color: "#8f4630", lineHeight: 1.6 }}>
                      {used} {used === 1 ? "activity uses" : "activities use"} this. Removing it takes it out
                      of the list, but those activities keep the label — nothing you've logged is lost.
                    </div>
                    <div style={{ display: "flex", gap: 7, marginTop: 8 }}>
                      <Btn small onClick={() => { removeFeast(f); setConfirm(null); }}>Remove anyway</Btn>
                      <Btn small tone="quiet" onClick={() => setConfirm(null)}>Keep it</Btn>
                    </div>
                  </div>)}
              </div>);
          })}
        </div>

        <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
          <input value={adding} onChange={e => setAdding(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && adding.trim()) { addFeast(adding.trim()); setAdding(""); } }}
            placeholder="Add a practice — e.g. Poetry Teatime"
            style={{ ...inp, flex: 1, minWidth: 190, minHeight: 42 }} />
          <Btn small disabled={!adding.trim()}
            onClick={() => { addFeast(adding.trim()); setAdding(""); }}>
            <Plus size={13} /> Add</Btn>
        </div>
      </Panel>

      <Panel title="Your subjects" pad={0}>
        {SUBJECTS.map((s, i) => (
          <div key={s.s} style={{ display: "flex", gap: 14, padding: "14px 18px", alignItems: "center",
            borderBottom: i < SUBJECTS.length - 1 ? `1px solid ${C.line}` : "none" }}>
            <div style={{ width: 6, alignSelf: "stretch", borderRadius: 4, background: subjColor(s.s), flexShrink: 0 }} />
            <Motif kind={MOTIFS[i]} color={subjColor(s.s)} size={34} style={{ flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14.5, fontWeight: 600, marginBottom: 3 }}>{s.s}</div>
              <div style={{ fontSize: 12.8, color: C.soft, lineHeight: 1.6 }}>{s.a}</div></div>
          </div>))}
      </Panel>
      <Panel title="Provider guidelines">
        <Note>{prov ? `${prov.name} requirements are loaded. Flora has hidden anything this level doesn't need.`
          : "Enter a provider code in Settings, or upload your provider's files."}</Note>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(215px,1fr))", gap: 10 }}>
          {guides.map(g => (
            <div key={g.n} style={{ border: `1px solid ${C.line}`, borderRadius: 10, padding: "13px 14px",
              background: g.ok ? "#fff" : C.wash, opacity: g.ok ? 1 : .68 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 4 }}>
                {g.ok ? <Check size={13} style={{ color: C.green }} /> : <Info size={13} style={{ color: C.muted }} />}
                <span style={{ fontSize: 13.5, fontWeight: 600 }}>{g.n}</span></div>
              <div style={{ fontSize: 12, color: C.soft, lineHeight: 1.5 }}>{g.d}</div>
            </div>))}
        </div>
        <div style={{ marginTop: 13 }}><Btn tone="quiet" small disabled title="Not built yet"><Upload size={13} /> Upload a guideline file</Btn></div>
      </Panel>
    </>);
}

/* ───────────────────────── OUTPUTS ───────────────────────── */
function PageOutputs({ plan, done, fav, setFav, caps, setCaps, notes, photoVersion, bumpPhotos,
  photoFit, setPhotoFit, photoMeta, setPhotoMeta, prov, subjOpts, noPhotosHere }) {
  const [all, setAll] = useState([]);
  const [filter, setFilter] = useState("photos");   // photos | done | starred
  const [preview, setPreview] = useState(null);     // { photo, entryId }
  const [weekOf, setWeekOf] = useState(() => {
    const d = new Date(); d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - ((d.getDay() + 6) % 7));      // Monday of this week
    return d.toISOString().slice(0, 10);
  });
  const [busy, setBusy] = useState(false);

  /* Back-filling a term: photos that were taken before Flora existed have
     no activity to attach to, so they carry their own subject and title.
     They sort into the portfolio exactly like logged ones. */
  const addPast = async files => {
    setBusy(true);
    for (const f of files) {
      try {
        const id = await addPhoto(BULK_ID, f);
        const taken = f.lastModified ? new Date(f.lastModified) : new Date();
        setPhotoMeta(m => ({ ...m, [id]: { subject: "", title: "", date: taken.toISOString().slice(0, 10) } }));
      } catch {}
    }
    setBusy(false);
    bumpPhotos();
  };

  /* every photo in the store, joined back to the activity it belongs to.
     Reading from the photo store rather than from done/starred flags is
     the point: a photo must never be invisible just because the parent
     hasn't ticked or starred anything yet. */
  useEffect(() => {
    let cancelled = false;
    getAllPhotos()
      .then(rows => { if (!cancelled) setAll(rows.filter(r => r.entryId !== PROFILE_ID && r.entryId !== "__selftest__")); })
      .catch(() => { if (!cancelled) setAll([]); });
    return () => { cancelled = true; };
  }, [photoVersion]);

  const byEntry = {};
  all.forEach(r => { (byEntry[r.entryId] = byEntry[r.entryId] || []).push(r); });

  const past = (byEntry[BULK_ID] || []).slice().sort((x, y) => (y.addedAt || 0) - (x.addedAt || 0));
  const withPhotos = plan.filter(r => byEntry[r.id]?.length);
  const orphanIds = Object.keys(byEntry)
    .filter(id => id !== BULK_ID && !plan.some(r => r.id === id));

  /* a Monday-to-Sunday window for looking back at a particular week */
  const wkStart = new Date(weekOf + "T00:00:00").getTime();
  const wkEnd = wkStart + 7 * 86400000;

  /* one entry per activity per day, so a repeating rhythm row shows up
     once for every day it was actually done */
  const completions = Object.entries(done).map(([k, v]) => {
    const { id, day } = splitKey(k);
    const row = plan.find(r => r.id === id);
    if (!row || !v) return null;
    const when = day ? new Date(day + "T00:00:00").getTime()
      : (typeof v === "number" ? v : null);
    return { row, id, day: day || (typeof v === "number" ? isoDay(v) : null), when, key: k };
  }).filter(Boolean);

  const doneThatWeek = completions
    .filter(c => c.when !== null && c.when >= wkStart && c.when < wkEnd)
    .sort((a2, b2) => a2.when - b2.when);
  const undatedDone = completions.filter(c => c.when === null);
  const shiftWeek = days => {
    const d = new Date(weekOf + "T00:00:00");
    d.setDate(d.getDate() + days);
    setWeekOf(d.toISOString().slice(0, 10));
  };
  const wkLabel = new Date(weekOf + "T00:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "long" });

  const rows = filter === "photos" ? withPhotos.map(r => ({ row: r, id: r.id, day: null }))
    : filter === "done" ? doneThatWeek
    : plan.filter(r => fav[r.id]).map(r => ({ row: r, id: r.id, day: null }));

  const counts = {
    photos: withPhotos.length,
    done: completions.length,
    starred: plan.filter(r => fav[r.id]).length,
  };
  const totalPhotos = all.length;

  return (
    <>
      <Title sub="Every photo you've kept, with the activity it belongs to. Star what should appear in the portfolio.">Photos &amp; outputs</Title>

      {noPhotosHere && (
        <Note icon={Info}>
          <strong>No photos on this device yet.</strong> Photos stay on the device they were taken on.
          Logging on your phone but looking on a computer? Back up on the phone and restore here — that's
          how a term moves across.
        </Note>)}

      {totalPhotos > 0 && (() => {
        /* a glance at where the term stands: how many photos, how many are
           chosen for the portfolio, and which subjects still have none */
        const bySubj = {};
        withPhotos.forEach(r => subjectsOf(r).forEach(sub => {
          bySubj[sub] = (bySubj[sub] || 0) + (byEntry[r.id] || []).length;
        }));
        past.forEach(ph => {
          const sub = photoMeta[ph.id]?.subject;
          if (sub) bySubj[sub] = (bySubj[sub] || 0) + 1;
        });
        const starredPhotos = past.filter(ph => fav[ph.id]).length
          + withPhotos.filter(r => fav[r.id]).reduce((n, r) => n + (byEntry[r.id] || []).length, 0);
        const unsorted = past.filter(ph => !photoMeta[ph.id]?.subject).length;
        const covered = Object.keys(bySubj);
        const missing = (prov ? prov.subjects : SUBJ_OPTIONS).filter(x => !covered.includes(x));

        return (
          <Panel title="Where your photos stand">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(130px,1fr))", gap: 10, marginBottom: 14 }}>
              {[["Photos kept", totalPhotos, C.ink],
                ["Chosen for the portfolio", starredPhotos, C.green],
                ["Waiting for a subject", unsorted, unsorted ? "#a4553b" : C.muted]].map(([l, v, col]) => (
                <div key={l} style={{ border: `1px solid ${C.line}`, borderRadius: 10, padding: "11px 13px" }}>
                  <div style={{ fontSize: 11, color: C.muted, lineHeight: 1.4 }}>{l}</div>
                  <div style={{ fontFamily: serif, fontSize: 25, fontWeight: 600, color: col, marginTop: 2 }}>{v}</div>
                </div>))}
            </div>

            {covered.length > 0 && (
              <>
                <div style={{ fontSize: 11, letterSpacing: 1.2, textTransform: "uppercase",
                  color: C.muted, fontWeight: 700, marginBottom: 7 }}>By subject</div>
                <div style={{ display: "flex", gap: 7, flexWrap: "wrap", marginBottom: missing.length ? 11 : 0 }}>
                  {covered.sort((a2, b2) => bySubj[b2] - bySubj[a2]).map(sub => (
                    <span key={sub} style={{ display: "inline-flex", alignItems: "center", gap: 6,
                      border: `1px solid ${C.line}`, borderRadius: 20, padding: "5px 11px", fontSize: 12 }}>
                      <span style={{ width: 8, height: 8, borderRadius: "50%", background: subjColor(sub) }} />
                      <span style={{ color: C.soft }}>{sub}</span>
                      <strong style={{ color: C.ink }}>{bySubj[sub]}</strong>
                    </span>))}
                </div>
              </>)}

            {missing.length > 0 && (
              <div style={{ fontSize: 12, color: C.soft, lineHeight: 1.65 }}>
                Nothing yet for {missing.slice(0, 3).join(", ")}{missing.length > 3 ? ` and ${missing.length - 3} more` : ""}.
                Not a problem — just the ones to reach for next.
              </div>)}
          </Panel>);
      })()}

      <Panel title={`${totalPhotos} photo${totalPhotos === 1 ? "" : "s"} kept so far`}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {[["photos", `With a photo (${counts.photos})`],
            ["done", `Marked done (${counts.done})`],
            ["starred", `For the portfolio (${counts.starred})`]].map(([k, label]) => {
            const on = filter === k;
            return (
              <button key={k} onClick={() => setFilter(k)} style={{ cursor: "pointer", minHeight: 40,
                borderRadius: 9, padding: "8px 13px", fontSize: 12.5, fontWeight: on ? 700 : 500,
                border: `1.5px solid ${on ? C.green : C.line}`, background: on ? "#f1f5ed" : "#fff",
                color: on ? C.deep : C.soft }}>{label}</button>);
          })}
        </div>
        {orphanIds.length > 0 && (
          <div style={{ fontSize: 11.5, color: C.muted, marginTop: 10 }}>
            {orphanIds.length} photo group{orphanIds.length === 1 ? "" : "s"} belong to activities no longer
            in your rhythm. They stay in your backup and are safe.
          </div>)}

        {filter === "done" && (
          <div style={{ marginTop: 14, paddingTop: 13, borderTop: `1px solid ${C.line}` }}>
            <div style={{ display: "flex", gap: 9, alignItems: "center", flexWrap: "wrap" }}>
              <Btn small tone="quiet" onClick={() => shiftWeek(-7)}><ChevronLeft size={13} /> Earlier</Btn>
              <SmallField label="Week beginning">
                <input type="date" value={weekOf} onChange={e => setWeekOf(e.target.value)}
                  style={{ ...inp, minHeight: 42, width: 170 }} /></SmallField>
              <Btn small tone="quiet" onClick={() => shiftWeek(7)}>Later <ChevronRight size={13} /></Btn>
              <span style={{ fontSize: 12.5, color: C.soft }}>
                Week of {wkLabel} — {doneThatWeek.length} logged</span>
            </div>
            {undatedDone.length > 0 && (
              <div style={{ fontSize: 11.5, color: C.muted, marginTop: 8, lineHeight: 1.6 }}>
                {undatedDone.length} older tick{undatedDone.length === 1 ? "" : "s"} carry no date, so they
                can't be placed in a week. Everything logged from now on is stored against its own day.
              </div>)}
          </div>)}
      </Panel>

      <Panel title="Add photos from before"
        right={<span style={{ fontSize: 11.5, color: C.muted }}>{past.length} added</span>}>
        <div style={{ fontSize: 13, color: C.soft, lineHeight: 1.7, marginBottom: 12 }}>
          Catching up on a term that's already underway? Add the photos straight from your gallery — as many
          at once as you like — then give each one a subject so it lands on the right portfolio page.
        </div>
        <label style={{ display: "inline-flex", alignItems: "center", gap: 8, cursor: busy ? "default" : "pointer",
          background: C.green, color: "#fff", border: "1px solid transparent", borderRadius: 9,
          fontWeight: 600, fontSize: 13.5, padding: "12px 18px", minHeight: 44, opacity: busy ? .55 : 1 }}>
          <input type="file" accept="image/*,.heic,.heif" multiple disabled={busy}
            onChange={async e => { const f = [...e.target.files]; e.target.value = ""; if (f.length) await addPast(f); }}
            style={{ position: "absolute", width: 1, height: 1, opacity: 0, clip: "rect(0 0 0 0)" }} />
          <Upload size={15} /> {busy ? "Adding…" : "Choose photos"}
        </label>

        {past.length > 0 && (
          <div style={{ marginTop: 16 }}>
            {/* grouped by subject once one is chosen, so a term's worth of
                catching-up reads as pages rather than a pile */}
            {(() => {
              const groups = {};
              past.forEach(ph => {
                const k = (photoMeta[ph.id]?.subject) || "Not sorted yet";
                (groups[k] = groups[k] || []).push(ph);
              });
              const order = Object.keys(groups).sort((a2, b2) =>
                a2 === "Not sorted yet" ? -1 : b2 === "Not sorted yet" ? 1 : a2.localeCompare(b2));

              return order.map(group => (
                <div key={group} style={{ marginBottom: 20 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 9 }}>
                    <span style={{ width: 9, height: 9, borderRadius: 3, flexShrink: 0,
                      background: group === "Not sorted yet" ? C.line : subjColor(group) }} />
                    <span style={{ fontSize: 12.5, fontWeight: 700, letterSpacing: .3,
                      color: group === "Not sorted yet" ? C.muted : C.ink }}>{group}</span>
                    <span style={{ fontSize: 11.5, color: C.muted }}>
                      {groups[group].length} photo{groups[group].length === 1 ? "" : "s"}</span>
                    <div style={{ flex: 1, height: 1, background: C.line }} />
                  </div>

                  <div style={{ display: "grid", gap: 10 }}>
                    {groups[group].map(ph => {
                      const meta = photoMeta[ph.id] || {};
                      const setMeta = patch => setPhotoMeta({ ...photoMeta, [ph.id]: { ...meta, ...patch } });
                      return (
                        <div key={ph.id} style={{ display: "flex", gap: 12, alignItems: "flex-start",
                          flexWrap: "wrap", border: `1px solid ${C.line}`, borderRadius: 11,
                          padding: 11, background: "#fff" }}>
                          <button onClick={() => setPreview({ photo: ph, entryId: ph.id })}
                            title="Open, turn or crop"
                            style={{ width: 110, height: 84, padding: 0, border: "none", background: "none",
                              cursor: "zoom-in", flexShrink: 0 }}>
                            <PhotoImg rec={ph} url={photoURL(ph)} fit={photoFit[ph.id] || "cover"}
                              style={{ borderRadius: 8, border: `1px solid ${C.line}`, background: C.wash }} />
                          </button>

                          <div style={{ flex: 1, minWidth: 210, display: "grid", gap: 8 }}>
                            <input value={meta.title || ""} onChange={e => setMeta({ title: e.target.value })}
                              placeholder="What was this? e.g. Nature walk at the creek"
                              style={{ ...inp, minHeight: 40, fontSize: 13 }} />
                            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                              <select value={meta.subject || ""} onChange={e => setMeta({ subject: e.target.value })}
                                style={{ ...inp, minHeight: 40, fontSize: 13, flex: 1, minWidth: 150 }}>
                                <option value="">Which subject?</option>
                                {(prov ? prov.subjects : subjOpts || []).map(sub => (
                                  <option key={sub} value={sub}>{sub}</option>))}
                              </select>
                              <input type="date" value={meta.date || ""} onChange={e => setMeta({ date: e.target.value })}
                                style={{ ...inp, minHeight: 40, fontSize: 13, width: 155 }} />
                            </div>
                            <input value={caps[ph.id] || ""} onChange={e => setCaps({ ...caps, [ph.id]: e.target.value })}
                              placeholder="Caption for the portfolio…"
                              style={{ ...inp, minHeight: 40, fontSize: 12.5, fontStyle: "italic" }} />
                            <SuggestCaption photo={ph} subject={meta.subject} title={meta.title}
                              current={caps[ph.id]}
                              onUse={t => setCaps({ ...caps, [ph.id]: t })} />
                          </div>

                          <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "center" }}>
                            <button onClick={() => setFav({ ...fav, [ph.id]: !fav[ph.id] })}
                              title="Include in the portfolio"
                              style={{ background: "none", border: "none", cursor: "pointer", padding: 5 }}>
                              <Star size={19} fill={fav[ph.id] ? C.blush : "none"}
                                style={{ color: fav[ph.id] ? C.blush : C.line }} /></button>
                            <button title="Remove this photo"
                              onClick={async () => { await deletePhoto(ph.id); releaseURL(ph.id); bumpPhotos(); }}
                              style={{ background: "none", border: "none", cursor: "pointer", padding: 5 }}>
                              <Trash2 size={15} style={{ color: C.muted }} /></button>
                          </div>
                        </div>);
                    })}
                  </div>
                </div>));
            })()}

            <div style={{ fontSize: 11.5, color: C.muted, lineHeight: 1.6 }}>
              Starred photos appear on the portfolio page for the subject you chose. Without a subject they
              still show under Photo highlights.
            </div>
          </div>)}
      </Panel>

      <Panel pad={0} title={filter === "photos" ? "Activities with photos"
        : filter === "done" ? "Marked done" : "Chosen for the portfolio"}>
        {rows.length === 0 ? (
          <div style={{ padding: 34, textAlign: "center", color: C.muted, fontSize: 13.5, lineHeight: 1.7 }}>
            {filter === "photos"
              ? <>No photos yet. Open an activity on Today and tap <strong>Add photo</strong> —<br />
                  they'll all gather here.</>
              : filter === "done" ? "Nothing marked done yet."
              : "Nothing starred yet. Tap the star on an activity to include it."}
          </div>
        ) : rows.map(entry => {
          const r = entry.row, day = entry.day;
          const photos = day
            ? (byEntry[r.id] || []).filter(x => !x.day || x.day === day)
            : (byEntry[r.id] || []);
          const cap = day ? readDay(caps, r.id, day) : caps[r.id];
          const note = day ? readDay(notes || {}, r.id, day) : (notes || {})[r.id];
          return (
            <div key={entry.key || r.id} style={{ padding: "14px 18px", borderBottom: `1px solid ${C.line}` }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 12, flexWrap: "wrap" }}>
                <div style={{ flex: 1, minWidth: 190 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 14.5, fontWeight: 500 }}>{r.book || r.topic || "Untitled"}</span>
                    <SubjectPills r={r} />
                    {day && <span style={{ fontSize: 11, color: C.green, fontWeight: 600 }}>
                      {new Date(day + "T00:00:00").toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" })}</span>}
                  </div>
                  <input value={cap || ""}
                    onChange={e => setCaps(day ? writeDay(caps, r.id, day, e.target.value)
                                               : { ...caps, [r.id]: e.target.value })}
                    placeholder="Add a caption…" style={{ border: `1px solid ${C.line}`, outline: "none",
                      fontSize: 12.5, color: C.soft, background: "#fff", width: "100%", marginTop: 6,
                      fontStyle: "italic", borderRadius: 7, padding: "7px 9px", minHeight: 38 }} />
                  {note && (
                    <div style={{ fontSize: 12, color: C.muted, marginTop: 4, lineHeight: 1.55 }}>{note}</div>)}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                  <AddPhoto entryId={r.id} onAdded={bumpPhotos} small
                    label={photos.length ? "Add another" : "Add photo"} />
                  <button onClick={() => setFav({ ...fav, [r.id]: !fav[r.id] })}
                    title="Include in the portfolio"
                    style={{ background: "none", border: "none", cursor: "pointer", padding: 6 }}>
                    <Star size={19} fill={fav[r.id] ? C.blush : "none"}
                      style={{ color: fav[r.id] ? C.blush : C.line }} /></button>
                </div>
              </div>

              {photos.length > 0 && (
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 11 }}>
                  {photos.map(ph => {
                    const fit = photoFit[ph.id] || "cover";
                    return (
                      <div key={ph.id} style={{ position: "relative", width: 104, height: 78 }}>
                        <button title="Open, turn or caption this photo"
                          onClick={() => setPreview({ photo: ph, entryId: r.id })}
                          style={{ width: "100%", height: "100%", padding: 0, border: "none",
                            background: "none", cursor: "zoom-in", display: "block" }}>
                          <PhotoImg rec={ph} url={photoURL(ph)} fit={fit}
                            style={{ borderRadius: 8, border: `1px solid ${C.line}`, background: C.wash }} />
                        </button>
                        <button title={fit === "cover" ? "Show the whole photo" : "Crop to fill"}
                          onClick={() => setPhotoFit({ ...photoFit, [ph.id]: fit === "cover" ? "contain" : "cover" })}
                          style={{ position: "absolute", bottom: 4, left: 4, borderRadius: 6, border: "none",
                            background: "rgba(47,58,44,.72)", color: "#fff", fontSize: 9.5, fontWeight: 700,
                            padding: "3px 6px", cursor: "pointer" }}>
                          {fit === "cover" ? "cropped" : "whole"}</button>
                        <button title="Remove this photo"
                          onClick={async () => { await deletePhoto(ph.id); releaseURL(ph.id); bumpPhotos(); }}
                          style={{ position: "absolute", top: -6, right: -6, width: 19, height: 19,
                            borderRadius: "50%", border: `1px solid ${C.line}`, background: "#fff",
                            cursor: "pointer", padding: 0, display: "flex", alignItems: "center",
                            justifyContent: "center" }}>
                          <X size={10} style={{ color: C.muted }} /></button>
                      </div>);
                  })}
                </div>)}
            </div>);
        })}
      </Panel>

      {preview && (
        <PhotoLightbox
          photo={preview.photo}
          caption={caps[preview.entryId]}
          onCaption={v => setCaps({ ...caps, [preview.entryId]: v })}
          fit={photoFit[preview.photo.id] || "cover"}
          onFit={() => setPhotoFit({ ...photoFit,
            [preview.photo.id]: (photoFit[preview.photo.id] || "cover") === "cover" ? "contain" : "cover" })}
          onRotate={async deg => {
            const up = await rotatePhoto(preview.photo.id, deg);
            bumpPhotos();
            if (up) setPreview(pv => ({ ...pv, photo: up }));   // stay open on the turned photo
          }}
          onCrop={async sel => {
            const up = await cropPhoto(preview.photo.id, sel);
            bumpPhotos();
            if (up) setPreview(pv => ({ ...pv, photo: up }));
          }}
          onDelete={async () => { await deletePhoto(preview.photo.id); releaseURL(preview.photo.id); bumpPhotos(); setPreview(null); }}
          onClose={() => setPreview(null)} />)}
    </>);
}

/* ───────────────────────── charts ───────────────────────── */
function arc(cx, cy, r0, r1, a0, a1) {
  const p = (r, a) => [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  const [x0, y0] = p(r1, a0), [x1, y1] = p(r1, a1), [x2, y2] = p(r0, a1), [x3, y3] = p(r0, a0);
  const big = a1 - a0 > Math.PI ? 1 : 0;
  return `M${x0} ${y0}A${r1} ${r1} 0 ${big} 1 ${x1} ${y1}L${x2} ${y2}A${r0} ${r0} 0 ${big} 0 ${x3} ${y3}Z`;
}
function NestedDonut({ size = 300 }) {
  const [hover, setHover] = useState(null);
  const cx = size / 2, cy = size / 2, total = RD.total;
  const order = RD.subjects.map(([s]) => s);
  let a = -Math.PI / 2;
  const outer = RD.subjects.map(([s, v]) => { const sp = v / total * Math.PI * 2; const g = { s, v, a0: a, a1: a + sp }; a += sp; return g; });
  a = -Math.PI / 2;
  const inner = [];
  order.forEach(s => (RD.nest[s] || []).forEach(([p, v]) => { const sp = v / total * Math.PI * 2; inner.push({ s, p, v, a0: a, a1: a + sp }); a += sp; }));
  return (
    <div style={{ display: "flex", gap: 22, alignItems: "center", flexWrap: "wrap" }}>
      <div style={{ position: "relative", flexShrink: 0 }}>
        <svg width={size} height={size}>
          {inner.map((g, i) => <path key={"i" + i} d={arc(cx, cy, size * .17, size * .285, g.a0, g.a1)}
            fill={pracColor(g.p)} stroke="#fdfbf6" strokeWidth="1" opacity={hover && hover !== g.p && hover !== g.s ? .25 : .88}
            onMouseEnter={() => setHover(g.p)} onMouseLeave={() => setHover(null)} />)}
          {outer.map((g, i) => <path key={"o" + i} d={arc(cx, cy, size * .305, size * .44, g.a0, g.a1)}
            fill={subjColor(g.s)} stroke="#fdfbf6" strokeWidth="1.5" opacity={hover && hover !== g.s ? .28 : .95}
            onMouseEnter={() => setHover(g.s)} onMouseLeave={() => setHover(null)} />)}
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
          <div style={{ fontFamily: serif, fontSize: 30, fontWeight: 600, color: C.deep }}>{total}</div>
          <div style={{ fontSize: 10, color: C.muted, letterSpacing: 1 }}>ACTIVITIES</div>
          <div style={{ fontSize: 10, color: C.muted }}>{RD.days} days</div></div>
      </div>
      <div style={{ flex: 1, minWidth: 210 }}>
        <div style={{ fontSize: 10, letterSpacing: 1.6, textTransform: "uppercase", color: C.muted, fontWeight: 700, marginBottom: 7 }}>Outer ring — DepEd subject</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3px 12px", marginBottom: 15 }}>
          {RD.subjects.map(([s, v]) => (
            <div key={s} onMouseEnter={() => setHover(s)} onMouseLeave={() => setHover(null)}
              style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11.5, opacity: hover && hover !== s ? .4 : 1 }}>
              <span style={{ width: 9, height: 9, borderRadius: 2, background: subjColor(s), flexShrink: 0 }} />
              <span style={{ flex: 1, color: C.soft }}>{s}</span><span style={{ color: C.muted }}>{v}</span></div>))}
        </div>
        <div style={{ fontSize: 10, letterSpacing: 1.6, textTransform: "uppercase", color: C.muted, fontWeight: 700, marginBottom: 7 }}>Inner ring — CM feast</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3px 12px" }}>
          {RD.practices.map(([p, v]) => (
            <div key={p} onMouseEnter={() => setHover(p)} onMouseLeave={() => setHover(null)}
              style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11.5, opacity: hover && hover !== p ? .4 : 1 }}>
              <span style={{ width: 9, height: 9, borderRadius: "50%", background: pracColor(p), flexShrink: 0 }} />
              <span style={{ flex: 1, color: C.soft }}>{p}</span><span style={{ color: C.muted }}>{v}</span></div>))}
        </div>
      </div>
    </div>);
}
function Pie({ data, colorFn, size = 200 }) {
  const total = data.reduce((a, d) => a + d[1], 0);
  let a = -Math.PI / 2;
  const segs = data.map(([k, v]) => { const sp = v / total * Math.PI * 2; const s = { k, a0: a, a1: a + sp }; a += sp; return s; });
  return <svg width={size} height={size}>{segs.map((g, i) =>
    <path key={i} d={arc(size / 2, size / 2, size * .17, size * .45, g.a0, g.a1)} fill={colorFn(g.k)} stroke="#fdfbf6" strokeWidth="1.5" />)}</svg>;
}

/* ───────────────────────── REPORTS ───────────────────────── */
function PageReports({ plan, done }) {
  /* This month is what a parent checks in on. The other ranges are there
     when she wants them, not in the way when she doesn't. */
  const [range, setRange] = useState("month");   // week | month | all
  const [pickRange, setPickRange] = useState(false);

  /* Reports read from what the parent actually ticked. Completion now
     carries a timestamp, so a range can be applied honestly. Anything
     ticked before timestamps existed has no date and is counted only in
     "Up to date", never in a week or month it can't be placed in. */
  const now = new Date();
  const startOfWeek = new Date(now); startOfWeek.setHours(0, 0, 0, 0);
  startOfWeek.setDate(startOfWeek.getDate() - ((startOfWeek.getDay() + 6) % 7));  // Monday
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const from = range === "week" ? startOfWeek.getTime()
    : range === "month" ? startOfMonth.getTime() : null;

  /* one record per activity per day — an activity done every Monday
     counts every Monday, which is the whole point of dating the keys */
  const logged = Object.entries(done).map(([k, v]) => {
    if (!v) return null;
    const { id, day } = splitKey(k);
    const row = plan.find(r => r.id === id);
    if (!row) return null;
    const when = day ? new Date(day + "T00:00:00").getTime()
      : (typeof v === "number" ? v : null);
    if (from !== null && (when === null || when < from)) return null;
    return { row, day: day || (when !== null ? isoDay(when) : "undated") };
  }).filter(Boolean);

  const tally = (keyFn) => {
    const m = {};
    logged.forEach(e => { const k = keyFn(e.row); if (k) m[k] = (m[k] || 0) + 1; });
    return Object.entries(m).sort((a, b) => b[1] - a[1]);
  };
  /* a folk song is Filipino and Music — it belongs in both slices */
  const subjTally = {};
  logged.forEach(e => subjectsOf(e.row).forEach(k => { subjTally[k] = (subjTally[k] || 0) + 1; }));
  const subjects = Object.entries(subjTally).sort((a, b) => b[1] - a[1]);
  const practices = tally(r => r.feast);
  const books = tally(r => r.book);
  const total = logged.length;
  const days = new Set(logged.map(e => e.day)).size;

  const label = range === "week" ? "this week" : range === "month" ? "this month" : "so far";
  const topBook = books[0];

  /* The earlier record — the term already logged in the spreadsheet before
     Flora existed. It's kept as totals per subject, practice and book, not
     as individual dated entries, so it can be shown as its own summary but
     never sliced into a particular week. */
  const histFrom = RD.byday[0][0], histTo = RD.byday[RD.byday.length - 1][0];
  const fmt = d => new Date(d + "T00:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "long" });
  const histTopBook = RD.books[0];
  const showHistory = range === "all";

  return (
    <>
      <Title sub={range === "all"
        ? `${RD.total + total} activities altogether — ${RD.total} from your earlier record and ${total} logged in Flora.`
        : `${total} ${total === 1 ? "activity" : "activities"} logged ${label}.`}>Reports</Title>

      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 16 }}>
        <span style={{ fontSize: 13, color: C.soft }}>
          Showing <strong style={{ color: C.ink }}>
            {range === "week" ? "this week" : range === "month" ? "this month" : "everything so far"}</strong>
        </span>
        <Btn small tone="quiet" onClick={() => setPickRange(v => !v)}>
          {pickRange ? "Hide" : "Change"}</Btn>
      </div>

      {pickRange && (
        <Panel title="Show me">
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {[["week", "This week"], ["month", "This month"], ["all", "Everything so far"]].map(([k, t]) => {
              const on = range === k;
              return (
                <button key={k} onClick={() => { setRange(k); setPickRange(false); }}
                  style={{ cursor: "pointer", minHeight: 42,
                    borderRadius: 9, padding: "9px 15px", fontSize: 13, fontWeight: on ? 700 : 500,
                    border: `1.5px solid ${on ? C.green : C.line}`, background: on ? "#f1f5ed" : "#fff",
                    color: on ? C.deep : C.soft }}>{t}</button>);
            })}
          </div>
          <div style={{ fontSize: 11.5, color: C.muted, marginTop: 10, lineHeight: 1.6 }}>
            These are proportions, not scores. A quiet subject isn't a failure — it's just an invitation
            to reach for that book next. Your earlier record from {fmt(histFrom)} to {fmt(histTo)} is kept
            as totals rather than dated entries, so it only appears under <strong>Everything so far</strong>.
          </div>
        </Panel>)}

      {total === 0 ? (
        <Panel title={`Nothing logged ${label}`}>
          <div style={{ fontSize: 13.2, color: C.soft, lineHeight: 1.7 }}>
            {range === "all"
              ? "Tick a few activities on Today and they'll appear here."
              : <>Tick a few activities on Today and they'll appear here. Tap <strong>Change</strong> above
                  and choose <strong>Everything so far</strong> to see what you logged before
                  this {range === "week" ? "week" : "month"}.</>}
          </div>
        </Panel>
      ) : (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 13, marginBottom: 16 }}>
            {[["Activities logged", total], ["Days learning", days],
              ["Books used", books.length], ["Subjects touched", subjects.length]].map(([l, v]) => (
              <div key={l} style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: 12, padding: "15px 17px" }}>
                <div style={{ fontSize: 11, color: C.muted }}>{l}</div>
                <div style={{ fontFamily: serif, fontSize: 27, color: C.green, fontWeight: 600, marginTop: 2 }}>{v}</div></div>))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 16 }}>
            <Panel title="By DepEd subject">
              <div style={{ display: "flex", gap: 18, alignItems: "center", flexWrap: "wrap" }}>
                <Pie data={subjects} colorFn={subjColor} size={186} />
                <div style={{ flex: 1, minWidth: 130 }}>{subjects.map(([s2, v]) => (
                  <div key={s2} style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 11.5, padding: "2px 0" }}>
                    <span style={{ width: 9, height: 9, borderRadius: 2, background: subjColor(s2) }} />
                    <span style={{ flex: 1, color: C.soft }}>{s2}</span>
                    <span style={{ color: C.muted }}>{Math.round(v / total * 100)}%</span></div>))}</div>
              </div></Panel>

            <Panel title="By CM practice">
              <div style={{ display: "flex", gap: 18, alignItems: "center", flexWrap: "wrap" }}>
                <Pie data={practices} colorFn={pracColor} size={186} />
                <div style={{ flex: 1, minWidth: 130 }}>{practices.map(([p2, v]) => (
                  <div key={p2} style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 11.5, padding: "2px 0" }}>
                    <span style={{ width: 9, height: 9, borderRadius: "50%", background: pracColor(p2) }} />
                    <span style={{ flex: 1, color: C.soft }}>{p2}</span>
                    <span style={{ color: C.muted }}>{Math.round(v / total * 100)}%</span></div>))}</div>
              </div></Panel>
          </div>

          {books.length > 0 && (
            <Panel title={`Books used ${label}`}>
              {books.map(([b2, v]) => (
                <div key={b2} style={{ marginBottom: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontSize: 13.5 }}>{b2}</span>
                    <span style={{ fontSize: 12, color: C.muted }}>{v} {v === 1 ? "time" : "times"}</span></div>
                  <div style={{ height: 7, background: C.wash, borderRadius: 4, overflow: "hidden" }}>
                    <div style={{ width: `${v / topBook[1] * 100}%`, height: "100%",
                      background: pracColor("Read aloud"), opacity: .8, borderRadius: 4 }} /></div>
                </div>))}
            </Panel>)}

          {subjects.length > 1 && (
            <Panel title="Worth a look">
              <div style={{ fontSize: 13.2, color: C.soft, lineHeight: 1.75 }}>
                Most of your time {label} went to <strong style={{ color: C.ink }}>{subjects[0][0]}</strong>.
                The quietest was <strong style={{ color: C.ink }}>{subjects[subjects.length - 1][0]}</strong> —
                if that one matters to you this term, it might be the one to reach for next.
              </div></Panel>)}
        </>)}

      {showHistory && (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "26px 0 14px" }}>
            <div style={{ height: 1, background: C.line, flex: 1 }} />
            <span style={{ fontSize: 10.5, letterSpacing: 1.8, textTransform: "uppercase",
              color: C.muted, fontWeight: 700, whiteSpace: "nowrap" }}>Your earlier record</span>
            <div style={{ height: 1, background: C.line, flex: 1 }} />
          </div>

          <Panel title={`${fmt(histFrom)} to ${fmt(histTo)} — ${RD.total} activities across ${RD.days} days`}>
            <div style={{ fontSize: 12.8, color: C.soft, lineHeight: 1.7 }}>
              The term you had already logged before Flora. It's held as totals per subject, practice and
              book rather than as dated entries, so it can be summarised here but not split by week.
            </div>
          </Panel>

          <Panel title="Coverage — CM practice inside, DepEd subject outside">
            <NestedDonut size={300} /></Panel>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 16 }}>
            <Panel title="By DepEd subject">
              <div style={{ display: "flex", gap: 18, alignItems: "center", flexWrap: "wrap" }}>
                <Pie data={RD.subjects} colorFn={subjColor} size={186} />
                <div style={{ flex: 1, minWidth: 130 }}>{RD.subjects.map(([s2, v]) => (
                  <div key={s2} style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 11.5, padding: "2px 0" }}>
                    <span style={{ width: 9, height: 9, borderRadius: 2, background: subjColor(s2) }} />
                    <span style={{ flex: 1, color: C.soft }}>{s2}</span>
                    <span style={{ color: C.muted }}>{Math.round(v / RD.total * 100)}%</span></div>))}</div>
              </div></Panel>

            <Panel title="By CM practice">
              <div style={{ display: "flex", gap: 18, alignItems: "center", flexWrap: "wrap" }}>
                <Pie data={RD.practices} colorFn={pracColor} size={186} />
                <div style={{ flex: 1, minWidth: 130 }}>{RD.practices.map(([p2, v]) => (
                  <div key={p2} style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 11.5, padding: "2px 0" }}>
                    <span style={{ width: 9, height: 9, borderRadius: "50%", background: pracColor(p2) }} />
                    <span style={{ flex: 1, color: C.soft }}>{p2}</span>
                    <span style={{ color: C.muted }}>{Math.round(v / RD.total * 100)}%</span></div>))}</div>
              </div></Panel>
          </div>

          <Panel title="Books read aloud">
            {RD.books.map(([b2, v]) => (
              <div key={b2} style={{ marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 13.5 }}>{b2}</span>
                  <span style={{ fontSize: 12, color: C.muted }}>{v} times</span></div>
                <div style={{ height: 7, background: C.wash, borderRadius: 4, overflow: "hidden" }}>
                  <div style={{ width: `${v / histTopBook[1] * 100}%`, height: "100%",
                    background: pracColor("Read aloud"), opacity: .8, borderRadius: 4 }} /></div>
              </div>))}
          </Panel>

          <Panel title="Day by day">
            <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 90 }}>
              {RD.byday.map(([d, v]) => {
                const max = Math.max(...RD.byday.map(x => x[1]));
                return (
                  <div key={d} title={`${fmt(d)} — ${v} ${v === 1 ? "activity" : "activities"}`}
                    style={{ flex: 1, height: `${v / max * 100}%`, minHeight: 3,
                      background: C.green, opacity: .75, borderRadius: "3px 3px 0 0" }} />);
              })}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: C.muted, marginTop: 7 }}>
              <span>{fmt(histFrom)}</span><span>{fmt(histTo)}</span>
            </div>
          </Panel>
        </>)}
    </>);
}

const THEMES = {
  garden:  { name: "Garden",  bg: "#f6f5ec", ink: "#41512f", accent: "#6b8259", soft: "#b0bfa0", head: serif, motif: "fern",      note: "Soft and botanical" },
  meadow:  { name: "Meadow",  bg: "#f5f7f2", ink: "#3c4a33", accent: "#7d9a63", soft: "#b9c9a7", head: serif, motif: "rabbit",    note: "Gentle and green" },
  classic: { name: "Classic", bg: "#faf8f3", ink: "#37352f", accent: "#7d6a4f", soft: "#c6b699", head: serif, motif: "acorn",     note: "Formal and bookish" },
  blossom: { name: "Blossom", bg: "#fbf5f2", ink: "#5a4038", accent: "#c98d70", soft: "#e6c4b2", head: serif, motif: "butterfly", note: "Warm and tender" },
  seaside: { name: "Seaside", bg: "#f2f6f7", ink: "#2f464f", accent: "#5b8496", soft: "#aac5cf", head: serif, motif: "nest",      note: "Cool and calm" },
  simple:  { name: "Simple",  bg: "#ffffff", ink: "#2f2f2f", accent: "#5c7290", soft: "#b3c1d1", head: "'Karla', sans-serif", motif: "wreath", note: "Clean and modern" },
};
const tint = (hex, amt) => {
  const n = parseInt(hex.replace("#", ""), 16);
  const f = c => Math.round(c + (255 - c) * amt);
  return `rgb(${f((n >> 16) & 255)},${f((n >> 8) & 255)},${f(n & 255)})`;
};

function PagePortfolio({ plan, fav, caps, setCaps, prov, about, setAbout, curric, setCurric, sections, setSecOn, stickers, setStickers,
  photoVersion, bumpPhotos, photoFit, setPhotoFit, photoMeta = {}, term, go, noPhotosHere }) {
  const [preview, setPreview] = useState(null);
  const [themeKey, setThemeKey] = useState("garden");
  const [custom, setCustom] = useState("#6b8259");
  const [useCustom, setUseCustom] = useState(false);
  const [motif, setMotif] = useState(null);
  const [showMotifs, setShowMotifs] = useState(true);
  const [paste, setPaste] = useState(false);
  const [pasteTxt, setPasteTxt] = useState("");
  const [editAbout, setEditAbout] = useState(false);
  const [tpl, setTpl] = useState("provider");   // "provider" | theme key

  const PROVIDER_TPL = { name: "Provider’s Template", bg: "#ffffff", ink: "#2b2b2b", accent: "#5c6b56",
    soft: "#c9c6bb", head: serif, motif: "wreath", note: "Exactly the sections your provider asks for" };
  const isProviderTpl = tpl === "provider";
  const base = isProviderTpl ? PROVIDER_TPL : THEMES[themeKey];
  const t = (!isProviderTpl && useCustom)
    ? { ...base, accent: custom, soft: tint(custom, .58), bg: tint(custom, .94), ink: C.deep } : base;
  const activeMotif = motif || base.motif;
  const req = prov ? prov.required : ["cover"];
  const isReq = k => req.includes(k);

  const starredRows = plan.filter(r => fav[r.id]);

  /* same cached URLs the rest of the app uses — see photoURL */
  const [photoByEntry, setPhotoByEntry] = useState({});
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const map = {};
      for (const r of starredRows) {
        const rows = await getPhotosFor(r.id).catch(() => []);
        map[r.id] = rows.map(x => ({ id: x.id, url: photoURL(x), rec: x }));
      }
      if (!cancelled) setPhotoByEntry(map);
    })();
    return () => { cancelled = true; };
  }, [starredRows.map(r => r.id).join(","), photoVersion]);

  /* the portfolio shows photos, so an entry contributes one tile per photo */
  const expand = rows => rows.flatMap(r => {
    const ph = photoByEntry[r.id] || [];
    return ph.length
      ? ph.map(p => ({ ...r, key: p.id, id: p.id, url: p.url, rec: p.rec,
          caption: caps[p.id] || caps[r.id] }))
      : [{ ...r, key: r.id, caption: caps[r.id] }];
  });

  /* photos added in bulk have no activity behind them — they bring their
     own subject and title, and sit alongside the logged ones */
  const [pastTiles, setPastTiles] = useState([]);
  useEffect(() => {
    let cancelled = false;
    getPhotosFor(BULK_ID)
      .then(rows => { if (!cancelled) setPastTiles(rows.filter(x => fav[x.id])); })
      .catch(() => { if (!cancelled) setPastTiles([]); });
    return () => { cancelled = true; };
  }, [photoVersion, Object.keys(fav).filter(k => fav[k]).join(",")]);

  const pastAsTiles = pastTiles.map(x => {
    const m = photoMeta[x.id] || {};
    return { key: x.id, id: x.id, url: photoURL(x), rec: x,
      caption: caps[x.id] || m.title || "", subj: m.subject || "", book: m.title || "" };
  });

  const starred = [...expand(starredRows), ...pastAsTiles];
  const bySubject = {};
  starredRows.forEach(r => subjectsOf(r).forEach(sub => {
    const k = sub.split(" / ")[0];
    (bySubject[k] = bySubject[k] || []).push(r);
  }));
  Object.keys(bySubject).forEach(k => { bySubject[k] = expand(bySubject[k]); });
  pastAsTiles.forEach(t => {
    if (!t.subj) return;
    const k = t.subj.split(" / ")[0];
    (bySubject[k] = bySubject[k] || []).push(t);
  });

  const doPaste = () => {
    const rows = pasteTxt.trim().split("\n").filter(Boolean).map(l => {
      const c = l.split("\t").length > 1 ? l.split("\t") : l.split(/\s{2,}|,/);
      return { subj: (c[0] || "").trim(), feast: (c[1] || "").trim(), books: (c[2] || "").trim(), obj: (c[3] || "").trim() };
    });
    setCurric(rows); setPaste(false); setPasteTxt("");
  };

  const has = {
    cover: true, about: !!(about.hi || about.fav), curriculum: curric.length > 0,
    coverage: true, books: true, highlights: starred.length > 0,
    subjects: Object.keys(bySubject).length > 0, attainments: false, reflection: false,
  };
  const on = Object.keys(SECTION_META).filter(k => sections[k]);
  const built = on.filter(k => has[k]).length;
  const pctDone = Math.round(built / Math.max(on.length, 1) * 100);

  return (
    <>
      <Title sub="This builds itself as your term goes. Add what you have; the tracker keeps the rest visible until you're ready.">Portfolio</Title>

      {noPhotosHere && (
        <Note icon={Info}>
          <strong>No photos on this device yet.</strong> Flora keeps photos on the device that took them —
          nothing is sent to a server. If you've been logging on another phone or computer, back up there
          and use <em>Restore from a backup</em> in Settings to bring everything across.
        </Note>)}

      {starredRows.length === 0 && pastTiles.length === 0 && (
        <div style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "13px 16px", borderRadius: 12,
          background: C.sand, border: "1px solid #e3d6bd", marginBottom: 16 }}>
          <Star size={17} style={{ color: C.gold, flexShrink: 0, marginTop: 2 }} />
          <div style={{ flex: 1, fontSize: 13, color: C.soft, lineHeight: 1.65 }}>
            <strong style={{ color: C.ink }}>Nothing chosen for the portfolio yet.</strong> Photos you add
            are all kept — they appear here once you tap the star on an activity. That way you decide what
            gets submitted, not Flora.
          </div>
          {go && <Btn small tone="quiet" onClick={() => go("outputs")}>
            <Camera size={13} /> See my photos</Btn>}
        </div>)}

      <Panel title={`Under construction — ${built} of ${on.length} sections ready`}>
        <div style={{ height: 9, background: C.wash, borderRadius: 5, overflow: "hidden", marginBottom: 14 }}>
          <div style={{ width: `${pctDone}%`, height: "100%", background: t.accent, borderRadius: 5, transition: "width .4s" }} /></div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(190px,1fr))", gap: 8 }}>
          {Object.entries(SECTION_META).map(([k, m]) => {
            const enabled = sections[k], ok = has[k], required = isReq(k);
            const locked = isProviderTpl && !required;
            return (
              <div key={k} style={{ display: "flex", gap: 8, alignItems: "flex-start", padding: "9px 10px", borderRadius: 8,
                background: !enabled ? "#f7f6f1" : ok ? "#f1f5ed" : C.wash,
                border: `1px solid ${!enabled ? C.line : ok ? "#d9e5cd" : C.line}`, opacity: enabled ? 1 : .55 }}>
                {enabled ? (ok ? <Check size={13} style={{ color: C.green, marginTop: 2, flexShrink: 0 }} />
                  : <div style={{ width: 11, height: 11, border: `1.5px dashed ${C.muted}`, borderRadius: "50%", marginTop: 3, flexShrink: 0 }} />)
                  : <EyeOff size={12} style={{ color: C.muted, marginTop: 2, flexShrink: 0 }} />}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    <span style={{ fontSize: 12.5, fontWeight: ok && enabled ? 600 : 400, color: enabled ? C.ink : C.muted }}>{m.label}</span>
                    {required
                      ? <span style={{ fontSize: 8.5, letterSpacing: .6, textTransform: "uppercase", color: C.green,
                          background: "#e9f0e2", padding: "1px 5px", borderRadius: 4, fontWeight: 700 }}>required</span>
                      : <span style={{ fontSize: 8.5, letterSpacing: .6, textTransform: "uppercase", color: C.muted,
                          background: C.wash, padding: "1px 5px", borderRadius: 4 }}>optional</span>}
                  </div>
                  <div style={{ fontSize: 10.5, color: C.muted, marginTop: 1 }}>{m.hint}</div></div>
                <button onClick={() => !locked && setSecOn({ ...sections, [k]: !enabled })}
                  title={locked ? "Not required — add it from Add-ons below" : enabled ? "Hide" : "Show"}
                  disabled={locked}
                  style={{ background: "none", border: "none", cursor: locked ? "not-allowed" : "pointer",
                    padding: 0, flexShrink: 0, opacity: locked ? .35 : 1 }}>
                  {enabled ? <Eye size={13} style={{ color: C.muted }} /> : <EyeOff size={13} style={{ color: C.muted }} />}</button>
              </div>);
          })}
        </div>
        <div style={{ fontSize: 11.5, color: C.muted, marginTop: 11, lineHeight: 1.6 }}>
          {isProviderTpl
            ? <>Strict by default: only what {prov ? prov.short : "your provider"} asks for is included.
                Anything else lives under Add-ons below.</>
            : <>Turn any section on or off. Sections marked required are the ones your provider expects.</>}
        </div>
      </Panel>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <Panel title="All About Me" right={<Btn small tone="quiet" onClick={() => setEditAbout(!editAbout)}><Pencil size={12} /> {editAbout ? "Done" : "Edit"}</Btn>}>
          {editAbout ? (
            <div style={{ display: "grid", gap: 10 }}>
              {[["hi", "Hi, I'm…", "Hi, my name is Maria! I am 6 years old."],
                ["fav", "My favourite things", "Butterflies, painting, and singing!"],
                ["proud", "What I'm proud of", "I'm good at drawing turtles."],
                ["grow", "When I grow up…", "I want to be a scientist like Dr. Jose Rizal."]].map(([k, l, ph]) => (
                <SmallField key={k} label={l}>
                  <textarea rows={2} value={about[k]} onChange={e => setAbout({ ...about, [k]: e.target.value })}
                    placeholder={ph} style={{ ...inp, resize: "vertical", fontSize: 12.5 }} /></SmallField>))}
            </div>
          ) : (
            <div style={{ fontSize: 12.8, color: C.soft, lineHeight: 1.7 }}>
              {about.hi || about.fav
                ? <>{about.hi && <p style={{ marginBottom: 6 }}>{about.hi}</p>}
                    {about.fav && <p style={{ marginBottom: 6 }}>{about.fav}</p>}
                    {about.proud && <p style={{ marginBottom: 6 }}>{about.proud}</p>}
                    {about.grow && <p>{about.grow}</p>}</>
                : "Your child's own page — favourite things, what they're proud of, what they want to be. Tap Edit and let them tell you."}
            </div>)}
        </Panel>

        <Panel title="Curriculum & learning plan" right={<Btn small tone="quiet" onClick={() => setPaste(true)}><ClipboardPaste size={12} /> Paste from sheet</Btn>}>
          {curric.length === 0 ? (
            <div style={{ fontSize: 12.8, color: C.soft, lineHeight: 1.65 }}>
              Copy the rows straight out of your spreadsheet and paste them here — subject, CM feast, books, objectives.
              No need to type it all again.</div>
          ) : (
            <div style={{ fontSize: 12.5 }}>
              {curric.slice(0, 5).map((r, i) => (
                <div key={i} style={{ display: "flex", gap: 8, padding: "5px 0", borderBottom: `1px solid ${C.line}` }}>
                  <span style={{ fontWeight: 600, minWidth: 90 }}>{r.subj}</span>
                  <span style={{ color: C.soft, flex: 1 }}>{r.books || r.feast}</span></div>))}
              {curric.length > 5 && <div style={{ fontSize: 11.5, color: C.muted, marginTop: 7 }}>+ {curric.length - 5} more rows</div>}
              <div style={{ marginTop: 10 }}><Btn small tone="quiet" onClick={() => setCurric([])}><X size={12} /> Clear</Btn></div>
            </div>)}
        </Panel>
      </div>

      {paste && (
        <div className="no-print" style={{ position: "fixed", inset: 0, background: "rgba(47,58,44,.42)", zIndex: 50,
          display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ background: "#fff", borderRadius: 14, padding: 22, width: 620, maxWidth: "100%" }}>
            <div style={{ fontFamily: serif, fontSize: 22, color: C.deep, marginBottom: 6 }}>Paste your curriculum</div>
            <div style={{ fontSize: 12.8, color: C.soft, marginBottom: 13, lineHeight: 1.6 }}>
              Copy the rows from Google Sheets or Excel and paste below. Four columns: subject, CM feast, books, objectives.</div>
            <textarea rows={8} value={pasteTxt} onChange={e => setPasteTxt(e.target.value)}
              placeholder={"Filipino\tLiterature / Reading\tAlamat ng Palay; Isang Mayang Uhaw\tNarrates a complete story in Filipino"}
              style={{ ...inp, resize: "vertical", fontFamily: "ui-monospace, monospace", fontSize: 12 }} />
            <div style={{ display: "flex", gap: 8, marginTop: 13 }}>
              <Btn onClick={doPaste} disabled={!pasteTxt.trim()}><Check size={13} /> Add rows</Btn>
              <Btn tone="quiet" onClick={() => setPaste(false)}>Cancel</Btn></div>
          </div>
        </div>)}

      <Panel title="Choose a template">
        {/* provider-exact option, structure only */}
        <button onClick={() => setTpl("provider")} style={{
          width: "100%", textAlign: "left", cursor: "pointer", marginBottom: 14,
          border: `2px solid ${isProviderTpl ? C.green : C.line}`, borderRadius: 12,
          background: isProviderTpl ? "#f2f6ee" : "#fff", padding: "15px 17px",
          display: "flex", gap: 15, alignItems: "flex-start" }}>
          <div style={{ width: 54, height: 68, borderRadius: 5, background: "#fff", border: `1px solid ${C.line}`,
            padding: 6, flexShrink: 0 }}>
            <div style={{ height: 5, background: C.line, borderRadius: 2, marginBottom: 4 }} />
            <div style={{ height: 3, background: "#eceadf", borderRadius: 2, marginBottom: 3 }} />
            {[0,1,2,3].map(i => <div key={i} style={{ height: 3, background: "#eeece2", borderRadius: 2, marginBottom: 3 }} />)}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <LayoutTemplate size={15} style={{ color: isProviderTpl ? C.green : C.muted }} />
              <span style={{ fontSize: 15, fontWeight: 600 }}>Provider’s Template</span>
              {isProviderTpl && <Check size={14} style={{ color: C.green }} />}
            </div>
            <div style={{ fontSize: 12.8, color: C.soft, lineHeight: 1.6 }}>
              The same page format your provider hands out — side labels, header strip, the four-column planner table,
              the highlight pages — laid out so you never have to design anything. Fill it and submit.
            </div>
            <div style={{ fontSize: 11.5, color: C.muted, marginTop: 7, lineHeight: 1.55 }}>
              Same structure, Flora's colours. Your provider's name, logo and house palette stay theirs —
              the portfolio carries your child's name, not a school's branding.
            </div>
          </div>
        </button>

        <div style={{ fontSize: 10, letterSpacing: 1.8, textTransform: "uppercase", color: C.muted,
          fontWeight: 700, marginBottom: 9 }}>Flora’s own templates</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(132px,1fr))", gap: 10, marginBottom: 16 }}>
          {Object.entries(THEMES).map(([k, v]) => (
            <button key={k} onClick={() => { setTpl(k); setThemeKey(k); setUseCustom(false); setMotif(null); }} style={{
              border: `2px solid ${tpl === k ? C.green : C.line}`, borderRadius: 12, padding: 0,
              cursor: "pointer", overflow: "hidden", background: "#fff", textAlign: "left" }}>
              <div style={{ height: 64, background: v.bg, borderBottom: `1px solid ${C.line}`, padding: 10,
                display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div><div style={{ fontFamily: v.head, fontSize: 15, color: v.ink }}>Aa</div>
                  <div style={{ display: "flex", gap: 3, marginTop: 5 }}>
                    <span style={{ width: 20, height: 5, borderRadius: 3, background: v.accent }} />
                    <span style={{ width: 12, height: 5, borderRadius: 3, background: v.soft }} /></div></div>
                <Motif kind={v.motif} color={v.accent} size={26} /></div>
              <div style={{ padding: "8px 11px" }}>
                <div style={{ fontSize: 12.5, fontWeight: 600 }}>{v.name}</div>
                <div style={{ fontSize: 10.5, color: C.muted }}>{v.note}</div></div>
            </button>))}
        </div>

        {!isProviderTpl && (
          <div style={{ display: "flex", gap: 20, flexWrap: "wrap", alignItems: "flex-start", marginBottom: 4 }}>
            <SmallField label="Your own colour">
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <input type="color" value={custom} onChange={e => { setCustom(e.target.value); setUseCustom(true); }}
                  style={{ width: 40, height: 34, border: `1px solid ${C.line}`, borderRadius: 8, cursor: "pointer", padding: 2, background: "#fff" }} />
                <input value={custom} onChange={e => { setCustom(e.target.value); setUseCustom(true); }} style={{ ...inp, width: 96 }} />
                <Btn small tone={useCustom ? "solid" : "quiet"} onClick={() => setUseCustom(!useCustom)}>
                  {useCustom ? "Using yours" : "Use this"}</Btn></div>
            </SmallField>
            <div style={{ flex: 1, minWidth: 250 }}>
              <SmallField label="Charlotte Mason motif">
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
                  {MOTIFS.map(m => (
                    <button key={m} onClick={() => setMotif(m)} title={m} style={{
                      border: `1.5px solid ${activeMotif === m ? t.accent : C.line}`, borderRadius: 9,
                      background: activeMotif === m ? tint(t.accent, .89) : "#fff", cursor: "pointer", padding: 3, lineHeight: 0 }}>
                      <Motif kind={m} color={activeMotif === m ? t.accent : C.muted} size={28} /></button>))}
                  <label style={{ display: "flex", alignItems: "center", gap: 5, marginLeft: 6, fontSize: 12, color: C.soft, cursor: "pointer" }}>
                    <input type="checkbox" checked={showMotifs} onChange={e => setShowMotifs(e.target.checked)} /> show on page</label>
                </div></SmallField>
            </div>
          </div>)}

        <div style={{ display: "flex", gap: 9, marginTop: 16, flexWrap: "wrap" }}>
          <Btn onClick={() => window.print()}><FileText size={14} /> Print / Save as PDF</Btn>
        </div>
        <div style={{ fontSize: 11.5, color: C.muted, marginTop: 9, display: "flex", alignItems: "flex-start", gap: 6, lineHeight: 1.55 }}>
          <Lock size={11} style={{ marginTop: 3, flexShrink: 0 }} /> Your records are yours and always exportable. Direct PDF export
          built to your provider's file rules is still being built — for now, use your browser's Save as PDF.</div>
      </Panel>

      {/* ── add-ons: optional sections, with an honest warning ── */}
      <Panel title="Add-ons" right={<span style={{ fontSize: 11, color: C.muted }}>
        {Object.keys(SECTION_META).filter(k => !isReq(k) && sections[k]).length} added</span>}>
        <Note icon={AlertCircle} tone="blush">
          None of these are required by {prov ? prov.short : "your provider"}. They make a lovelier keepsake, but each one
          adds pages — and most providers cap the page count and file size. If you're near the limit, keep only the ones
          that matter most to your family.
        </Note>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(232px,1fr))", gap: 10 }}>
          {Object.entries(SECTION_META).filter(([k]) => !isReq(k)).map(([k, m]) => {
            const on = sections[k];
            const pages = { about: 1, coverage: 1, books: 1, reflection: 1, attainments: 1, curriculum: 2, highlights: 2, subjects: 3 }[k] || 1;
            return (
              <button key={k} onClick={() => setSecOn({ ...sections, [k]: !on })} style={{
                textAlign: "left", cursor: "pointer", borderRadius: 11, padding: "12px 13px",
                border: `1.5px solid ${on ? C.green : C.line}`, background: on ? "#f1f5ed" : "#fff" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 4 }}>
                  <Plus size={13} style={{ color: on ? C.green : C.muted, transform: on ? "rotate(45deg)" : "none" }} />
                  <span style={{ fontSize: 13.5, fontWeight: 600, color: on ? C.deep : C.ink }}>{m.label}</span>
                  <span style={{ marginLeft: "auto", fontSize: 10, color: C.muted }}>~{pages} pg</span>
                </div>
                <div style={{ fontSize: 11.8, color: C.soft, lineHeight: 1.5 }}>{m.hint}</div>
              </button>);
          })}
        </div>
        {Object.keys(SECTION_META).filter(k => !isReq(k) && sections[k]).length > 2 && (
          <div style={{ marginTop: 12, fontSize: 12, color: "#a4553b", display: "flex", gap: 7, alignItems: "flex-start" }}>
            <AlertCircle size={13} style={{ flexShrink: 0, marginTop: 2 }} />
            <span>That's several extra pages on top of the required ones. Worth checking your provider's page limit before you export.</span>
          </div>)}
      </Panel>

      {/* ── stickers ── */}
      <Panel title="Stickers" right={<span style={{ fontSize: 11, color: C.muted }}>{stickers.length} chosen</span>}>
        {isProviderTpl ? (
          <Note icon={Info}>
            The Provider’s Template stays plain — stickers are off so nothing distracts from what's being checked.
            Pick one of Flora’s own templates to decorate.
          </Note>
        ) : (
          <div style={{ fontSize: 12.8, color: C.soft, lineHeight: 1.6, marginBottom: 14 }}>
            Little drawings for the corners of your pages. Tap to add or remove — they're placed for you,
            never over a photo. A little charm, not clutter.
          </div>)}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(118px,1fr))", gap: 10, opacity: isProviderTpl ? .4 : 1 }}>
          {STICKER_KEYS.map(k => {
            const on = stickers.includes(k);
            return (
              <button key={k} disabled={isProviderTpl}
                onClick={() => setStickers(on ? stickers.filter(x => x !== k) : [...stickers, k])}
                style={{ border: `1.5px solid ${on ? t.accent : C.line}`, borderRadius: 12, cursor: isProviderTpl ? "default" : "pointer",
                  background: on ? tint(t.accent, .92) : "#fff", padding: "12px 8px 10px", position: "relative" }}>
                {on && <Check size={12} style={{ position: "absolute", top: 7, right: 7, color: t.accent }} />}
                <StickerArt kind={k} color={on ? t.accent : C.muted} accent={on ? tint(t.accent, .74) : "#f0eee6"} size={72} />
              </button>);
          })}
        </div>
      </Panel>

      {prov && !prov.requiresExamRecording && (
        <Note icon={ShieldCheck}>{prov.level} at {prov.short} does not require exam recordings — highlights and the planner are enough. You may still add a video link if you want to.</Note>)}

      {isProviderTpl && (
        <div style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "11px 15px", borderRadius: 10,
          background: C.wash, border: `1px solid ${C.line}`, marginBottom: 12 }}>
          <LayoutTemplate size={15} style={{ color: C.soft, flexShrink: 0, marginTop: 2 }} />
          <div style={{ fontSize: 12.6, color: C.soft, lineHeight: 1.6 }}>
            <strong style={{ color: C.ink }}>Provider’s Template.</strong> {req.length} required section{req.length === 1 ? "" : "s"},
            in order, nothing added. No coverage charts, no book counts, no decoration —
            nothing extra, nothing to question.
          </div>
        </div>)}

      {/* ── LIVE PREVIEW ── */}
      {isProviderTpl ? (
        <div style={{ border: `1px solid ${C.line}`, borderRadius: 14, overflow: "hidden", background: "#fff" }}>
          {/* cover — vertical term label, name block, school year */}
          <div style={{ display: "flex", borderBottom: `1px solid ${C.line}` }}>
            <div style={{ width: 46, background: C.wash, borderRight: `1px solid ${C.line}`,
              display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ writingMode: "vertical-rl", transform: "rotate(180deg)", fontFamily: serif,
                fontSize: 17, letterSpacing: 4, textTransform: "uppercase", color: C.line }}>
                {prov ? prov.terms[0] : "First Semester"}</span>
            </div>
            <div style={{ flex: 1, padding: "34px 30px 30px", background: "#fcfbf6" }}>
              <div style={{ fontSize: 8.5, letterSpacing: 2.4, textTransform: "uppercase", color: C.muted, marginBottom: 26 }}>Student Portfolio</div>
              <div style={{ fontSize: 8.5, letterSpacing: 1.8, textTransform: "uppercase", color: C.muted }}>Student Name</div>
              <div style={{ fontFamily: serif, fontSize: 33, fontWeight: 600, color: C.deep, margin: "3px 0 18px" }}>{about.name}</div>
              <div style={{ fontSize: 8.5, letterSpacing: 1.8, textTransform: "uppercase", color: C.muted }}>Grade Level</div>
              <div style={{ fontFamily: serif, fontSize: 22, fontWeight: 600, color: C.deep, marginTop: 2 }}>{prov ? prov.level : "Kindergarten"}</div>
              <div style={{ fontSize: 11, color: C.muted, marginTop: 30 }}>SY {prov ? prov.sy : "2026–2027"}</div>
            </div>
          </div>

          {sections.curriculum && (
            <PPage label="Feast Planner" header={`${about.name} | ${prov ? prov.level : "Kindergarten"} | ${term}`}>
              {has.curriculum ? (
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 10.5 }}>
                  <thead><tr style={{ background: C.wash }}>
                    {["DepEd Subject", "CM Feast", "Books / Materials", "Plans / Objectives"].map(h => (
                      <th key={h} style={{ textAlign: "left", padding: "6px 8px", border: `1px solid ${C.line}`,
                        fontSize: 8.5, letterSpacing: .8, textTransform: "uppercase", color: C.soft, fontWeight: 700 }}>{h}</th>))}
                  </tr></thead>
                  <tbody>{curric.map((r, i) => (
                    <tr key={i}>
                      <td style={{ padding: "6px 8px", border: `1px solid ${C.line}`, fontWeight: 600, verticalAlign: "top", width: "17%" }}>{r.subj}</td>
                      <td style={{ padding: "6px 8px", border: `1px solid ${C.line}`, color: C.soft, verticalAlign: "top", width: "20%" }}>{r.feast}</td>
                      <td style={{ padding: "6px 8px", border: `1px solid ${C.line}`, color: C.soft, verticalAlign: "top" }}>{r.books}</td>
                      <td style={{ padding: "6px 8px", border: `1px solid ${C.line}`, color: C.soft, verticalAlign: "top" }}>{r.obj}</td>
                    </tr>))}</tbody>
                </table>
              ) : (
                <div style={{ border: `1px dashed ${C.line}`, borderRadius: 8, padding: "22px 18px", textAlign: "center", fontSize: 12.5, color: C.muted }}>
                  Paste your planner rows above and they fill this table — DepEd subject, CM feast, books, objectives.</div>)}
            </PPage>)}

          {sections.highlights && (
            <PPage label={prov && prov.level === "Kindergarten" ? "Kinder Highlights" : "Core Subject Highlights"}
              header={`${about.name} | ${prov ? prov.level : "Kindergarten"} | ${term}`}>
              {has.highlights
                ? <PhotoGrid items={starred.slice(0, 9)} t={{ ink: C.ink, soft: C.line }} photoFit={photoFit} setPhotoFit={setPhotoFit} onOpen={setPreview} editable caps={caps} setCaps={setCaps} />
                : <div style={{ border: `1px dashed ${C.line}`, borderRadius: 8, padding: "22px 18px", textAlign: "center", fontSize: 12.5, color: C.muted }}>
                    Star your best work on Home — up to nine a page, placed for you.</div>}
            </PPage>)}

          {sections.subjects && (
            <PPage label="MAPEH · HELE / TLE Highlights" last
              header={`${about.name} | ${prov ? prov.level : "Kindergarten"} | ${term}`}>
              {has.subjects
                ? Object.entries(bySubject).map(([sub, items]) => (
                    <div key={sub} style={{ marginBottom: 16 }}>
                      <div style={{ fontSize: 9, letterSpacing: 1.6, textTransform: "uppercase", color: C.muted, marginBottom: 7 }}>{sub}</div>
                      <PhotoGrid items={items.slice(0, 6)} t={{ ink: C.ink, soft: C.line }} photoFit={photoFit} setPhotoFit={setPhotoFit} onOpen={setPreview} editable caps={caps} setCaps={setCaps} />
                    </div>))
                : <div style={{ border: `1px dashed ${C.line}`, borderRadius: 8, padding: "22px 18px", textAlign: "center", fontSize: 12.5, color: C.muted }}>
                    Music, arts, PE, handicraft and chores photos land here, grouped by subject.</div>}
            </PPage>)}

          {Object.keys(SECTION_META).filter(k => !isReq(k) && sections[k]).length > 0 && (
            <div style={{ padding: "13px 18px", background: C.sand, borderTop: `1px solid ${C.line}`,
              fontSize: 11.5, color: C.soft, display: "flex", gap: 8, alignItems: "flex-start" }}>
              <AlertCircle size={13} style={{ color: C.gold, flexShrink: 0, marginTop: 1 }} />
              <span>Add-on pages follow after the required ones. They aren't asked for by your provider — check your page limit before exporting.</span>
            </div>)}
        </div>
      ) : (
      <div style={{ background: t.bg, borderRadius: 14, border: `1px solid ${C.line}`, overflow: "hidden", position: "relative" }}>
        {showMotifs && <Motif kind={activeMotif} color={t.soft} size={104} style={{ position: "absolute", top: 16, right: 20, opacity: .45 }} />}
        {stickers[0] && (
          <div style={{ position: "absolute", bottom: 18, right: 22, opacity: .9, pointerEvents: "none" }}>
            <StickerArt kind={stickers[0]} color={t.accent} accent={tint(t.accent, .78)} size={84} /></div>)}
        {stickers[1] && (
          <div style={{ position: "absolute", bottom: 130, left: 20, opacity: .82, pointerEvents: "none", transform: "rotate(-7deg)" }}>
            <StickerArt kind={stickers[1]} color={t.accent} accent={tint(t.accent, .8)} size={68} showLabel={false} /></div>)}

        {sections.cover && (
          <div style={{ padding: "46px 40px 34px", textAlign: "center", borderBottom: `1px solid ${t.soft}` }}>
            {showMotifs && <Motif kind={activeMotif} color={t.accent} size={44} style={{ marginBottom: 8 }} />}
            <div style={{ fontSize: 10, letterSpacing: 2.6, textTransform: "uppercase", color: t.accent, fontWeight: 700 }}>Student Portfolio</div>
            <div style={{ fontFamily: t.head, fontSize: 38, color: t.ink, margin: "10px 0 5px", fontWeight: 600 }}>{about.name}</div>
            <div style={{ fontSize: 14, color: t.ink, opacity: .7 }}>
              {prov ? `${prov.level} · ${prov.terms[0]} · SY ${prov.sy}` : "Kindergarten · First Semester · SY 2026–2027"}</div>
            <div style={{ display: "inline-flex", gap: 6, alignItems: "center", marginTop: 14, padding: "5px 13px",
              borderRadius: 20, background: tint(t.accent, .86), color: t.ink, fontSize: 11 }}>
              <Sparkles size={11} style={{ color: t.accent }} /> In progress · {pctDone}% assembled</div>
          </div>)}

        <div style={{ padding: "26px 40px 36px" }}>
          {sections.about && (
            <PSec t={t} label="All About Me" done={has.about}>
              {has.about ? (
                <div style={{ display: "flex", gap: 22, alignItems: "flex-start" }}>
                  <div style={{ flex: 1, fontSize: 12.8, color: t.ink, lineHeight: 1.75 }}>
                    {about.hi && <><strong style={{ color: t.accent }}>Hi, I'm…</strong><div style={{ marginBottom: 8 }}>{about.hi}</div></>}
                    {about.fav && <><strong style={{ color: t.accent }}>My favourite things</strong><div style={{ marginBottom: 8 }}>{about.fav}</div></>}
                    {about.proud && <><strong style={{ color: t.accent }}>What I'm proud of</strong><div style={{ marginBottom: 8 }}>{about.proud}</div></>}
                    {about.grow && <><strong style={{ color: t.accent }}>When I grow up…</strong><div>{about.grow}</div></>}
                  </div>
                  <div style={{ width: 132, aspectRatio: "3 / 4", borderRadius: 8, background: "#fff",
                    border: `1px solid ${t.soft}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Camera size={17} style={{ color: t.soft }} /></div>
                </div>
              ) : <Pending t={t}>Fill this in above and your child's own page appears here.</Pending>}
            </PSec>)}

          {sections.curriculum && (
            <PSec t={t} label="Curriculum & learning plan" done={has.curriculum}>
              {has.curriculum ? (
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                  <thead><tr>{["Subject", "CM Feast", "Books / Materials", "Plans / Objectives"].map(h => (
                    <th key={h} style={{ textAlign: "left", padding: "6px 8px", borderBottom: `1px solid ${t.soft}`,
                      color: t.accent, fontSize: 9.5, letterSpacing: 1.1, textTransform: "uppercase" }}>{h}</th>))}</tr></thead>
                  <tbody>{curric.map((r, i) => (
                    <tr key={i}><td style={{ padding: "6px 8px", color: t.ink, fontWeight: 600, verticalAlign: "top" }}>{r.subj}</td>
                      <td style={{ padding: "6px 8px", color: t.ink, opacity: .75, verticalAlign: "top" }}>{r.feast}</td>
                      <td style={{ padding: "6px 8px", color: t.ink, opacity: .75, verticalAlign: "top" }}>{r.books}</td>
                      <td style={{ padding: "6px 8px", color: t.ink, opacity: .75, verticalAlign: "top" }}>{r.obj}</td></tr>))}</tbody>
                </table>
              ) : <Pending t={t}>Paste your curriculum rows above — subject, feast, books, objectives.</Pending>}
            </PSec>)}

          {sections.books && (
            <PSec t={t} label="Books read aloud this term" done>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 22px" }}>
                {RD.books.map(([b, v]) => (
                  <div key={b} style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 12.8, color: t.ink, padding: "3px 0" }}>
                    <span style={{ width: 5, height: 5, borderRadius: "50%", background: t.accent, flexShrink: 0 }} />
                    <span style={{ flex: 1 }}>{b}</span><span style={{ opacity: .55, fontSize: 11.5 }}>{v}×</span></div>))}
              </div></PSec>)}

          {sections.coverage && (
            <PSec t={t} label="Subject coverage" done>
              <div style={{ display: "flex", gap: 20, alignItems: "center", flexWrap: "wrap" }}>
                <Pie data={RD.subjects} colorFn={subjColor} size={130} />
                <div style={{ flex: 1, minWidth: 190, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2px 14px" }}>
                  {RD.subjects.map(([sb, v]) => (
                    <div key={sb} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: t.ink }}>
                      <span style={{ width: 8, height: 8, borderRadius: 2, background: subjColor(sb) }} />
                      <span style={{ flex: 1, opacity: .8 }}>{sb}</span>
                      <span style={{ opacity: .55 }}>{Math.round(v / RD.total * 100)}%</span></div>))}</div>
              </div></PSec>)}

          {sections.highlights && (
            <PSec t={t} label="Photo highlights" done={has.highlights}>
              {has.highlights
                ? <><PhotoGrid items={starred.slice(0, 9)} t={t} photoFit={photoFit} setPhotoFit={setPhotoFit} onOpen={setPreview} editable caps={caps} setCaps={setCaps} />
                    <div style={{ fontSize: 10.5, color: t.ink, opacity: .5, marginTop: 8, textAlign: "center" }}>
                      Up to nine a page — sized and placed for you, never stretched.</div></>
                : <Pending t={t}>Star an activity on Home and its photo appears here, balanced automatically.</Pending>}
            </PSec>)}

          {sections.subjects && Object.entries(bySubject).map(([sub, items]) => (
            <PSec key={sub} t={t} label={sub} done><PhotoGrid items={items.slice(0, 9)} t={t} photoFit={photoFit} setPhotoFit={setPhotoFit} onOpen={setPreview} editable caps={caps} setCaps={setCaps} /></PSec>))}
          {sections.subjects && !has.subjects && (
            <PSec t={t} label="A page per subject" done={false}>
              <Pending t={t}>Star work in each subject and Flora gives every one its own page.</Pending></PSec>)}

          {sections.attainments && (
            <PSec t={t} label="Attainments and habits" done={false}>
              <Pending t={t}>Rated once at term's end, in the Weekly Plan. These observations carry no academic weight.</Pending></PSec>)}

          {sections.reflection && (
            <PSec t={t} label="Parent's reflection" done={false}>
              <div style={{ border: `1px dashed ${t.accent}`, borderRadius: 10, padding: "14px 16px", background: tint(t.accent, .94) }}>
                <div style={{ fontSize: 10, letterSpacing: 1.4, textTransform: "uppercase", color: t.accent, fontWeight: 700, marginBottom: 5 }}>Only you can write this</div>
                <div style={{ fontSize: 13, color: t.ink, opacity: .8, lineHeight: 1.6 }}>
                  What did you notice growing in {about.name.split(" ")[0]} this term?</div></div>
            </PSec>)}
        </div>
      </div>)}

      {preview && (
        <PhotoLightbox
          photo={preview.rec}
          caption={caps[preview.id] || ""}
          onCaption={v => setCaps({ ...caps, [preview.id]: v })}
          fit={photoFit[preview.key] || "cover"}
          onFit={() => setPhotoFit({ ...photoFit,
            [preview.key]: (photoFit[preview.key] || "cover") === "cover" ? "contain" : "cover" })}
          onRotate={async deg => {
            const up = await rotatePhoto(preview.id, deg);
            bumpPhotos && bumpPhotos();
            if (up) setPreview(pv => ({ ...pv, rec: up }));
          }}
          onCrop={async sel => {
            const up = await cropPhoto(preview.id, sel);
            bumpPhotos && bumpPhotos();
            if (up) setPreview(pv => ({ ...pv, rec: up }));
          }}
          onDelete={async () => { await deletePhoto(preview.id); releaseURL(preview.id); bumpPhotos && bumpPhotos(); setPreview(null); }}
          onClose={() => setPreview(null)} />)}
    </>);
}

/* Provider's Template — the structural page format enrolled families are given:
   a vertical label up the left edge, a header strip, then the section content.
   Structure is reproduced; the palette and pattern are Flora's own. */
const PPage = ({ label, header, children, last }) => (
  <div style={{ display: "flex", background: "#fff", borderBottom: last ? "none" : `1px solid ${C.line}` }}>
    <div style={{ width: 34, flexShrink: 0, background: C.wash, display: "flex",
      alignItems: "center", justifyContent: "center", borderRight: `1px solid ${C.line}` }}>
      <span style={{ writingMode: "vertical-rl", transform: "rotate(180deg)", fontSize: 9.5,
        letterSpacing: 2.6, textTransform: "uppercase", color: C.muted, fontWeight: 600 }}>{label}</span>
    </div>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "9px 18px", borderBottom: `1px solid ${C.line}`, background: "#fcfbf6" }}>
        <span style={{ fontSize: 8.5, letterSpacing: 2, textTransform: "uppercase", color: C.muted }}>Student Portfolio</span>
        <span style={{ fontFamily: serif, fontSize: 13, color: C.deep }}>{header}</span>
        <Leaf size={12} style={{ color: C.line }} />
      </div>
      <div style={{ padding: "18px 20px 22px" }}>{children}</div>
    </div>
  </div>
);

const PSec = ({ t, label, children, done }) => (
  <div style={{ marginBottom: 26 }}>
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
      <div style={{ fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: t.accent, fontWeight: 700 }}>{label}</div>
      <div style={{ flex: 1, height: 1, background: t.soft, opacity: .5 }} />
      {done ? <Check size={12} style={{ color: t.accent }} />
        : <span className="no-print" style={{ fontSize: 9.5, letterSpacing: 1, textTransform: "uppercase", color: t.ink, opacity: .45 }}>pending</span>}
    </div>{children}</div>
);
const Pending = ({ t, children }) => (
  <div style={{ border: `1px dashed ${t.soft}`, borderRadius: 10, padding: "16px 18px", textAlign: "center",
    fontSize: 12.5, color: t.ink, opacity: .62 }}>{children}</div>
);

/* ───────────────────────── E-LIBRARY ───────────────────────── */
function PageLibrary() {
  return (
    <>
      <Title sub="Free e-books you can open and read straight away. One cover per link — tap any spine to open it.">E-Library</Title>
      <div style={{ background: "#5c4a35", borderRadius: 14, padding: "26px 24px 20px", boxShadow: "inset 0 -8px 20px rgba(0,0,0,.18)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(126px,1fr))", gap: 16 }}>
          {EBOOKS.map((b, i) => (
            <a key={b.t} href={b.u} target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}>
              <div style={{ background: b.c, borderRadius: "3px 7px 7px 3px", padding: "16px 13px", height: 166,
                display: "flex", flexDirection: "column", justifyContent: "space-between",
                boxShadow: "3px 4px 10px rgba(0,0,0,.3)", borderLeft: "5px solid rgba(0,0,0,.22)" }}>
                <div><Motif kind={MOTIFS[i % MOTIFS.length]} color="rgba(255,255,255,.5)" size={22} style={{ marginBottom: 6 }} />
                  <div style={{ fontFamily: serif, fontSize: 15.5, color: "#fff", lineHeight: 1.28, fontWeight: 600 }}>{b.t}</div></div>
                <div><div style={{ fontSize: 9.5, color: "rgba(255,255,255,.7)", marginBottom: 6 }}>{b.a}</div>
                  <div style={{ height: 1, background: "rgba(255,255,255,.28)" }} />
                  <div style={{ fontSize: 9, color: "rgba(255,255,255,.62)", marginTop: 6, display: "flex", alignItems: "center", gap: 3 }}>
                    Open <Link2 size={9} /></div></div>
              </div></a>))}
        </div>
        <div style={{ height: 7, background: "#3f3324", borderRadius: 4, marginTop: 18 }} />
      </div>
      <div style={{ marginTop: 14 }}><Btn tone="quiet" small disabled title="Not built yet"><Plus size={13} /> Add a book link</Btn></div>
    </>);
}

function PageOthers() {
  const docs = [{ n: "Enrolment form", s: "Submitted" }, { n: "ECCD checklist — start of year", s: "Submitted" },
    { n: "ECCD checklist — end of year", s: "Due in April" }, { n: "Semester ratings sheet", s: "Draft saved" }];
  return (
    <>
      <Title sub="Anything your provider asks for besides the portfolio. Keep them here so nothing is hunted for at deadline.">Others</Title>
      <Panel title="Required documents" pad={0}>
        {docs.map((d, i) => (
          <div key={d.n} style={{ display: "flex", alignItems: "center", gap: 12, padding: "13px 18px",
            borderBottom: i < docs.length - 1 ? `1px solid ${C.line}` : "none" }}>
            <Files size={16} style={{ color: C.muted, flexShrink: 0 }} />
            <span style={{ fontSize: 14, flex: 1 }}>{d.n}</span>
            <Pill color={d.s === "Submitted" ? C.green : C.blush}>{d.s}</Pill>
            <Btn tone="quiet" small disabled title="Not built yet"><Upload size={12} /> Upload</Btn></div>))}
      </Panel>
    </>);
}

/* ───────────────────────── SETTINGS (provider code) ───────────────────────── */
function PageSettings({ prov, code, applyCode, setCode, freedMB, photoCount, pstats, logFreq, setLogFreq, uploadTo, setUploadTo,
  email, setEmail, emailOn, setEmailOn, events, showHolidays, setShowHolidays, jumpTo, setJumpTo,
  doBackup, doImport, lastBackup, drive, setDrive, lastDrive, sendToDrive,
  about, setAbout, termIdx, setTermIdx, term, terms, termWord,
  system, termSystem, setTermSystem, providerSystem, photoFit, setPhotoFit,
  photoVersion, bumpPhotos }) {
  const emailPanel = useRef(null);
  const emailInput = useRef(null);
  const studentPanel = useRef(null);
  const backupPanel = useRef(null);
  const portrait = useProfilePhoto(photoVersion);
  useEffect(() => {
    if (jumpTo !== "backup") return;
    const t = setTimeout(() => { backupPanel.current?.scrollIntoView({ behavior: "smooth", block: "start" }); setJumpTo(null); }, 60);
    return () => clearTimeout(t);
  }, [jumpTo, setJumpTo]);
  useEffect(() => {
    if (jumpTo !== "student") return;
    const t = setTimeout(() => { studentPanel.current?.scrollIntoView({ behavior: "smooth", block: "start" }); setJumpTo(null); }, 60);
    return () => clearTimeout(t);
  }, [jumpTo, setJumpTo]);
  useEffect(() => {
    if (jumpTo !== "email") return;
    const t = setTimeout(() => {
      emailPanel.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      emailInput.current?.focus();
      setJumpTo(null);
    }, 60);
    return () => clearTimeout(t);
  }, [jumpTo, setJumpTo]);
  const [entry, setEntry] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [dBusy, setDBusy] = useState(false);
  const [dMsg, setDMsg] = useState("");

  /* real export — pulls everything Flora holds and hands it back as a file */
  const exportRecords = async () => {
    const r = await store.get("flora:v3");
    const blob = new Blob([r?.value || "{}"], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `flora-records-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const submit = () => { if (applyCode(entry)) { setEntry(""); setErr(""); } else setErr("That code isn't recognised yet. Check the spelling, or leave it blank to set things up yourself."); };

  return (
    <>
      <Title sub="Set once, and Flora shapes itself around your provider and your child's level.">Settings</Title>

      <DiagnosticsPanel photoVersion={photoVersion} />

      <div ref={studentPanel}>
      <Panel title="Your student">
        <div style={{ display: "flex", gap: 20, alignItems: "flex-start", flexWrap: "wrap" }}>
          <div style={{ textAlign: "center", width: 118 }}>
            <div style={{ width: 88, height: 88, borderRadius: "50%", overflow: "hidden", background: C.wash,
              marginLeft: "auto", marginRight: "auto",
              border: `1px solid ${C.line}`, display: "flex", alignItems: "center", justifyContent: "center",
              marginBottom: 9 }}>
              {portrait ? <PhotoImg rec={portrait} url={portrait.url}
                            fit={photoFit[portrait.id] || "cover"} />
                        : <Camera size={22} style={{ color: C.muted }} />}
            </div>
            <AddPhoto entryId={PROFILE_ID} onAdded={bumpPhotos} small block
              label={portrait ? "Change photo" : "Add photo"} />
            {!portrait && (
              <div style={{ fontSize: 10.5, color: C.muted, marginTop: 6, lineHeight: 1.5 }}>
                Added on another device? Restore your backup below.
              </div>)}
            {portrait && (
              <button onClick={() => setPhotoFit({ ...photoFit,
                [portrait.id]: (photoFit[portrait.id] || "cover") === "cover" ? "contain" : "cover" })}
                style={{ marginTop: 7, background: "none", border: "none", cursor: "pointer", padding: 0,
                  fontSize: 11.5, color: C.muted, textDecoration: "underline" }}>
                {(photoFit[portrait.id] || "cover") === "cover" ? "Show the whole photo" : "Crop to the circle"}</button>)}
          </div>

          <div style={{ flex: 1, minWidth: 250, display: "grid", gap: 13 }}>
            <SmallField label="Child's full name">
              <input value={about.name} onChange={e => setAbout({ ...about, name: e.target.value })}
                placeholder="e.g. Maria Cruz Santos"
                style={{ ...inp, minHeight: 44 }} /></SmallField>

            <SmallField label="How does your provider divide the school year?">
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {[["semester", "Semesters", "Two submissions a year"],
                  ["quarter", "Quarters", "Four submissions a year"]].map(([k, t, d]) => {
                  const on = system === k;
                  return (
                    <button key={k} onClick={() => { setTermSystem(k); setTermIdx(0); }}
                      style={{ textAlign: "left", cursor: "pointer", minHeight: 44, borderRadius: 10,
                        padding: "9px 14px", border: `1.5px solid ${on ? C.green : C.line}`,
                        background: on ? "#f1f5ed" : "#fff" }}>
                      <div style={{ fontSize: 13, fontWeight: on ? 700 : 500, color: on ? C.deep : C.ink }}>{t}</div>
                      <div style={{ fontSize: 11, color: C.muted, marginTop: 1 }}>{d}</div>
                    </button>);
                })}
              </div>
              {prov && (
                <div style={{ fontSize: 11.5, color: C.muted, marginTop: 8, lineHeight: 1.6 }}>
                  {prov.short} submits {prov.level} by {prov.termWord.toLowerCase()}s.
                  {system !== providerSystem && " You've chosen a different setting — check it matches what your provider asks for."}
                </div>)}
            </SmallField>

            <SmallField label={`Which ${termWord.toLowerCase()} are you working on?`}>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {terms.map((t, i) => {
                  const on = termIdx === i;
                  return (
                    <button key={t} onClick={() => setTermIdx(i)} style={{ cursor: "pointer", minHeight: 44,
                      borderRadius: 10, padding: "9px 14px", fontSize: 13, fontWeight: on ? 700 : 500,
                      border: `1.5px solid ${on ? C.green : C.line}`, background: on ? "#f1f5ed" : "#fff",
                      color: on ? C.deep : C.soft }}>{t}</button>);
                })}
              </div></SmallField>

            <div style={{ fontSize: 11.5, color: C.muted, lineHeight: 1.6 }}>
              This name and term appear on the portfolio cover and on every page header.
              The portrait shows in the corner so you always know whose day you're logging.
            </div>
          </div>
        </div>
      </Panel>
      </div>

      <Panel title="Provider code">
        {prov ? (
          <>
            <div style={{ display: "flex", gap: 14, alignItems: "flex-start", marginBottom: 14 }}>
              <div style={{ width: 42, height: 42, borderRadius: 10, background: "#eef2e8",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Check size={18} style={{ color: C.green }} /></div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 600 }}>{prov.name}</div>
                <div style={{ fontSize: 12.5, color: C.soft, marginTop: 2 }}>
                  {prov.level} · SY {prov.sy} · {prov.termWord}s · code <code style={{ background: C.wash, padding: "1px 6px", borderRadius: 4 }}>{code}</code></div>
              </div>
              <Btn small tone="quiet" onClick={() => setCode(null)}>Remove</Btn>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(190px,1fr))", gap: 9, marginBottom: 13 }}>
              {[["Grades required", prov.requiresGrades], ["Exam recording required", prov.requiresExamRecording]].map(([l, v]) => (
                <div key={l} style={{ border: `1px solid ${C.line}`, borderRadius: 9, padding: "10px 12px" }}>
                  <div style={{ fontSize: 11.5, color: C.muted }}>{l}</div>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: v ? C.ink : C.green, marginTop: 2 }}>{v ? "Yes" : "No — hidden in Flora"}</div>
                </div>))}
            </div>
            <SmallField label={`What ${prov.short} expects`}>
              <div style={{ display: "grid", gap: 5, marginTop: 3 }}>
                {prov.notes.map(n => (
                  <div key={n} style={{ display: "flex", gap: 8, fontSize: 12.5, color: C.soft, lineHeight: 1.55 }}>
                    <span style={{ width: 5, height: 5, borderRadius: "50%", background: C.blush, marginTop: 7, flexShrink: 0 }} />{n}</div>))}
              </div></SmallField>
          </>
        ) : (
          <>
            <Note icon={KeyRound}>
              If you're with a homeschool provider, a code sets up your subjects, portfolio sections and requirements in one step —
              the same setup another family from that provider is already using.
            </Note>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "flex-end" }}>
              <div style={{ flex: 1, minWidth: 220 }}>
                <SmallField label="Enter your provider code">
                  <input value={entry} onChange={e => { setEntry(e.target.value); setErr(""); }}
                    onKeyDown={e => e.key === "Enter" && submit()}
                    placeholder="e.g. LLH-KINDER-2627"
                    style={{ ...inp, letterSpacing: 1, fontFamily: "ui-monospace, monospace" }} /></SmallField>
              </div>
              <Btn onClick={submit} disabled={!entry.trim()}><KeyRound size={14} /> Apply code</Btn>
              <Btn tone="quiet" onClick={() => applyCode("FLORA-OPEN")}>Set up myself</Btn>
            </div>
            {err && <div style={{ fontSize: 12.5, color: "#a4553b", marginTop: 9 }}>{err}</div>}
            <div style={{ fontSize: 11.5, color: C.muted, marginTop: 12, lineHeight: 1.6 }}>
              More providers are being added. If yours isn't listed yet, set up manually and send us your guidelines —
              we'll build a code for your community.
            </div>
          </>)}
      </Panel>

      <Panel title="How often you log">
        <div style={{ fontSize: 13.2, color: C.soft, lineHeight: 1.65, marginBottom: 14 }}>
          Not every family logs the same way. Choose the rhythm that matches yours — Flora groups your records
          and shapes the log screen to suit it. You can change this any time without losing anything.
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(196px,1fr))", gap: 10 }}>
          {[
            { k: "daily",     t: "Daily",     d: "Tick each activity as you go, while the book is still open.", w: "Best for a compressed morning block." },
            { k: "weekly",    t: "Weekly",    d: "One sitting at the end of the week, everything pre-ticked.",   w: "Good for working parents." },
            { k: "monthly",   t: "Monthly",   d: "A monthly catch-up on what was covered.",                      w: "Lighter, but details fade." },
            { k: "quarterly", t: "Quarterly", d: "Log once per term, just before submission.",                   w: "Only if your provider asks for little." },
          ].map(o => {
            const on = logFreq === o.k;
            return (
              <button key={o.k} onClick={() => setLogFreq(o.k)} style={{
                textAlign: "left", cursor: "pointer", borderRadius: 12, padding: "13px 14px",
                border: `1.5px solid ${on ? C.green : C.line}`, background: on ? "#f1f5ed" : "#fff" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 5 }}>
                  <CalendarDays size={14} style={{ color: on ? C.green : C.muted }} />
                  <span style={{ fontSize: 14, fontWeight: 600, color: on ? C.deep : C.ink }}>{o.t}</span>
                  {on && <Check size={13} style={{ color: C.green, marginLeft: "auto" }} />}
                </div>
                <div style={{ fontSize: 12, color: C.soft, lineHeight: 1.5 }}>{o.d}</div>
                <div style={{ fontSize: 11, color: C.muted, marginTop: 5, fontStyle: "italic" }}>{o.w}</div>
              </button>);
          })}
        </div>
        {logFreq === "quarterly" && (
          <div style={{ marginTop: 12 }}>
            <Note icon={AlertCircle} tone="blush">
              Logging only at term's end means writing from memory — the very thing Flora exists to spare you.
              If you can manage it, daily or weekly serves you better.
            </Note>
          </div>)}
      </Panel>

      <Panel title="Grade level">
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
          <select defaultValue="Kindergarten" style={{ ...inp, width: 200 }}>
            <option>Kindergarten</option><option disabled>Grade 1 — later version</option><option disabled>Grade 2 — later version</option></select>
          {prov && !prov.requiresGrades && <Pill color={C.green}>Grades page hidden</Pill>}
        </div>
        <Note icon={ShieldCheck}>Your provider's guidelines don't require graded exams at this level, so Flora hides the grades page and the grade column. Change the level and they return automatically.</Note>
      </Panel>

      <Panel title="Your backup">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 9, marginBottom: 14 }}>
          {[["Photos in Flora", `${photoCount}`, C.ink],
            ["Space they take", gb(pstats.heldMB), C.muted]].map(([l, v, col]) => (
            <div key={l} style={{ border: `1px solid ${C.line}`, borderRadius: 10, padding: "11px 13px" }}>
              <div style={{ fontSize: 11, color: C.muted }}>{l}</div>
              <div style={{ fontSize: 17, fontWeight: 600, color: col, marginTop: 3 }}>{v}</div>
            </div>))}
        </div>

        <Note icon={Info}>
          <strong>Keep your own photos.</strong> Flora holds a portfolio-sized copy so it can build your
          submission — it is not a place to store your family photos. Keep the originals on your phone or
          wherever you normally keep them, and back Flora up each week so nothing rests on one device.
        </Note>

        <div style={{ display: "flex", gap: 9, flexWrap: "wrap", alignItems: "center", marginTop: 14 }}>
          <Btn tone="quiet" small disabled={busy}
            onClick={async () => { setBusy(true); const r = await doBackup(); setBusy(false); setMsg(r
              ? `Saved ${r.photos} photo${r.photos === 1 ? "" : "s"} · ${r.sizeMB.toFixed(1)} MB. Move it to your Drive.`
              : "Backup failed. Try again."); }}>
            <HardDrive size={13} /> {busy ? "Working…" : "Back up everything"}</Btn>
          <label style={{ display: "inline-flex", alignItems: "center", gap: 7, cursor: "pointer",
            background: C.card, color: C.soft, border: `1px solid ${C.line}`, borderRadius: 9,
            fontWeight: 600, fontSize: 12.5, padding: "7px 13px" }}>
            <input type="file" accept=".zip,application/zip,application/json" style={{ display: "none" }}
              onChange={async e => {
                const f = e.target.files[0]; e.target.value = "";
                if (!f) return;
                setBusy(true);
                try { const r = await doImport(f); setMsg(`Restored ${r.photos} photo${r.photos === 1 ? "" : "s"}. Reload to see everything.`); }
                catch { setMsg("That file couldn't be read. Check it's a Flora backup."); }
                setBusy(false);
              }} />
            <Upload size={13} /> Restore from a backup
          </label>
        </div>
        {msg && <div style={{ fontSize: 12, color: C.soft, marginTop: 10 }}>{msg}</div>}
        <div style={{ fontSize: 11.5, color: C.muted, marginTop: 9, lineHeight: 1.6 }}>
          You get a zip file you can open: a photos folder with ordinary .jpg files named by day and
          activity, plus what Flora needs to put everything back. Save it to your Drive each Friday — it's
          also how you move a term from your phone to your laptop.
          {lastBackup && ` Last backup: ${new Date(lastBackup).toLocaleDateString("en-GB", { day: "numeric", month: "long" })}.`}
        </div>
      </Panel>

      <InstallStatus />

      <Panel title="About the photos Flora keeps">
        <div style={{ fontSize: 13, color: C.soft, lineHeight: 1.75 }}>
          When you add a photo, Flora makes its own copy on this device and shrinks it to portfolio size —
          about 300KB, clear enough to print. Deleting the picture from your phone's gallery does not
          remove Flora's copy.
        </div>
        <Note icon={Info}>
          <strong>Keep your originals anyway.</strong> Flora's copy lives in your browser's storage, and a
          browser can clear that when the phone runs low on space, or if you clear your browsing data.
          It is also smaller than the photo you took. Treat it as your portfolio copy, not as a backup of
          your family photos — and back up weekly so nothing depends on one device.
        </Note>
      </Panel>

      <div ref={backupPanel} />
      <Panel title="Send backups to your Google Drive"
        right={drive.on
          ? <span style={{ fontSize: 11.5, color: C.green, fontWeight: 600 }}>On</span>
          : <span style={{ fontSize: 11.5, color: C.muted }}>Off</span>}>
        <div style={{ fontSize: 13, color: C.soft, lineHeight: 1.7, marginBottom: 13 }}>
          Flora can put the weekly backup straight into a folder in your own Drive, so you never have to
          remember. It can only ever see the folder it creates — never the rest of your Drive.
        </div>

        <div style={{ display: "grid", gap: 12 }}>
          <SmallField label="Folder in your Drive">
            <input value={drive.folder} onChange={e => setDrive({ ...drive, folder: e.target.value })}
              placeholder="Flora Backups" style={{ ...inp, minHeight: 44 }} />
            <div style={{ fontSize: 11, color: C.muted, marginTop: 5 }}>
              Keep this folder for Flora only. Flora creates it if it isn't there yet, and keeps the last
              twelve backups so it doesn't fill up.
            </div></SmallField>

          <SmallField label="Google client ID">
            <input value={drive.clientId} onChange={e => setDrive({ ...drive, clientId: e.target.value.trim() })}
              placeholder="…apps.googleusercontent.com"
              style={{ ...inp, minHeight: 44, fontFamily: "ui-monospace, monospace", fontSize: 12 }} />
            <div style={{ fontSize: 11, color: C.muted, marginTop: 5, lineHeight: 1.6 }}>
              One-off setup, done for you before you join — you shouldn't need to touch this.
            </div></SmallField>

          <div style={{ display: "flex", gap: 9, flexWrap: "wrap", alignItems: "center" }}>
            <Btn small disabled={!drive.clientId || dBusy}
              onClick={async () => {
                setDBusy(true);
                const r = await sendToDrive();
                setDBusy(false);
                if (r.ok) { setDrive({ ...drive, on: true }); setDMsg(`Sent — ${r.name} is in your Drive.`); }
                else setDMsg(r.reason === "no-client-id"
                  ? "Add the client ID first."
                  : "Couldn't reach Drive. Check the connection and try again.");
              }}>
              <Upload size={13} /> {dBusy ? "Sending…" : drive.on ? "Send now" : "Connect and send"}</Btn>
            {drive.on && (
              <Btn small tone="quiet" onClick={() => { setDrive({ ...drive, on: false }); setDMsg("Turned off. Manual backups still work."); }}>
                Turn off</Btn>)}
            {lastDrive?.link && <A href={lastDrive.link}>Open the last backup</A>}
          </div>
          {dMsg && <div style={{ fontSize: 12, color: C.soft }}>{dMsg}</div>}

          {lastDrive && (
            <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.6 }}>
              Last sent {new Date(lastDrive.at).toLocaleDateString("en-GB", { day: "numeric", month: "long" })}
              {lastDrive.photos != null && ` \u00b7 ${lastDrive.photos} photo${lastDrive.photos === 1 ? "" : "s"}`}
              {lastDrive.sizeMB != null && ` \u00b7 ${lastDrive.sizeMB.toFixed(1)} MB`}
            </div>)}

          <Note icon={Info}>
            Flora sends the backup when you open it, if a week has gone by — a page in your browser can't
            upload while it's closed. Google also asks you to confirm every so often; Flora will tell you
            when it needs a tap.
          </Note>
        </div>
      </Panel>

      <Panel title="Your records, your rules">
        <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
          <Lock size={17} style={{ color: C.green, flexShrink: 0, marginTop: 2 }} />
          <div style={{ fontSize: 13.2, color: C.soft, lineHeight: 1.65 }}>
            Your child's photos and records are yours. Always exportable, free, whatever you decide about Flora.
            Never sold, and never used for anything but your own portfolio.
          </div></div>
        <div style={{ display: "flex", gap: 9, marginTop: 13, flexWrap: "wrap" }}>
          <Btn tone="quiet" small onClick={exportRecords}><Download size={13} /> Download records only</Btn>
        </div>
        <div style={{ fontSize: 11.5, color: C.muted, marginTop: 9 }}>
          Records alone download as a JSON file. For everything including photos, use Back up everything above.
        </div>
      </Panel>

      <Panel title="Philippine holidays">
        <div style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 13 }}>
          <div style={{ flex: 1, fontSize: 13.2, color: C.soft, lineHeight: 1.65 }}>
            Regular holidays and special non-working days are shown on your calendar so you can plan
            around them — and so a light day never looks like a missed one.
          </div>
          <button onClick={() => setShowHolidays(!showHolidays)} style={{ display: "inline-flex", alignItems: "center",
            gap: 8, padding: "9px 14px", borderRadius: 9, fontSize: 12.5, fontWeight: 600, cursor: "pointer", flexShrink: 0,
            border: `1px solid ${showHolidays ? "transparent" : C.line}`,
            background: showHolidays ? C.green : "#fff", color: showHolidays ? "#fff" : C.soft }}>
            <CalendarDays size={13} /> {showHolidays ? "Showing" : "Hidden"}</button>
        </div>
        <Note icon={Info}>
          2026 dates follow the official proclamation. 2027 is not yet proclaimed — those are marked
          <strong> provisional</strong>, since movable and additional special days are confirmed each year.
          Flora will update them once the proclamation is out.
        </Note>
      </Panel>

      <div ref={emailPanel} style={{ scrollMarginTop: 12 }}>
      <Panel title="Email reminders">
        <div style={{ fontSize: 13.2, color: C.soft, lineHeight: 1.65, marginBottom: 13 }}>
          Flora can send a note before anything on your calendar — a week ahead, three days, the day before,
          or on the morning itself. You choose per event.
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "flex-end", marginBottom: 13 }}>
          <div style={{ flex: 1, minWidth: 230 }}>
            <SmallField label="Where to send them">
              <input ref={emailInput} type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com" style={inp} /></SmallField>
          </div>
          <button onClick={() => setEmailOn(!emailOn)} style={{ display: "inline-flex", alignItems: "center", gap: 8,
            padding: "10px 15px", borderRadius: 9, fontSize: 13, fontWeight: 600, cursor: "pointer",
            border: `1px solid ${emailOn ? "transparent" : C.line}`, background: emailOn ? C.green : "#fff",
            color: emailOn ? "#fff" : C.soft }}>
            <Mail size={13} /> {emailOn ? "Reminders on" : "Reminders off"}</button>
        </div>
        <div style={{ display: "flex", gap: 7, flexWrap: "wrap", marginBottom: 12 }}>
          {REMIND_STEPS.map(r => (
            <span key={r.d} style={{ fontSize: 11.5, color: C.soft, background: C.wash,
              borderRadius: 20, padding: "5px 12px" }}>{r.label}</span>))}
        </div>
        <div style={{ fontSize: 11.5, color: C.muted, lineHeight: 1.6 }}>
          {(events || []).filter(e => e.email).length} event
          {(events || []).filter(e => e.email).length === 1 ? " is" : "s are"} set to email you.
          Everything still appears on Home whether or not email is on.
        </div>
      </Panel>
      </div>

      <Panel title="Video uploads">
        <div style={{ fontSize: 13.2, color: C.soft, lineHeight: 1.65, marginBottom: 13 }}>
          Flora doesn't host video — one minute of phone footage is larger than a whole term of photos.
          Choose where yours lives, and Flora will take you straight there when you need to upload.
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 10, marginBottom: 13 }}>
          {Object.entries(UPLOAD_DEST).map(([k, d]) => {
            const on = uploadTo === k;
            return (
              <button key={k} onClick={() => setUploadTo(k)} style={{ textAlign: "left", cursor: "pointer",
                borderRadius: 11, padding: "13px 14px", border: `1.5px solid ${on ? C.green : C.line}`,
                background: on ? "#f1f5ed" : "#fff" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 4 }}>
                  <Video size={14} style={{ color: on ? C.green : C.muted }} />
                  <span style={{ fontSize: 14, fontWeight: 600, color: on ? C.deep : C.ink }}>{d.label}</span>
                  {on && <Check size={13} style={{ color: C.green, marginLeft: "auto" }} />}
                </div>
                <div style={{ fontSize: 11.8, color: C.soft, lineHeight: 1.5 }}>{d.hint}</div>
              </button>);
          })}
        </div>
        <a href={UPLOAD_DEST[uploadTo].url} target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 13.5, fontWeight: 600,
            color: "#fff", background: C.green, borderRadius: 9, padding: "10px 17px", cursor: "pointer" }}>
            <Upload size={14} /> Open my {UPLOAD_DEST[uploadTo].label}<Link2 size={11} /></span></a>
        <Note icon={Video} tone="blush">
          Optional at this level. Whichever you choose, the link must open the file directly in a browser —
          not a folder, an album, or a slide deck.</Note>
      </Panel>
    </>);
}

function PageFeedback() {
  const [sent, setSent] = useState(false);
  return (
    <>
      <Title sub="We appreciate your feedback — it will help us make Flora better.">Feedback</Title>
      <Panel>
        {sent ? (
          <div style={{ textAlign: "center", padding: "26px 10px" }}>
            <Motif kind="butterfly" color={C.blush} size={46} style={{ marginBottom: 6 }} />
            <div style={{ fontFamily: serif, fontSize: 21, color: C.deep }}>Thank you.</div>
            <div style={{ fontSize: 13.5, color: C.soft, marginTop: 4 }}>Every note from a real homeschool changes what gets built next.</div>
          </div>
        ) : (
          <>
            <div style={{ display: "flex", gap: 8, marginBottom: 13, flexWrap: "wrap" }}>
              {["Something's confusing", "A feature request", "Something broke", "Just a thought"].map(x => (
                <button key={x} style={{ fontSize: 12, padding: "7px 13px", borderRadius: 20,
                  border: `1px solid ${C.line}`, background: "#fff", cursor: "pointer", color: C.soft }}>{x}</button>))}
            </div>
            <textarea rows={5} placeholder="Write it here…" style={{ ...inp, resize: "vertical", marginBottom: 13 }} />
            <Btn onClick={() => setSent(true)}>Send to Flora</Btn>
          </>)}
      </Panel>
    </>);
}
