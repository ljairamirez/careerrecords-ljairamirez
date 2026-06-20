const STORAGE_KEY = "salary-sheet-state-v5";
const CLOUD_STATE_ENDPOINT = "/api/salary-state";
const CLOUD_FILE_ENDPOINT = "/api/record-file";
const CLOUD_SYNC_DEBOUNCE_MS = 900;
const CLOUD_REFRESH_MS = 15000;
const ATTACHMENT_DB_NAME = "salary-sheet-attachments";
const ATTACHMENT_STORE_NAME = "files";
const IMPORT_STATUS_POLICY_VERSION = 2;
const STUDENT_STATUS_POLICY_VERSION = 1;
const REMOVED_IMPORTED_SESSION_IDS = new Set(["wb265"]);
const CORRECTED_IMPORTED_SESSION_DATES = {
  wb203: "2026-01-06",
  wb204: "2026-01-07"
};

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const sourceCvSections = [
  {
    title: "Contact",
    entries: [
      { title: "Quezon City, Philippines 1101", meta: "(+63) 916 7023 686 | jcramirez8@up.edu.ph | linkedin.com/in/jlcramirez" }
    ]
  },
  {
    title: "Summary",
    paragraphs: [
      "Detail-oriented and highly motivated 4th-year Geodetic Engineering student at the University of the Philippines Diliman, with hands-on experience in traditional surveying, remote sensing, GIS, and photogrammetry. Eager to take on new challenges, continuously learn, and grow professionally."
    ]
  },
  {
    title: "Education",
    entries: [
      {
        title: "Bachelor of Science in Geodetic Engineering",
        date: "August 2021 - Present",
        meta: "University of the Philippines Diliman, Quezon City, Metro Manila, Philippines",
        bullets: [
          "DOST-SEI Scholar (2021-Present)",
          "Undergraduate Research: Impact of Lighting Parameters on 3D Reconstruction of an Archaeological Artifact Replica Using Close Range Photogrammetry (unpublished), in partial fulfillment of GsE 188: Modern Photogrammetry.",
          "Undergraduate Research: From Fields to Cities: Comparison of Support Vector Machine and Random Forest Classifiers for a Multi-Temporal Analysis of Urban Growth in Cavite (unpublished), in partial fulfillment of GsE 189: Remote Sensing: Theory and Applications."
        ]
      },
      {
        title: "High School",
        date: "July 2015 - May 2021",
        meta: "Philippine Science High School - Ilocos Region Campus, San Ildefonso, Ilocos Sur, Philippines",
        bullets: [
          "With High Honors (2021)",
          "Proficiency Award in Arts, Design, and Technology (2021)",
          "STEM Track - Physics Strand, Electronics and Agriculture Elective"
        ]
      }
    ]
  },
  {
    title: "Work Experience",
    entries: [
      {
        title: "Geodetic Engineering Student Intern",
        date: "July 2024 - August 2024",
        meta: "RASA Surveying and Realty, Quezon City, Metro Manila, Philippines",
        bullets: [
          "Assisted in conducting land, hydrographic, and aerial surveying.",
          "Handled GIS and remote sensing software for data processing.",
          "Attended seminars and training camps for LiDAR and bathymetric surveying.",
          "Prepared survey returns documents following government standards."
        ]
      },
      {
        title: "Student Intern - Agriculture 1: Work Immersion",
        date: "March 2020",
        meta: "Malakas Farm Livelihood Development Enterprises, San Juan, Ilocos Sur",
        bullets: [
          "Participated in agricultural operations, particularly land preparation and mushroom propagation."
        ]
      },
      {
        title: "Student Intern - Microbiology, Chemistry, Metrology Labs",
        date: "September 2018",
        meta: "DOST Regional Science and Technology Laboratory 1, DMMMSU San Fernando, La Union",
        bullets: [
          "Shadowed laboratory staff and gained early exposure to scientific instrumentation."
        ]
      },
      {
        title: "Community Manager / Esports Varsity Player - MLBB",
        date: "March 2024 - May 2025",
        meta: "UP Esports Varsity Team",
        bullets: [
          "Managed internal communication and coordinated with players, moderators, and stakeholders for events and tournaments.",
          "Handled and managed Diliman Games tournaments as a co-organizer."
        ]
      },
      {
        title: "Campus Moonton Student Leader - UP Diliman",
        date: "March 2024 - Present",
        meta: "Moonton Student Leaders PH",
        bullets: [
          "Led initiatives and collaborated with nationwide student leaders on community projects.",
          "Planned and managed online and face-to-face tournaments at various scales."
        ]
      },
      {
        title: "Part-Time Tutor / Lecturer",
        date: "March 2024 - Present",
        meta: "Self-employed",
        bullets: [
          "Performed tutoring sessions for elementary and high school students, particularly in Mathematics and related subjects.",
          "Served as lecturer for review sessions for college entrance tests (CETs)."
        ]
      }
    ]
  },
  {
    title: "Skills",
    entries: [
      {
        title: "Surveying and Mapping",
        bullets: [
          "Hands-on experience in traditional surveying techniques and the use of remote sensing, GIS, and photogrammetry for data processing and analysis.",
          "Experienced in geospatial data handling and map creation using GIS platforms such as ArcGIS and QGIS, and CAD-based platforms such as Civil 3D and Autodesk."
        ]
      },
      {
        title: "Data Handling",
        bullets: [
          "Proficient in Microsoft Office Suite, including Word, Excel, and PowerPoint for document preparation and data processing."
        ]
      },
      {
        title: "Event Handling and Management",
        bullets: [
          "Skilled in end-to-end event coordination, including planning, logistics, and execution.",
          "Highly organized and efficient in managing time and tasks."
        ]
      },
      {
        title: "Flexible and Resilient",
        bullets: [
          "Demonstrates adaptability and a strong willingness to learn when given opportunities.",
          "Can effectively perform onsite, online, or in a hybrid setup."
        ]
      }
    ]
  },
  {
    title: "Affiliations & Leadership",
    entries: [
      {
        title: "University of the Philippines Namnama (UP Namnama)",
        bullets: [
          "Vice President for Internal Affairs (AY 2025-2026)",
          "Sirib ken Saririt 2025: 43rd Sirib Quiz Show and 16th Saririt Cultural Festival, Provincials Leg - Ilocos Norte Co-Head (January 2025)",
          "SURO 2025: Facilitator and Lecturer (Mathematics) - Ilocos Norte (July 2025)"
        ]
      },
      {
        title: "Moonton Student Leaders Philippines",
        bullets: [
          "Campus Student Leader (March 2024 - Present)"
        ]
      },
      {
        title: "University of the Philippines Esports Varsity Team",
        bullets: [
          "Community Manager (March 2024 - May 2025)",
          "Diliman Games 2024 Co-Organizer (May 2024)",
          "Diliman Games 2025 Co-Organizer (May 2025)"
        ]
      }
    ]
  }
];

function buildDefaultCvProfile() {
  return {
    name: "John Lloyd C. Ramirez",
    headline: "Academic and professional credentials",
    place: "Quezon City, Philippines 1101",
    contact: "(+63) 916 7023 686 | jcramirez8@up.edu.ph | ljairamirez@gmail.com | linkedin.com/in/jlcramirez"
  };
}

function buildDefaultCvSections() {
  return [
    {
      id: "summary",
      title: "Summary",
      items: [{
        id: "summary-main",
        title: "Professional Summary",
        description: "Detail-oriented and highly motivated 4th-year Geodetic Engineering student at the University of the Philippines Diliman, with hands-on experience in traditional surveying, remote sensing, GIS, and photogrammetry. Eager to take on new challenges, continuously learn, and grow professionally."
      }]
    },
    {
      id: "education",
      title: "Education",
      items: [
        {
          id: "education-upd",
          title: "Bachelor of Science in Geodetic Engineering",
          date: "August 2021 - Present",
          meta: "University of the Philippines Diliman, Quezon City, Metro Manila, Philippines",
          bullets: ["DOST-SEI Scholar (2021-Present)"]
        },
        {
          id: "education-pshs",
          title: "High School",
          date: "July 2015 - May 2021",
          meta: "Philippine Science High School - Ilocos Region Campus, San Ildefonso, Ilocos Sur, Philippines",
          bullets: [
            "With High Honors (2021)",
            "Proficiency Award in Arts, Design, and Technology (2021)",
            "STEM Track - Physics Strand, Electronics and Agriculture Elective"
          ]
        }
      ]
    },
    {
      id: "licenses-and-certifications",
      title: "Licenses and Certifications",
      items: []
    },
    {
      id: "works",
      title: "Works",
      items: [
        {
          id: "works-photogrammetry",
          title: "Impact of Lighting Parameters on 3D Reconstruction of an Archaeological Artifact Replica Using Close Range Photogrammetry",
          meta: "Unpublished undergraduate research in partial fulfillment of GsE 188: Modern Photogrammetry",
          bullets: ["P.L.C. Conte, K.A.T. Escabarte, M.G.R.A. Galano, J.L.C. Ramirez, K.A.P. Vergara"]
        },
        {
          id: "works-remote-sensing",
          title: "From Fields to Cities: Comparison of Support Vector Machine and Random Forest Classifiers for a Multi-Temporal Analysis of Urban Growth in Cavite",
          meta: "Unpublished undergraduate research in partial fulfillment of GsE 189: Remote Sensing: Theory and Applications",
          bullets: ["K.A.T. Escabarte, C.A.R. Manago, J.L.C. Ramirez, E.E.E. Elazegui"]
        }
      ]
    },
    {
      id: "work-experience",
      title: "Work Experience",
      items: sourceCvSections.find((section) => section.title === "Work Experience").entries.map((entry, index) => ({ id: `work-${index + 1}`, ...entry }))
    },
    {
      id: "skills",
      title: "Skills",
      items: sourceCvSections.find((section) => section.title === "Skills").entries.map((entry, index) => ({ id: `skill-${index + 1}`, ...entry }))
    },
    {
      id: "affiliations-and-leadership",
      title: "Affiliations and Leadership",
      items: sourceCvSections.find((section) => section.title === "Affiliations & Leadership").entries.map((entry, index) => ({ id: `leadership-${index + 1}`, ...entry }))
    }
  ];
}

function normalizeCvSections(sections) {
  const defaults = buildDefaultCvSections();
  const source = Array.isArray(sections) && sections.length ? sections : defaults;
  const normalized = source.map((section, sectionIndex) => {
    const title = section.title || defaults[sectionIndex]?.title || "Section";
    const rawItems = section.items || section.entries || (section.paragraphs || []).map((paragraph, index) => ({
      id: `${slugify(title)}-${index + 1}`,
      title: title === "Summary" ? "Professional Summary" : title,
      description: paragraph
    }));
    return {
      id: normalizeCvSectionId(section.id || sectionIdFromTitle(title)),
      title: normalizeCvSectionTitle(title),
      items: (rawItems || []).map((item, itemIndex) => normalizeCvItem(item, title, itemIndex))
    };
  });
  const byId = Object.fromEntries(normalized.map((section) => [section.id, section]));
  const defaultIds = new Set(defaults.map((section) => section.id));
  return [
    ...defaults.map((section) => byId[section.id] || section),
    ...normalized.filter((section) => !defaultIds.has(section.id))
  ];
}

function normalizeCvProfile(profile = {}) {
  const defaults = buildDefaultCvProfile();
  const next = { ...defaults, ...profile };
  if (!profile.place && typeof profile.contact === "string" && profile.contact.includes("|")) {
    const parts = profile.contact.split("|").map((part) => part.trim()).filter(Boolean);
    if (parts.length > 1 && /philippines|city|province|metro/i.test(parts[0])) {
      next.place = parts.shift();
      next.contact = parts.join(" | ");
    }
  }
  return next;
}

function normalizeCvItem(item, sectionTitle, index = 0) {
  return {
    id: item.id || `${sectionIdFromTitle(sectionTitle)}-${index + 1}`,
    title: item.title || "",
    date: item.date || "",
    meta: item.meta || "",
    description: item.description || "",
    bullets: Array.isArray(item.bullets) ? item.bullets : []
  };
}

function normalizeCvSectionTitle(title) {
  const value = String(title || "").trim();
  if (/^skill$/i.test(value)) return "Skills";
  if (/^(license|licenses|certification|certifications|licenses?\s*(and|&)\s*certifications?)$/i.test(value)) return "Licenses and Certifications";
  if (/^records?\s*only$/i.test(value)) return "Records Only";
  if (/^affiliations\s*&\s*leadership$/i.test(value)) return "Affiliations and Leadership";
  return value || "Works";
}

function sectionIdFromTitle(title) {
  return normalizeCvSectionId(slugify(normalizeCvSectionTitle(title || "Works")));
}

