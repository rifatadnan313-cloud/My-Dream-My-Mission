/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  RotateCcw, 
  Printer, 
  FileDown, 
  Menu, 
  X, 
  ChevronRight,
  Plus,
  Trash2,
  Settings,
  Palette,
  Type,
  Check,
  Crown,
  Sparkles,
  BookOpen,
  Layout,
  Bookmark,
  Award,
  Loader2
} from 'lucide-react';
import { BrandLogo, BrandEmblem } from './components/BrandLogo';
import { generateAndDownloadPDF } from './utils/pdfExport';

interface Goal {
  id: string;
  text: string;
}

interface SectionData {
  id: string;
  kicker: string;
  title: string;
  shortName: string;
  intro: string;
  goals: Goal[];
  hasCards?: boolean;
  isCustom?: boolean;
  edgeStyle?: 'default' | 'gold' | 'cyan' | 'double' | 'dashed';
}

const initialSections: SectionData[] = [
  {
    id: 'scholar',
    kicker: '01 / Scholarship',
    title: 'একজন আন্তর্জাতিক মানের ইসলামী আলেম ও গবেষক',
    shortName: 'আলেম ও গবেষক',
    intro: 'কুরআন, হাদিস, তাফসির, ফিকহ, উসুলুল ফিকহ, আকিদা ও ইসলামের অন্যান্য শাস্ত্রে গভীর, নির্ভরযোগ্য ও প্রমাণভিত্তিক জ্ঞান অর্জন করতে চাই।',
    goals: [
      { id: 's1', text: 'কুরআন ও সুন্নাহ সম্পর্কে গভীর ও নির্ভরযোগ্য জ্ঞান অর্জন।' },
      { id: 's2', text: 'তাফসির, উলুমুল কুরআন, উলুমুল হাদিস ও হাদিসশাস্ত্রে বিশেষজ্ঞ হওয়া।' },
      { id: 's3', text: 'ফিকহ, উসুলুল ফিকহ, ফতোয়া ও ইজতিহাদের নীতিমালা সম্পর্কে উচ্চতর জ্ঞান অর্জন।' },
      { id: 's4', text: 'আরবি ভাষা, নাহু, সরফ, বালাগাত ও আরবি সাহিত্যে দক্ষ হওয়া।' },
      { id: 's5', text: 'ইসলামের ইতিহাস, মুসলিম সভ্যতা ও মনীষীদের সম্পর্কে গবেষণামূলক জ্ঞান অর্জন।' },
      { id: 's6', text: 'তুলনামূলক ধর্মতত্ত্ব, দর্শন, যুক্তিবিদ্যা ও সমসাময়িক মতবাদ সম্পর্কে অধ্যয়ন।' },
      { id: 's7', text: 'দলিল, প্রমাণ ও নির্ভরযোগ্য সূত্রের ভিত্তিতে গবেষণা ও বিশ্লেষণ করতে পারা।' },
      { id: 's8', text: 'জটিল ইসলামী বিষয় সহজ ও প্রাঞ্জল ভাষায় মানুষের সামনে উপস্থাপন করতে পারা।' },
      { id: 's9', text: 'যোগ্য মুফতি ও ফকিহ হওয়ার জন্য প্রয়োজনীয় প্রাতিষ্ঠানিক শিক্ষা ও বিশেষায়িত প্রশিক্ষণ অর্জন।' },
      { id: 's10', text: 'আন্তর্জাতিক পর্যায়ে ইসলামী জ্ঞান, শিক্ষা ও গবেষণায় অবদান রাখা।' }
    ]
  },
  {
    id: 'author',
    kicker: '02 / Writing & Research',
    title: 'একজন আন্তর্জাতিক মানের ইসলামী লেখক ও গবেষণাধর্মী সাহিত্যিক',
    shortName: 'লেখক ও সাহিত্যিক',
    intro: 'ইসলামী জ্ঞান, ইতিহাস, দর্শন, সমাজ, সভ্যতা, নৈতিকতা ও সমসাময়িক বিষয় নিয়ে উচ্চমানের গবেষণাধর্মী ও সাহিত্যিক বই লিখতে চাই।',
    goals: [
      { id: 'a1', text: 'বাংলা, আরবি ও ইংরেজি ভাষায় উচ্চমানের লেখালেখির দক্ষতা অর্জন।' },
      { id: 'a2', text: 'প্রয়োজন অনুযায়ী উর্দু, ফারসি ও অন্যান্য ভাষা শেখা।' },
      { id: 'a3', text: 'গবেষণাপদ্ধতি, তথ্য যাচাই, সূত্র অনুসন্ধান ও রেফারেন্স ব্যবহারে দক্ষ হওয়া।' },
      { id: 'a4', text: 'ইসলামী গবেষণা, ইতিহাস, দর্শন, ধর্মতত্ত্ব ও সমাজবিষয়ক গবেষণায় পারদর্শী হওয়া।' },
      { id: 'a5', text: 'প্রবন্ধ, গবেষণাপত্র, প্রবন্ধসংকলন, জীবনী, ইতিহাস ও নন-ফিকশন বই লিখতে পারা।' },
      { id: 'a6', text: 'যুক্তিনির্ভর, তথ্যসমৃদ্ধ ও বিশ্লেষণধর্মী লেখা তৈরি করা।' },
      { id: 'a7', text: 'গল্প, সংলাপ, উদাহরণ ও সাহিত্যিক উপস্থাপনার মাধ্যমে কঠিন বিষয় সহজ করা।' },
      { id: 'a8', text: 'অনুবাদ, সম্পাদনা, প্রুফরিডিং ও প্রকাশনাসংক্রান্ত কাজে দক্ষ হওয়া।' },
      { id: 'a9', text: 'আন্তর্জাতিক মানের গবেষণাপত্র ও বই প্রকাশের যোগ্যতা অর্জন।' },
      { id: 'a10', text: 'পাঠকের জ্ঞান, চিন্তাশক্তি ও নৈতিক উন্নয়নে ভূমিকা রাখে—এমন বই লেখা।' }
    ]
  },
  {
    id: 'qari',
    kicker: '03 / Quran Recitation',
    title: 'একজন আন্তর্জাতিক মানের হাফেজ ও ক্বারি',
    shortName: 'হাফেজ ও ক্বারি',
    intro: 'সম্পূর্ণ কুরআনের হাফেজ হয়ে তাজবিদ, মাখরাজ, সিফাত, ওয়াকফ-ইবতিদা ও স্বীকৃত কিরাআতের ক্ষেত্রে উচ্চপর্যায়ের দক্ষতা অর্জন করতে চাই।',
    goals: [
      { id: 'q1', text: 'সম্পূর্ণ কুরআনুল কারিম নির্ভুলভাবে মুখস্থ করা।' },
      { id: 'q2', text: 'নিয়মিত পুনরাবৃত্তির মাধ্যমে হিফজকে মজবুত করা।' },
      { id: 'q3', text: 'তাজবিদের সব নিয়ম যথাযথভাবে আয়ত্ত করা।' },
      { id: 'q4', text: 'প্রতিটি হরফের মাখরাজ ও সিফাত শুদ্ধভাবে আদায় করতে শেখা।' },
      { id: 'q5', text: 'গুন্নাহ, মাদ, ইখফা, ইদগাম, ইকলাব ও ইজহারে দক্ষ হওয়া।' },
      { id: 'q6', text: 'ওয়াকফ ও ইবতিদার নিয়ম গভীরভাবে শেখা।' },
      { id: 'q7', text: 'প্রথমে হাফস আন আসিমসহ স্বীকৃত রিওয়ায়াতগুলো শুদ্ধভাবে শেখা।' },
      { id: 'q8', text: 'যোগ্য শিক্ষকের অধীনে অন্যান্য স্বীকৃত কিরাআত ও রিওয়ায়াত অধ্যয়ন।' },
      { id: 'q9', text: 'সাত ও দশ কিরাআত সম্পর্কে উচ্চতর জ্ঞান এবং যোগ্য শিক্ষকের কাছ থেকে ইজাজাহ ও সনদ লাভ।' },
      { id: 'q10', text: 'মুরাত্তাল ও মুজাওয়াদ উভয় ধারায় সুন্দরভাবে তিলাওয়াত করা।' },
      { id: 'q11', text: 'কণ্ঠের স্বাভাবিক সৌন্দর্য, সুরের নিয়ন্ত্রণ ও নিরাপদ শ্বাসপ্রশ্বাসের দক্ষতা অর্জন।' },
      { id: 'q12', text: 'মাকামাত সম্পর্কে জ্ঞান অর্জন করে তাজবিদ ও কুরআনের অর্থের মর্যাদা বজায় রেখে তিলাওয়াত করা।' },
      { id: 'q13', text: 'ইমামতি, তারাবিহ ও দীর্ঘ কিরাআতে দক্ষ হওয়া।' },
      { id: 'q14', text: 'অন্যদের কুরআন শেখানো এবং তাদের তিলাওয়াত সংশোধন করার যোগ্যতা অর্জন।' },
      { id: 'q15', text: 'নিজস্ব স্বতন্ত্র ও সুন্দর তিলাওয়াতের পরিচয় তৈরি করা।' }
    ]
  },
  {
    id: 'vocal',
    kicker: '04 / Vocal Artistry',
    title: 'একজন আন্তর্জাতিক মানের বহুমুখী কণ্ঠশিল্পী ও সুরস্রষ্টা',
    shortName: 'কণ্ঠশিল্পী ও সুরস্রষ্টা',
    intro: 'গজল, নাশিদ, হামদ, নাত ও অন্যান্য উপযুক্ত সংগীত শুদ্ধতা, আবেগ ও দক্ষতার সঙ্গে পরিবেশন করার পাশাপাশি নিজস্ব মৌলিক সৃষ্টি তৈরি করতে চাই।',
    goals: [
      { id: 'v1', text: 'শ্রুতিমধুর, স্বতন্ত্র, নমনীয় ও বহুমুখী কণ্ঠস্বরের অধিকারী হওয়া।' },
      { id: 'v2', text: 'Pitch Control, Voice Control, Breath Control, Vocal Flexibility ও Vocal Expression-এ দক্ষ হওয়া।' },
      { id: 'v3', text: 'কণ্ঠের গভীরতা, কোমলতা, শক্তি, উচ্চতা ও আবেগ নিয়ন্ত্রণ করতে পারা।' },
      { id: 'v4', text: 'বিভিন্ন ধরনের গজল, নাশিদ, হামদ ও নাত পরিবেশনায় পারদর্শী হওয়া।' },
      { id: 'v5', text: 'বিভিন্ন শিল্পীর কণ্ঠ, সুর, তাল, লয় ও পরিবেশনাশৈলী শুনে বিশ্লেষণ করতে পারা।' },
      { id: 'v6', text: 'অন্যের পরিবেশনা শুনে তার সুর ও কণ্ঠের বৈশিষ্ট্য শিখে নিজের কণ্ঠে পুনরায় পরিবেশন করতে পারা—প্রয়োজনীয় অনুমতি ও স্বত্বের প্রতি সম্মান রেখে।' },
      { id: 'v7', text: 'সুর, স্কেল, রাগ, মাকামাত ও মেলোডি সম্পর্কে গভীর জ্ঞান অর্জন।' },
      { id: 'v8', text: 'বাংলা, আরবি, উর্দু, ফারসি ও ইংরেজিসহ বিভিন্ন ভাষায় শুদ্ধ উচ্চারণে পরিবেশন করতে পারা।' },
      { id: 'v9', text: 'নিজেই গজল ও নাশিদের কথা লিখতে পারা।' },
      { id: 'v10', text: 'নিজস্ব সুর, মেলোডি ও কম্পোজিশন তৈরি করতে পারা।' },
      { id: 'v11', text: 'Vocal Layering, Harmony ও একাধিক কণ্ঠের সমন্বয়ে সুন্দর পরিবেশনা তৈরি করতে পারা।' },
      { id: 'v12', text: 'Microphone Technique, Vocal Recording, Audio Editing, Mixing ও Mastering শেখা।' },
      { id: 'v13', text: 'Digital Audio Workstation (DAW) ব্যবহার করে নিজস্ব অডিও প্রযোজনা করা।' },
      { id: 'v14', text: 'সম্পূর্ণ মৌলিক গজল ও নাশিদ তৈরি ও প্রকাশ করতে পারা।' },
      { id: 'v15', text: 'নিজের স্বতন্ত্র কণ্ঠ, সুর ও পরিবেশনাশৈলী প্রতিষ্ঠা করা।' },
      { id: 'v16', text: 'আন্তর্জাতিক পর্যায়ে পরিচিত ও সম্মানিত কণ্ঠশিল্পী ও সুরস্রষ্টা হওয়া।' }
    ]
  },
  {
    id: 'teacher',
    kicker: '05 / Teaching & Leadership',
    title: 'একজন দক্ষ শিক্ষক, বক্তা ও জ্ঞান প্রচারক',
    shortName: 'শিক্ষক ও বক্তা',
    intro: 'নিজের অর্জিত জ্ঞান ও দক্ষতা অন্যদের মধ্যে ছড়িয়ে দিতে এবং শিক্ষার মাধ্যমে মানুষের কল্যাণে অবদান রাখতে চাই।',
    goals: [
      { id: 't1', text: 'জটিল বিষয় সহজভাবে বোঝানোর দক্ষতা।' },
      { id: 't2', text: 'সুন্দর, প্রাঞ্জল ও প্রভাবশালী বক্তব্য উপস্থাপন।' },
      { id: 't3', text: 'আন্তর্জাতিক পর্যায়ে বক্তৃতা ও আলোচনা করার যোগ্যতা।' },
      { id: 't4', text: 'শিক্ষার্থীদের উপযোগী পাঠদান ও প্রশিক্ষণপদ্ধতি তৈরি।' },
      { id: 't5', text: 'কুরআন, হাদিস, আরবি ভাষা ও ইসলামী জ্ঞান শেখানোর দক্ষতা।' },
      { id: 't6', text: 'লেখালেখি, গবেষণা ও জ্ঞানচর্চায় অন্যদের উৎসাহিত করা।' },
      { id: 't7', text: 'ভবিষ্যতে একটি মানসম্মত শিক্ষাপ্রতিষ্ঠান বা গবেষণাকেন্দ্র প্রতিষ্ঠার যোগ্যতা অর্জন।' }
    ]
  },
  {
    id: 'knowledge',
    kicker: '06 / Languages & Knowledge',
    title: 'ভাষা, জ্ঞান ও প্রযুক্তিতে বহুমুখী দক্ষতা',
    shortName: 'ভাষা ও প্রযুক্তি',
    intro: 'নির্দিষ্ট কয়েকটি বিষয়ে সীমাবদ্ধ না থেকে প্রয়োজনীয় ভাষা, মানবিক জ্ঞান, বিজ্ঞান ও প্রযুক্তিতে বিস্তৃত ভিত্তি গড়ে তুলতে চাই।',
    hasCards: true,
    goals: [
      { id: 'k1', text: 'বাংলা, আরবি ও ইংরেজিতে উচ্চপর্যায়ের দক্ষতা।' },
      { id: 'k2', text: 'উর্দু, ফারসি ও অন্যান্য প্রয়োজনীয় ভাষা শেখা।' },
      { id: 'k3', text: 'অনুবাদ ও ভাষাগত বিশ্লেষণে দক্ষতা অর্জন।' },
      { id: 'k4', text: 'যুক্তিবিদ্যা, দর্শন ও সমালোচনামূলক চিন্তায় দক্ষতা।' },
      { id: 'k5', text: 'কম্পিউটার, ডিজিটাল গবেষণা ও তথ্য ব্যবস্থাপনায় দক্ষতা।' },
      { id: 'k6', text: 'লেখালেখি, প্রকাশনা, অডিও-ভিডিও নির্মাণ ও ডিজিটাল প্রোডাকশনের প্রযুক্তিগত জ্ঞান।' },
      { id: 'k7', text: 'সময় ব্যবস্থাপনা, শৃঙ্খলা, নেতৃত্ব ও পরিকল্পনার দক্ষতা।' }
    ]
  },
  {
    id: 'final',
    kicker: '07 / My Purpose',
    title: 'আমার চূড়ান্ত পরিচয় ও স্বপ্ন',
    shortName: 'চূড়ান্ত স্বপ্ন',
    intro: 'আমার চূড়ান্ত লক্ষ্য হলো এমন একজন বহুমুখী জ্ঞানী, গবেষক, লেখক, হাফেজ, ক্বারি, শিক্ষক, বক্তা, কণ্ঠশিল্পী ও সুরস্রষ্টা হয়ে ওঠা, যিনি প্রতিটি ক্ষেত্রে প্রকৃত জ্ঞান, যোগ্যতা, দক্ষতা ও স্বকীয়তার পরিচয় দিতে পারবেন।',
    goals: [
      { id: 'f1', text: 'ইসলামী জ্ঞানে গভীরতা ও গবেষণায় নির্ভরযোগ্যতা অর্জন করা।' },
      { id: 'f2', text: 'সাহিত্য ও লেখালেখিতে নিজস্ব শক্তিশালী পরিচয় তৈরি করা।' },
      { id: 'f3', text: 'কুরআন তিলাওয়াতে উচ্চপর্যায়ের দক্ষতা ও স্বীকৃত সনদ অর্জন করা।' },
      { id: 'f4', text: 'গজল ও নাশিদে অসাধারণ কণ্ঠশিল্পী ও সুরস্রষ্টা হওয়া।' },
      { id: 'f5', text: 'নিজের জ্ঞান ও প্রতিভা মানুষের কল্যাণে কাজে লাগানো।' },
      { id: 'f6', text: 'আন্তর্জাতিক পর্যায়ে শিক্ষা, গবেষণা, সাহিত্য ও শিল্পের মাধ্যমে অবদান রাখা।' },
      { id: 'f7', text: 'প্রতিটি ক্ষেত্রে মৌলিকতা, সততা, শৃঙ্খলা ও উৎকর্ষ বজায় রাখা।' }
    ]
  }
];