function normalizeCvSectionId(id) {
  const value = String(id || "").trim();
  if (value === "affiliations-leadership") return "affiliations-and-leadership";
  return value;
}

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const defaultState = {
  settings: {
    tutors: ["Lloyd Ramirez"],
    students: [
      "Erin", "Lia", "Reeva", "Ash", "Jeisha", "Janver", "Teo", "Hannah",
      "Anna", "Hans", "Jacob", "Megan", "Miguel", "Kaela", "Ashley", "Sam",
      "Fritzie", "Boaz", "Luis", "Francis", "Poseidon", "Rafa", "Euri",
      "Elliot", "Margo", "LEAP 6", "B2030 G9", "BOOSTER STAT",
      "BOARDS REVIEW", "ASHAPE", "NCE"
    ],
    packages: ["5 Hours", "10 Hours", "15 Hours", "Group 3 Students", "Group 4 Students", "Group 5-9 Students", "Group 10+ Students"],
    classTypes: ["Elem/JHS", "SHS", "College", "Group"],
    modes: ["Virtual", "F2F", "Hybrid"],
    frequencies: ["Weekly", "Twice a week", "One-time", "As needed"],
    scheduleStatuses: ["Active", "Paused", "Ended", "One-time"]
  },
  studentRecords: [
    { key: "Lloyd Ramirez", name: "Lloyd Ramirez", status: "Active", notes: "" }
  ],
  personalSessions: [],
  records: [],
  cvProfile: buildDefaultCvProfile(),
  cvSections: buildDefaultCvSections(),
  cvResumeItemIds: [],
  claimHistory: [],
  rates: [
    { id: uid(), tutor: "All Tutors", classType: "Elem/JHS", mode: "Virtual", packageName: "5 Hours", amount: 350 },
    { id: uid(), tutor: "All Tutors", classType: "SHS", mode: "Virtual", packageName: "5 Hours", amount: 400 },
    { id: uid(), tutor: "All Tutors", classType: "College", mode: "Virtual", packageName: "5 Hours", amount: 450 },
    { id: uid(), tutor: "All Tutors", classType: "Elem/JHS", mode: "F2F", packageName: "5 Hours", amount: 350 },
    { id: uid(), tutor: "All Tutors", classType: "SHS", mode: "F2F", packageName: "5 Hours", amount: 400 },
    { id: uid(), tutor: "All Tutors", classType: "College", mode: "F2F", packageName: "5 Hours", amount: 450 },
    { id: uid(), tutor: "All Tutors", classType: "Elem/JHS", mode: "Virtual", packageName: "10 Hours", amount: 300 },
    { id: uid(), tutor: "All Tutors", classType: "SHS", mode: "Virtual", packageName: "10 Hours", amount: 350 },
    { id: uid(), tutor: "All Tutors", classType: "College", mode: "Virtual", packageName: "10 Hours", amount: 400 },
    { id: uid(), tutor: "All Tutors", classType: "Elem/JHS", mode: "F2F", packageName: "10 Hours", amount: 300 },
    { id: uid(), tutor: "All Tutors", classType: "SHS", mode: "F2F", packageName: "10 Hours", amount: 350 },
    { id: uid(), tutor: "All Tutors", classType: "College", mode: "F2F", packageName: "10 Hours", amount: 400 },
    { id: uid(), tutor: "All Tutors", classType: "Elem/JHS", mode: "Virtual", packageName: "15 Hours", amount: 250 },
    { id: uid(), tutor: "All Tutors", classType: "SHS", mode: "Virtual", packageName: "15 Hours", amount: 283.33 },
    { id: uid(), tutor: "All Tutors", classType: "College", mode: "Virtual", packageName: "15 Hours", amount: 316.67 },
    { id: uid(), tutor: "All Tutors", classType: "Elem/JHS", mode: "F2F", packageName: "15 Hours", amount: 250 },
    { id: uid(), tutor: "All Tutors", classType: "SHS", mode: "F2F", packageName: "15 Hours", amount: 283.33 },
    { id: uid(), tutor: "All Tutors", classType: "College", mode: "F2F", packageName: "15 Hours", amount: 316.67 },
    { id: uid(), tutor: "Graduate Tutor", classType: "Elem/JHS", mode: "Virtual", packageName: "5 Hours", amount: 420 },
    { id: uid(), tutor: "Graduate Tutor", classType: "SHS", mode: "Virtual", packageName: "5 Hours", amount: 480 },
    { id: uid(), tutor: "Graduate Tutor", classType: "College", mode: "Virtual", packageName: "5 Hours", amount: 540 },
    { id: uid(), tutor: "Graduate Tutor", classType: "Elem/JHS", mode: "F2F", packageName: "5 Hours", amount: 480 },
    { id: uid(), tutor: "Graduate Tutor", classType: "SHS", mode: "F2F", packageName: "5 Hours", amount: 540 },
    { id: uid(), tutor: "Graduate Tutor", classType: "College", mode: "F2F", packageName: "5 Hours", amount: 600 },
    { id: uid(), tutor: "Graduate Tutor", classType: "Elem/JHS", mode: "Virtual", packageName: "10 Hours", amount: 360 },
    { id: uid(), tutor: "Graduate Tutor", classType: "SHS", mode: "Virtual", packageName: "10 Hours", amount: 420 },
    { id: uid(), tutor: "Graduate Tutor", classType: "College", mode: "Virtual", packageName: "10 Hours", amount: 480 },
    { id: uid(), tutor: "Graduate Tutor", classType: "Elem/JHS", mode: "F2F", packageName: "10 Hours", amount: 420 },
    { id: uid(), tutor: "Graduate Tutor", classType: "SHS", mode: "F2F", packageName: "10 Hours", amount: 480 },
    { id: uid(), tutor: "Graduate Tutor", classType: "College", mode: "F2F", packageName: "10 Hours", amount: 510 },
    { id: uid(), tutor: "Graduate Tutor", classType: "Elem/JHS", mode: "Virtual", packageName: "15 Hours", amount: 300 },
    { id: uid(), tutor: "Graduate Tutor", classType: "SHS", mode: "Virtual", packageName: "15 Hours", amount: 340 },
    { id: uid(), tutor: "Graduate Tutor", classType: "College", mode: "Virtual", packageName: "15 Hours", amount: 380 },
    { id: uid(), tutor: "Graduate Tutor", classType: "Elem/JHS", mode: "F2F", packageName: "15 Hours", amount: 340 },
    { id: uid(), tutor: "Graduate Tutor", classType: "SHS", mode: "F2F", packageName: "15 Hours", amount: 380 },
    { id: uid(), tutor: "Graduate Tutor", classType: "College", mode: "F2F", packageName: "15 Hours", amount: 420 },
    { id: uid(), tutor: "Group Class", classType: "Group", mode: "Virtual", packageName: "Group 3 Students", amount: 350 },
    { id: uid(), tutor: "Group Class", classType: "Group", mode: "Virtual", packageName: "Group 4 Students", amount: 400 },
    { id: uid(), tutor: "Group Class", classType: "Group", mode: "Virtual", packageName: "Group 5-9 Students", amount: 450 },
    { id: uid(), tutor: "Group Class", classType: "Group", mode: "Virtual", packageName: "Group 10+ Students", amount: 500 }
  ],
  sessions: [
    {
      id: uid(),
      date: isoDaysAgo(10),
      start: "17:00",
      end: "18:30",
      tutor: "Lloyd Ramirez",
      student: "B2030 G9",
      packageName: "Group 4 Students",
      classType: "Group",
      mode: "Virtual",
      studentCount: 4,
      rate: 400,
      status: "For Claiming",
      claimDate: "",
      notes: "Demo row"
    },
    {
      id: uid(),
      date: isoDaysAgo(7),
      start: "19:00",
      end: "20:00",
      tutor: "Lloyd Ramirez",
      student: "Megan",
      packageName: "10 Hours",
      classType: "SHS",
      mode: "Virtual",
      studentCount: 1,
      rate: 350,
      status: "Pending",
      claimDate: "",
      notes: ""
    },
    {
      id: uid(),
      date: isoDaysAgo(3),
      start: "14:00",
      end: "16:00",
      tutor: "Lloyd Ramirez",
      student: "Jacob",
      packageName: "15 Hours",
      classType: "Elem/JHS",
      mode: "F2F",
      studentCount: 1,
      rate: 250,
      status: "Claimed",
      claimDate: isoDaysAgo(1),
      notes: ""
    }
  ],
  schedules: [
    { id: uid(), day: "Monday", start: "10:00", end: "12:00", student: "Megan", tutor: "Lloyd Ramirez", mode: "Virtual", frequency: "Weekly", status: "Active", notes: "From old Schedule" },
    { id: uid(), day: "Tuesday", start: "15:00", end: "17:00", student: "B2030 G9", tutor: "Lloyd Ramirez", mode: "Virtual", frequency: "Weekly", status: "Active", notes: "From old Schedule" },
    { id: uid(), day: "Thursday", start: "18:00", end: "22:00", student: "BOARDS REVIEW", tutor: "Lloyd Ramirez", mode: "Virtual", frequency: "Weekly", status: "Active", notes: "From old Schedule" },
    { id: uid(), day: "Saturday", start: "09:00", end: "11:00", student: "NCE", tutor: "Lloyd Ramirez", mode: "F2F", frequency: "Weekly", status: "Active", notes: "From old Schedule" }
  ]
};

const hadLocalStateAtStartup = hasStoredState();
let state = loadState();
let recentlyClaimedPackageKeys = new Set();
let cvSelectionMode = false;
let selectedCvItems = new Set();
let cloudSync = {
  enabled: false,
  loading: false,
  saving: false,
  error: "",
  lastSavedAt: "",
  timer: null,
  refreshTimer: null,
  refreshStarted: false,
  dirty: false
};

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

document.addEventListener("DOMContentLoaded", () => {
  setupNavigation();
  setupForms();
  setupActions();
  hydrateControls();
  render();
  migrateLegacyRecordAttachments();
  initializeCloudSync();
});

function uid() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
}

function isoDaysAgo(daysAgo) {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().slice(0, 10);
}

function hasStoredState() {
  try {
    return Boolean(localStorage.getItem(STORAGE_KEY));
  } catch (error) {
    return false;
  }
}

function loadState() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return migrateState(JSON.parse(stored));
  } catch (error) {
    console.warn("Could not load saved Salary Sheet data.", error);
  }
  return migrateState(buildInitialState());
}

function buildInitialState() {
  const base = structuredClone(defaultState);
  const imported = window.salarySheetWorkbookData;
  if (!imported) return base;

  base.settings.students = imported.students.map((student) => student.name);
  base.studentRecords = imported.students.map((student) => ({
    key: student.key,
    name: student.name,
    status: student.status || "Active",
    notes: student.notes || ""
  }));
  base.sessions = imported.sessions.filter((session) => !REMOVED_IMPORTED_SESSION_IDS.has(session.id)).map((session) => ({
    ...session,
    packageLabel: session.packageLabel || "Package 1",
    packageName: session.packageName || "15 Hours",
    studentCount: Number(session.studentCount || 1),
    hours: Number(session.hours || 0),
    rate: Number(session.rate || 0),
    totalPay: Number(session.totalPay || 0),
    status: session.claimed ? "Claimed" : "Pending",
    claimed: Boolean(session.claimed),
    color: session.claimed ? "claimed" : "open"
  }));
  base.schedules = imported.schedules?.length ? imported.schedules : base.schedules;
  base.importedPackages = (imported.packages || []).filter((pkg) => !(pkg.studentKey === "Ashley" && pkg.packageNo === 2));
  base.claimHistory = imported.claimHistory || [];
  return base;
}

function migrateState(inputState) {
  const next = inputState || buildInitialState();
  const imported = window.salarySheetWorkbookData;
  const importedRows = (imported?.sessions || []).filter((session) => !REMOVED_IMPORTED_SESSION_IDS.has(session.id));
  const importedSessions = Object.fromEntries(importedRows.map((session) => [session.id, session]));
  const shouldResetImportedOpenStatuses = next.importStatusPolicyVersion !== IMPORT_STATUS_POLICY_VERSION;

  next.settings ||= structuredClone(defaultState.settings);
  next.settings.modes = ["Virtual", "F2F", "Hybrid"];
  next.settings.students = uniqueNormalizedNames((next.settings.students || []).map(normalizeStudentName).filter((name) => normalizeStudentName(name) !== "SUBS"));
  next.studentRecords = (next.studentRecords || [])
    .map((student) => ({ ...student, name: normalizeStudentName(student.name), status: student.status || "Active" }))
    .filter((student) => normalizeStudentName(student.name) !== "SUBS");

  const hydrateSession = (session) => {
    const importedSession = importedSessions[session.id];
    const source = importedSession || session;
    const rawStatus = importedSession
      ? source.claimed ? "Claimed" : shouldResetImportedOpenStatuses ? "Pending" : session.status || "Pending"
      : session.status || "Pending";
    const status = rawStatus === "Collect on Next Payment" ? "Pending" : rawStatus;
    const subs = isSubsRawSession(source);
    const notes = normalizeProgramAlias(session.notes || source.notes || "");
    const groupStudent = resolveGroupStudentName({ ...source, ...session, notes });
    const student = subs
      ? normalizeStudentName(notes) || "SUBS"
      : groupStudent || normalizeStudentName(session.student || source.student);
    const correctedDate = CORRECTED_IMPORTED_SESSION_DATES[session.id] || CORRECTED_IMPORTED_SESSION_DATES[source.id];
    return {
      ...source,
      ...session,
      date: correctedDate || session.date || source.date,
      student,
      notes,
      isSubs: subs || session.isSubs === true,
      packageLabel: normalizeProgramAlias(session.packageLabel || source.packageLabel || "PACKAGE 1"),
      packageName: source.packageName || session.packageName || "15 Hours",
      mode: normalizeModeLabel(session.mode || source.mode),
      classType: subs ? "Individual" : session.classType,
      studentCount: subs ? 1 : Number(session.studentCount || source.studentCount || 1),
      status,
      claimed: status === "Claimed" || status === "Archived",
      color: status === "Claimed" || status === "Archived" ? "claimed" : isClaimingStatus({ status }) ? "claiming" : "open"
    };
  };
  next.sessions = (next.sessions || []).filter((session) => !REMOVED_IMPORTED_SESSION_IDS.has(session.id)).map(hydrateSession);
  next.personalSessions = (next.personalSessions || []).map((session) => ({
    ...session,
    student: normalizeStudentName(session.student),
    mode: normalizeModeLabel(session.mode),
    status: session.status || "Pending",
    packageLabel: session.packageLabel || "PACKAGE 1"
  }));
  next.records = (next.records || []).map((record) => ({
    ...record,
    id: record.id || uid(),
    category: normalizeCvSectionTitle(record.category || "Works"),
    title: record.title || "",
    startDate: record.startDate || record.date || "",
    endDate: record.endDate || "",
    organization: record.organization || "",
    location: record.location || "",
    description: record.description || "",
    bullets: Array.isArray(record.bullets) ? record.bullets : parseBulletLines(record.bullets || ""),
    file: record.file || "",
    fileName: record.fileName || record.file || "",
    fileData: record.fileData || "",
    attachmentId: record.attachmentId || "",
    attachmentUrl: record.attachmentUrl || ""
  }));
  next.cvProfile = normalizeCvProfile(next.cvProfile);
  next.cvSections = normalizeCvSections(next.cvSections || buildDefaultCvSections());
  next.cvResumeItemIds = uniqueValues(next.cvResumeItemIds || []);
  const knownSessionIds = new Set(next.sessions.map((session) => session.id));
  importedRows.forEach((session) => {
    if (!knownSessionIds.has(session.id)) next.sessions.push(hydrateSession(session));
  });
  next.settings.students = uniqueNormalizedNames([
    ...next.settings.students,
    ...next.sessions.map((session) => session.student).filter((name) => normalizeStudentName(name) !== "SUBS")
  ]);
  const recordsByName = Object.fromEntries((next.studentRecords || []).map((student) => [student.name, student]));
  next.studentRecords = next.settings.students.map((name) => recordsByName[name] || { key: name, name, status: "Active", notes: "" });
  if (next.studentStatusPolicyVersion !== STUDENT_STATUS_POLICY_VERSION) {
    const openStudents = new Set(next.sessions.filter(isOpenStatus).map((session) => session.student).filter(Boolean));
    next.studentRecords = next.studentRecords.map((student) => ({
      ...student,
      status: openStudents.has(student.name) ? "Active" : "Inactive"
    }));
    next.studentStatusPolicyVersion = STUDENT_STATUS_POLICY_VERSION;
  }
  next.claimHistory = normalizeClaimHistory(next.claimHistory, imported?.claimHistory || []);
  next.importStatusPolicyVersion = IMPORT_STATUS_POLICY_VERSION;

  next.schedules = (next.schedules || []).map((item) => ({
    ...item,
    student: normalizeStudentName(item.student),
    mode: normalizeModeLabel(item.mode)
  }));
  next.rates = (next.rates || []).map((rate) => ({ ...rate, mode: normalizeModeLabel(rate.mode) }));
  return next;
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  cloudSync.dirty = true;
  queueCloudSave();
}

function shouldUseCloudSync() {
  return location.protocol.startsWith("http") &&
    !["localhost", "127.0.0.1", ""].includes(location.hostname);
}

function hostingProviderName() {
  if (/\.vercel\.app$/i.test(location.hostname)) return "Vercel";
  if (/\.netlify\.app$/i.test(location.hostname)) return "Netlify";
  return "hosted site";
}

async function initializeCloudSync() {
  cloudSync.enabled = shouldUseCloudSync();
  renderCloudStatus();
  if (!cloudSync.enabled) return;

  cloudSync.loading = true;
  cloudSync.error = "";
  renderCloudStatus();

  try {
    const response = await fetch(CLOUD_STATE_ENDPOINT, { headers: { Accept: "application/json" } });
    if (!response.ok) throw new Error(await cloudResponseError(response, "Cloud sync failed"));
    const payload = await response.json();
    if (payload?.state) {
      const remoteState = migrateState(payload.state);
      cloudSync.lastSavedAt = payload.updatedAt || "";
      if (hadLocalStateAtStartup && localSessionHistoryIsAhead(state, remoteState)) {
        cloudSync.dirty = true;
        await syncCloudSave(true);
      } else {
        state = remoteState;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        cloudSync.dirty = false;
        hydrateControls();
        render();
        migrateLegacyRecordAttachments();
      }
    } else {
      await syncCloudSave(true);
    }
    await syncPendingRecordAttachments();
  } catch (error) {
    cloudSync.error = error.message || "Cloud sync unavailable";
    console.warn("Cloud sync unavailable.", error);
  } finally {
    cloudSync.loading = false;
    startCloudRefresh();
    if (cloudSync.dirty) queueCloudSave();
    renderCloudStatus();
  }
}

function localSessionHistoryIsAhead(localState, remoteState) {
  const localRows = (localState?.sessions || []).filter(hasUsableDate);
  const remoteRows = (remoteState?.sessions || []).filter(hasUsableDate);
  const latest = (rows) => rows.reduce((date, row) => row.date > date ? row.date : date, "");
  return localRows.length > remoteRows.length || latest(localRows) > latest(remoteRows);
}

function queueCloudSave() {
  if (!cloudSync.enabled || cloudSync.loading) return;
  clearTimeout(cloudSync.timer);
  cloudSync.timer = window.setTimeout(() => syncCloudSave(), CLOUD_SYNC_DEBOUNCE_MS);
  renderCloudStatus();
}

async function syncCloudSave(force = false) {
  if (!cloudSync.enabled && !force) return;
  cloudSync.saving = true;
  cloudSync.error = "";
  renderCloudStatus();
  try {
    const response = await fetch(CLOUD_STATE_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ state })
    });
    if (!response.ok) throw new Error(await cloudResponseError(response, "Cloud save failed"));
    const payload = await response.json();
    cloudSync.lastSavedAt = payload.updatedAt || new Date().toISOString();
    cloudSync.dirty = false;
  } catch (error) {
    cloudSync.error = error.message || "Cloud save failed";
    console.warn("Cloud save failed.", error);
  } finally {
    cloudSync.saving = false;
    renderCloudStatus();
  }
}

function startCloudRefresh() {
  if (!cloudSync.enabled || cloudSync.refreshStarted) return;
  cloudSync.refreshStarted = true;
  cloudSync.refreshTimer = window.setInterval(refreshCloudState, CLOUD_REFRESH_MS);
  window.addEventListener("focus", refreshCloudState);
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) refreshCloudState();
  });
}

async function refreshCloudState() {
  if (!cloudSync.enabled || cloudSync.loading || cloudSync.saving || cloudSync.dirty || document.hidden) return;
  try {
    const response = await fetch(CLOUD_STATE_ENDPOINT, {
      headers: { Accept: "application/json" },
      cache: "no-store"
    });
    if (!response.ok) throw new Error(await cloudResponseError(response, "Cloud refresh failed"));
    const payload = await response.json();
    if (!payload?.state || !payload.updatedAt || payload.updatedAt === cloudSync.lastSavedAt) return;
    state = migrateState(payload.state);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    cloudSync.lastSavedAt = payload.updatedAt;
    cloudSync.error = "";
    hydrateControls();
    render();
    renderCloudStatus();
  } catch (error) {
    cloudSync.error = error.message || "Cloud refresh failed";
    renderCloudStatus();
  }
}

async function cloudResponseError(response, fallback) {
  try {
    const payload = await response.json();
    return payload.error || `${fallback}: ${response.status}`;
  } catch (error) {
    return `${fallback}: ${response.status}`;
  }
}

function syncCloudNow() {
  if (!cloudSync.enabled) {
    alert("Cloud Sync turns on automatically after this site is deployed on Vercel or Netlify.");
    return;
  }
  syncCloudSave(true);
}

function renderCloudStatus() {
  const status = $("#cloudSyncStatus");
  const button = $("#syncCloudNow");
  if (!status || !button) return;
  button.disabled = cloudSync.loading || cloudSync.saving;
  if (!cloudSync.enabled) {
    status.textContent = "Local browser save only. Deploy on Vercel or Netlify to enable hosted updates.";
    button.textContent = "Sync Now";
    return;
  }
  if (cloudSync.loading) {
    status.textContent = `Loading ${hostingProviderName()} saved data...`;
    button.textContent = "Syncing";
    return;
  }
  if (cloudSync.saving) {
    status.textContent = `Saving changes to ${hostingProviderName()}...`;
    button.textContent = "Saving";
    return;
  }
  if (cloudSync.error) {
    status.textContent = `${cloudSync.error}. Browser backup is still saved.`;
    button.textContent = "Retry Sync";
    return;
  }
  status.textContent = cloudSync.lastSavedAt
    ? `Saved on ${hostingProviderName()} ${formatDateTime(cloudSync.lastSavedAt)}`
    : `Ready to save changes on ${hostingProviderName()}.`;
  button.textContent = "Sync Now";
}

function setupNavigation() {
  const menuToggle = $("#menuToggle");
  const sidebar = $("#sidebar");
  const setMenuOpen = (open) => {
    sidebar?.classList.toggle("open", open);
    menuToggle?.setAttribute("aria-expanded", String(open));
  };
  menuToggle?.addEventListener("click", () => setMenuOpen(!sidebar?.classList.contains("open")));
  const activate = () => {
    const id = (location.hash || "#dashboard").replace("#", "");
    const target = document.getElementById(id) ? id : "dashboard";
    $$(".view").forEach((view) => view.classList.toggle("active", view.id === target));
    $$(".nav a").forEach((link) => link.classList.toggle("active", link.dataset.view === target));
    $$(".nav-group").forEach((group) => {
      if (group.querySelector(`[data-view="${target}"]`)) group.open = true;
    });
    $("#viewTitle").textContent = document.getElementById(target).dataset.title;
    $("#monthFilter")?.closest("label")?.classList.toggle("hidden-control", target !== "dashboard");
    setMenuOpen(false);
    render();
  };
  window.addEventListener("hashchange", activate);
  activate();
}

function setupForms() {
  $("#sessionForm").addEventListener("submit", saveSession);
  $("#personalSessionForm")?.addEventListener("submit", savePersonalSession);
  $("#recordForm")?.addEventListener("submit", saveRecord);
  $("#rateForm").addEventListener("submit", saveRate);
  $("#scheduleForm").addEventListener("submit", saveSchedule);
  $("#settingsForm").addEventListener("submit", saveSettings);

  ["sessionTutor", "sessionClassType", "sessionMode", "sessionPackage"].forEach((id) => {
    $("#" + id).addEventListener("change", setSuggestedRate);
  });
  $("#sessionStudent").addEventListener("change", () => {
    updateSessionPackageOptions();
    setSuggestedRate();
  });

  $("#monthFilter").addEventListener("change", render);
  $("#tutorFilter")?.addEventListener("change", render);
  $("#summaryYear").addEventListener("change", () => {
    hydrateSummaryMonths(true);
    renderSummaries();
  });
  $("#summaryMonth").addEventListener("change", renderSummaries);
  $("#toggleCvSelect")?.addEventListener("click", toggleCvSelectionMode);
  $("#addSelectedToResume")?.addEventListener("click", addSelectedCvItemsToResume);
  $("#clearResume")?.addEventListener("click", clearResumeDetails);
  $("#cvProfileForm")?.addEventListener("submit", saveCvProfile);
  $("#updateCvProfile")?.addEventListener("click", saveCvProfile);
  $("#cvDetailForm")?.addEventListener("submit", saveCvDetail);
  $("#clearCvDetailEditor")?.addEventListener("click", resetCvDetailEditor);
  ["cvDisplayName", "cvHeadline", "cvPlace", "cvContact"].forEach((id) => {
    $("#" + id)?.addEventListener("change", saveCvProfile);
  });
  $("#sessionSortBy")?.addEventListener("change", renderSessions);
  $("#sessionSortDirection")?.addEventListener("change", renderSessions);
  $("#packageSearch")?.addEventListener("input", renderPackages);
  $("#personalPackageSearch")?.addEventListener("input", renderPersonalPackages);
  $("#claimDate").addEventListener("change", () => {
    enforceClaimCutoffInputs();
    saveState();
    render();
  });

  $("#clearSessionForm").addEventListener("click", resetSessionForm);
  $("#clearPersonalSessionForm")?.addEventListener("click", resetPersonalSessionForm);
  $("#clearRecordForm")?.addEventListener("click", resetRecordForm);
  $("#clearScheduleForm").addEventListener("click", resetScheduleForm);
}

function setupActions() {
  $("#printView").addEventListener("click", () => window.print());
  $("#markClaimed").addEventListener("click", markClaimed);
  $("#exportSessionsCsv").addEventListener("click", () => exportCsv("session-log.csv", sessionCsvRows(sessionLogRows())));
  $("#exportPersonalCsv")?.addEventListener("click", () => exportCsv("personal-session-log.csv", sessionCsvRows(personalSessionRows())));
  $("#exportClaimCsv").addEventListener("click", () => exportCsv("claiming-view.csv", sessionCsvRows(claimableSessions())));
  $("#exportJson").addEventListener("click", () => downloadFile("salary-sheet-backup.json", JSON.stringify(state, null, 2), "application/json"));
  $("#importJson").addEventListener("change", importJson);
  $("#syncCloudNow")?.addEventListener("click", syncCloudNow);
  $("#inactiveExceptOpen")?.addEventListener("click", setInactiveExceptOpenStudents);
  $("#resetDemo").addEventListener("click", () => {
    state = migrateState(buildInitialState());
    saveState();
    hydrateControls();
    render();
  });
  $("#closeSelectedPackages").addEventListener("click", () => setSelectedPackagesStatus("For Claiming"));
  $("#reopenSelectedPackages").addEventListener("click", () => setSelectedPackagesStatus("Pending"));
  $("#closePersonalPackages")?.addEventListener("click", () => setPersonalSelectedPackagesStatus("Closed"));
  $("#openPersonalPackages")?.addEventListener("click", () => setPersonalSelectedPackagesStatus("Pending"));
}

function hydrateControls() {
  const today = new Date().toISOString().slice(0, 10);
  const claimDate = claimCutoffDate();
  $("#monthFilter").value ||= today.slice(0, 7);
  $("#claimDate").value ||= claimDate;
  if ($("#packageClaimDate")) $("#packageClaimDate").value ||= claimDate;
  enforceClaimCutoffInputs();

  if ($("#tutorFilter")) fillSelect($("#tutorFilter"), ["All Tutors", ...state.settings.tutors], "All Tutors");
  $("#sessionTutor").value = "Lloyd Ramirez";
  fillDatalist($("#activeStudentOptions"), activeStudentNames());
  fillSelect($("#sessionPackage"), state.settings.packages);
  updateSessionPackageOptions("", true);
  fillSelect($("#sessionClassType"), state.settings.classTypes);
  fillSelect($("#sessionMode"), state.settings.modes);
  fillDatalist($("#personalStudentOptions"), personalStudentNames());
  fillSelect($("#personalSessionPackage"), state.settings.packages);
  fillSelect($("#personalSessionClassType"), state.settings.classTypes);
  fillSelect($("#personalSessionMode"), state.settings.modes);

  fillSelect($("#scheduleDay"), days);
  fillSelect($("#scheduleStudent"), activeStudentNames());
  $("#scheduleTutor").value = "Lloyd Ramirez";
  fillSelect($("#scheduleMode"), state.settings.modes);
  fillSelect($("#scheduleFrequency"), state.settings.frequencies);
  fillSelect($("#scheduleStatus"), state.settings.scheduleStatuses);

  fillSelect($("#rateTutor"), ["All Tutors", "Graduate Tutor", "Group Class", ...state.settings.tutors]);
  fillSelect($("#rateClassType"), state.settings.classTypes);
  fillSelect($("#rateMode"), state.settings.modes);
  fillSelect($("#ratePackage"), state.settings.packages);

  $("#settingTutors").value = state.settings.tutors.join("\n");
  $("#settingStudents").value = sortNames(state.settings.students).join("\n");
  $("#settingPackages").value = state.settings.packages.join("\n");
  $("#settingClassTypes").value = state.settings.classTypes.join("\n");
  $("#settingModes").value = state.settings.modes.join("\n");
  $("#settingScheduleStatuses").value = state.settings.scheduleStatuses.join("\n");
  if ($("#cvDisplayName")) $("#cvDisplayName").value = state.cvProfile?.name || "";
  if ($("#cvHeadline")) $("#cvHeadline").value = state.cvProfile?.headline || "";
  if ($("#cvPlace")) $("#cvPlace").value = state.cvProfile?.place || "";
  if ($("#cvContact")) $("#cvContact").value = state.cvProfile?.contact || "";
  hydrateSummaryYears();

  resetSessionForm();
  resetPersonalSessionForm();
  resetRecordForm();
  resetScheduleForm();
}

function fillSelect(select, options, selected = "") {
  const cleanOptions = uniqueDisplayValues(options);
  select.innerHTML = [
    `<option value=""></option>`,
    ...cleanOptions.filter((option) => option !== "").map((option) => `<option value="${escapeAttr(option)}">${escapeHtml(option)}</option>`)
  ].join("");
  select.value = selected || "";
}

function fillDatalist(list, options) {
  list.innerHTML = uniqueDisplayValues(options).map((option) => `<option value="${escapeAttr(option)}"></option>`).join("");
}

function render() {
  renderDashboard();
  renderSessions();
  renderPersonalSessions();
  renderPersonalPackages();
  renderPersonalGroups();
  renderRates();
  renderSchedule();
  renderWeekly();
  renderPackages();
  renderClaiming();
  renderArchive();
  renderGroups();
  renderSummaries();
  renderStudentStatuses();
  renderRecords();
  renderCareerDocuments();
  hydrateProfilePhotos();
}

function filteredSessions() {
  const tutor = $("#tutorFilter")?.value;
  return state.sessions
    .filter((session) => tutor === "All Tutors" || !tutor || session.tutor === tutor)
    .sort(sessionSortComparator());
}

function sessionLogRows() {
  return filteredSessions().filter((session) => !isClaimedStatus(session));
}

function sessionSortComparator() {
  const sortBy = $("#sessionSortBy")?.value || "date";
  const direction = ($("#sessionSortDirection")?.value || "desc") === "desc" ? -1 : 1;
  const fallback = (a, b) => (
    a.date.localeCompare(b.date) ||
    a.start.localeCompare(b.start) ||
    a.student.localeCompare(b.student)
  );

  return (a, b) => {
    let result = 0;
    if (sortBy === "date") {
      result = a.date.localeCompare(b.date) || a.start.localeCompare(b.start);
    } else if (sortBy === "day") {
      result = days.indexOf(dayName(a.date)) - days.indexOf(dayName(b.date)) || a.start.localeCompare(b.start);
    } else if (sortBy === "type") {
      result = (a.classType || "").localeCompare(b.classType || "") || fallback(a, b);
    } else {
      result = (a.student || "").localeCompare(b.student || "") || fallback(a, b);
    }
    return (result || fallback(a, b)) * direction;
  };
}

function dashboardSessions() {
  const month = $("#monthFilter").value;
  return state.sessions
    .filter(hasUsableDate)
    .filter((session) => !month || session.date.slice(0, 7) === month)
    .filter((session) => session.status !== "Cancelled");
}

function renderDashboard() {
  const rows = dashboardSessions();
  const totals = summarize(rows);
  const allRows = state.sessions.filter((row) => row.status !== "Cancelled");
  const claimed = sum(allRows.filter(isClaimedStatus), totalPay);
  const forClaiming = sum(allRows.filter(isClaimingStatus), totalPay);
  const pending = sum(allRows.filter((row) => row.status === "Pending"), totalPay);
  const currentUnclaimed = currentUnclaimedTotal();
  const peak = peakDay(rows);
  const monthLabel = $("#monthFilter").value ? monthName($("#monthFilter").value) : "selected month";
  const activeDays = new Set(rows.map((row) => row.date)).size || 0;
  const avgHours = activeDays ? totals.hours / activeDays : 0;
  const avgEarnings = activeDays ? totals.pay / activeDays : 0;

  $("#dashboardMetrics").innerHTML = [
    metric("Monthly Earnings", money(totals.pay), `${monthLabel} / ${totals.sessions} sessions`, "earnings"),
    metric("Ready For Claiming", money(forClaiming), "closed packages waiting to claim", "unclaimed"),
    metric("Total Unclaimed", money(currentUnclaimed), `${unclaimedSessions().length} logs not claimed yet`, "total"),
    metric("Peak Day of the Month", peak ? money(peak.pay) : money(0), peak ? `${formatDate(peak.date)} (${peak.sessions} sessions)` : "No sessions", "peak")
  ].join("");

  const months = monthlySummary(state.sessions.filter((row) => row.status !== "Cancelled").filter(hasUsableDate)).slice(-12);
  const max = Math.max(1, ...months.map((row) => row.pay));
  const peakMonthPay = Math.max(0, ...months.map((row) => row.pay));
  $("#monthlyChart").innerHTML = months.map((row) => {
    const height = Math.max(4, (row.pay / max) * 100);
    const peakClass = row.pay === peakMonthPay ? " peak-month" : "";
    return `<div class="bar${peakClass}"><span class="bar-value">${moneyShort(row.pay)}</span><span class="bar-fill" style="height:${height}%"></span><span class="bar-label">${escapeHtml(monthName(row.month, true))}</span></div>`;
  }).join("") || `<p class="empty">No monthly data yet.</p>`;

  $("#averageMetrics").innerHTML = [
    metric("Avg Hours / Day", number(avgHours), activeDays ? `${activeDays} logged days` : "No logged days", "unclaimed"),
    metric("Avg Earnings / Day", money(avgEarnings), monthLabel, "earnings")
  ].join("");

  const statusRows = [
    ["Claimed", claimed],
    ["For Claiming", forClaiming],
    ["Pending", pending]
  ];
  const statusMax = Math.max(1, ...statusRows.map((row) => row[1]));
  $("#statusStack").innerHTML = statusRows.map(([label, value]) => (
    `<div class="status-row status-${statusClass(label)}"><strong>${escapeHtml(label)}</strong><div class="track"><span style="width:${(value / statusMax) * 100}%"></span></div><span>${money(value)}</span></div>`
  )).join("");

  const rankedDays = dailySummary(rows)
    .sort((a, b) => b.pay - a.pay || b.date.localeCompare(a.date));
  const peakPay = Math.max(0, ...rankedDays.map((row) => row.pay));
  $("#peakDays").innerHTML = rankedDays.slice(0, 6).map((row) => (
    `<tr class="${row.pay === peakPay ? "peak-row" : ""}"><td>${formatDate(row.date)}</td><td>${escapeHtml(dayName(row.date))}</td><td>${row.sessions}</td><td>${number(row.hours)}</td><td>${money(row.pay)}</td></tr>`
  )).join("") || emptyRow(5);

  $("#unclaimedStudentRows").innerHTML = unclaimedByStudent().map((row) => (
    `<tr><td>${escapeHtml(row.student)}</td><td>${row.sessions}</td><td>${number(row.hours)}</td><td>${money(row.claiming)}</td><td>${money(row.open)}</td><td>${money(row.pay)}</td></tr>`
  )).join("") || emptyRow(6);
}