export type LayoutStyle = 'standard' | 'royal' | 'modern' | 'journal';

export default function App() {
  const [sections, setSections] = useState<SectionData[]>(initialSections);
  const [checkedState, setCheckedState] = useState<Record<string, boolean>>({});
  const [notesState, setNotesState] = useState<Record<string, string>>({});
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeSectionId, setActiveSectionId] = useState<string>('scholar');
  const [isMenuDrawerOpen, setIsMenuDrawerOpen] = useState<boolean>(false);
  const [menuViewMode, setMenuViewMode] = useState<'nav' | 'settings'>('nav');
  
  // Theme, Font & Layout Style states
  const [currentTheme, setCurrentTheme] = useState<'classic-bw' | 'warm-gold' | 'midnight'>('classic-bw');
  const [currentFont, setCurrentFont] = useState<'tiro' | 'anek'>('tiro');
  const [currentLayoutStyle, setCurrentLayoutStyle] = useState<LayoutStyle>('standard');

  const [exportModalOpen, setExportModalOpen] = useState<boolean>(false);
  const [isExportingPDF, setIsExportingPDF] = useState<boolean>(false);
  const [pdfSuccessMessage, setPdfSuccessMessage] = useState<string | null>(null);
  const [isAddSectionModalOpen, setIsAddSectionModalOpen] = useState<boolean>(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState<boolean>(false);

  // Triple click delete & edit unlock states
  const [unlockedSectionDeletes, setUnlockedSectionDeletes] = useState<Record<string, boolean>>({});
  const [unlockedGoalDeletes, setUnlockedGoalDeletes] = useState<Record<string, boolean>>({});
  const [confirmGoalDeleteId, setConfirmGoalDeleteId] = useState<string | null>(null);
  const [confirmSectionDeleteId, setConfirmSectionDeleteId] = useState<string | null>(null);
  
  const [editingGoalId, setEditingGoalId] = useState<string | null>(null);
  const [editingGoalText, setEditingGoalText] = useState<string>('');
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [editingSectionTitle, setEditingSectionTitle] = useState<string>('');
  const [editingSectionIntro, setEditingSectionIntro] = useState<string>('');

  // Add Goal / Stream to Section state & Edge style state
  const [addingGoalSectionId, setAddingGoalSectionId] = useState<string | null>(null);
  const [newGoalInputText, setNewGoalInputText] = useState<string>('');
  const [edgeSelectorSectionId, setEdgeSelectorSectionId] = useState<string | null>(null);

  const clickCountsRef = React.useRef<Record<string, { count: number; timer: any }>>({});

  const handleTripleClick = (id: string, isGoal: boolean) => {
    const record = clickCountsRef.current[id] || { count: 0, timer: null };
    if (record.timer) clearTimeout(record.timer);

    record.count += 1;

    if (record.count >= 3) {
      if (isGoal) {
        setUnlockedGoalDeletes(prev => ({ ...prev, [id]: !prev[id] }));
      } else {
        setUnlockedSectionDeletes(prev => ({ ...prev, [id]: !prev[id] }));
      }
      record.count = 0;
    } else {
      record.timer = setTimeout(() => {
        record.count = 0;
      }, 1600);
    }

    clickCountsRef.current[id] = record;
  };

  // New Section Form State
  const [newSecTitle, setNewSecTitle] = useState<string>('');
  const [newSecIntro, setNewSecIntro] = useState<string>('');
  const [newSecStepInput, setNewSecStepInput] = useState<string>('');
  const [newSecSteps, setNewSecSteps] = useState<string[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedCustomSecs = localStorage.getItem('mdmm-custom-sections');
      let loadedSections = initialSections;
      if (savedCustomSecs) {
        const parsed = JSON.parse(savedCustomSecs);
        if (Array.isArray(parsed) && parsed.length > 0) {
          loadedSections = parsed;
        }
      }
      setSections(loadedSections);

      const savedTheme = localStorage.getItem('mdmm-theme') as any;
      if (savedTheme) setCurrentTheme(savedTheme);

      const savedFont = localStorage.getItem('mdmm-font') as any;
      if (savedFont) setCurrentFont(savedFont);

      const savedLayout = localStorage.getItem('mdmm-layout-style') as LayoutStyle | null;
      if (savedLayout && ['standard', 'royal', 'modern', 'journal'].includes(savedLayout)) {
        setCurrentLayoutStyle(savedLayout);
      }

      const loadedChecks: Record<string, boolean> = {};
      const loadedNotes: Record<string, string> = {};

      loadedSections.forEach(sec => {
        sec.goals.forEach(g => {
          const val = localStorage.getItem('mdmm-' + g.id);
          if (val === '1') loadedChecks[g.id] = true;
        });
        const noteVal = localStorage.getItem('mdmm-note-' + sec.id);
        if (noteVal) loadedNotes[sec.id] = noteVal;
      });

      setCheckedState(loadedChecks);
      setNotesState(loadedNotes);
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Update active section highlight as user scrolls naturally through all serial sections
  useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSectionId(entry.target.id);
          }
        });
      },
      { rootMargin: '-15% 0px -65% 0px' }
    );

    sections.forEach((sec) => {
      const el = document.getElementById(sec.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sections]);

  // Lock body scroll when mobile full-screen menu drawer is open
  useEffect(() => {
    if (isMenuDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuDrawerOpen]);

  const saveCustomSectionsToStorage = (updatedSections: SectionData[]) => {
    setSections(updatedSections);
    localStorage.setItem('mdmm-custom-sections', JSON.stringify(updatedSections));
  };

  const handleThemeChange = (theme: 'classic-bw' | 'warm-gold' | 'midnight') => {
    setCurrentTheme(theme);
    localStorage.setItem('mdmm-theme', theme);
  };

  const handleFontChange = (font: 'tiro' | 'anek') => {
    setCurrentFont(font);
    localStorage.setItem('mdmm-font', font);
  };

  const handleLayoutStyleChange = (style: LayoutStyle) => {
    setCurrentLayoutStyle(style);
    localStorage.setItem('mdmm-layout-style', style);
  };

  const toBengaliNumber = (num: number | string): string => {
    const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return String(num).replace(/[0-9]/g, (d) => bnDigits[parseInt(d, 10)]);
  };

  const handleCheckboxChange = (id: string, checked: boolean) => {
    const updated = { ...checkedState, [id]: checked };
    setCheckedState(updated);
    localStorage.setItem('mdmm-' + id, checked ? '1' : '0');
  };

  const handleNoteChange = (sectionId: string, value: string) => {
    const updated = { ...notesState, [sectionId]: value };
    setNotesState(updated);
    localStorage.setItem('mdmm-note-' + sectionId, value);
  };

  const handleAddStepToNewSec = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSecStepInput.trim()) return;
    setNewSecSteps([...newSecSteps, newSecStepInput.trim()]);
    setNewSecStepInput('');
  };

  const handleRemoveStepFromNewSec = (index: number) => {
    setNewSecSteps(newSecSteps.filter((_, i) => i !== index));
  };

  const handleAddSection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSecTitle.trim()) return;

    const id = 'custom-' + Date.now();
    const kickerNum = String(sections.length + 1).padStart(2, '0');
    
    const goalsList: Goal[] = newSecSteps.length > 0 
      ? newSecSteps.map((txt, idx) => ({ id: `g-${Date.now()}-${idx}`, text: txt }))
      : [{ id: 'goal-' + Date.now(), text: 'আপনার প্রথম ধাপ বা লক্ষ্য এখানে যুক্ত করুন।' }];

    const newSection: SectionData = {
      id,
      kicker: `${kickerNum} / Custom Mission`,
      title: newSecTitle.trim(),
      shortName: newSecTitle.trim().split(' ')[0] || 'নতুন লক্ষ্য',
      intro: newSecIntro.trim() || 'এই বিভাগের নতুন লক্ষ্য ও উদ্দেশ্যসমূহ।',
      isCustom: true,
      goals: goalsList
    };

    const updated = [...sections, newSection];
    saveCustomSectionsToStorage(updated);
    setNewSecTitle('');
    setNewSecIntro('');
    setNewSecSteps([]);
    setNewSecStepInput('');
    setIsAddSectionModalOpen(false);
    setActiveSectionId(id);
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const scrollToSection = (sectionId: string) => {
    setActiveSectionId(sectionId);
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleDeleteSection = (sectionId: string) => {
    const updated = sections.filter(s => s.id !== sectionId);
    saveCustomSectionsToStorage(updated);
    if (activeSectionId === sectionId && updated.length > 0) {
      setActiveSectionId(updated[0].id);
    }
    setConfirmSectionDeleteId(null);
    setUnlockedSectionDeletes(prev => ({ ...prev, [sectionId]: false }));
  };

  const handleDeleteGoal = (sectionId: string, goalId: string) => {
    const updated = sections.map(sec => {
      if (sec.id === sectionId) {
        return {
          ...sec,
          goals: sec.goals.filter(g => g.id !== goalId)
        };
      }
      return sec;
    });
    saveCustomSectionsToStorage(updated);
    setConfirmGoalDeleteId(null);
    setUnlockedGoalDeletes(prev => ({ ...prev, [goalId]: false }));
  };

  const handleEditGoal = (sectionId: string, goalId: string, newText: string) => {
    const updated = sections.map(sec => {
      if (sec.id === sectionId) {
        return {
          ...sec,
          goals: sec.goals.map(g => g.id === goalId ? { ...g, text: newText } : g)
        };
      }
      return sec;
    });
    saveCustomSectionsToStorage(updated);
  };

  const handleEditSection = (sectionId: string, newTitle: string, newIntro: string) => {
    const updated = sections.map(sec => {
      if (sec.id === sectionId) {
        return {
          ...sec,
          title: newTitle,
          intro: newIntro
        };
      }
      return sec;
    });
    saveCustomSectionsToStorage(updated);
  };

  const handleAddGoal = (sectionId: string, text: string) => {
    if (!text.trim()) return;
    const newGoal: Goal = {
      id: `g-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      text: text.trim()
    };
    const updated = sections.map(sec => {
      if (sec.id === sectionId) {
        return {
          ...sec,
          goals: [...sec.goals, newGoal]
        };
      }
      return sec;
    });
    saveCustomSectionsToStorage(updated);
  };

  const handleUpdateEdgeStyle = (sectionId: string, style: 'default' | 'gold' | 'cyan' | 'double' | 'dashed') => {
    const updated = sections.map(sec => {
      if (sec.id === sectionId) {
        return {
          ...sec,
          edgeStyle: style
        };
      }
      return sec;
    });
    saveCustomSectionsToStorage(updated);
    setEdgeSelectorSectionId(null);
  };

  const getSectionEdgeClass = (edgeStyle?: string) => {
    switch (edgeStyle) {
      case 'gold':
        return 'border-2 border-amber-500 shadow-[0_0_28px_rgba(245,158,11,0.25)] ring-1 ring-amber-400/80 rounded-3xl';
      case 'cyan':
        return 'border-2 border-sky-400 shadow-[0_0_28px_rgba(56,189,248,0.3)] ring-1 ring-sky-400/80 rounded-3xl';
      case 'double':
        return 'border-4 border-double border-amber-400/90 shadow-xl rounded-3xl';
      case 'dashed':
        return 'border-2 border-dashed border-emerald-500/80 shadow-md rounded-3xl';
      default:
        return '';
    }
  };

  const handleReset = () => {
    localStorage.clear();
    setSections(initialSections);
    setCheckedState({});
    setNotesState({});
    setIsResetConfirmOpen(false);
  };

  const handleDownloadPDF = async () => {
    try {
      setIsExportingPDF(true);
      setPdfSuccessMessage(null);
      await generateAndDownloadPDF({
        sections,
        checkedState,
        currentTheme,
        currentLayoutStyle,
        currentFont,
        overallPercent,
        totalGoalsCount,
        doneGoalsCount
      });
      setPdfSuccessMessage('পিডিএফ ফাইলটি সফলভাবে তৈরি ও ডাউনলোড হয়েছে!');
      setTimeout(() => {
        setPdfSuccessMessage(null);
        setExportModalOpen(false);
      }, 2500);
    } catch (error) {
      console.error('PDF Export Error:', error);
      alert('পিডিএফ তৈরিতে সমস্যা হয়েছে। আপনি সরাসরি প্রিন্ট অপশনটিও ব্যবহার করতে পারেন।');
    } finally {
      setIsExportingPDF(false);
    }
  };

  // Stats calculation
  const totalGoalsCount = useMemo(() => {
    return sections.reduce((acc, s) => acc + s.goals.length, 0);
  }, [sections]);

  const doneGoalsCount = useMemo(() => {
    return Object.values(checkedState).filter(Boolean).length;
  }, [checkedState]);

  const overallPercent = totalGoalsCount > 0 ? Math.round((doneGoalsCount / totalGoalsCount) * 100) : 0;

  // Filter query matching
  const query = searchQuery.trim().toLowerCase();

  const getSectionPercent = (sectionGoals: Goal[]) => {
    if (sectionGoals.length === 0) return 0;
    const done = sectionGoals.filter(g => checkedState[g.id]).length;
    return Math.round((done / sectionGoals.length) * 100);
  };

  // Theme styling definitions - dynamic theme effects for main goals with zero black effects
  const themeClasses = {
    'classic-bw': {
      bg: 'bg-[#ffffff] text-[#111111]',
      headerBg: 'bg-[#0a0a0a] text-white border-neutral-800',
      heroBg: 'bg-[#111111] text-white',
      cardBg: 'bg-white border-neutral-300 text-neutral-900',
      drawerBg: 'bg-[#171717] text-white border-neutral-800',
      modalBg: 'bg-white text-neutral-900 border-neutral-300',
      inputBg: 'bg-neutral-50 text-neutral-900 border-neutral-300',
      fabBg: 'bg-neutral-900 text-white border-neutral-700 hover:bg-neutral-800',
      fabShadow: 'shadow-[0_8px_25px_rgba(71,85,105,0.25)]',
      progressBarBg: 'bg-neutral-200',
      progressBarFill: 'bg-neutral-900',
      accentBtn: 'bg-neutral-900 text-white hover:bg-neutral-800',
      secondaryBtn: 'bg-neutral-200 text-neutral-800 hover:bg-neutral-300',
      selectedItemBg: 'bg-neutral-100 text-neutral-900 shadow-md font-semibold border border-neutral-300',
      menuBtn: 'bg-white text-black hover:bg-neutral-200 border border-neutral-300 font-bold',
      drawerActiveTab: 'border-white text-white',
      drawerLinkActive: 'bg-neutral-100 text-neutral-950 font-bold border-neutral-300 shadow-md ring-1 ring-neutral-300',
      drawerLink: 'bg-neutral-900 text-neutral-300 border-neutral-800 hover:border-neutral-500 hover:bg-neutral-800',
      contentsHeader: 'text-neutral-500',
      // Main goal effect in contents index - clean silver/slate highlight, NO black
      contentsSelected: 'bg-gradient-to-r from-neutral-100 to-neutral-50 text-neutral-900 border-l-4 border-l-neutral-800 shadow-[0_4px_16px_rgba(71,85,105,0.12)] font-bold border border-neutral-300 ring-1 ring-neutral-300/80',
      contentsNormal: 'text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 border border-transparent hover:border-neutral-200',
      // Main goal card on page - clean refined silver effect, NO black
      sectionActiveEffect: 'ring-2 ring-neutral-400 shadow-[0_8px_30px_rgba(71,85,105,0.14)] border-neutral-400',
      sectionNormalEffect: 'shadow-[0_4px_20px_rgba(71,85,105,0.06)] border-neutral-200/90',
      sectionHeaderActive: 'bg-gradient-to-r from-neutral-100/70 via-neutral-50/30 to-transparent border-b-neutral-300',
      sectionHeaderNormal: 'border-b-neutral-200',
      sectionTopAccent: 'bg-gradient-to-r from-neutral-300 via-neutral-600 to-neutral-300',
      activePill: 'bg-neutral-200 text-neutral-800 border border-neutral-400/50',
      selectionClass: 'selection:bg-neutral-800 selection:text-white'
    },
    'warm-gold': {
      bg: 'bg-[#fdfbf7] text-[#1c1917]',
      headerBg: 'bg-[#292524] text-[#fef3c7] border-stone-700',
      heroBg: 'bg-[#1c1917] text-[#fef3c7]',
      cardBg: 'bg-white border-stone-300 text-stone-900',
      drawerBg: 'bg-[#1c1917] text-amber-100 border-stone-700',
      modalBg: 'bg-[#fffbf0] text-stone-900 border-stone-300',
      inputBg: 'bg-white text-stone-900 border-stone-300',
      fabBg: 'bg-[#b45309] text-white border-amber-600 hover:bg-[#92400e]',
      fabShadow: 'shadow-[0_8px_25px_rgba(217,119,6,0.35)]',
      progressBarBg: 'bg-stone-200',
      progressBarFill: 'bg-[#b45309]',
      accentBtn: 'bg-[#b45309] text-white hover:bg-[#92400e]',
      secondaryBtn: 'bg-stone-200 text-stone-800 hover:bg-stone-300',
      selectedItemBg: 'bg-amber-100 text-amber-950 shadow-md font-semibold border border-amber-300',
      menuBtn: 'bg-[#b45309] text-amber-50 hover:bg-[#92400e] border border-amber-400/50 font-bold shadow-md',
      drawerActiveTab: 'border-amber-400 text-amber-300',
      drawerLinkActive: 'bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold border-amber-300 shadow-[0_4px_16px_rgba(217,119,6,0.35)]',
      drawerLink: 'bg-stone-900/80 text-amber-100/90 border-amber-500/20 hover:border-amber-400 hover:bg-stone-800',
      contentsHeader: 'text-amber-600 font-bold',
      // Main goal effect in contents index - warm golden radiant glow, NO black
      contentsSelected: 'bg-gradient-to-r from-amber-100 to-amber-50 text-amber-950 border-l-4 border-l-amber-600 shadow-[0_4px_20px_rgba(217,119,6,0.22)] font-bold border border-amber-300 ring-1 ring-amber-400/50',
      contentsNormal: 'text-stone-800 hover:bg-amber-100/70 hover:text-stone-950 border border-transparent hover:border-amber-300',
      // Main goal card on page - vibrant golden amber effect, NO black
      sectionActiveEffect: 'ring-2 ring-amber-500/70 shadow-[0_8px_32px_rgba(217,119,6,0.20)] border-amber-400',
      sectionNormalEffect: 'shadow-[0_4px_20px_rgba(217,119,6,0.07)] border-stone-200',
      sectionHeaderActive: 'bg-gradient-to-r from-amber-100/60 via-amber-50/20 to-transparent border-b-amber-300/80',
      sectionHeaderNormal: 'border-b-stone-200',
      sectionTopAccent: 'bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400',
      activePill: 'bg-amber-100 text-amber-900 border border-amber-400/60 shadow-xs',
      selectionClass: 'selection:bg-amber-600 selection:text-white'
    },
    'midnight': {
      bg: 'bg-[#090d16] text-[#e2e8f0]',
      headerBg: 'bg-[#030712] text-white border-slate-800',
      heroBg: 'bg-[#0f172a] text-white',
      cardBg: 'bg-[#111827] border-slate-700 text-slate-100',
      drawerBg: 'bg-[#0b1120] text-slate-100 border-slate-800',
      modalBg: 'bg-[#111827] text-slate-100 border-slate-700',
      inputBg: 'bg-[#1f2937] text-slate-100 border-slate-600',
      fabBg: 'bg-[#38bdf8] text-slate-950 border-sky-300 hover:bg-[#7dd3fc]',
      fabShadow: 'shadow-[0_8px_25px_rgba(56,189,248,0.45)]',
      progressBarBg: 'bg-slate-800',
      progressBarFill: 'bg-[#38bdf8]',
      accentBtn: 'bg-[#38bdf8] text-slate-950 hover:bg-[#7dd3fc]',
      secondaryBtn: 'bg-slate-800 text-slate-200 hover:bg-slate-700',
      selectedItemBg: 'bg-sky-950/80 text-sky-200 shadow-md font-semibold border border-sky-400/50',
      menuBtn: 'bg-[#38bdf8] text-slate-950 hover:bg-[#7dd3fc] border border-sky-300 font-bold shadow-md',
      drawerActiveTab: 'border-sky-400 text-sky-300',
      drawerLinkActive: 'bg-[#38bdf8] text-slate-950 font-bold border-sky-200 shadow-[0_0_18px_rgba(56,189,248,0.5)]',
      drawerLink: 'bg-slate-900/90 text-slate-200 border-slate-700 hover:border-sky-400 hover:bg-slate-800',
      contentsHeader: 'text-sky-400 font-bold',
      // Main goal effect in contents index - electric neon sky/cyan glow, NO black
      contentsSelected: 'bg-gradient-to-r from-sky-950/90 to-slate-900/90 text-sky-200 border-l-4 border-l-sky-400 shadow-[0_0_24px_rgba(56,189,248,0.28)] font-bold border border-sky-500/40 ring-1 ring-sky-400/40',
      contentsNormal: 'text-slate-300 hover:bg-slate-800/70 hover:text-white border border-transparent hover:border-slate-700',
      // Main goal card on page - electric cyan sky effect, NO black
      sectionActiveEffect: 'ring-2 ring-sky-400/70 shadow-[0_8px_35px_rgba(56,189,248,0.25)] border-sky-400/80',
      sectionNormalEffect: 'shadow-[0_4px_20px_rgba(15,23,42,0.5)] border-slate-700/80',
      sectionHeaderActive: 'bg-gradient-to-r from-sky-950/60 via-slate-900/30 to-transparent border-b-sky-500/50',
      sectionHeaderNormal: 'border-b-slate-700',
      sectionTopAccent: 'bg-gradient-to-r from-transparent via-sky-400 to-transparent',
      activePill: 'bg-sky-950/90 text-sky-300 border border-sky-400/60 shadow-[0_0_12px_rgba(56,189,248,0.3)]',
      selectionClass: 'selection:bg-sky-500 selection:text-slate-950'
    }
  };

  const activeTheme = themeClasses[currentTheme];
  const fontClass = currentFont === 'tiro' ? 'font-[Tiro_Bangla,serif]' : 'font-[Anek_Bangla,sans-serif]';

  return (
    <div className={`min-h-screen ${activeTheme.bg} ${fontClass} ${activeTheme.selectionClass} transition-colors duration-300`}>
      {/* Top Navbar */}
      <header className={`sticky top-0 z-45 border-b backdrop-blur-md ${activeTheme.headerBg}`}>
        <div className="max-w-[1180px] mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
          <a href="#home" className="group">
            <BrandLogo 
              layoutStyle={currentLayoutStyle} 
              theme={currentTheme} 
              size="md" 
            />
          </a>

          <div className="flex items-center gap-2 shrink-0">
            <button 
              className={`font-sans font-semibold text-xs px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl shadow transition-all flex items-center gap-1.5 cursor-pointer ${activeTheme.menuBtn}`}
              onClick={() => { setIsMenuDrawerOpen(true); setMenuViewMode('settings'); }}
              aria-label="সেটিংস ও ডিজাইন"
              title="সেটিংস ও ডিজাইন"
            >
              <Settings size={15} />
              <span className="hidden xs:inline">সেটিংস</span>
            </button>
            <button 
              className={`font-sans font-semibold text-xs px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl shadow transition-all flex items-center gap-1.5 cursor-pointer ${activeTheme.menuBtn}`}
              onClick={() => { setIsMenuDrawerOpen(!isMenuDrawerOpen); setMenuViewMode('nav'); }}
              aria-label="Toggle menu"
            >
              {isMenuDrawerOpen ? <X size={16} /> : <Menu size={16} />}
              <span>মেনু</span>
            </button>
          </div>
        </div>
      </header>

      {/* Right-Side Sliding Board (No Pop-up) */}
      {isMenuDrawerOpen && (
        <div 
          className="fixed inset-0 z-50 overflow-hidden"
          role="dialog"
          aria-modal="true"
        >
          {/* Backdrop overlay */}
          <div 
            onClick={() => setIsMenuDrawerOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity cursor-pointer"
          />

          {/* Sliding Board Pinned to the Right Edge */}
          <aside 
            className={`fixed top-0 right-0 bottom-0 h-full w-full sm:w-[420px] md:w-[460px] z-10 shadow-2xl flex flex-col overflow-hidden border-l border-current/15 transition-all duration-300 animate-slideInRight ${activeTheme.drawerBg}`}
          >
            {/* Top Fixed Header */}
            <div className="shrink-0 border-b border-current/10 px-5 py-4 backdrop-blur-md bg-inherit/90 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <BrandEmblem 
                  size={34} 
                  layoutStyle={currentLayoutStyle} 
                  theme={currentTheme} 
                />
                <span className="font-['Cormorant_Garamond',serif] text-xl font-bold tracking-wide">
                  Saiful Islam Rifat
                </span>
              </div>

              <button
                onClick={() => setIsMenuDrawerOpen(false)}
                className="w-8 h-8 rounded-full border border-current/20 bg-current/5 hover:bg-current/15 flex items-center justify-center transition-all cursor-pointer"
                aria-label="Close menu"
                title="বন্ধ করুন"
              >
                <X size={16} />
              </button>
            </div>

            {/* Segmented Switcher Tabs */}
            <div className="shrink-0 px-5 py-3 border-b border-current/10 bg-inherit/50">
              <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-black/20 border border-current/10 font-sans text-xs font-medium">
                <button
                  onClick={() => setMenuViewMode('nav')}
                  className={`py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    menuViewMode === 'nav' 
                      ? `${activeTheme.menuBtn} shadow-xs font-semibold` 
                      : 'opacity-70 hover:opacity-100 hover:bg-current/5'
                  }`}
                >
                  <BookOpen size={14} />
                  <span>মূল লক্ষ্যসমূহ ({toBengaliNumber(sections.length)})</span>
                </button>
                <button
                  onClick={() => setMenuViewMode('settings')}
                  className={`py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    menuViewMode === 'settings' 
                      ? `${activeTheme.menuBtn} shadow-xs font-semibold` 
                      : 'opacity-70 hover:opacity-100 hover:bg-current/5'
                  }`}
                >
                  <Settings size={14} />
                  <span>ডিজাইন ও সেটিংস</span>
                </button>
              </div>
            </div>

            {/* Scrollable Content Container */}
            <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-5 py-6 space-y-6">
              {menuViewMode === 'nav' ? (
                <div className="space-y-3 font-sans">
                  <div className="text-[11px] uppercase tracking-wider font-semibold opacity-60 px-1 mb-2">
                    সকল লক্ষ্যক্ষেত্র ও অধ্যায়
                  </div>

                  {sections.map((s, idx) => {
                    const isCurrentActive = activeSectionId === s.id;
                    const numStr = String(idx + 1).padStart(2, '0');
                    const totalSecGoals = s.goals.length;
                    const doneSecGoals = s.goals.filter(g => checkedState[g.id]).length;
                    const secPercent = totalSecGoals > 0 ? Math.round((doneSecGoals / totalSecGoals) * 100) : 0;

                    return (
                      <button
                        type="button"
                        key={s.id}
                        onClick={() => {
                          setIsMenuDrawerOpen(false);
                          setTimeout(() => {
                            scrollToSection(s.id);
                          }, 80);
                        }}
                        className={`w-full text-left p-3.5 rounded-xl border transition-all text-xs group cursor-pointer flex items-center justify-between gap-3 ${
                          isCurrentActive ? activeTheme.drawerLinkActive : activeTheme.drawerLink
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <span className="font-mono text-[11px] opacity-70 shrink-0">
                            {toBengaliNumber(numStr)}
                          </span>
                          <div className="truncate">
                            <div className="font-semibold text-sm truncate">
                              {s.title}
                            </div>
                            <div className="text-[10px] opacity-70 mt-0.5">
                              {toBengaliNumber(doneSecGoals)}/{toBengaliNumber(totalSecGoals)}টি সম্পন্ন ({toBengaliNumber(secPercent)}%)
                            </div>
                          </div>
                        </div>
                        <ChevronRight size={15} className="opacity-60 group-hover:translate-x-1 transition-transform shrink-0" />
                      </button>
                    );
                  })}

                  <div className="pt-2">
                    <button
                      onClick={() => {
                        setIsMenuDrawerOpen(false);
                        setIsAddSectionModalOpen(true);
                      }}
                      className="w-full py-3 px-4 rounded-xl border border-dashed border-current/25 hover:border-current/50 bg-current/5 hover:bg-current/10 font-sans font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <Plus size={15} />
                      <span>নতুন মূল লক্ষ্য যোগ করুন</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6 font-sans">
                  {/* Website Design Style Selector */}
                  <div>
                    <div className="text-[11px] uppercase tracking-wider font-semibold opacity-60 mb-2.5 flex items-center gap-1.5">
                      <Layout size={14} />
                      <span>ওয়েবসাইট ডিজাইন লেআউট</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <button
                        onClick={() => handleLayoutStyleChange('standard')}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                          currentLayoutStyle === 'standard' 
                            ? 'border-current bg-current/15 font-semibold' 
                            : 'border-current/15 bg-current/5 opacity-80 hover:opacity-100'
                        }`}
                      >
                        <div>
                          <div className="text-xs font-bold">এডিটরিয়াল মিনিমাল</div>
                          <div className="text-[10px] opacity-70">ক্লীন ও পরিপাটি</div>
                        </div>
                        {currentLayoutStyle === 'standard' && <Check size={14} className="text-emerald-400 shrink-0" />}
                      </button>

                      <button
                        onClick={() => handleLayoutStyleChange('royal')}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                          currentLayoutStyle === 'royal' 
                            ? 'border-amber-400 bg-amber-500/15 font-semibold text-amber-200' 
                            : 'border-current/15 bg-current/5 opacity-80 hover:opacity-100'
                        }`}
                      >
                        <div>
                          <div className="text-xs font-bold">রয়্যাল হেরিটেজ</div>
                          <div className="text-[10px] opacity-70">দ্বীনি আভিজাত্য</div>
                        </div>
                        {currentLayoutStyle === 'royal' && <Check size={14} className="text-amber-400 shrink-0" />}
                      </button>

                      <button
                        onClick={() => handleLayoutStyleChange('modern')}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                          currentLayoutStyle === 'modern' 
                            ? 'border-sky-400 bg-sky-500/15 font-semibold text-sky-200' 
                            : 'border-current/15 bg-current/5 opacity-80 hover:opacity-100'
                        }`}
                      >
                        <div>
                          <div className="text-xs font-bold">লাক্সারি গ্লাস</div>
                          <div className="text-[10px] opacity-70">মডার্ন স্টুডিও</div>
                        </div>
                        {currentLayoutStyle === 'modern' && <Check size={14} className="text-sky-300 shrink-0" />}
                      </button>

                      <button
                        onClick={() => handleLayoutStyleChange('journal')}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                          currentLayoutStyle === 'journal' 
                            ? 'border-emerald-400 bg-emerald-500/15 font-semibold text-emerald-200' 
                            : 'border-current/15 bg-current/5 opacity-80 hover:opacity-100'
                        }`}
                      >
                        <div>
                          <div className="text-xs font-bold">মাকতাবা ক্লাসিক</div>
                          <div className="text-[10px] opacity-70">পাণ্ডুলিপি নোটবুক</div>
                        </div>
                        {currentLayoutStyle === 'journal' && <Check size={14} className="text-emerald-300 shrink-0" />}
                      </button>
                    </div>
                  </div>

                  {/* Theme Selector */}
                  <div>
                    <div className="text-[11px] uppercase tracking-wider font-semibold opacity-60 mb-2.5 flex items-center gap-1.5">
                      <Palette size={14} />
                      <span>কালার স্কিম (Theme)</span>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => handleThemeChange('classic-bw')}
                        className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer text-xs ${
                          currentTheme === 'classic-bw' 
                            ? 'border-white bg-white/10 font-bold' 
                            : 'border-current/15 bg-current/5 opacity-75 hover:opacity-100'
                        }`}
                      >
                        <span className="block text-[11px]">ক্লাসিক</span>
                      </button>

                      <button
                        onClick={() => handleThemeChange('warm-gold')}
                        className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer text-xs ${
                          currentTheme === 'warm-gold' 
                            ? 'border-amber-400 bg-amber-500/20 text-amber-200 font-bold' 
                            : 'border-current/15 bg-current/5 opacity-75 hover:opacity-100'
                        }`}
                      >
                        <span className="block text-[11px]">ওয়ার্ম গোল্ড</span>
                      </button>

                      <button
                        onClick={() => handleThemeChange('midnight')}
                        className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer text-xs ${
                          currentTheme === 'midnight' 
                            ? 'border-sky-400 bg-sky-500/20 text-sky-200 font-bold' 
                            : 'border-current/15 bg-current/5 opacity-75 hover:opacity-100'
                        }`}
                      >
                        <span className="block text-[11px]">মিডনাইট</span>
                      </button>
                    </div>
                  </div>

                  {/* Font Selector */}
                  <div>
                    <div className="text-[11px] uppercase tracking-wider font-semibold opacity-60 mb-2.5 flex items-center gap-1.5">
                      <Type size={14} />
                      <span>বাংলা ফন্ট (Font Style)</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleFontChange('tiro')}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer font-[Tiro_Bangla,serif] ${
                          currentFont === 'tiro' 
                            ? 'border-current bg-current/15 font-bold' 
                            : 'border-current/15 bg-current/5 opacity-75 hover:opacity-100'
                        }`}
                      >
                        <div className="text-xs">টাইরো বাংলা</div>
                        <div className="text-[10px] font-sans opacity-70">সেরিফ ক্লাসিক</div>
                      </button>

                      <button
                        onClick={() => handleFontChange('anek')}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer font-[Anek_Bangla,sans-serif] ${
                          currentFont === 'anek' 
                            ? 'border-current bg-current/15 font-bold' 
                            : 'border-current/15 bg-current/5 opacity-75 hover:opacity-100'
                        }`}
                      >
                        <div className="text-xs">অনেক বাংলা</div>
                        <div className="text-[10px] opacity-70">ক্লীন সান্স-সেরিফ</div>
                      </button>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="pt-2 border-t border-current/10">
                    <div className="text-[11px] uppercase tracking-wider font-semibold opacity-60 mb-2.5">
                      দ্রুত অ্যাকশন
                    </div>

                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => {
                          setIsMenuDrawerOpen(false);
                          setExportModalOpen(true);
                        }}
                        className="w-full p-3 rounded-xl border border-current/15 bg-current/5 hover:bg-current/10 text-left transition-all cursor-pointer flex items-center justify-between text-xs font-semibold"
                      >
                        <div className="flex items-center gap-2">
                          <FileDown size={15} className="text-amber-400" />
                          <span>PDF ডাউনলোড ও প্রিন্ট</span>
                        </div>
                        <ChevronRight size={14} className="opacity-60" />
                      </button>

                      <button
                        onClick={() => {
                          setIsMenuDrawerOpen(false);
                          setIsResetConfirmOpen(true);
                        }}
                        className="w-full p-3 rounded-xl border border-red-500/20 bg-red-500/10 hover:bg-red-500/20 text-left transition-all cursor-pointer flex items-center justify-between text-xs font-semibold text-red-300"
                      >
                        <div className="flex items-center gap-2">
                          <RotateCcw size={15} className="text-red-400" />
                          <span>অগ্রগতি রিসেট করুন</span>
                        </div>
                        <ChevronRight size={14} className="opacity-60" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Minimal Footer */}
            <div className="shrink-0 border-t border-current/10 px-5 py-3 bg-inherit/95 text-[11px] opacity-60 flex items-center justify-between font-sans">
              <span>Saiful Islam Rifat</span>
              <span>{currentLayoutStyle} · {currentTheme}</span>
            </div>
          </aside>
        </div>
      )}

      {/* Hero Section */}
      <section id="home" className={`relative overflow-hidden ${activeTheme.heroBg} ${
        currentLayoutStyle === 'royal' ? 'border-y border-amber-500/30' : currentLayoutStyle === 'modern' ? 'border-y border-white/10' : ''
      }`}>
        {/* Style Specific Atmospheric Backgrounds */}
        {currentLayoutStyle === 'royal' ? (
          <>
            <div className="absolute inset-0 bg-gradient-to-b from-amber-500/[0.05] via-amber-950/[0.02] to-transparent pointer-events-none" />
            <div className="absolute w-[360px] h-[360px] bg-amber-500/10 rounded-full blur-3xl -top-24 -right-24 pointer-events-none" />
          </>
        ) : currentLayoutStyle === 'modern' ? (
          <>
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-sky-400 to-transparent opacity-80" />
            <div className="absolute w-[400px] h-[400px] bg-sky-500/10 rounded-full blur-3xl -top-28 -right-28 pointer-events-none" />
          </>
        ) : currentLayoutStyle === 'journal' ? (
          <>
            <div className="absolute inset-0 bg-gradient-to-b from-stone-500/[0.04] to-transparent pointer-events-none" />
          </>
        ) : (
          <div className="absolute w-[320px] h-[320px] bg-current/[0.02] rounded-full blur-3xl -right-20 -top-20 pointer-events-none" />
        )}

        <div className="max-w-[1180px] mx-auto px-4 sm:px-6 py-20 sm:py-24 relative z-10">
          {/* Hero Kicker */}
          {currentLayoutStyle === 'royal' ? (
            <div className="font-serif text-xs uppercase tracking-[0.2em] text-amber-400 font-bold mb-3 flex items-center gap-2">
              <Crown size={15} /> <span>বিসমিল্লাহির রাহমানির রাহিম · উচ্চতর জীবন লক্ষ্য ও গবেষণা রূপরেখা</span>
            </div>
          ) : currentLayoutStyle === 'modern' ? (
            <div className="font-sans text-xs uppercase tracking-[0.2em] text-sky-400 font-semibold mb-3 flex items-center gap-2">
              <Sparkles size={14} className="text-sky-300" />
              <span>CORE VISION & LIFELONG ROADMAP</span>
            </div>
          ) : currentLayoutStyle === 'journal' ? (
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-current/5 border border-current/15 rounded-lg text-xs font-sans font-medium mb-3">
              <BookOpen size={14} className="text-emerald-400" />
              <span>মাকতাবা ও ব্যক্তিগত সংকল্পপত্র · LIFELONG ARCHIVE</span>
            </div>
          ) : (
            <div className="font-sans text-xs uppercase tracking-[0.2em] opacity-80 mb-3 flex items-center gap-2">
              Personal Vision • Lifelong Roadmap & Mission
            </div>
          )}

          <h1 className="text-3xl sm:text-4xl md:text-6xl font-normal leading-[1.12] mb-5 tracking-tight">
            My Dream,<br />
            <span className="italic opacity-90">
              {currentLayoutStyle === 'royal' ? 'My Royal Calling & Noble Pursuit.' : currentLayoutStyle === 'modern' ? 'My Core Architecture.' : currentLayoutStyle === 'journal' ? 'My Written Vows & Archive.' : 'My Mission.'}
            </span>
          </h1>

          <p className="max-w-[720px] text-sm sm:text-base md:text-lg mb-8 leading-relaxed opacity-90">
            জ্ঞান, গবেষণা, সাহিত্য, কুরআন তিলাওয়াত ও সৃজনশীলতার পথে আমার স্বপ্ন, লক্ষ্য এবং অর্জন করতে চাওয়া যোগ্যতাসমূহের ব্যক্তিগত নকশা। ডান পাশের ফ্লোটিং প্লাস আইকনে ক্লিক করে নতুন লক্ষ্য ও ধাপ যুক্ত করুন।
          </p>

          <div className="flex flex-wrap gap-4 items-center font-sans">
            <a 
              href="#contents" 
              className={`${activeTheme.accentBtn} font-semibold text-xs tracking-wide px-5 py-2.5 rounded-xl shadow-md transition-all flex items-center justify-center cursor-pointer h-10 min-w-[140px]`}
            >
              {currentLayoutStyle === 'royal' && <Crown size={14} className="mr-1.5 text-amber-300" />}
              {currentLayoutStyle === 'modern' && <Sparkles size={14} className="mr-1.5" />}
              {currentLayoutStyle === 'journal' && <Bookmark size={14} className="mr-1.5" />}
              আমার লক্ষ্যগুলো
            </a>
            <button 
              onClick={() => setExportModalOpen(true)}
              className={`${activeTheme.secondaryBtn} font-semibold text-xs tracking-wide px-5 py-2.5 rounded-xl shadow-md transition-all flex items-center justify-center cursor-pointer h-10 min-w-[140px]`}
            >
              <span>প্রিন্ট ও পিডিএফ এক্সপোর্ট</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <main className="max-w-[1180px] mx-auto px-4 sm:px-6 mb-20">
        {/* Stats Grid - Stylized by layout */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5 -mt-8 relative z-20 mb-12 sm:mb-14 font-sans">
          {[
            { label: 'মূল লক্ষ্যক্ষেত্র', val: sections.length, num: '01' },
            { label: 'মোট দক্ষতা ও লক্ষ্য', val: totalGoalsCount, num: '02' },
            { label: 'চিহ্নিত সম্পন্ন', val: doneGoalsCount, num: '03' },
            { label: 'ব্যক্তিগত অগ্রগতি', val: `${overallPercent}%`, num: '04' }
          ].map((stat, sIdx) => {
            if (currentLayoutStyle === 'royal') {
              return (
                <div 
                  key={sIdx} 
                  className={`p-4 sm:p-6 rounded-2xl border border-amber-500/30 bg-gradient-to-b from-amber-500/[0.06] to-transparent shadow-lg transition-all duration-300 hover:border-amber-400/50 hover:-translate-y-0.5 relative overflow-hidden ${activeTheme.cardBg}`}
                >
                  <div className="text-[10px] font-serif uppercase tracking-widest text-amber-400/90 font-bold mb-1 flex items-center gap-1.5">
                    <span>❖</span>
                    <span>সাধনা {toBengaliNumber(stat.num)}</span>
                  </div>
                  <strong className="block text-2xl sm:text-3xl font-semibold mb-1 font-serif text-amber-200">{stat.val}</strong>
                  <span className="text-[10px] sm:text-[11px] uppercase tracking-wider opacity-80 font-medium">{stat.label}</span>
                </div>
              );
            }

            if (currentLayoutStyle === 'modern') {
              return (
                <div 
                  key={sIdx} 
                  className={`p-4 sm:p-6 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl shadow-lg transition-all duration-300 hover:border-sky-400/40 hover:shadow-[0_8px_30px_rgba(56,189,248,0.1)] hover:-translate-y-0.5 relative overflow-hidden group ${activeTheme.cardBg}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-sans tracking-widest text-sky-400 font-semibold">{stat.num}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                  </div>
                  <strong className="block text-2xl sm:text-3xl font-bold tracking-tight mb-1">{stat.val}</strong>
                  <span className="text-[10px] sm:text-[11px] uppercase tracking-wider opacity-70">{stat.label}</span>
                </div>
              );
            }

            if (currentLayoutStyle === 'journal') {
              return (
                <div 
                  key={sIdx} 
                  className={`p-4 sm:p-6 rounded-2xl border border-current/15 bg-stone-500/[0.03] shadow-md transition-all duration-300 hover:border-emerald-500/40 hover:-translate-y-0.5 relative ${activeTheme.cardBg}`}
                >
                  <div className="text-[10px] font-sans font-medium uppercase tracking-wider text-emerald-400 mb-1">
                    অধ্যায় {toBengaliNumber(stat.num)}
                  </div>
                  <strong className="block text-2xl sm:text-3xl font-semibold mb-1">{stat.val}</strong>
                  <span className="text-[10px] sm:text-[11px] uppercase tracking-wider opacity-70 font-medium">{stat.label}</span>
                </div>
              );
            }

            return (
              <div key={sIdx} className={`p-4 sm:p-6 rounded-2xl border border-current/15 bg-current/[0.02] shadow-sm transition-all duration-300 hover:border-current/30 hover:-translate-y-0.5 ${activeTheme.cardBg}`}>
                <div className="text-[10px] font-sans tracking-widest opacity-60 mb-1">{stat.num}</div>
                <strong className="block text-2xl sm:text-3xl font-semibold mb-1">{stat.val}</strong>
                <span className="text-[10px] sm:text-[11px] uppercase tracking-widest opacity-70 font-medium">{stat.label}</span>
              </div>
            );
          })}
        </div>

        {/* CONTENTS Section - Stylized by layout */}
        <div id="contents" className={`mb-10 transition-all ${
          currentLayoutStyle === 'royal' 
            ? `border border-amber-500/30 rounded-3xl p-6 sm:p-10 shadow-xl bg-gradient-to-b from-amber-500/[0.04] to-transparent relative overflow-hidden ${activeTheme.cardBg}`
            : currentLayoutStyle === 'modern'
            ? `border border-white/10 rounded-3xl backdrop-blur-xl p-6 sm:p-8 shadow-xl bg-white/[0.03] relative overflow-hidden ${activeTheme.cardBg}`
            : currentLayoutStyle === 'journal'
            ? `border border-current/15 rounded-3xl p-6 sm:p-8 shadow-md bg-stone-500/[0.03] relative overflow-hidden ${activeTheme.cardBg}`
            : `border border-current/15 rounded-2xl p-6 sm:p-8 shadow-sm bg-current/[0.02] ${activeTheme.cardBg}`
        }`}>
          {currentLayoutStyle === 'modern' && (
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-sky-400 via-indigo-500 to-sky-400" />
          )}

          {/* CONTENTS Header */}
          {currentLayoutStyle === 'royal' ? (
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-amber-500/20">
              <div className="flex items-center gap-2">
                <Crown size={17} className="text-amber-400" />
                <h2 className="text-base sm:text-lg font-bold font-serif text-amber-200">
                  সূচিপত্র · সম্মানিত লক্ষ্য ও গবেষণার বিষয়সমূহ
                </h2>
              </div>
              <span className="font-serif text-xs text-amber-400/80 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20">
                {toBengaliNumber(sections.length)}টি মূল ক্ষেত্র
              </span>
            </div>
          ) : currentLayoutStyle === 'modern' ? (
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-sky-300" />
                <h2 className="text-xs uppercase tracking-[0.2em] font-bold text-sky-400">
                  CONTENTS // সূচিপত্র
                </h2>
              </div>
              <span className="text-[10px] font-sans opacity-80 px-2.5 py-1 rounded-full bg-white/5 border border-white/10">
                {toBengaliNumber(sections.length)} MODULES
              </span>
            </div>
          ) : currentLayoutStyle === 'journal' ? (
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-current/15">
              <div className="flex items-center gap-2">
                <BookOpen size={16} className="text-emerald-400" />
                <h2 className="text-sm sm:text-base font-bold">
                  সূচিপত্র · জীবন অধ্যায় ও সংকল্পসমূহ
                </h2>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {toBengaliNumber(sections.length)}টি অধ্যায়
              </span>
            </div>
          ) : (
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-current/15 opacity-90">
              <h2 className={`text-xs tracking-[0.2em] uppercase font-bold ${activeTheme.contentsHeader}`}>
                CONTENTS · সূচিপত্র
              </h2>
              <span className="text-[11px] opacity-70">
                {toBengaliNumber(sections.length)}টি মূল বিভাগ
              </span>
            </div>
          )}

          <div className="space-y-2">
            {sections.map((s, idx) => {
              const isSelected = activeSectionId === s.id;
              const numStr = String(idx + 1).padStart(2, '0');
              return (
                <button
                  type="button"
                  key={s.id}
                  onClick={() => scrollToSection(s.id)}
                  className={`w-full text-left py-3.5 px-4 rounded-xl transition-all cursor-pointer flex items-center justify-between group ${
                    isSelected 
                      ? activeTheme.contentsSelected 
                      : activeTheme.contentsNormal
                  } ${
                    currentLayoutStyle === 'royal' && isSelected ? 'border-2 border-amber-400/60' : ''
                  }`}
                >
                  <span className="text-sm sm:text-base tracking-wide truncate font-medium flex items-center gap-2">
                    {currentLayoutStyle === 'royal' && (
                      <span className={`font-serif shrink-0 ${isSelected ? 'text-amber-600 dark:text-amber-300 font-bold' : 'text-amber-500'}`}>❖</span>
                    )}
                    {currentLayoutStyle === 'modern' && (
                      <span className={`font-mono text-xs shrink-0 ${isSelected ? 'text-sky-400 font-bold' : 'text-sky-400 opacity-80'}`}>[{numStr}]</span>
                    )}
                    {currentLayoutStyle === 'journal' && (
                      <span className="text-xs opacity-75 font-sans shrink-0 pl-4 sm:pl-6">অধ্যায় {toBengaliNumber(idx + 1)} ·</span>
                    )}
                    {currentLayoutStyle === 'standard' && (
                      <span className={`shrink-0 ${isSelected ? 'font-bold' : 'opacity-70'}`}>{numStr} ·</span>
                    )}
                    <span className="truncate">{s.title}</span>
                  </span>
                  <div className="flex items-center gap-2 shrink-0 ml-2">
                    {isSelected && (
                      <span className={`text-[10px] font-sans font-bold px-2 py-0.5 rounded-full ${activeTheme.activePill}`}>
                        সক্রিয়
                      </span>
                    )}
                    <ChevronRight size={15} className={`transition-transform shrink-0 ${isSelected ? 'opacity-100 translate-x-1' : 'opacity-60 group-hover:translate-x-1'}`} />
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-8 pt-4 border-t opacity-70 text-[11px] leading-relaxed font-sans">
            এই ওয়েবসাইটটি ব্যক্তিগত লক্ষ্য ও অগ্রগতি সাজিয়ে রাখার জন্য। প্রতিটি লক্ষ্য ও তার সব ধাপ সিরিয়াল অনুযায়ী নিচে ধারাবাহিকভাবে সাজানো রয়েছে।
          </div>
        </div>

        {/* Search & Reset Toolbar */}
        <div className="flex flex-wrap gap-3 mb-10 items-center font-sans">
          <div className={`relative flex-1 min-w-[220px] border rounded-xl ${activeTheme.cardBg}`}>
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 opacity-60" />
            <input 
              type="search"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="আপনার লক্ষ্য বা দক্ষতা খুঁজুন…"
              className="w-full pl-11 pr-4 py-3.5 bg-transparent text-sm focus:outline-none transition-all"
            />
          </div>
          <button 
            onClick={() => setIsResetConfirmOpen(true)}
            className={`${activeTheme.secondaryBtn} rounded-xl px-5 py-3.5 text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer shrink-0`}
          >
            <RotateCcw size={14} /> অগ্রগতি রিসেট
          </button>
        </div>

        {/* Sections Loop - All goals and steps rendered serially in full sequence */}
        <div className="space-y-12 sm:space-y-16">
          {sections.map((sec, secIdx) => {
            const secPercent = getSectionPercent(sec.goals);
            const filteredGoals = sec.goals.filter(g => 
              !query || g.text.toLowerCase().includes(query) || sec.title.toLowerCase().includes(query)
            );

            if (query && filteredGoals.length === 0) return null;
            const isSecActive = activeSectionId === sec.id;

            return (
              <section 
                key={sec.id} 
                id={sec.id} 
                className={`scroll-mt-24 transition-all duration-300 block relative overflow-hidden ${
                  sec.edgeStyle && sec.edgeStyle !== 'default'
                    ? `${getSectionEdgeClass(sec.edgeStyle)} ${activeTheme.cardBg}`
                    : currentLayoutStyle === 'royal'
                    ? `border border-amber-500/30 rounded-3xl shadow-xl bg-gradient-to-b from-amber-500/[0.04] to-transparent`
                    : currentLayoutStyle === 'modern'
                    ? `border border-white/10 rounded-3xl backdrop-blur-xl shadow-xl bg-white/[0.03]`
                    : currentLayoutStyle === 'journal'
                    ? `border border-current/15 rounded-3xl shadow-md bg-stone-500/[0.03]`
                    : `border border-current/15 rounded-2xl shadow-sm ${activeTheme.cardBg}`
                } ${
                  isSecActive ? activeTheme.sectionActiveEffect : activeTheme.sectionNormalEffect
                }`}
              >
                {/* Dynamic theme accent line on active main goal - NO black effect */}
                {isSecActive && (
                  <div className={`absolute top-0 left-0 right-0 h-1 z-10 ${activeTheme.sectionTopAccent}`} />
                )}

                {/* Header with Triple-Click Edit & Delete Unlock - Dynamic theme effect, NO black */}
                <div className={`p-6 sm:p-8 border-b opacity-95 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors duration-300 ${
                  isSecActive ? activeTheme.sectionHeaderActive : activeTheme.sectionHeaderNormal
                }`}>
                  {editingSectionId === sec.id ? (
                    <div className="w-full space-y-4 font-sans">
                      <div>
                        <label className="block text-xs font-bold uppercase mb-1">লক্ষ্যের শিরোনাম</label>
                        <input
                          type="text"
                          value={editingSectionTitle}
                          onChange={e => setEditingSectionTitle(e.target.value)}
                          className={`w-full px-3.5 py-2.5 border rounded-xl text-sm ${activeTheme.inputBg}`}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase mb-1">সংক্ষিপ্ত বিবরণ</label>
                        <textarea
                          value={editingSectionIntro}
                          onChange={e => setEditingSectionIntro(e.target.value)}
                          className={`w-full px-3.5 py-2.5 border rounded-xl text-sm ${activeTheme.inputBg}`}
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            if (editingSectionTitle.trim()) {
                              handleEditSection(sec.id, editingSectionTitle.trim(), editingSectionIntro.trim());
                              setEditingSectionId(null);
                            }
                          }}
                          className={`${activeTheme.accentBtn} px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer`}
                        >
                          সংরক্ষণ
                        </button>
                        <button
                          onClick={() => setEditingSectionId(null)}
                          className={`${activeTheme.secondaryBtn} px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer`}
                        >
                          বাতিল
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div 
                        onClick={() => handleTripleClick(sec.id, false)}
                        className="cursor-pointer select-none group"
                        title="পরপর ৩ বার ক্লিক করলে এডিট ও ডিলিট অপশন আসবে"
                      >
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          {currentLayoutStyle === 'royal' ? (
                            <div className="flex items-center gap-1.5 font-serif text-[11px] tracking-[0.15em] uppercase font-bold text-amber-400">
                              <Crown size={13} />
                              <span>✦ সাধনা 0{secIdx + 1} · {sec.kicker || 'উচ্চতর সাধনা'} ✦</span>
                            </div>
                          ) : currentLayoutStyle === 'modern' ? (
                            <div className="flex items-center gap-1.5 font-sans text-[11px] tracking-[0.15em] uppercase font-bold text-sky-400">
                              <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                              <span>CORE MODULE // 0{secIdx + 1}</span>
                            </div>
                          ) : currentLayoutStyle === 'journal' ? (
                            <div className="flex items-center gap-1.5 font-sans text-[11px] tracking-[0.15em] uppercase font-bold text-emerald-500">
                              <BookOpen size={13} />
                              <span>অধ্যায় {toBengaliNumber(secIdx + 1)} · {sec.kicker || 'গবেষণা ও সংকল্প'}</span>
                            </div>
                          ) : (
                            <span className="font-sans text-[11px] tracking-[0.15em] uppercase font-semibold opacity-70">
                              0{secIdx + 1} / {sec.kicker || 'বিভাগ'}
                            </span>
                          )}
                          {isSecActive && (
                            <span className={`text-[10px] font-sans font-bold px-2.5 py-0.5 rounded-full ${activeTheme.activePill}`}>
                              সক্রিয় লক্ষ্য
                            </span>
                          )}
                        </div>
                        <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold leading-snug transition-colors group-hover:opacity-90">
                          {sec.title}
                        </h2>
                      </div>

                      <div className="shrink-0 flex items-center gap-3 font-sans">
                        <span className="text-xs font-semibold px-3.5 py-1.5 rounded-full opacity-90 bg-current/10">
                          {secPercent}% সম্পন্ন
                        </span>
                        {unlockedSectionDeletes[sec.id] && (
                          <div className="flex items-center gap-1.5" onClick={e => e.stopPropagation()}>
                            {confirmSectionDeleteId === sec.id ? (
                              <div className="flex items-center gap-1.5 bg-red-500/10 border border-red-500/30 text-red-600 px-2.5 py-1 rounded-xl text-xs font-semibold">
                                <span>মুছবেন?</span>
                                <button
                                  onClick={() => handleDeleteSection(sec.id)}
                                  className="bg-red-600 hover:bg-red-700 text-white px-2 py-0.5 rounded-lg text-xs cursor-pointer shadow-sm"
                                >
                                  হ্যাঁ
                                </button>
                                <button
                                  onClick={() => setConfirmSectionDeleteId(null)}
                                  className="bg-neutral-300 dark:bg-neutral-700 hover:bg-neutral-400 text-neutral-800 dark:text-neutral-200 px-2 py-0.5 rounded-lg text-xs cursor-pointer"
                                >
                                  না
                                </button>
                              </div>
                            ) : (
                                <>
                                <button
                                  onClick={() => {
                                    setAddingGoalSectionId(sec.id);
                                    setNewGoalInputText('');
                                  }}
                                  className="text-emerald-600 hover:text-emerald-700 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500/10 transition-colors cursor-pointer flex items-center gap-1"
                                  title="এই মূল লক্ষ্যে নতুন ধারা বা ধাপ যোগ করুন"
                                >
                                  <Plus size={13} /> ধারা যোগ
                                </button>
                                <button
                                  onClick={() => setEdgeSelectorSectionId(edgeSelectorSectionId === sec.id ? null : sec.id)}
                                  className="text-amber-600 hover:text-amber-700 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-amber-500/10 transition-colors cursor-pointer flex items-center gap-1"
                                  title="কার্ডের ধারের স্টাইল পরিবর্তন"
                                >
                                  <Palette size={13} /> ধারের স্টাইল
                                </button>
                                <button
                                  onClick={() => {
                                    setEditingSectionId(sec.id);
                                    setEditingSectionTitle(sec.title);
                                    setEditingSectionIntro(sec.intro);
                                  }}
                                  className="text-blue-600 hover:text-blue-700 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-blue-500/10 transition-colors cursor-pointer"
                                  title="এডিট করুন"
                                >
                                  এডিট
                                </button>
                                <button
                                  onClick={() => setConfirmSectionDeleteId(sec.id)}
                                  className="text-red-500 hover:text-red-600 px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-500/10 transition-colors cursor-pointer"
                                  title="মুছে ফেলুন"
                                >
                                  ডিলিট
                                </button>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>

                {/* Body */}
                <div className="p-6 sm:p-8">
                  <p className="text-sm sm:text-base mb-6 leading-relaxed opacity-90">
                    {sec.intro}
                  </p>

                  {/* Progress Bar */}
                  <div className="mb-8 font-sans">
                    <div className="flex justify-between text-xs opacity-80 mb-2">
                      <span className="font-medium">এই বিভাগের অগ্রগতি</span>
                      <span className="font-semibold">{secPercent}%</span>
                    </div>
                    <div className={`h-2.5 rounded-full overflow-hidden w-full ${activeTheme.progressBarBg}`}>
                      <div 
                        className={`h-full transition-all duration-300 rounded-full ${activeTheme.progressBarFill}`} 
                        style={{ width: `${secPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Goals List with Triple-Click Edit & Delete Unlock */}
                  <ul className="space-y-3 mb-6">
                    {(query ? filteredGoals : sec.goals).map(goal => {
                      const isChecked = !!checkedState[goal.id];
                      const origIdx = sec.goals.findIndex(g => g.id === goal.id);
                      const serialNo = origIdx !== -1 ? origIdx + 1 : 1;
                      const serialStr = String(serialNo).padStart(2, '0');

                      return (
                        <li 
                          key={goal.id} 
                          className={`group flex items-center justify-between gap-4 p-4 transition-all relative ${
                            currentLayoutStyle === 'royal'
                              ? 'rounded-2xl border shadow-sm hover:shadow-md hover:border-amber-400/60'
                              : currentLayoutStyle === 'modern'
                              ? 'rounded-2xl border backdrop-blur-md shadow-sm hover:shadow-[0_8px_25px_rgba(56,189,248,0.1)] hover:border-sky-400/50'
                              : currentLayoutStyle === 'journal'
                              ? 'rounded-2xl border shadow-sm hover:border-emerald-500/50'
                              : 'rounded-2xl border shadow-xs hover:border-current/30'
                          } ${
                            isChecked 
                              ? (currentTheme === 'warm-gold'
                                  ? 'border-amber-400/50 bg-amber-50/60 text-stone-900 shadow-sm'
                                  : currentTheme === 'midnight'
                                  ? 'border-slate-700 bg-slate-900/60 text-slate-100 shadow-sm'
                                  : 'border-neutral-300 bg-neutral-100/70 text-neutral-900 shadow-sm')
                              : (currentTheme === 'warm-gold'
                                  ? 'border-stone-300 bg-white hover:border-amber-500 shadow-sm text-stone-900'
                                  : currentTheme === 'midnight'
                                  ? 'border-slate-700 bg-[#111827] hover:border-sky-400 shadow-sm text-slate-100'
                                  : 'border-neutral-200 bg-white hover:border-neutral-400 shadow-sm text-neutral-900')
                          }`}
                        >
                          {editingGoalId === goal.id ? (
                            <div className="w-full space-y-3 font-sans py-1">
                              <input 
                                type="text"
                                value={editingGoalText}
                                onChange={e => setEditingGoalText(e.target.value)}
                                className={`w-full px-3.5 py-2.5 border rounded-xl text-sm ${activeTheme.inputBg}`}
                                autoFocus
                              />
                              <div className="flex gap-2">
                                <button
                                  onClick={() => {
                                    if (editingGoalText.trim()) {
                                      handleEditGoal(sec.id, goal.id, editingGoalText.trim());
                                      setEditingGoalId(null);
                                    }
                                  }}
                                  className={`${activeTheme.accentBtn} px-3.5 py-1.5 rounded-xl text-xs font-semibold cursor-pointer`}
                                >
                                  সংরক্ষণ
                                </button>
                                <button
                                  onClick={() => setEditingGoalId(null)}
                                  className={`${activeTheme.secondaryBtn} px-3.5 py-1.5 rounded-xl text-xs font-semibold cursor-pointer`}
                                >
                                  বাতিল
                                </button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <div 
                                onClick={() => handleTripleClick(goal.id, true)}
                                className="flex items-center gap-3.5 min-w-0 flex-1 cursor-pointer select-none"
                                title="এই ধাপে পরপর ৩ বার ক্লিক করলে এডিট ও ডিলিট অপশন আসবে"
                              >
                                {/* Distinct Theme-Styled Checkbox Box */}
                                <button
                                  type="button"
                                  role="checkbox"
                                  aria-checked={isChecked}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleCheckboxChange(goal.id, !isChecked);
                                  }}
                                  className={`w-6 h-6 flex items-center justify-center shrink-0 transition-all cursor-pointer shadow-sm ${
                                    currentLayoutStyle === 'royal' 
                                      ? 'rounded-md border-2 border-double' 
                                      : currentLayoutStyle === 'modern' 
                                      ? 'rounded-md border' 
                                      : currentLayoutStyle === 'journal' 
                                      ? 'rounded-md border-2 border-dashed' 
                                      : 'rounded-lg border-2'
                                  } ${
                                    isChecked
                                      ? (currentTheme === 'warm-gold'
                                          ? 'bg-[#b45309] border-[#b45309] text-white shadow-amber-900/40'
                                          : currentTheme === 'midnight'
                                          ? 'bg-[#38bdf8] border-[#38bdf8] text-slate-950 shadow-sky-950/40'
                                          : 'bg-neutral-900 border-neutral-900 text-white shadow-neutral-900/20')
                                      : (currentTheme === 'warm-gold'
                                          ? 'border-stone-400 bg-stone-100/70 hover:border-amber-600'
                                          : currentTheme === 'midnight'
                                          ? 'border-slate-500 bg-slate-800/80 hover:border-sky-400'
                                          : 'border-neutral-400 bg-neutral-100/80 hover:border-neutral-800')
                                  }`}
                                  title={isChecked ? "সম্পন্ন হিসেবে চিহ্নিত আছে" : "সম্পন্ন করতে ক্লিক করুন"}
                                >
                                  {isChecked && <Check size={16} strokeWidth={3.5} />}
                                </button>

                                {/* Serial Badge by layout style */}
                                {currentLayoutStyle === 'royal' ? (
                                  <span className="font-serif text-xs font-bold text-amber-500 shrink-0">
                                    ❖ {toBengaliNumber(serialNo)}.
                                  </span>
                                ) : currentLayoutStyle === 'modern' ? (
                                  <span className="font-mono text-xs font-bold text-sky-400 opacity-80 shrink-0">
                                    [{serialStr}]
                                  </span>
                                ) : currentLayoutStyle === 'journal' ? (
                                  <span className="font-sans text-xs font-bold opacity-80 shrink-0 flex items-center gap-1">
                                    📌 {toBengaliNumber(serialNo)}.
                                  </span>
                                ) : (
                                  <span className="font-sans text-xs sm:text-sm font-bold opacity-70 shrink-0">
                                    {serialStr}.
                                  </span>
                                )}

                                <span 
                                  className={`text-sm sm:text-base leading-relaxed ${
                                    isChecked ? 'line-through font-medium opacity-100 decoration-2' : 'font-medium'
                                  }`}
                                >
                                  {goal.text}
                                </span>
                              </div>

                              {unlockedGoalDeletes[goal.id] && (
                                <div className="flex items-center gap-1.5 shrink-0 font-sans" onClick={e => e.stopPropagation()}>
                                  {confirmGoalDeleteId === goal.id ? (
                                    <div className="flex items-center gap-1.5 bg-red-500/10 border border-red-500/30 text-red-600 px-2 py-1 rounded-xl text-xs font-semibold">
                                      <span>মুছবেন?</span>
                                      <button
                                        onClick={() => handleDeleteGoal(sec.id, goal.id)}
                                        className="bg-red-600 hover:bg-red-700 text-white px-2 py-0.5 rounded-lg text-xs cursor-pointer shadow-sm"
                                      >
                                        হ্যাঁ
                                      </button>
                                      <button
                                        onClick={() => setConfirmGoalDeleteId(null)}
                                        className="bg-neutral-300 dark:bg-neutral-700 hover:bg-neutral-400 text-neutral-800 dark:text-neutral-200 px-2 py-0.5 rounded-lg text-xs cursor-pointer"
                                      >
                                        না
                                      </button>
                                    </div>
                                  ) : (
                                    <>
                                      <button
                                        onClick={() => {
                                          setEditingGoalId(goal.id);
                                          setEditingGoalText(goal.text);
                                        }}
                                        className="text-blue-600 hover:text-blue-700 px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-500/10 transition-colors cursor-pointer"
                                        title="এডিট করুন"
                                      >
                                        এডিট
                                      </button>
                                      <button
                                        onClick={() => setConfirmGoalDeleteId(goal.id)}
                                        className="text-red-500 hover:text-red-600 px-2.5 py-1 rounded-lg text-xs font-semibold bg-red-500/10 transition-colors cursor-pointer"
                                        title="মুছে ফেলুন"
                                      >
                                        ডিলিট
                                      </button>
                                    </>
                                  )}
                                </div>
                              )}
                            </>
                          )}
                        </li>
                      );
                    })}
                  </ul>

                  {/* Add New Clause / Step / Edge System for this Main Goal */}
                  <div className="mb-8 font-sans">
                    {addingGoalSectionId === sec.id ? (
                      <div className={`p-4 sm:p-5 rounded-2xl border-2 transition-all shadow-md ${
                        currentTheme === 'warm-gold'
                          ? 'border-amber-400 bg-amber-50/70 dark:bg-stone-900/80 text-stone-900'
                          : currentTheme === 'midnight'
                          ? 'border-sky-400 bg-slate-900/90 text-slate-100'
                          : 'border-neutral-300 bg-neutral-50 dark:bg-neutral-900/90 text-neutral-900'
                      }`}>
                        <div className="flex items-center justify-between mb-2.5">
                          <label className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 opacity-90">
                            <Plus size={14} className="text-amber-500" />
                            <span>এই মূল লক্ষ্যে নতুন ধারা বা ধাপ যুক্ত করুন</span>
                          </label>
                          <span className="text-[10px] opacity-70">Enter চাপলে দ্রুত যুক্ত হবে</span>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2.5">
                          <input 
                            type="text"
                            value={newGoalInputText}
                            onChange={e => setNewGoalInputText(e.target.value)}
                            onKeyDown={e => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                if (newGoalInputText.trim()) {
                                  handleAddGoal(sec.id, newGoalInputText.trim());
                                  setNewGoalInputText('');
                                }
                              }
                            }}
                            placeholder="যেমন: নতুন গবেষণা পত্র প্রস্তুত করা, বিশেষ কর্মশালায় অংশগ্রহণ..."
                            autoFocus
                            className={`flex-1 px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 transition-all shadow-inner ${activeTheme.inputBg}`}
                          />
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                if (newGoalInputText.trim()) {
                                  handleAddGoal(sec.id, newGoalInputText.trim());
                                  setNewGoalInputText('');
                                }
                              }}
                              disabled={!newGoalInputText.trim()}
                              className={`${activeTheme.accentBtn} disabled:opacity-50 disabled:cursor-not-allowed px-5 py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-md transition-all shrink-0`}
                            >
                              <Plus size={15} /> ধারা যুক্ত করুন
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setAddingGoalSectionId(null);
                                setNewGoalInputText('');
                              }}
                              className={`${activeTheme.secondaryBtn} px-4 py-3 rounded-xl text-xs font-semibold cursor-pointer transition-all shrink-0`}
                            >
                              বাতিল
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-wrap items-center gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            setAddingGoalSectionId(sec.id);
                            setNewGoalInputText('');
                          }}
                          className={`group px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer border shadow-xs ${
                            currentTheme === 'warm-gold'
                              ? 'bg-amber-100/70 hover:bg-amber-200/80 text-amber-950 border-amber-300'
                              : currentTheme === 'midnight'
                              ? 'bg-sky-950/60 hover:bg-sky-900/80 text-sky-200 border-sky-500/40'
                              : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-900 border-neutral-300'
                          }`}
                        >
                          <span className={`w-5 h-5 rounded-lg flex items-center justify-center text-white ${activeTheme.accentBtn} group-hover:scale-110 transition-transform`}>
                            <Plus size={13} />
                          </span>
                          <span>+ এই লক্ষ্যে নতুন ধারা বা ধাপ যোগ করুন</span>
                        </button>

                        {/* Edge Style (কার্ডের ধার / বর্ডার ও আভা) Selector */}
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => setEdgeSelectorSectionId(edgeSelectorSectionId === sec.id ? null : sec.id)}
                            className={`px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer border opacity-80 hover:opacity-100 ${
                              sec.edgeStyle && sec.edgeStyle !== 'default'
                                ? 'bg-current/15 border-current/30 font-bold'
                                : 'bg-current/5 border-current/15'
                            }`}
                            title="মূল লক্ষ্যের কার্ডের চারপাশের ধার (বর্ডার ও আভা) পরিবর্তন করুন"
                          >
                            <Palette size={13} />
                            <span>ধারের স্টাইল {sec.edgeStyle && sec.edgeStyle !== 'default' ? `(${sec.edgeStyle})` : ''}</span>
                          </button>

                          {/* Edge style popover picker */}
                          {edgeSelectorSectionId === sec.id && (
                            <div className={`absolute left-0 mt-2 z-30 p-3 rounded-2xl border shadow-xl min-w-[250px] animate-fadeIn ${activeTheme.modalBg}`}>
                              <div className="text-[11px] font-bold uppercase tracking-wider mb-2 opacity-80 flex items-center justify-between">
                                <span>কার্ডের ধার (বর্ডার) স্টাইল</span>
                                <button onClick={() => setEdgeSelectorSectionId(null)} className="p-0.5 opacity-60 hover:opacity-100 cursor-pointer">
                                  <X size={12} />
                                </button>
                              </div>
                              <div className="space-y-1.5 text-xs">
                                {[
                                  { id: 'default', label: 'স্বাভাবিক থিম ধার (Default)', icon: '▫' },
                                  { id: 'gold', label: 'উজ্জ্বল সোনালী ধার (Golden Edge)', icon: '🌟' },
                                  { id: 'cyan', label: 'নীলকান্তমণি আভা ধার (Sapphire Glow)', icon: '💎' },
                                  { id: 'double', label: 'রয়্যাল ডাবল ফ্রেম ধার (Royal Double)', icon: '⚜' },
                                  { id: 'dashed', label: 'নোটবুক ড্যাশড ধার (Dashed Edge)', icon: '📌' },
                                ].map((opt) => (
                                  <button
                                    key={opt.id}
                                    type="button"
                                    onClick={() => handleUpdateEdgeStyle(sec.id, opt.id as any)}
                                    className={`w-full text-left px-2.5 py-2 rounded-lg flex items-center justify-between transition-colors cursor-pointer ${
                                      (sec.edgeStyle || 'default') === opt.id
                                        ? 'bg-current/15 font-bold'
                                        : 'hover:bg-current/10'
                                    }`}
                                  >
                                    <span className="flex items-center gap-2">
                                      <span>{opt.icon}</span>
                                      <span>{opt.label}</span>
                                    </span>
                                    {(sec.edgeStyle || 'default') === opt.id && <Check size={13} />}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Knowledge Extra Info Cards if applicable */}
                  {sec.hasCards && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                      <div className="border border-current/20 p-5 rounded-2xl opacity-95 shadow-sm">
                        <h3 className="text-base font-semibold mb-1.5">সাধারণ শিক্ষার ভিত্তি</h3>
                        <p className="text-xs sm:text-sm opacity-85">গণিত, পদার্থবিজ্ঞান, রসায়ন, জীববিজ্ঞান, ইতিহাস, ভূগোল, অর্থনীতি ও মনোবিজ্ঞানের মৌলিক জ্ঞান।</p>
                      </div>
                      <div className="border border-current/20 p-5 rounded-2xl opacity-95 shadow-sm">
                        <h3 className="text-base font-semibold mb-1.5">গবেষণা ও চিন্তাশক্তি</h3>
                        <p className="text-xs sm:text-sm opacity-85">Critical Thinking, Analytical Thinking, Logic, তথ্য যাচাই, গবেষণাপদ্ধতি ও একাডেমিক রেফারেন্স।</p>
                      </div>
                      <div className="border border-current/20 p-5 rounded-2xl opacity-95 shadow-sm">
                        <h3 className="text-base font-semibold mb-1.5">শেখার কৌশল</h3>
                        <p className="text-xs sm:text-sm opacity-85">Active Recall, Spaced Repetition, Note Taking, Mind Mapping ও নিয়মিত আত্মমূল্যায়ন।</p>
                      </div>
                      <div className="border border-current/20 p-5 rounded-2xl opacity-95 shadow-sm">
                        <h3 className="text-base font-semibold mb-1.5">স্বাস্থ্য ও ব্যক্তিত্ব</h3>
                        <p className="text-xs sm:text-sm opacity-85">সুষম খাদ্য, পর্যাপ্ত ঘুম, কণ্ঠের যত্ন, ধৈর্য, বিনয়, নৈতিকতা ও আবেগ নিয়ন্ত্রণ।</p>
                      </div>
                    </div>
                  )}

                  {/* Final Principle Box if applicable */}
                  {sec.id === 'final' && (
                    <div className="border-l-4 border-current p-6 text-sm sm:text-base mb-8 rounded-r-2xl shadow-sm bg-current/5">
                      <strong>আমার মূলনীতি</strong><br />
                      আমি কারও অন্ধ অনুকরণ করতে চাই না। যোগ্য ব্যক্তিদের কাছ থেকে ভালো দিকগুলো শিখব, প্রাতিষ্ঠানিক শিক্ষা ও প্রশিক্ষণ গ্রহণ করব, নিজের জ্ঞান ও দক্ষতা উন্নত করব এবং প্রতিটি ক্ষেত্রে নিজস্ব পরিচয় তৈরি করব。<br /><br />
                      <strong>আমার সর্বোচ্চ উদ্দেশ্য</strong><br />
                      আল্লাহর সন্তুষ্টি অর্জন করা, উপকারী জ্ঞান অর্জন করা এবং নিজের সামর্থ্যকে মানুষের কল্যাণে ব্যবহার করা।
                    </div>
                  )}

                  {/* Notes Area */}
                  <div className="mt-6 pt-5 border-t opacity-95 font-sans">
                    <label htmlFor={`note-${sec.id}`} className="block text-sm font-semibold mb-2.5 opacity-90">
                      আমার নোট ও পরবর্তী পদক্ষেপ
                    </label>
                    <textarea 
                      id={`note-${sec.id}`}
                      value={notesState[sec.id] || ''}
                      onChange={e => handleNoteChange(sec.id, e.target.value)}
                      placeholder="এখানে পড়াশোনা, বই, শিক্ষক বা পরবর্তী পদক্ষেপ লিখুন…"
                      className={`w-full min-h-[110px] resize-y p-4 border rounded-xl text-sm focus:outline-none focus:border-current transition-all shadow-inner ${activeTheme.inputBg}`}
                    />
                  </div>
                </div>
              </section>
            );
          })}
        </div>
      </main>

      {/* Add Custom Section Modal */}
      {isAddSectionModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`border rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl relative animate-fadeIn max-h-[90vh] flex flex-col font-sans ${activeTheme.modalBg}`}>
            <button 
              onClick={() => setIsAddSectionModalOpen(false)}
              className="absolute top-5 right-5 opacity-70 hover:opacity-100 p-1.5 rounded-full transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-3.5 mb-6 shrink-0 border-b border-current/20 pb-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ${activeTheme.accentBtn}`}>
                <Plus size={24} />
              </div>
              <div>
                <h3 className="text-xl font-serif font-bold">নতুন মূল লক্ষ্য ও ধাপ যোগ করুন</h3>
                <p className="text-xs opacity-70">প্রফেশনাল ও ক্লাসিক লক্ষ্য বিন্যাস</p>
              </div>
            </div>

            <form onSubmit={handleAddSection} className="space-y-5 my-2 overflow-y-auto pr-1 flex-1">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2 opacity-90">
                  মূল লক্ষ্যের নাম (Title) *
                </label>
                <input 
                  type="text"
                  required
                  value={newSecTitle}
                  onChange={e => setNewSecTitle(e.target.value)}
                  placeholder=""
                  className={`w-full px-4 py-3.5 border rounded-xl text-sm focus:outline-none focus:border-current shadow-inner ${activeTheme.inputBg}`}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2 opacity-90">
                  সংক্ষিপ্ত বিবরণ (Introduction)
                </label>
                <textarea 
                  value={newSecIntro}
                  onChange={e => setNewSecIntro(e.target.value)}
                  placeholder=""
                  className={`w-full min-h-[90px] px-4 py-3.5 border rounded-xl text-sm focus:outline-none focus:border-current shadow-inner resize-y ${activeTheme.inputBg}`}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2 opacity-90">
                  ধাপসমূহ যোগ করুন (Steps)
                </label>
                <div className="flex gap-2.5 mb-3">
                  <input 
                    type="text"
                    value={newSecStepInput}
                    onChange={e => setNewSecStepInput(e.target.value)}
                    placeholder="একটি করে ধাপ লিখুন…"
                    className={`flex-1 px-4 py-3 border rounded-xl text-sm focus:outline-none focus:border-current shadow-inner ${activeTheme.inputBg}`}
                  />
                  <button
                    type="button"
                    onClick={handleAddStepToNewSec}
                    className={`${activeTheme.accentBtn} px-5 py-3 rounded-xl text-xs font-semibold flex items-center gap-1.5 shrink-0 cursor-pointer shadow`}
                  >
                    <Plus size={16} /> ধাপ যোগ করুন
                  </button>
                </div>

                {newSecSteps.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    {newSecSteps.map((st, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs py-2 px-3 rounded-lg bg-current/10">
                        <span className="font-medium">{idx + 1}. {st}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveStepFromNewSec(idx)}
                          className="opacity-60 hover:opacity-100 hover:text-red-500 p-1 cursor-pointer"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-4 border-t border-current/20 mt-6">
                <button
                  type="submit"
                  className={`flex-1 ${activeTheme.accentBtn} font-semibold text-xs py-4 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg cursor-pointer`}
                >
                  <Plus size={16} /> লক্ষ্য সংরক্ষণ করুন
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddSectionModalOpen(false)}
                  className={`${activeTheme.secondaryBtn} font-semibold text-xs py-4 px-4 rounded-xl transition-colors cursor-pointer`}
                >
                  বাতিল
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Premium Export & Print Modal */}
      {exportModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`border rounded-2xl max-w-lg w-full p-6 md:p-8 shadow-2xl relative animate-fadeIn font-sans ${activeTheme.modalBg}`}>
            <button 
              onClick={() => {
                if (!isExportingPDF) setExportModalOpen(false);
              }}
              disabled={isExportingPDF}
              className="absolute top-4 right-4 opacity-70 hover:opacity-100 p-1 rounded-full transition-colors cursor-pointer disabled:opacity-30"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${activeTheme.accentBtn}`}>
                <FileDown size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold">পিডিএফ ডাউনলোড ও প্রিন্ট</h3>
                <p className="text-xs opacity-70">Saiful Islam Rifat · Lifelong Roadmap & Vision</p>
              </div>
            </div>

            <div className="space-y-4 my-6 text-sm opacity-90">
              <div className="border border-current/20 p-4 rounded-xl space-y-2 bg-current/5">
                <div className="flex justify-between text-xs font-semibold opacity-80">
                  <span>মোট লক্ষ্য: {toBengaliNumber(totalGoalsCount)}টি</span>
                  <span>সম্পন্ন: {toBengaliNumber(doneGoalsCount)}টি ({toBengaliNumber(overallPercent)}%)</span>
                </div>
                <div className={`w-full h-2 rounded-full overflow-hidden ${activeTheme.progressBarBg}`}>
                  <div className={`h-full rounded-full ${activeTheme.progressBarFill}`} style={{ width: `${overallPercent}%` }} />
                </div>
              </div>

              {/* Theme & Design preview pill */}
              <div className="p-3 rounded-xl border border-current/15 bg-current/5 text-xs space-y-1">
                <div className="font-semibold flex items-center gap-1.5 text-emerald-400">
                  <Check size={14} />
                  <span>ওয়েবসাইটের থিম ও ডিজাইন অনুযায়ী ডাউনলোড হবে</span>
                </div>
                <div className="text-[11px] opacity-75 leading-relaxed">
                  সক্রিয় থিম: <span className="font-bold">{currentTheme === 'warm-gold' ? 'ওয়ার্ম গোল্ড' : currentTheme === 'midnight' ? 'মিডনাইট' : 'ব্ল্যাক অ্যান্ড হোয়াইট'}</span> · 
                  ডিজাইন: <span className="font-bold">{currentLayoutStyle === 'royal' ? 'রয়্যাল হেরিটেজ' : currentLayoutStyle === 'modern' ? 'লাক্সারি গ্লাস' : currentLayoutStyle === 'journal' ? 'মাকতাবা ক্লাসিক' : 'এডিটরিয়াল মিনিমাল'}</span>
                </div>
              </div>

              {pdfSuccessMessage && (
                <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
                  <Check size={16} />
                  <span>{pdfSuccessMessage}</span>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-current/20 font-sans">
              <button 
                onClick={handleDownloadPDF}
                disabled={isExportingPDF}
                className={`flex-1 ${activeTheme.accentBtn} font-bold text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed`}
              >
                {isExportingPDF ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>পিডিএফ তৈরি হচ্ছে...</span>
                  </>
                ) : (
                  <>
                    <FileDown size={16} />
                    <span>📥 PDF ফাইল ডাউনলোড করুন</span>
                  </>
                )}
              </button>

              <button 
                onClick={() => {
                  window.print();
                  setExportModalOpen(false);
                }}
                disabled={isExportingPDF}
                className={`flex-1 ${activeTheme.secondaryBtn} font-semibold text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-60`}
              >
                <Printer size={16} />
                <span>সরাসরি প্রিন্ট (Print)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Confirmation Modal */}
      {isResetConfirmOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`border rounded-2xl max-w-sm w-full p-6 shadow-2xl relative animate-fadeIn font-sans ${activeTheme.modalBg}`}>
            <h3 className="text-base font-bold mb-2">অগ্রগতি রিসেট নিশ্চিতকরণ</h3>
            <p className="text-xs opacity-80 leading-relaxed mb-6">
              আপনি কি সব লক্ষ্য-চিহ্ন ও ব্যক্তিগত নোট মুছে ফেলে প্রাথমিক অবস্থায় ফিরে যেতে চান?
            </p>
            <div className="flex gap-2.5">
              <button
                onClick={handleReset}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold text-xs py-2.5 px-4 rounded-xl transition-colors cursor-pointer shadow-md"
              >
                হ্যাঁ, রিসেট করুন
              </button>
              <button
                onClick={() => setIsResetConfirmOpen(false)}
                className={`flex-1 ${activeTheme.secondaryBtn} font-semibold text-xs py-2.5 px-4 rounded-xl transition-colors cursor-pointer`}
              >
                বাতিল
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Button (FAB) */}
      <button
        onClick={() => setIsAddSectionModalOpen(true)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 ${activeTheme.fabShadow} flex items-center justify-center hover:scale-105 active:scale-95 transition-all cursor-pointer ${
          currentLayoutStyle === 'royal'
            ? 'rounded-2xl border border-amber-400/60 shadow-lg shadow-amber-950/40'
            : currentLayoutStyle === 'modern'
            ? 'rounded-2xl border border-sky-300/60 shadow-[0_4px_25px_rgba(56,189,248,0.35)]'
            : currentLayoutStyle === 'journal'
            ? 'rounded-2xl border border-emerald-400/60 shadow-md'
            : 'rounded-2xl border border-current/25 shadow-md'
        } ${activeTheme.fabBg}`}
        title="নতুন মূল লক্ষ্য যোগ করুন"
        aria-label="Add new goal"
      >
        <Plus size={24} />
      </button>

      {/* Footer */}
      <footer className="py-12 px-6 text-center border-t font-sans opacity-85">
        <div className="max-w-[1180px] mx-auto flex flex-col items-center justify-center space-y-3">
          <BrandEmblem 
            size={36} 
            layoutStyle={currentLayoutStyle} 
            theme={currentTheme} 
          />
          <strong className="font-semibold tracking-wide text-sm sm:text-base">Saiful Islam Rifat</strong>
          <p className="text-xs opacity-75 max-w-md">একটি স্বপ্ন। একটি জীবনব্যাপী সাধনা। জ্ঞান, শুদ্ধতা, তিলাওয়াত ও কল্যাণের পথে।</p>
          <div className="flex items-center gap-2 text-[11px] opacity-60">
            <span>ব্যক্তিগত লক্ষ্য-রূপরেখা</span>
            <span>•</span>
            <span>নিয়মিত অগ্রগতি পর্যালোচনা</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