function renderSessions() {
  $("#sessionRows").innerHTML = sessionLogRows().map((session) => {
    const hours = totalHours(session);
    const pay = totalPay(session);
    return `<tr class="${sessionRowClass(session)}">
      <td><input type="checkbox" class="session-check" value="${escapeAttr(session.id)}"></td>
      <td>${formatDate(session.date)}</td>
      <td>${escapeHtml(packageLabel(session))}</td>
      <td>${escapeHtml(session.timeText || `${session.start}-${session.end}`)}</td>
      <td>${escapeHtml(session.student)}</td>
      <td>${escapeHtml(session.classType)}</td>
      <td>${escapeHtml(session.mode)}</td>
      <td>${number(hours)}</td>
      <td>${money(session.rate)}</td>
      <td>${money(pay)}</td>
      <td><div class="row-actions"><button class="mini" type="button" data-edit-session="${escapeAttr(session.id)}">Edit</button><button class="mini" type="button" data-delete-session="${escapeAttr(session.id)}">Delete</button></div></td>
    </tr>`;
  }).join("") || emptyRow(11);

  $$("[data-edit-session]").forEach((button) => button.addEventListener("click", () => editSession(button.dataset.editSession)));
  $$("[data-delete-session]").forEach((button) => button.addEventListener("click", () => deleteItem("sessions", button.dataset.deleteSession)));
}

function personalSessionRows() {
  return [...(state.personalSessions || [])].sort(sessionSortComparator());
}

function renderPersonalSessions() {
  const target = $("#personalSessionRows");
  if (!target) return;
  target.innerHTML = personalSessionRows().map((session) => (
    `<tr class="personal-row">
      <td>${formatDate(session.date)}</td>
      <td>${escapeHtml(packageLabel(session))}</td>
      <td>${escapeHtml(session.timeText || `${session.start}-${session.end}`)}</td>
      <td>${escapeHtml(session.student)}</td>
      <td>${escapeHtml(session.classType)}</td>
      <td>${escapeHtml(session.mode)}</td>
      <td>${number(totalHours(session))}</td>
      <td>${money(session.rate)}</td>
      <td>${money(totalPay(session))}</td>
      <td><div class="row-actions"><button class="mini" type="button" data-edit-personal="${escapeAttr(session.id)}">Edit</button><button class="mini" type="button" data-delete-personal="${escapeAttr(session.id)}">Delete</button></div></td>
    </tr>`
  )).join("") || emptyRow(10);

  $$("[data-edit-personal]").forEach((button) => button.addEventListener("click", () => editPersonalSession(button.dataset.editPersonal)));
  $$("[data-delete-personal]").forEach((button) => button.addEventListener("click", () => deleteItem("personalSessions", button.dataset.deletePersonal)));
}

function renderPersonalPackages() {
  const board = $("#personalPackageBoard");
  if (!board) return;
  const query = ($("#personalPackageSearch")?.value || "").trim().toLowerCase();
  const packages = packageSummaries(state.personalSessions || []);
  const groups = Object.entries(groupBy(packages, (item) => item.student))
    .map(([student, items]) => ({
      student,
      items: items.filter((item) => !query || student.toLowerCase().includes(query) || item.label.toLowerCase().includes(query))
    }))
    .filter((group) => group.items.length)
    .sort((a, b) => a.student.localeCompare(b.student));

  board.innerHTML = groups.map(({ student, items }) => {
    const cards = items.map(personalPackageCardHtml).join("");
    return `<section class="package-student personal-package-student"><div class="package-student-head"><h3>${escapeHtml(student)}</h3><span>${items.length} packages</span></div><div class="package-card-grid">${cards}</div></section>`;
  }).join("") || `<p class="empty">No personal packages yet.</p>`;
}

function personalPackageCardHtml(pkg) {
  const closed = pkg.sessions.length && pkg.sessions.every((session) => session.status === "Closed");
  return `<article class="package-card personal-package-card ${closed ? "personal-closed" : "personal-open"}">
    <label class="package-select"><input type="checkbox" class="personal-package-check" value="${escapeAttr(pkg.key)}"><span>${escapeHtml(pkg.label)}</span></label>
    <div class="package-stats"><span>${pkg.sessions.length} logs</span><span>${number(pkg.hours)} hrs</span><span>${money(pkg.pay)}</span></div>
    <span class="pill ${closed ? "claimed" : "pending"}">${closed ? "Closed" : "Open"}</span>
  </article>`;
}

function renderPersonalGroups() {
  const target = $("#personalStudentGroups");
  if (!target) return;
  target.innerHTML = groupedPanels("student", personalSessionRows());
}

function renderRates() {
  $("#rateRows").innerHTML = state.rates.map((rate) => (
    `<tr>
      <td>${rateSelect(rate.id, "tutor", ["All Tutors", "Graduate Tutor", "Group Class", ...state.settings.tutors], rate.tutor)}</td>
      <td>${rateSelect(rate.id, "classType", state.settings.classTypes, rate.classType)}</td>
      <td>${rateSelect(rate.id, "mode", state.settings.modes, rate.mode)}</td>
      <td>${rateSelect(rate.id, "packageName", state.settings.packages, rate.packageName)}</td>
      <td><input class="rate-edit" data-rate-id="${escapeAttr(rate.id)}" data-rate-field="amount" type="number" min="0" step="0.01" value="${escapeAttr(rate.amount)}"></td>
      <td><div class="row-actions"><button class="mini" type="button" data-delete-rate="${escapeAttr(rate.id)}">Delete</button></div></td>
    </tr>`
  )).join("") || emptyRow(6);

  $$(".rate-edit").forEach((control) => control.addEventListener("change", () => updateRateCell(control)));
  $$("[data-delete-rate]").forEach((button) => button.addEventListener("click", () => deleteItem("rates", button.dataset.deleteRate)));
}

function rateSelect(id, field, options, value) {
  return `<select class="rate-edit" data-rate-id="${escapeAttr(id)}" data-rate-field="${escapeAttr(field)}">${options.map((option) => `<option value="${escapeAttr(option)}"${option === value ? " selected" : ""}>${escapeHtml(option)}</option>`).join("")}</select>`;
}

function updateRateCell(control) {
  const rate = state.rates.find((item) => item.id === control.dataset.rateId);
  if (!rate) return;
  rate[control.dataset.rateField] = control.dataset.rateField === "amount" ? Number(control.value || 0) : control.value;
  saveState();
  setSuggestedRate();
}

function renderSchedule() {
  const order = Object.fromEntries(days.map((day, index) => [day, index]));
  const rows = [...state.schedules].sort((a, b) => order[a.day] - order[b.day] || a.start.localeCompare(b.start));
  $("#scheduleRows").innerHTML = rows.map((item) => (
    `<tr>
      <td>${escapeHtml(item.day)}</td>
      <td>${escapeHtml(item.start)}-${escapeHtml(item.end)}</td>
      <td>${escapeHtml(item.student)}</td>
      <td>${escapeHtml(item.mode)}</td>
      <td>${escapeHtml(item.frequency)}</td>
      <td>${escapeHtml(item.status)}</td>
      <td>${escapeHtml(item.notes || "")}</td>
      <td><div class="row-actions"><button class="mini" type="button" data-edit-schedule="${escapeAttr(item.id)}">Edit</button><button class="mini" type="button" data-delete-schedule="${escapeAttr(item.id)}">Delete</button></div></td>
    </tr>`
  )).join("") || emptyRow(8);

  $$("[data-edit-schedule]").forEach((button) => button.addEventListener("click", () => editSchedule(button.dataset.editSchedule)));
  $$("[data-delete-schedule]").forEach((button) => button.addEventListener("click", () => deleteItem("schedules", button.dataset.deleteSchedule)));
}

function renderWeekly() {
  const startHour = 8;
  const endHour = 24;
  const pixelsPerHour = 72;
  const rows = endHour - startHour;
  const timeLabels = Array.from({ length: rows + 1 }, (_, index) => {
    const hour = startHour + index;
    return `<div class="time-label" style="grid-column:1;grid-row:${index + 2}">${formatHour(hour)}</div>`;
  }).join("");
  const dayHeads = days.map((day, index) => `<div class="week-day-head" style="grid-column:${index + 2};grid-row:1">${day}</div>`).join("");
  const hourLines = Array.from({ length: rows }, (_, index) => `<div class="hour-line" style="grid-column:1 / 9;grid-row:${index + 2}"></div>`).join("");
  const scheduleItems = state.schedules
    .filter((item) => item.status !== "Inactive")
    .filter((item) => item.start && item.end);
  const dayLanes = days.map((day, index) => {
    const blocks = scheduleBlocksForDay(scheduleItems.filter((item) => item.day === day), startHour, endHour, pixelsPerHour);
    return `<div class="week-day-lane" style="grid-column:${index + 2};grid-row:2 / ${rows + 2}">${blocks}</div>`;
  }).join("");
  $("#weekGrid").innerHTML = `${dayHeads}${timeLabels}${hourLines}${dayLanes}`;
}

function scheduleBlocksForDay(items, startHour, endHour, pixelsPerHour) {
  const blocks = items.map((item) => {
    const rawStart = timeToDecimal(item.start);
    const rawEnd = timeToDecimal(item.end) <= rawStart ? 24 : timeToDecimal(item.end);
    const start = Math.max(rawStart, startHour);
    const end = Math.min(rawEnd, endHour);
    if (end <= startHour || start >= endHour || end <= start) return null;
    return { item, start, end };
  }).filter(Boolean).sort((a, b) => a.start - b.start || a.end - b.end);

  const columnEnds = [];
  blocks.forEach((block) => {
    let column = columnEnds.findIndex((end) => end <= block.start);
    if (column < 0) column = columnEnds.length;
    columnEnds[column] = block.end;
    block.column = column;
  });

  const columnCount = Math.max(1, columnEnds.length);
  return blocks.map((block) => {
    const top = (block.start - startHour) * pixelsPerHour;
    const height = Math.max(48, (block.end - block.start) * pixelsPerHour - 6);
    const left = `calc(${(block.column / columnCount) * 100}% + 6px)`;
    const width = `calc(${100 / columnCount}% - 12px)`;
    return `<div class="schedule-block ${normalizeMode(block.item.mode)} ${scheduleTypeClass(block.item)}" style="top:${top}px;height:${height}px;left:${left};right:auto;width:${width}"><strong>${escapeHtml(block.item.student)}</strong><span>${escapeHtml(block.item.timeText || `${block.item.start}-${block.item.end}`)}</span></div>`;
  }).join("");
}

function renderPackages() {
  const query = ($("#packageSearch")?.value || "").trim().toLowerCase();
  const packages = packageSummaries(state.sessions.filter(matchesTutorFilter));
  const byStudent = groupBy(packages, (item) => item.student);
  const groups = Object.entries(byStudent)
    .map(([student, items]) => ({
      student,
      items: items.filter((item) => !query || student.toLowerCase().includes(query) || item.label.toLowerCase().includes(query))
    }))
    .filter((group) => group.items.length)
    .sort((a, b) => Number(hasOpenPackage(b.items)) - Number(hasOpenPackage(a.items)) || a.student.localeCompare(b.student));

  $("#packageBoard").innerHTML = groups.map(({ student, items }) => {
    const sortedItems = items
      .sort((a, b) => (a.packageNo || 999) - (b.packageNo || 999) || a.label.localeCompare(b.label))
    const visiblePackages = sortedItems.filter((pkg) => !pkg.sessions.every(isClaimedStatus));
    const claimedPackages = sortedItems.filter((pkg) => pkg.sessions.length && pkg.sessions.every(isClaimedStatus));
    const cards = visiblePackages.map(packageCardHtml).join("");
    const claimedCards = claimedPackages.map(packageCardHtml).join("");
    const claimedTotal = sum(claimedPackages, (pkg) => pkg.pay);
    const claimedDropdown = claimedPackages.length
      ? `<details class="claimed-package-dropdown">
          <summary><span>Claimed / collected packages</span><strong>${claimedPackages.length} / ${money(claimedTotal)}</strong></summary>
          <div class="package-card-grid claimed-grid">${claimedCards}</div>
        </details>`
      : "";
    const activeText = hasOpenPackage(items) ? "Active package" : "No open package";
    const visibleGrid = cards ? `<div class="package-card-grid">${cards}</div>` : "";
    return `<section class="package-student"><div class="package-student-head"><h3>${escapeHtml(student)}</h3><span>${escapeHtml(activeText)} / ${items.length} packages</span></div>${visibleGrid}${claimedDropdown}</section>`;
  }).join("") || `<p class="empty">No packages yet.</p>`;
}

function packageCardHtml(pkg) {
  const packageState = packageStatus(pkg.sessions);
  const claimAnimation = recentlyClaimedPackageKeys.has(pkg.key) ? " payroll-claimed-flash" : "";
  return `<article class="package-card ${packageState.className}${claimAnimation}" data-package-key="${escapeAttr(pkg.key)}">
    <label class="package-select"><input type="checkbox" class="package-check" value="${escapeAttr(pkg.key)}"><span>${escapeHtml(pkg.label)}</span></label>
    <div class="package-stats">
      <span>${pkg.sessions.length} logs</span>
      <span>${number(pkg.hours)} hrs</span>
      <span>${money(pkg.pay)}</span>
    </div>
    <span class="pill ${packageState.pillClass}">${packageState.label}</span>
  </article>`;
}

function renderClaiming() {
  const rows = claimableSessions();
  const totals = summarize(rows);
  $("#claimMetrics").innerHTML = [
    metric("Claimable Amount", money(totals.pay), `${totals.sessions} sessions`),
    metric("Total Hours", number(totals.hours), "selected for payment"),
    metric("Claim Date", $("#claimDate").value ? formatDate($("#claimDate").value) : "Not set", "salary release")
  ].join("");

  const groups = packageSummaries(rows);
  $("#claimRows").innerHTML = groups.map((pkg) => {
    const typeClass = pkg.sessions.some(isGroupSession) ? "group-session" : "individual-session";
    const body = pkg.sessions.map((session) => (
      `<tr class="claim-row ${sessionRowClass(session)}">
        <td>${formatDate(session.date)}</td>
        <td>${escapeHtml(session.student)}</td>
        <td>${number(totalHours(session))}</td>
        <td>${money(session.rate)}</td>
        <td>${money(totalPay(session))}</td>
      </tr>`
    )).join("");
    return `<tr class="claim-package-head ${typeClass}"><td colspan="5"><strong>${escapeHtml(pkg.student)} / ${escapeHtml(pkg.label)}</strong><span>${number(pkg.hours)} hrs / ${money(pkg.pay)}</span></td></tr>${body}<tr class="claim-package-total ${typeClass}"><td colspan="2">TOTAL HRS</td><td>${number(pkg.hours)}</td><td>TOTAL</td><td>${money(pkg.pay)}</td></tr>`;
  }).join("") || emptyRow(5);
}

function renderArchive() {
  const totalEver = totalPayrollEverSince();
  const importedClaimed = sum(state.claimHistory || [], (claim) => Number(claim.amount || 0));
  const sessionClaimed = sum(state.sessions.filter(isClaimedStatus), totalPay);
  const claimRows = (state.claimHistory || []).length
    ? [...state.claimHistory].sort((a, b) => b.claimDate.localeCompare(a.claimDate))
    : claimHistoryFromSessions();

  $("#archiveMetrics").innerHTML = [
    metric("Total Claimed Payroll", money(importedClaimed || sessionClaimed), `${claimRows.length} claim dates`),
    metric("Total Payroll Ever Since", money(totalEver), `${state.sessions.length} logs`),
    metric("Current Unclaimed", money(currentUnclaimedTotal()), "open or ready for claiming")
  ].join("");

  $("#archiveRows").innerHTML = claimRows.map((claim) => (
    `<tr><td>${formatDate(claim.claimDate)}</td><td>${escapeHtml(claim.label || "Claimed Payroll")}</td><td>${escapeHtml(claim.logs || "")}</td><td>${money(claim.amount)}</td></tr>`
  )).join("") || emptyRow(4);
}

function totalPayrollEverSince() {
  const claimedFromHistory = sum(state.claimHistory || [], (claim) => Number(claim.amount || 0));
  const currentUnclaimed = currentUnclaimedTotal();
  const sessionTotal = sum(state.sessions.filter((session) => session.status !== "Cancelled"), totalPay);
  return Math.max(sessionTotal, claimedFromHistory + currentUnclaimed);
}

function currentUnclaimedTotal() {
  return sum(unclaimedSessions(), totalPay);
}

function unclaimedSessions() {
  return state.sessions.filter((session) => !isClaimedStatus(session) && session.status !== "Cancelled");
}

function unclaimedByStudent() {
  return Object.entries(groupBy(unclaimedSessions(), (session) => session.student || "Unassigned"))
    .map(([student, sessions]) => ({
      student,
      sessions: sessions.length,
      hours: sum(sessions, totalHours),
      claiming: sum(sessions.filter(isClaimingStatus), totalPay),
      open: sum(sessions.filter(isOpenStatus), totalPay),
      pay: sum(sessions, totalPay)
    }))
    .sort((a, b) => b.pay - a.pay || a.student.localeCompare(b.student));
}

function renderGroups() {
  const rows = state.sessions
    .filter(matchesTutorFilter)
    .filter((session) => session.status !== "Cancelled")
    .sort(sessionSortComparator());
  $("#studentGroups").innerHTML = groupedPanels("student", rows);
}

function renderSummaries() {
  const rows = summaryFilteredSessions();
  const allRows = state.sessions.filter(hasUsableDate).filter((session) => session.status !== "Cancelled");
  const currentYear = new Date().getFullYear().toString();
  const currentMonth = new Date().toISOString().slice(0, 7);
  const bestMonth = monthlySummary(allRows).sort((a, b) => b.pay - a.pay || a.month.localeCompare(b.month))[0] || null;
  const bestDayAll = peakDay(allRows);
  const bestDayYear = peakDay(allRows.filter((session) => session.date?.startsWith(currentYear)));
  const bestDayMonth = peakDay(allRows.filter((session) => session.date?.startsWith(currentMonth)));

  $("#summaryStats").innerHTML = [
    metric("Highest Month All Time", bestMonth ? money(bestMonth.pay) : money(0), bestMonth ? monthName(bestMonth.month) : "No sessions", "earnings"),
    metric("Peak Day All Time", bestDayAll ? money(bestDayAll.pay) : money(0), bestDayAll ? formatDate(bestDayAll.date) : "No sessions", "peak"),
    metric("Peak Day This Year", bestDayYear ? money(bestDayYear.pay) : money(0), bestDayYear ? formatDate(bestDayYear.date) : "No sessions", "unclaimed"),
    metric("Peak Day This Month", bestDayMonth ? money(bestDayMonth.pay) : money(0), bestDayMonth ? formatDate(bestDayMonth.date) : "No sessions", "total")
  ].join("");

  $("#dailyRows").innerHTML = dailySummary(rows).map((row) => (
    `<tr><td>${formatDate(row.date)}</td><td>${escapeHtml(dayName(row.date))}</td><td>${row.sessions}</td><td>${number(row.hours)}</td><td>${money(row.pay)}</td><td>${money(row.claimed)}</td><td>${money(row.unclaimed)}</td></tr>`
  )).join("") || emptyRow(7);

  $("#monthlyRows").innerHTML = monthlySummary(rows).map((row) => (
    `<tr><td>${escapeHtml(monthName(row.month))}</td><td>${row.sessions}</td><td>${number(row.hours)}</td><td>${money(row.pay)}</td><td>${money(row.avgRate)}</td><td>${money(row.avgSession)}</td><td>${money(row.claimed)}</td><td>${money(row.unclaimed)}</td><td>${money(row.claiming)}</td></tr>`
  )).join("") || emptyRow(9);
}

function renderStudentStatuses() {
  syncStudentRecords();
  $("#studentStatusRows").innerHTML = sortStudentRecords(state.studentRecords).map((student) => (
    `<tr>
      <td>${escapeHtml(student.name)}</td>
      <td><select class="student-status" data-student-key="${escapeAttr(student.key)}"><option${student.status === "Active" ? " selected" : ""}>Active</option><option${student.status === "Inactive" ? " selected" : ""}>Inactive</option><option${student.status === "Transferred" ? " selected" : ""}>Transferred</option></select></td>
      <td><input class="student-note" data-student-key="${escapeAttr(student.key)}" value="${escapeAttr(student.notes || "")}" placeholder="Optional"></td>
    </tr>`
  )).join("") || emptyRow(3);

  $$(".student-status").forEach((select) => select.addEventListener("change", () => updateStudentRecord(select.dataset.studentKey, { status: select.value })));
  $$(".student-note").forEach((input) => input.addEventListener("change", () => updateStudentRecord(input.dataset.studentKey, { notes: input.value.trim() })));
}

function renderRecords() {
  const list = $("#recordsList");
  if (!list) return;
  const records = sortedRecords().filter(hasRecordAttachment);
  list.innerHTML = records.map((record) => (
    `<article class="record-card">
      <div>
        <span class="pill">${escapeHtml(record.category)}</span>
        <h3>${escapeHtml(record.title)}</h3>
        <p>${escapeHtml([record.organization, record.location].filter(Boolean).join(" / "))}</p>
        <small>${escapeHtml(formatRecordPeriod(record))}</small>
      </div>
      <p>${escapeHtml(record.description || "")}</p>
      ${recordProofHtml(record)}
      <div class="row-actions"><button class="mini" type="button" data-edit-record="${escapeAttr(record.id)}">Edit</button><button class="mini" type="button" data-delete-record="${escapeAttr(record.id)}">Delete</button></div>
    </article>`
  )).join("") || `<p class="empty">No attached credential records yet.</p>`;

  $$("[data-edit-record]").forEach((button) => button.addEventListener("click", () => editRecord(button.dataset.editRecord)));
  $$("[data-delete-record]").forEach((button) => button.addEventListener("click", () => deleteItem("records", button.dataset.deleteRecord)));
}

function renderCareerDocuments() {
  updateDocumentProfile();
  renderResumeFromSelection($("#resumeContent"));
  renderCurriculumVitae($("#cvContent"));
  renderCvAttachments();
}

function updateDocumentProfile() {
  const profile = normalizeCvProfile(state.cvProfile || {});
  [["#resumeDocumentName", profile.name], ["#cvDocumentName", profile.name], ["#resumeDocumentHeadline", profile.headline], ["#cvDocumentHeadline", profile.headline], ["#resumeDocumentPlace", profile.place], ["#cvDocumentPlace", profile.place], ["#resumeDocumentContact", profile.contact], ["#cvDocumentContact", profile.contact]].forEach(([selector, value]) => {
    const element = $(selector);
    if (element) element.textContent = value || "";
  });
}

function renderResumeFromSelection(target) {
  if (!target) return;
  const selectedIds = new Set(state.cvResumeItemIds || []);
  const groups = cvSectionGroups().map((section) => ({
    ...section,
    items: section.items.filter((item) => selectedIds.has(item.id))
  })).filter((section) => section.items.length);

  if ($("#clearResume")) $("#clearResume").disabled = !groups.length;

  target.innerHTML = groups.map((section) => {
    return `<section class="document-section" data-cv-section="${escapeAttr(section.id)}">
      <h3>${escapeHtml(section.title)}</h3>
      <div class="document-items">
        ${section.items.map((item) => cvItemHtml(item, { resume: true, sectionId: section.id })).join("")}
      </div>
    </section>`;
  }).join("") || `<section class="document-section"><p class="empty">Select CV details, then add them to the resume.</p></section>`;

  $$("[data-remove-resume-item]").forEach((button) => button.addEventListener("click", () => removeResumeItem(button.dataset.removeResumeItem)));
}

function renderCurriculumVitae(target) {
  if (!target) return;
  const selectClass = cvSelectionMode ? " cv-selecting" : "";
  if ($("#toggleCvSelect")) $("#toggleCvSelect").textContent = cvSelectionMode ? "Done Selecting" : "Select Details";
  if ($("#addSelectedToResume")) $("#addSelectedToResume").disabled = !selectedCvItems.size;
  target.innerHTML = cvSectionGroups().map((section) => `<section class="document-section${selectClass}" data-cv-section="${escapeAttr(section.id)}">
    <h3>${escapeHtml(section.title)}</h3>
    <div class="document-items">
      ${section.items.map((item) => cvItemHtml(item, { selectable: cvSelectionMode, sectionId: section.id })).join("")}
    </div>
  </section>`).join("");

  $$("[data-cv-select]").forEach((checkbox) => checkbox.addEventListener("change", () => {
    if (checkbox.checked) selectedCvItems.add(checkbox.dataset.cvSelect);
    else selectedCvItems.delete(checkbox.dataset.cvSelect);
    if ($("#addSelectedToResume")) $("#addSelectedToResume").disabled = !selectedCvItems.size;
  }));
  $$("[data-edit-cv-item]").forEach((button) => button.addEventListener("click", () => editCvItem(button.dataset.sectionId, button.dataset.editCvItem)));
  $$("[data-cv-record-edit]").forEach((button) => button.addEventListener("click", () => editRecord(button.dataset.cvRecordEdit)));
}

function cvSectionGroups() {
  const sections = normalizeCvSections(state.cvSections || buildDefaultCvSections()).map((section) => ({
    ...section,
    items: section.items.map((item) => ({ ...item, id: item.id || uid(), source: "cv" }))
  }));
  const byId = Object.fromEntries(sections.map((section) => [section.id, section]));
  sortedRecords().forEach((record) => {
    const sectionId = sectionIdFromTitle(record.category || "Works");
    if (sectionId === "records-only") return;
    const section = byId[sectionId] || byId.works || sections[0];
    section.items.push(recordToCvItem(record));
  });
  sections.forEach((section) => {
    if (section.id === "work-experience") {
      section.items = section.items
        .map((item, index) => ({ item, index }))
        .sort((a, b) => cvDateRank(b.item.date) - cvDateRank(a.item.date) || a.index - b.index)
        .map(({ item }) => item);
    }
    if (section.id === "works") {
      section.items = section.items
        .map((item, index) => ({ item, index }))
        .sort((a, b) => worksItemPriority(a.item) - worksItemPriority(b.item) || a.index - b.index)
        .map(({ item }) => item);
    }
  });
  return sections;
}

function worksItemPriority(item) {
  const text = [item.title, item.meta, item.description].filter(Boolean).join(" ");
  if (/undergraduate\s+thesis|\bthesis\b/i.test(text)) return 0;
  if (/undergraduate\s+research|\bresearch\b/i.test(text)) return 1;
  return 2;
}

function cvDateRank(value) {
  const text = String(value || "").trim();
  if (!text) return 0;
  if (/present|current|ongoing/i.test(text)) return 999999;
  const monthLookup = {
    january: 1, february: 2, march: 3, april: 4, may: 5, june: 6,
    july: 7, august: 8, september: 9, october: 10, november: 11, december: 12
  };
  const monthMatches = [...text.matchAll(/\b(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{4})\b/gi)]
    .map((match) => Number(match[2]) * 100 + monthLookup[match[1].toLowerCase()]);
  if (monthMatches.length) return Math.max(...monthMatches);
  const years = [...text.matchAll(/\b(19|20)\d{2}\b/g)].map((match) => Number(match[0]) * 100);
  return years.length ? Math.max(...years) : 0;
}

function recordToCvItem(record) {
  return {
    id: `record:${record.id}`,
    recordId: record.id,
    source: "record",
    title: record.title || "",
    date: formatRecordPeriod(record),
    meta: [record.organization, record.location].filter(Boolean).join(" / "),
    description: record.description || "",
    descriptionItalic: true,
    bullets: record.bullets || []
  };
}

function cvItemHtml(item, options = {}) {
  const selector = options.selectable
    ? `<label class="cv-select-control no-print"><input type="checkbox" data-cv-select="${escapeAttr(item.id)}" ${selectedCvItems.has(item.id) ? "checked" : ""}><span>Add</span></label>`
    : "";
  const editButton = item.recordId
    ? `<button class="mini cv-edit-button no-print" type="button" data-cv-record-edit="${escapeAttr(item.recordId)}">Edit</button>`
    : `<button class="mini cv-edit-button no-print" type="button" data-section-id="${escapeAttr(options.sectionId || "")}" data-edit-cv-item="${escapeAttr(item.id)}">Edit</button>`;
  const removeButton = options.resume
    ? `<button class="mini cv-edit-button no-print" type="button" data-remove-resume-item="${escapeAttr(item.id)}">Remove</button>`
    : "";
  const bulletHtml = item.bullets?.length
    ? options.sectionId === "works"
      ? `<div class="document-inline-details">${item.bullets.map((bullet) => `<p>${escapeHtml(bullet)}</p>`).join("")}</div>`
      : `<ul>${item.bullets.map((bullet) => `<li>${escapeHtml(bullet)}</li>`).join("")}</ul>`
    : "";
  return `<article class="document-item cv-detail-item">
    <div class="document-item-main">
      ${selector}
      <div class="document-item-body">
        <div class="document-item-title"><strong>${escapeHtml(item.title)}</strong>${item.date ? `<span>${escapeHtml(item.date)}</span>` : ""}</div>
        ${item.meta ? `<p class="document-item-meta">${escapeHtml(item.meta)}</p>` : ""}
        ${item.description ? `<p class="${item.descriptionItalic ? "document-item-description is-italic" : "document-item-description"}">${escapeHtml(item.description)}</p>` : ""}
        ${bulletHtml}
      </div>
      ${options.resume ? removeButton : editButton}
    </div>
  </article>`;
}

function renderCvAttachments() {
  const target = $("#cvAttachments");
  if (!target) return;
  const files = [
    { label: "Old Curriculum Vitae", href: "Assets/Ramirez_JohnLloyd_CV.pdf" },
    ...sortedRecords().filter(hasRecordAttachment).map((record) => ({
      label: record.fileName || record.file,
      recordId: record.id,
      title: record.title
    }))
  ];
  target.innerHTML = files.map((file) => `<article class="record-card attachment-card">
    <div>
      <h3>${escapeHtml(file.title || file.label)}</h3>
      ${file.title ? `<p>${escapeHtml(file.label)}</p>` : ""}
    </div>
    ${file.recordId
      ? `<button class="button-link" type="button" data-open-record-file="${escapeAttr(file.recordId)}">Open File</button>`
      : `<a class="button-link" href="${escapeAttr(file.href)}" target="_blank" rel="noopener">Open File</a>`}
  </article>`).join("") || `<p class="empty">No attached files yet.</p>`;
  bindAttachmentOpeners();
}

function toggleCvSelectionMode() {
  cvSelectionMode = !cvSelectionMode;
  if (!cvSelectionMode) selectedCvItems.clear();
  renderCareerDocuments();
}

function addSelectedCvItemsToResume() {
  if (!selectedCvItems.size) return;
  state.cvResumeItemIds = uniqueValues([...(state.cvResumeItemIds || []), ...selectedCvItems]);
  selectedCvItems.clear();
  cvSelectionMode = false;
  saveState();
  renderCareerDocuments();
}

function removeResumeItem(id) {
  state.cvResumeItemIds = (state.cvResumeItemIds || []).filter((itemId) => itemId !== id);
  saveState();
  renderCareerDocuments();
}

function clearResumeDetails() {
  state.cvResumeItemIds = [];
  saveState();
  renderCareerDocuments();
}

function editCvItem(sectionId, itemId) {
  const section = (state.cvSections || []).find((item) => item.id === sectionId);
  const item = section?.items?.find((detail) => detail.id === itemId);
  if (!section || !item) return;
  $("#cvDetailEditingSection").value = section.id;
  $("#cvDetailEditingId").value = item.id;
  $("#cvDetailSection").value = section.id;
  $("#cvDetailTitle").value = item.title || "";
  $("#cvDetailDate").value = item.date || "";
  $("#cvDetailMeta").value = item.meta || "";
  $("#cvDetailDescription").value = item.description || "";
  $("#cvDetailBullets").value = (item.bullets || []).join("\n");
  $("#cvDetailTitle").focus();
  $(".cv-builder-grid")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function saveCvDetail(event) {
  event?.preventDefault();
  const originalSectionId = $("#cvDetailEditingSection")?.value || "";
  const itemId = $("#cvDetailEditingId")?.value || "";
  const targetSectionId = $("#cvDetailSection")?.value || originalSectionId;
  if (!originalSectionId || !itemId) return;

  state.cvSections = normalizeCvSections(state.cvSections || buildDefaultCvSections());
  const originalSection = state.cvSections.find((section) => section.id === originalSectionId);
  const targetSection = state.cvSections.find((section) => section.id === targetSectionId) || originalSection;
  const itemIndex = originalSection?.items?.findIndex((detail) => detail.id === itemId) ?? -1;
  if (!originalSection || !targetSection || itemIndex < 0) return;

  const [item] = originalSection.items.splice(itemIndex, 1);
  Object.assign(item, {
    title: $("#cvDetailTitle")?.value.trim() || "",
    date: $("#cvDetailDate")?.value.trim() || "",
    meta: $("#cvDetailMeta")?.value.trim() || "",
    description: $("#cvDetailDescription")?.value.trim() || "",
    bullets: ($("#cvDetailBullets")?.value || "").split(/\r?\n/).map((line) => line.trim()).filter(Boolean)
  });
  if (targetSection.id === originalSection.id) targetSection.items.splice(itemIndex, 0, item);
  else targetSection.items.push(item);
  $("#cvDetailEditingSection").value = targetSection.id;
  saveState();
  renderCareerDocuments();
}

function resetCvDetailEditor() {
  if (!$("#cvDetailForm")) return;
  $("#cvDetailForm").reset();
  $("#cvDetailEditingSection").value = "";
  $("#cvDetailEditingId").value = "";
}

function saveCvProfile(event) {
  event?.preventDefault();
  state.cvProfile = {
    ...buildDefaultCvProfile(),
    ...(state.cvProfile || {}),
    name: $("#cvDisplayName")?.value.trim() ?? "",
    headline: $("#cvHeadline")?.value.trim() ?? "",
    place: $("#cvPlace")?.value.trim() ?? "",
    contact: $("#cvContact")?.value.trim() ?? ""
  };
  saveState();
  renderCareerDocuments();
}

function sortedRecords() {
  return [...(state.records || [])].sort((a, b) => (b.startDate || b.date || "").localeCompare(a.startDate || a.date || "") || (a.category || "").localeCompare(b.category || "") || (a.title || "").localeCompare(b.title || ""));
}

function recordProofHtml(record) {
  if (!hasRecordAttachment(record)) return "";
  const label = record.fileName || record.file;
  return `<details class="proof-details">
    <summary>Attachment / Documents</summary>
    <button class="attachment-text-link" type="button" data-open-record-file="${escapeAttr(record.id)}">${escapeHtml(label)}</button>
  </details>`;
}

function groupedPanels(key, rows) {
  const groups = groupBy(rows, (row) => row[key] || "Unassigned");
  return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b)).map(([name, items]) => {
    const totals = summarize(items.filter((item) => item.status !== "Cancelled"));
    const rowHtml = (session) => (
      `<tr class="${sessionRowClass(session)}"><td>${formatDate(session.date)}</td><td>${escapeHtml(dayName(session.date))}</td><td>${escapeHtml(session.timeText || `${session.start}-${session.end}`)}</td><td>${escapeHtml(session.student)}</td><td>${escapeHtml(packageLabel(session))}</td><td>${escapeHtml(session.classType)}</td><td>${number(totalHours(session))}</td><td>${money(session.rate)}</td><td>${money(totalPay(session))}</td><td>${statusPill(session.status)}</td></tr>`
    );
    const tableHtml = (list) => `<div class="table-wrap"><table><thead><tr><th>Date</th><th>Day</th><th>Time</th><th>Student</th><th>Package</th><th>Type</th><th>Hours</th><th>Rate</th><th>Total</th><th>Status</th></tr></thead><tbody>${list.map(rowHtml).join("") || emptyRow(10)}</tbody></table></div>`;
    const openItems = items.filter((session) => !isClaimedStatus(session));
    const claimedItems = items.filter(isClaimedStatus);
    const claimedPay = sum(claimedItems, totalPay);
    const claimedDetails = claimedItems.length
      ? `<details class="claimed-package-dropdown student-claimed-dropdown">
          <summary><span>Claimed options</span><strong>${claimedItems.length} logs / ${money(claimedPay)}</strong></summary>
          ${tableHtml(claimedItems)}
        </details>`
      : "";
    return `<section class="panel">
      <div class="panel-head"><h2>${escapeHtml(name)}</h2></div>
      <div class="group-summary"><span class="pill">${totals.sessions} sessions</span><span class="pill">${number(totals.hours)} hours</span><span class="pill">${money(totals.pay)}</span></div>
      ${tableHtml(openItems)}
      ${claimedDetails}
    </section>`;
  }).join("") || `<section class="panel"><p class="empty">No grouped logs yet.</p></section>`;
}

function packageSummaries(rows = state.sessions) {
  const groups = groupBy(rows, (session) => `${session.student || "Unassigned"}::${packageGroupLabel(session)}`);
  return Object.entries(groups).map(([key, sessions]) => {
    const [student, label] = key.split("::");
    const sorted = [...sessions].sort((a, b) => a.date.localeCompare(b.date));
    return {
      key,
      student,
      label,
      packageNo: sorted.find((session) => session.packageNo)?.packageNo || packageNumber(label),
      sessions: sorted,
      hours: sum(sorted, totalHours),
      pay: sum(sorted, totalPay)
    };
  }).sort((a, b) => a.student.localeCompare(b.student) || (a.packageNo || 999) - (b.packageNo || 999) || a.label.localeCompare(b.label));
}

function updateSessionPackageOptions(selected = "", blankDefault = false) {
  const select = $("#sessionClaimPackage");
  if (!select) return;
  const student = $("#sessionStudent")?.value || "";
  const summaries = packageSummaries(state.sessions.filter((session) => session.student === student));
  const existing = summaries.map((pkg) => pkg.label);
  const numbers = existing.map(packageNumber).filter(Boolean);
  const next = `PACKAGE ${Math.max(0, ...numbers) + 1}`;
  const openPackage = summaries.find((pkg) => pkg.sessions.some(isOpenStatus))?.label;
  const options = [...new Set([...existing, next, selected].filter(Boolean))];
  fillSelect(select, options.length ? options : ["PACKAGE 1"], blankDefault ? "" : selected || openPackage || next || options[0] || "PACKAGE 1");
}

function setSelectedPackagesStatus(status) {
  const selected = new Set($$(".package-check:checked").map((box) => box.value));
  if (!selected.size) return;
  const claimDate = $("#packageClaimDate")?.value || $("#claimDate")?.value || claimCutoffDate();
  const changed = [];
  state.sessions.forEach((session) => {
    const key = `${session.student || "Unassigned"}::${packageGroupLabel(session)}`;
    if (!selected.has(key)) return;
    if (session.status === "Archived" || session.status === "Cancelled") return;
    if (status !== "Claimed" && isClaimedStatus(session)) return;

    const wasClaimed = isClaimedStatus(session);
    session.status = status;
    session.claimed = status === "Claimed";
    session.claimDate = status === "Claimed" ? claimDate : "";
    session.color = status === "Claimed" ? "claimed" : status === "For Claiming" ? "claiming" : "open";
    if (status === "Claimed" && !wasClaimed) changed.push(session);
  });
  if (status === "Claimed" && changed.length) {
    recentlyClaimedPackageKeys = new Set(selected);
  }
  saveState();
  render();
  if (status === "Claimed" && changed.length) {
    window.setTimeout(() => {
      recentlyClaimedPackageKeys.clear();
      $$(".payroll-claimed-flash").forEach((card) => card.classList.remove("payroll-claimed-flash"));
    }, 1400);
  }
}

function setPersonalSelectedPackagesStatus(status) {
  const selected = new Set($$(".personal-package-check:checked").map((box) => box.value));
  if (!selected.size) return;
  state.personalSessions ||= [];
  state.personalSessions.forEach((session) => {
    const key = `${session.student || "Unassigned"}::${packageGroupLabel(session)}`;
    if (selected.has(key)) session.status = status;
  });
  saveState();
  render();
}

function syncStudentRecords() {
  state.studentRecords ||= [];
  const byName = Object.fromEntries(state.studentRecords.map((student) => [student.name, student]));
  state.settings.students.forEach((name) => {
    if (!byName[name]) state.studentRecords.push({ key: name, name, status: "Active", notes: "" });
  });
  state.studentRecords = state.studentRecords.filter((student) => state.settings.students.includes(student.name));
  state.settings.students = sortNames(uniqueValues(state.settings.students));
  state.studentRecords = sortStudentRecords(state.studentRecords);
}

function updateStudentRecord(key, changes) {
  const record = state.studentRecords.find((student) => student.key === key);
  if (!record) return;
  Object.assign(record, changes);
  saveState();
  hydrateControls();
}

function ensureStudent(name) {
  if (!name) return;
  if (!state.settings.students.includes(name)) state.settings.students.push(name);
  state.studentRecords ||= [];
  if (!state.studentRecords.some((student) => student.name === name)) {
    state.studentRecords.push({ key: name, name, status: "Active", notes: "Created from session log" });
  }
  syncStudentRecords();
}

function activeStudentNames() {
  syncStudentRecords();
  const inactive = new Set(state.studentRecords.filter((student) => student.status !== "Active").map((student) => student.name));
  return sortNames(state.settings.students.filter((student) => normalizeStudentName(student) !== "SUBS" && !inactive.has(student)));
}

function personalStudentNames() {
  return sortNames([...(new Set((state.personalSessions || []).map((session) => session.student).filter(Boolean)))]);
}

function sortNames(values) {
  return [...values].filter(Boolean).sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }));
}

function sortStudentRecords(records) {
  return [...records].sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: "base" }));
}

function setInactiveExceptOpenStudents() {
  syncStudentRecords();
  const openStudents = new Set(state.sessions.filter(isOpenStatus).map((session) => session.student).filter(Boolean));
  state.studentRecords = state.studentRecords.map((student) => ({
    ...student,
    status: openStudents.has(student.name) ? "Active" : "Inactive"
  }));
  state.studentStatusPolicyVersion = STUDENT_STATUS_POLICY_VERSION;
  saveState();
  hydrateControls();
  render();
}

function hydrateSummaryYears() {
  const years = [...new Set(state.sessions.filter(hasUsableDate).map((session) => session.date?.slice(0, 4)).filter(Boolean))].sort();
  fillSelect($("#summaryYear"), years, $("#summaryYear").value || years[years.length - 1] || new Date().getFullYear().toString());
  hydrateSummaryMonths();
}

function hydrateSummaryMonths(resetSelection = false) {
  const year = $("#summaryYear").value;
  const months = [...new Set(state.sessions.filter(hasUsableDate).filter((session) => !year || session.date?.startsWith(year)).map((session) => session.date?.slice(0, 7)).filter(Boolean))].sort();
  const options = months.map((month) => monthName(month));
  const current = resetSelection ? "" : $("#summaryMonth").value;
  fillSelect($("#summaryMonth"), options, current && options.includes(current) ? current : "");
}

function summaryFilteredSessions() {
  const year = $("#summaryYear").value;
  const monthLabelValue = $("#summaryMonth").value;
  const month = monthLabelValue ? monthValueFromName(monthLabelValue) : "";
  return state.sessions
    .filter(hasUsableDate)
    .filter((session) => session.status !== "Cancelled")
    .filter((session) => !year || session.date?.startsWith(year))
    .filter((session) => !month || session.date?.startsWith(month));
}

function claimHistoryFromSessions() {
  return Object.entries(groupBy(state.sessions.filter((session) => session.claimDate && isClaimedStatus(session)), (session) => session.claimDate))
    .map(([claimDate, sessions]) => ({
      claimDate,
      label: "Claimed Sessions",
      logs: `${sessions.length} logs`,
      amount: sum(sessions, totalPay)
    }))
    .sort((a, b) => b.claimDate.localeCompare(a.claimDate));
}

function normalizeClaimHistory(history = [], importedHistory = []) {
  const importedKeys = new Set(importedHistory.map(claimKey));
  const importedRows = importedHistory.map((claim) => ({
    ...claim,
    label: claim.label || "Claimed Payroll"
  }));
  const validManualRows = history.filter((claim) => (
    claim.source === "claiming-view" &&
    !importedKeys.has(claimKey(claim))
  ));
  return [...importedRows, ...validManualRows]
    .filter((claim) => claim.claimDate <= "2026-06-15" || claim.source === "claiming-view")
    .sort((a, b) => a.claimDate.localeCompare(b.claimDate));
}

function claimKey(claim) {
  return `${claim.claimDate || ""}::${Number(claim.amount || 0).toFixed(2)}`;
}

function hasUsableDate(session) {
  const year = Number(session.date?.slice(0, 4));
  const currentYear = new Date().getFullYear();
  return Number.isFinite(year) && year >= 2025 && year <= currentYear;
}

function saveSession(event) {
  event.preventDefault();
  const studentName = normalizeStudentName($("#sessionStudent").value.trim());
  ensureStudent(studentName);
  const id = $("#sessionId").value || uid();
  const existing = state.sessions.find((item) => item.id === id);
  const hours = Number($("#sessionHours").value || 0);
  const rate = Number($("#sessionRate").value || 0);
  const session = {
    id,
    date: $("#sessionDate").value,
    start: $("#sessionStart").value,
    end: $("#sessionEnd").value,
    timeText: `${$("#sessionStart").value}-${$("#sessionEnd").value}`,
    tutor: $("#sessionTutor").value,
    student: studentName,
    packageName: $("#sessionPackage").value,
    packageLabel: $("#sessionClaimPackage").value || "Package 1",
    classType: $("#sessionClassType").value,
    mode: $("#sessionMode").value ? normalizeModeLabel($("#sessionMode").value) : "",
    studentCount: Number($("#sessionStudents").value || 1),
    hours,
    rate,
    totalPay: hours * rate,
    status: existing?.status || "Pending",
    claimDate: existing?.claimDate || "",
    claimed: existing?.claimed || false,
    color: existing?.color || "open",
    notes: $("#sessionNotes").value.trim()
  };
  upsert("sessions", session);
  resetSessionForm();
  hydrateControls();
  saveState();
  render();
}

function savePersonalSession(event) {
  event.preventDefault();
  const id = $("#personalSessionId").value || uid();
  const hours = Number($("#personalSessionHours").value || 0);
  const rate = Number($("#personalSessionRate").value || 0);
  const session = {
    id,
    date: $("#personalSessionDate").value,
    start: $("#personalSessionStart").value,
    end: $("#personalSessionEnd").value,
    timeText: `${$("#personalSessionStart").value}-${$("#personalSessionEnd").value}`,
    tutor: "Personal",
    student: normalizeStudentName($("#personalSessionStudent").value.trim()),
    packageName: $("#personalSessionPackage").value,
    packageLabel: $("#personalSessionPackage").value || "PACKAGE 1",
    classType: $("#personalSessionClassType").value,
    mode: $("#personalSessionMode").value ? normalizeModeLabel($("#personalSessionMode").value) : "",
    studentCount: 1,
    hours,
    rate,
    totalPay: hours * rate,
    status: state.personalSessions?.find((item) => item.id === id)?.status || "Pending",
    claimDate: "",
    notes: $("#personalSessionNotes").value.trim(),
    personal: true
  };
  state.personalSessions ||= [];
  upsert("personalSessions", session);
  resetPersonalSessionForm();
  hydrateControls();
  saveState();
  render();
}

async function saveRecord(event) {
  event.preventDefault();
  const existing = (state.records || []).find((item) => item.id === $("#recordId").value);
  const id = $("#recordId").value || uid();
  const file = $("#recordFileInput")?.files?.[0] || null;
  const fileName = file ? file.name : existing?.fileName || $("#recordFile").value.trim();
  const attachmentId = file ? id : existing?.attachmentId || "";
  let attachmentUrl = existing?.attachmentUrl || "";
  let fileData = existing?.fileData || "";
  if (file) {
    let storedLocally = false;
    try {
      await saveAttachmentBlob(attachmentId, file);
      storedLocally = true;
    } catch (error) {
      console.warn("Browser attachment storage is unavailable.", error);
    }
    if (shouldUseCloudSync()) {
      try {
        attachmentUrl = await uploadRecordAttachment(attachmentId, file);
      } catch (error) {
        console.warn("The attachment is saved in this browser but could not be uploaded yet.", error);
      }
    }
    fileData = storedLocally || attachmentUrl ? "" : await readFileAsDataUrl(file);
  }
  const record = {
    id,
    startDate: $("#recordStartDate").value,
    endDate: $("#recordEndDate").value,
    category: normalizeCvSectionTitle($("#recordCategory").value || "Works"),
    title: $("#recordTitle").value.trim(),
    organization: $("#recordOrganization").value.trim(),
    location: $("#recordLocation").value.trim(),
    file: fileName ? `Assets/${fileName}` : "",
    fileName,
    fileData,
    attachmentId,
    attachmentUrl,
    description: $("#recordDescription").value.trim(),
    bullets: parseBulletLines($("#recordBullets").value)
  };
  state.records ||= [];
  upsert("records", record);
  resetRecordForm();
  saveState();
  render();
}

function saveRate(event) {
  event.preventDefault();
  const rate = {
    id: $("#rateId").value || uid(),
    tutor: $("#rateTutor").value,
    classType: $("#rateClassType").value,
    mode: $("#rateMode").value ? normalizeModeLabel($("#rateMode").value) : "",
    packageName: $("#ratePackage").value,
    amount: Number($("#rateAmount").value || 0)
  };
  upsert("rates", rate);
  $("#rateForm").reset();
  $("#rateId").value = "";
  saveState();
  render();
}

function saveSchedule(event) {
  event.preventDefault();
  const schedule = {
    id: $("#scheduleId").value || uid(),
    day: $("#scheduleDay").value,
    start: $("#scheduleStart").value,
    end: $("#scheduleEnd").value,
    student: $("#scheduleStudent").value,
    tutor: $("#scheduleTutor").value,
    mode: $("#scheduleMode").value ? normalizeModeLabel($("#scheduleMode").value) : "",
    frequency: $("#scheduleFrequency").value,
    status: $("#scheduleStatus").value,
    notes: $("#scheduleNotes").value.trim()
  };
  upsert("schedules", schedule);
  resetScheduleForm();
  saveState();
  render();
}

function saveSettings(event) {
  event.preventDefault();
  state.settings.tutors = parseLines($("#settingTutors").value);
  state.settings.students = uniqueNormalizedNames(parseLines($("#settingStudents").value).map(normalizeStudentName).filter((name) => name !== "SUBS"));
  syncStudentRecords();
  state.settings.packages = parseLines($("#settingPackages").value);
  state.settings.classTypes = parseLines($("#settingClassTypes").value);
  state.settings.modes = ["Virtual", "F2F", "Hybrid"];
  state.settings.scheduleStatuses = parseLines($("#settingScheduleStatuses").value);
  saveState();
  hydrateControls();
  render();
}

function upsert(collection, item) {
  const index = state[collection].findIndex((existing) => existing.id === item.id);
  if (index >= 0) state[collection][index] = item;
  else state[collection].push(item);
}

function editSession(id) {
  const session = state.sessions.find((item) => item.id === id);
  if (!session) return;
  $("#sessionId").value = session.id;
  $("#sessionDate").value = session.date;
  $("#sessionStart").value = session.start;
  $("#sessionEnd").value = session.end;
  $("#sessionTutor").value = session.tutor;
  $("#sessionStudent").value = session.student;
  updateSessionPackageOptions(session.packageLabel);
  $("#sessionPackage").value = session.packageName;
  $("#sessionClassType").value = session.classType;
  $("#sessionMode").value = session.mode;
  $("#sessionStudents").value = session.studentCount;
  $("#sessionRate").value = session.rate;
  $("#sessionHours").value = totalHours(session) || "";
  $("#sessionNotes").value = session.notes || "";
  location.hash = "#sessions";
}

function editPersonalSession(id) {
  const session = state.personalSessions.find((item) => item.id === id);
  if (!session) return;
  $("#personalSessionId").value = session.id;
  $("#personalSessionDate").value = session.date;
  $("#personalSessionStart").value = session.start;
  $("#personalSessionEnd").value = session.end;
  $("#personalSessionStudent").value = session.student;
  $("#personalSessionPackage").value = session.packageName || session.packageLabel;
  $("#personalSessionClassType").value = session.classType;
  $("#personalSessionMode").value = session.mode;
  $("#personalSessionRate").value = session.rate;
  $("#personalSessionHours").value = totalHours(session) || "";
  $("#personalSessionNotes").value = session.notes || "";
  location.hash = "#personal-sessions";
}

function editRecord(id) {
  const record = (state.records || []).find((item) => item.id === id);
  if (!record) return;
  $("#recordId").value = record.id;
  $("#recordStartDate").value = record.startDate || record.date || "";
  $("#recordEndDate").value = record.endDate || "";
  $("#recordCategory").value = record.category || "";
  $("#recordTitle").value = record.title || "";
  $("#recordOrganization").value = record.organization || "";
  $("#recordLocation").value = record.location || "";
  $("#recordFile").value = record.fileName || record.file || "";
  $("#recordFileInput").value = "";
  $("#recordDescription").value = record.description || "";
  $("#recordBullets").value = (record.bullets || []).join("\n");
  location.hash = "#records-add";
}

function editRate(id) {
  const rate = state.rates.find((item) => item.id === id);
  if (!rate) return;
  $("#rateId").value = rate.id;
  $("#rateTutor").value = rate.tutor;
  $("#rateClassType").value = rate.classType;
  $("#rateMode").value = rate.mode;
  $("#ratePackage").value = rate.packageName;
  $("#rateAmount").value = rate.amount;
}

function editSchedule(id) {
  const item = state.schedules.find((schedule) => schedule.id === id);
  if (!item) return;
  $("#scheduleId").value = item.id;
  $("#scheduleDay").value = item.day;
  $("#scheduleStart").value = item.start;
  $("#scheduleEnd").value = item.end;
  $("#scheduleStudent").value = item.student;
  $("#scheduleTutor").value = item.tutor;
  $("#scheduleMode").value = item.mode;
  $("#scheduleFrequency").value = item.frequency;
  $("#scheduleStatus").value = item.status;
  $("#scheduleNotes").value = item.notes || "";
}

function deleteItem(collection, id) {
  if (collection === "records") {
    const record = state.records.find((item) => item.id === id);
    if (record?.attachmentId) deleteAttachmentBlob(record.attachmentId);
    if (record?.attachmentId && shouldUseCloudSync()) deleteHostedAttachment(record.attachmentId);
  }
  state[collection] = state[collection].filter((item) => item.id !== id);
  saveState();
  render();
}

function resetSessionForm() {
  $("#sessionForm").reset();
  $("#sessionId").value = "";
  $("#sessionDate").value = new Date().toISOString().slice(0, 10);
  $("#sessionStart").value = "";
  $("#sessionEnd").value = "";
  $("#sessionStudents").value = 1;
  $("#sessionHours").value = "";
  $("#sessionStudent").value = "";
  $("#sessionPackage").value = "";
  $("#sessionClassType").value = "";
  $("#sessionMode").value = "";
  updateSessionPackageOptions("", true);
  setSuggestedRate();
}

function resetPersonalSessionForm() {
  if (!$("#personalSessionForm")) return;
  $("#personalSessionForm").reset();
  $("#personalSessionId").value = "";
  $("#personalSessionDate").value = new Date().toISOString().slice(0, 10);
  $("#personalSessionStart").value = "";
  $("#personalSessionEnd").value = "";
  $("#personalSessionStudent").value = "";
  $("#personalSessionPackage").value = "";
  $("#personalSessionClassType").value = "";
  $("#personalSessionMode").value = "";
  $("#personalSessionRate").value = "";
  $("#personalSessionHours").value = "";
}

function resetRecordForm() {
  if (!$("#recordForm")) return;
  $("#recordForm").reset();
  $("#recordId").value = "";
  $("#recordStartDate").value = "";
  $("#recordEndDate").value = "";
  $("#recordCategory").value = "";
  $("#recordFile").value = "";
  $("#recordFileData").value = "";
  $("#recordFileInput").value = "";
  $("#recordBullets").value = "";
}

function resetScheduleForm() {
  $("#scheduleForm").reset();
  $("#scheduleId").value = "";
  $("#scheduleStart").value = "";
  $("#scheduleEnd").value = "";
  $("#scheduleDay").value = "";
  $("#scheduleStudent").value = "";
  $("#scheduleMode").value = "";
  $("#scheduleFrequency").value = "";
  $("#scheduleStatus").value = "";
}

function setSuggestedRate() {
  const rate = lookupRate({
    tutor: $("#sessionTutor").value,
    classType: $("#sessionClassType").value,
    mode: $("#sessionMode").value,
    packageName: $("#sessionPackage").value
  });
  $("#sessionRate").value = rate || "";
}

function lookupRate(session) {
  const scoreRate = (rate) => {
    let score = 0;
    if (rate.tutor === session.tutor) score += 16;
    if (["All Tutors", "Group Class", "Graduate Tutor"].includes(rate.tutor)) score += 8;
    if (rate.classType === session.classType) score += 4;
    if (sameMode(rate.mode, session.mode)) score += 2;
    if (rate.packageName === session.packageName) score += 1;
    return score;
  };
  const candidates = state.rates
    .filter((rate) => rate.classType === session.classType)
    .filter((rate) => sameMode(rate.mode, session.mode))
    .filter((rate) => rate.packageName === session.packageName)
    .sort((a, b) => scoreRate(b) - scoreRate(a));
  return (candidates[0] || {}).amount || 0;
}

function sameMode(a, b) {
  return normalizeMode(a) === normalizeMode(b);
}

function normalizeMode(mode) {
  return normalizeModeLabel(mode).toLowerCase();
}

function markClaimed() {
  const date = $("#claimDate").value || claimCutoffDate();
  const sessions = claimableSessions();
  const amount = sum(sessions, totalPay);
  sessions.forEach((session) => {
    session.status = "Claimed";
    session.claimDate = date;
    session.claimed = true;
    session.color = "claimed";
  });
  if (amount > 0) {
    state.claimHistory ||= [];
    state.claimHistory.push({
      claimDate: date,
      amount,
      logs: `${sessions.length} logs`,
      label: "Claimed Payroll",
      source: "claiming-view"
    });
  }
  saveState();
  render();
}

function claimableSessions() {
  return state.sessions
    .filter(matchesTutorFilter)
    .filter(isClaimingStatus);
}

function claimCutoffDate(baseDate = new Date()) {
  const year = baseDate.getFullYear();
  const month = baseDate.getMonth();
  const day = baseDate.getDate();
  const cutoffDay = day <= 15 ? 15 : new Date(year, month + 1, 0).getDate();
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(cutoffDay).padStart(2, "0")}`;
}

function enforceClaimCutoffInputs() {
  const cutoff = claimCutoffDate();
  ["claimDate", "packageClaimDate"].forEach((id) => {
    const input = $("#" + id);
    if (!input) return;
    input.min = cutoff;
    input.max = cutoff;
    input.value = cutoff;
  });
}

function matchesTutorFilter(session) {
  const tutor = $("#tutorFilter")?.value;
  return tutor === "All Tutors" || !tutor || session.tutor === tutor;
}

function isClaimingStatus(session) {
  return session.status === "For Claiming";
}

function isOpenStatus(session) {
  return !isClaimedStatus(session) && session.status !== "Cancelled" && !isClaimingStatus(session);
}

function packageStatus(sessions) {
  if (sessions.length && sessions.every(isClaimedStatus)) {
    return { label: "Claimed", className: "closed-package", pillClass: "claimed" };
  }
  if (sessions.some(isClaimingStatus)) {
    return { label: "For Claiming", className: "ready-package", pillClass: "claiming" };
  }
  return { label: "Open", className: "open-package", pillClass: "pending" };
}

function hasOpenPackage(packages) {
  return packages.some((pkg) => pkg.sessions.some((session) => !isClaimedStatus(session) && session.status !== "Cancelled"));
}

function isClaimedStatus(session) {
  return session.status === "Claimed" || session.status === "Archived" || session.claimed === true;
}

function packageGroupLabel(session) {
  if (!isSubsSession(session)) return packageLabel(session);
  if (isClaimedStatus(session)) return "PACKAGE 1";
  const hasClaimedForStudent = state.sessions.some((item) => item.student === session.student && isClaimedStatus(item));
  return hasClaimedForStudent ? "PACKAGE 2" : "PACKAGE 1";
}

function isSubsSession(session) {
  return session.isSubs === true ||
    normalizeStudentName(session.student) === "SUBS" ||
    normalizeStudentName(session.studentKey) === "SUBS" ||
    normalizeStudentName(session.sourceSheet) === "SUBS" ||
    normalizeStudentName(session.packageLabel).toUpperCase() === "SUBS";
}

function isSubsRawSession(session) {
  return normalizeStudentName(session.packageLabel).toUpperCase() === "SUBS" ||
    normalizeStudentName(session.studentKey).toUpperCase() === "SUBS" ||
    normalizeStudentName(session.sourceSheet).toUpperCase() === "SUBS";
}

function sessionTypeClass(session) {
  return isGroupSession(session) ? "group-session" : "individual-session";
}

function scheduleTypeClass(item) {
  return isGroupName(item.student) ? "group-session" : "individual-session";
}

function isGroupSession(session) {
  if (isSubsSession(session)) return false;
  return String(session.classType || "").toLowerCase() === "group" ||
    Number(session.studentCount || 1) > 1 ||
    isGroupName(session.student) ||
    /^group/i.test(String(session.packageName || ""));
}

function isGroupName(name) {
  return /\b(upis|group|stat|booster|b2030|boards review)\b/i.test(String(name || ""));
}

function totalHours(session) {
  if (Object.prototype.hasOwnProperty.call(session, "hours") && Number.isFinite(Number(session.hours))) return Number(session.hours);
  return computeHours(session.start, session.end);
}

function totalPay(session) {
  if (session.status === "Cancelled") return 0;
  if (Number.isFinite(Number(session.totalPay)) && Number(session.totalPay) > 0) return Number(session.totalPay);
  return totalHours(session) * Number(session.rate || 0);
}

function computeHours(startText, endText) {
  if (!startText || !endText) return 0;
  const [sh, sm] = startText.split(":").map(Number);
  const [eh, em] = endText.split(":").map(Number);
  if (![sh, sm, eh, em].every(Number.isFinite)) return 0;
  let start = sh * 60 + sm;
  let end = eh * 60 + em;
  if (end <= start) end += 24 * 60;
  return Math.round(((end - start) / 60) * 100) / 100;
}

function scheduleDuration(item) {
  return computeHours(item.start, item.end) || 1;
}

function packageLabel(session) {
  return session.packageLabel || "Package 1";
}

function packageNumber(label) {
  const match = String(label || "").match(/package\s*(\d+)/i);
  return match ? Number(match[1]) : null;
}

function sessionRowClass(session) {
  const classes = [sessionTypeClass(session)];
  if (isClaimedStatus(session)) classes.push("claimed-row");
  if (isClaimingStatus(session)) classes.push("claiming-row");
  return classes.join(" ");
}

function summarize(rows) {
  const sessions = rows.length;
  const hours = sum(rows, totalHours);
  const pay = sum(rows, totalPay);
  return {
    sessions,
    hours,
    pay,
    avgRate: hours ? pay / hours : 0,
    avgSession: sessions ? pay / sessions : 0
  };
}

function dailySummary(rows) {
  return Object.entries(groupBy(rows, (row) => row.date))
    .map(([date, items]) => {
      const summary = summarize(items);
      return {
        date,
        sessions: summary.sessions,
        hours: summary.hours,
        pay: summary.pay,
        claimed: sum(items.filter(isClaimedStatus), totalPay),
        unclaimed: sum(items.filter((item) => !isClaimedStatus(item)), totalPay)
      };
    })
    .sort((a, b) => a.date.localeCompare(b.date));
}

function monthlySummary(rows) {
  return Object.entries(groupBy(rows, (row) => row.date.slice(0, 7)))
    .map(([month, items]) => {
      const summary = summarize(items);
      return {
        month,
        ...summary,
        claimed: sum(items.filter(isClaimedStatus), totalPay),
        unclaimed: sum(items.filter((item) => !isClaimedStatus(item)), totalPay),
        claiming: sum(items.filter(isClaimingStatus), totalPay)
      };
    })
    .sort((a, b) => a.month.localeCompare(b.month));
}

function peakDay(rows) {
  return dailySummary(rows).sort((a, b) => b.pay - a.pay || b.date.localeCompare(a.date))[0] || null;
}

function groupBy(rows, getter) {
  return rows.reduce((groups, row) => {
    const key = getter(row);
    groups[key] ||= [];
    groups[key].push(row);
    return groups;
  }, {});
}

function sum(rows, getter) {
  return rows.reduce((total, row) => total + getter(row), 0);
}

function parseLines(value) {
  return value.split(/\r?\n|,/).map((item) => item.trim()).filter(Boolean);
}

function parseBulletLines(value) {
  return String(value || "").split(/\r?\n/).map((item) => item.trim()).filter(Boolean);
}

function uniqueValues(values) {
  return [...new Set(values.filter(Boolean))];
}

function uniqueNormalizedNames(values) {
  const seen = new Set();
  return values.filter((value) => {
    const normalized = normalizeStudentName(value).toLowerCase();
    if (!normalized || seen.has(normalized)) return false;
    seen.add(normalized);
    return true;
  });
}

function uniqueDisplayValues(values) {
  const seen = new Set();
  return values.filter((value) => {
    const normalized = normalizeStudentName(value || value).toLowerCase();
    if (!value || seen.has(normalized)) return false;
    seen.add(normalized);
    return true;
  });
}

function normalizeStudentName(name) {
  const raw = normalizeProgramAlias(String(name || "").replace(/\s+/g, " ").trim());
  if (!raw) return "";
  if (isProgramName(raw)) return raw;

  const parenthetical = raw.match(/^(.*?)\s*\(([^)]+)\)\s*$/);
  let base = parenthetical ? parenthetical[1].trim() : raw;
  let info = parenthetical ? parenthetical[2].trim() : "";
  const trailingInfo = extractTrailingStudentInfo(base);
  if (trailingInfo) {
    base = trailingInfo.base;
    info = uniqueValues([trailingInfo.info, info]).join(" / ");
  }

  if (base.includes(",")) {
    const [surname, ...rest] = base.split(",");
    const first = rest.join(",").trim();
    return `${surname.trim()}, ${first}${info ? ` (${info})` : ""}`.trim();
  }

  const parts = base.split(" ").filter(Boolean);
  if (parts.length >= 2) {
    const surname = parts.pop();
    return `${surname}, ${parts.join(" ")}${info ? ` (${info})` : ""}`;
  }

  return `${base}${info ? ` (${info})` : ""}`;
}

function extractTrailingStudentInfo(name) {
  const value = String(name || "").trim();
  const patterns = [
    /\s+(ASHAPE|UPCAT|NCE|ACET|DCAT|USTET)$/i,
    /\s+(G(?:RADE)?\s*\d+)$/i,
    /\s+((?:LEAP|STAT|BOOSTER)\s*\d*)$/i
  ];
  for (const pattern of patterns) {
    const match = value.match(pattern);
    if (match) {
      return {
        base: value.slice(0, match.index).trim(),
        info: match[1].replace(/\s+/g, " ").toUpperCase()
      };
    }
  }
  return null;
}

function isProgramName(name) {
  const value = String(name || "").trim();
  if (!value) return false;
  if (/^(UPIS|B2030 G9|GROUP TUTORIALS|BOARDS REVIEW|STAT LEAP|STAT BOOSTER|PSHS|SUMMER|BOOSTER[- ]STAT|CALNATSCI STAT)/i.test(value)) return true;
  return value === value.toUpperCase() && /\b(UPIS|B2030|GROUP|TUTORIALS|REVIEW|STAT|BOOSTER|BOARDS|CALNATSCI)\b/.test(value);
}

function normalizeProgramAlias(value) {
  const text = String(value || "").replace(/\s+/g, " ").trim();
  if (!text) return "";
  return text
    .replace(/\bCal\s*Sci\b/gi, "CalNatSci")
    .replace(/\bCalNatSci\s+Stat\b/gi, "CalNatSci Stat")
    .replace(/^STAT LEAP$/i, "B2030 G9")
    .replace(/^STAT BOOSTER$/i, "BOOSTER STAT")
    .replace(/^BOOSTER[- ]STAT$/i, "BOOSTER STAT")
    .replace(/^UPIS\s+(?:G)?7(?:\s+Math)?$/i, "UPIS G7")
    .replace(/^UPIS\s+(?:Science\s+9|G9(?:\s+Science)?|9)$/i, "UPIS G9")
    .replace(/^GROUP TUTORIALS$/i, "UPIS G7")
    .replace(/^UPIS Science$/i, "UPIS G9")
    .replace(/^PSHS G9$/i, "UPIS G9");
}

function resolveGroupStudentName(session) {
  const packageText = String(session.packageLabel || session.packageName || "").trim();
  const studentText = String(session.student || "").trim();
  const notesText = String(session.notes || "").trim();
  const combined = [packageText, studentText, notesText].join(" ");
  if (/PSHS\s+LEAP\s+STAT|STAT\s+LEAP/i.test(combined)) return "B2030 G9";
  if (/BOOSTER[- ]STAT|STAT\s+BOOSTER/i.test(combined)) return "BOOSTER STAT";
  const normalizedPackage = normalizeProgramAlias(packageText);
  if (/^UPIS G(?:7|9)$/i.test(normalizedPackage)) return normalizedPackage;
  const normalizedNotes = normalizeProgramAlias(notesText);
  if (/^UPIS G(?:7|9)$/i.test(normalizedNotes)) return normalizedNotes;
  return "";
}

function normalizeModeLabel(mode) {
  const value = String(mode || "").trim().toLowerCase();
  if (value === "online" || value === "virtual") return "Virtual";
  if (value === "face-to-face" || value === "face to face" || value === "f2f") return "F2F";
  if (value === "hybrid") return "Hybrid";
  return mode ? String(mode).trim() : "Virtual";
}

function sessionCsvRows(rows) {
  return [
    ["Date", "Day", "Start", "End", "Student", "Claim Package", "Rate Package", "Class Type", "Mode", "Students", "Hours", "Rate", "Total Pay", "Notes"],
    ...rows.map((session) => [
      session.date,
      dayName(session.date),
      session.start,
      session.end,
      session.student,
      packageLabel(session),
      session.packageName,
      session.classType,
      session.mode,
      session.studentCount,
      totalHours(session),
      session.rate,
      totalPay(session),
      session.notes || ""
    ])
  ];
}

function exportCsv(filename, rows) {
  const csv = rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n");
  downloadFile(filename, csv, "text/csv");
}

function downloadFile(filename, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function importJson(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      state = JSON.parse(reader.result);
      state = migrateState(state);
      saveState();
      hydrateControls();
      render();
    } catch (error) {
      alert("The selected backup could not be loaded.");
    }
  };
  reader.readAsText(file);
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result || "");
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function hasRecordAttachment(record) {
  return Boolean(record?.file || record?.fileData || record?.attachmentId || record?.attachmentUrl);
}

function openAttachmentDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(ATTACHMENT_DB_NAME, 1);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(ATTACHMENT_STORE_NAME)) {
        request.result.createObjectStore(ATTACHMENT_STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function attachmentStoreRequest(mode, action) {
  const database = await openAttachmentDatabase();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(ATTACHMENT_STORE_NAME, mode);
    const request = action(transaction.objectStore(ATTACHMENT_STORE_NAME));
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
    transaction.oncomplete = () => database.close();
  });
}

function saveAttachmentBlob(id, file) {
  return attachmentStoreRequest("readwrite", (store) => store.put(file, id));
}

function loadAttachmentBlob(id) {
  if (!id) return Promise.resolve(null);
  return attachmentStoreRequest("readonly", (store) => store.get(id));
}

function deleteAttachmentBlob(id) {
  if (!id) return Promise.resolve();
  return attachmentStoreRequest("readwrite", (store) => store.delete(id)).catch(() => {});
}

async function migrateLegacyRecordAttachments() {
  let changed = false;
  for (const record of state.records || []) {
    if (!record.fileData) continue;
    try {
      const response = await fetch(record.fileData);
      const blob = await response.blob();
      record.attachmentId ||= record.id;
      await saveAttachmentBlob(record.attachmentId, blob);
      record.fileData = "";
      changed = true;
    } catch (error) {
      console.warn("Could not migrate a saved attachment.", error);
    }
  }
  if (changed) {
    saveState();
    renderRecords();
    renderCvAttachments();
    if (cloudSync.enabled) await syncPendingRecordAttachments();
  }
}

async function uploadRecordAttachment(id, file) {
  const query = new URLSearchParams({ id, name: file.name });
  const response = await fetch(`${CLOUD_FILE_ENDPOINT}?${query}`, {
    method: "POST",
    headers: { "Content-Type": file.type || "application/octet-stream" },
    body: file
  });
  if (!response.ok) throw new Error(`Attachment upload failed: ${response.status}`);
  const payload = await response.json();
  return payload.url || `${CLOUD_FILE_ENDPOINT}?id=${encodeURIComponent(id)}`;
}

async function syncPendingRecordAttachments() {
  if (!cloudSync.enabled) return;
  let changed = false;
  for (const record of state.records || []) {
    if (!record.attachmentId || record.attachmentUrl?.startsWith(CLOUD_FILE_ENDPOINT)) continue;
    const blob = await loadAttachmentBlob(record.attachmentId).catch(() => null);
    if (!blob) continue;
    const file = new File([blob], record.fileName || "attachment", { type: blob.type || "application/octet-stream" });
    try {
      record.attachmentUrl = await uploadRecordAttachment(record.attachmentId, file);
      changed = true;
    } catch (error) {
      console.warn("A local attachment is waiting for its next cloud upload.", error);
    }
  }
  if (changed) {
    saveState();
    await syncCloudSave(true);
  }
}

function deleteHostedAttachment(id) {
  return fetch(`${CLOUD_FILE_ENDPOINT}?id=${encodeURIComponent(id)}`, { method: "DELETE" }).catch(() => {});
}

function bindAttachmentOpeners() {
  $$('[data-open-record-file]').forEach((button) => {
    button.addEventListener("click", () => openRecordAttachment(button.dataset.openRecordFile));
  });
}

async function openRecordAttachment(id) {
  const record = (state.records || []).find((item) => item.id === id);
  if (!record) return;
  const popup = window.open("about:blank", "_blank");
  if (popup) popup.opener = null;
  try {
    let blob = await loadAttachmentBlob(record.attachmentId).catch(() => null);
    if (!blob && record.fileData) blob = await (await fetch(record.fileData)).blob();
    const hostedHref = shouldUseCloudSync() && record.attachmentId
      ? `${CLOUD_FILE_ENDPOINT}?id=${encodeURIComponent(record.attachmentId)}`
      : "";
    const href = blob ? URL.createObjectURL(blob) : hostedHref || record.attachmentUrl || normalizeAssetPath(record.file);
    if (!href) throw new Error("Attachment is unavailable.");
    if (popup) popup.location.replace(href);
    else {
      const link = document.createElement("a");
      link.href = href;
      link.target = "_blank";
      link.rel = "noopener";
      link.click();
    }
    if (blob) window.setTimeout(() => URL.revokeObjectURL(href), 60000);
  } catch (error) {
    popup?.close();
    alert("This attachment could not be opened. Please upload the file again from Add Record.");
  }
}

function hydrateProfilePhotos() {
  $$("[data-profile-photo]").forEach((image) => {
    const sources = ["Assets/2by2_id.jpg", "Assets/2by2_id.png", "Assets/2by2_id.jpeg", "Assets/2by2_id.webp"];
    let index = 0;
    image.onerror = () => {
      index += 1;
      if (sources[index]) image.src = sources[index];
      else {
        const placeholder = document.createElement("div");
        placeholder.className = "profile-photo photo-placeholder";
        placeholder.textContent = "2x2 photo";
        image.replaceWith(placeholder);
      }
    };
    image.src = sources[0];
  });
}

function normalizeAssetPath(file) {
  const value = String(file || "").trim();
  if (!value) return "";
  if (/^(https?:|mailto:|Assets\/)/i.test(value)) return value;
  return `Assets/${value}`;
}

function formatRecordDate(value) {
  if (!value) return "";
  if (/^\d{4}-\d{2}$/.test(value)) return monthName(value, true);
  return formatDate(value);
}

function formatRecordPeriod(record) {
  const start = formatRecordDate(record.startDate || record.date);
  const end = record.endDate ? formatRecordDate(record.endDate) : "Present";
  if (!start && !record.endDate) return "";
  if (!start) return end;
  return `${start} - ${end}`;
}

function metric(label, value, note, tone = "") {
  const toneClass = tone ? ` metric-${escapeAttr(tone)}` : "";
  return `<article class="metric${toneClass}"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong><small>${escapeHtml(note)}</small></article>`;
}

function statusPill(status) {
  const klass = isClaimedStatus({ status }) ? "claimed" : isClaimingStatus({ status }) ? "claiming" : status.toLowerCase().replace(/\s+/g, "-");
  return `<span class="pill ${escapeAttr(klass)}">${escapeHtml(status)}</span>`;
}

function statusClass(status) {
  return String(status || "").toLowerCase().replace(/\s+/g, "-");
}

function emptyRow(count) {
  return `<tr><td colspan="${count}" class="empty">No records yet.</td></tr>`;
}

function dayName(dateString) {
  if (!dateString) return "";
  return new Date(dateString + "T00:00:00").toLocaleDateString("en-US", { weekday: "long" });
}

function formatDate(dateString) {
  if (!dateString) return "";
  return new Date(dateString + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function formatDateTime(dateString) {
  if (!dateString) return "";
  return new Date(dateString).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit"
  });
}

function monthName(monthString, short = false) {
  if (!monthString) return "";
  return new Date(monthString + "-01T00:00:00").toLocaleDateString("en-US", { month: short ? "short" : "long", year: "numeric" });
}

function monthValueFromName(name) {
  const match = state.sessions
    .map((session) => session.date?.slice(0, 7))
    .filter(Boolean)
    .find((month) => monthName(month) === name);
  return match || "";
}

function timeToDecimal(timeText) {
  const [hour, minute] = String(timeText || "0:0").split(":").map(Number);
  return (Number.isFinite(hour) ? hour : 0) + ((Number.isFinite(minute) ? minute : 0) / 60);
}

function formatHour(hour) {
  if (hour === 24) return "12 MN";
  const suffix = hour >= 12 ? "PM" : "AM";
  const display = hour % 12 || 12;
  return `${display} ${suffix}`;
}

function money(value) {
  return `PHP ${Number(value || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function moneyShort(value) {
  const amount = Number(value || 0);
  if (amount >= 1000) return `PHP ${(amount / 1000).toFixed(1)}k`;
  return `PHP ${amount.toFixed(0)}`;
}

function number(value) {
  return Number(value || 0).toLocaleString("en-US", { maximumFractionDigits: 2 });
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function escapeAttr(value) {
  return escapeHtml(value);
}
