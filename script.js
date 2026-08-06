const STORAGE_KEY = "salary-sheet-state-v5";
const CLOUD_STATE_ENDPOINT = "/api/salary-state";
const CLOUD_FILE_ENDPOINT = "/api/record-file";
const CLOUD_SYNC_DEBOUNCE_MS = 900;
const CLOUD_REFRESH_MS = 15000;
const DEFAULT_SESSION_START_TIME = "12:00";
const CURRENT_RATE_TUTOR = "Graduate Tutor";
const UPGG_TITLE = "University of the Philippines Gaming Guild (UPGG)";
const UPGG_ARIMAONGA_BULLET = "**Oblation Esports Arimaonga Player** (2AY 2025-2026)";
const DOCUMENT_EMAIL = "ramirez.johnlloydc@gmail.com";
const DOCUMENT_LINKEDIN_URL = "https://linkedin.com/in/jlcramirez";
const CV_SECTION_ORDER = [
  "education",
  "work-experience",
  "works",
  "professional-development",
  "licenses-and-certifications",
  "skills",
  "affiliations-and-leadership"
];
const ATTACHMENT_DB_NAME = "salary-sheet-attachments";
const ATTACHMENT_STORE_NAME = "files";
const IMPORT_STATUS_POLICY_VERSION = 2;
const STUDENT_STATUS_POLICY_VERSION = 1;
const REMOVED_IMPORTED_SESSION_IDS = new Set(["wb265"]);
const REMOVED_IMPORTED_SCHEDULE_IDS = new Set(["sch16"]);
const CORRECTED_IMPORTED_SESSION_DATES = {
  wb203: "2026-01-06",
  wb204: "2026-01-07"
};

const PERSONAL_VIEW_IDS = new Set([
  "personal-sessions",
  "personal-packages",
  "personal-receipt",
  "personal-students"
]);
const MANAGEMENT_VIEW_IDS = new Set(["management"]);

const PERSONAL_ACCESS_STORAGE_KEY = "career-records-personal-unlocked";
const MANAGEMENT_ACCESS_STORAGE_KEY = "career-records-management-unlocked";
const PERSONAL_ACCESS_HASH = "682c32838fa9f46d2abc56c74ca4db4dfc1b179d2e13d0edae318524fd24d3d3";
const MANAGEMENT_ACCESS_HASH = "d81c16dd903dd64d1880d5c1d396bff60f25740ee8bd420bc5975223efbfea5c";

let currentActiveView = "dashboard";
let sessionRateManuallyEdited = false;

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const weekdays = days.slice(0, 5);
const scheduleDayOptions = ["Weekday", ...days];
const graduateTutorRatePackages = [
  { packageName: "5 Hours", amounts: { "Elem/JHS": 420, SHS: 480, College: 540 } },
  { packageName: "10 Hours", amounts: { "Elem/JHS": 360, SHS: 420, College: 480 } },
  { packageName: "15 Hours", amounts: { "Elem/JHS": 300, SHS: 340, College: 380 } }
];
const graduateTutorRateModes = ["Virtual", "F2F"];
const studyBuddyRatePackages = [
  { packageName: "Pair (SB)", amount: 400 },
  { packageName: "Trio (SB)", amount: 400 },
  { packageName: "Group (4)", amount: 450 },
  { packageName: "Group (5-9)", amount: 500 },
  { packageName: "Group (10+)", amount: 550 }
];
const studyBuddyRateModes = ["Virtual", "F2F", "Hybrid"];
const salaryGradeStepOne2026 = [
  14634, 15522, 16486, 17506, 18581, 19716, 20914, 22423, 24329, 26917, 31705,
  33947, 36125, 38764, 42178, 45694, 49562, 53818, 59153, 66052, 73303, 81796,
  91306, 102603, 116643, 131807, 148940, 167129, 187531, 210718, 300961,
  356237, 449157
];

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
      "Detail-oriented and highly motivated Bachelor of Science in Geodetic Engineering graduate from the University of the Philippines Diliman, with hands-on experience in traditional surveying, remote sensing, GIS, and photogrammetry. Eager to take on new challenges, continuously learn, and grow professionally."
    ]
  },
  {
    title: "Education",
    entries: [
      {
        title: "University of the Philippines Diliman",
        date: "2021 - 2026",
        meta: "",
        bullets: [
          "**Bachelor of Science in Geodetic Engineering**",
          "**DOST RA 7687 S&T Undergraduate Scholarship Grantee** (2021-2025)",
          "**UP Student Learning Assistance System (SLAS) Scholarship Awardee** (2023-2024)"
        ]
      },
      {
        title: "Philippine Science High School - Ilocos Region Campus",
        date: "2015 - 2021",
        meta: "",
        bullets: [
          "**With High Honors** (2021)",
          "**Proficiency Award in Arts, Design, and Technology** (2021)",
          "**STEM Track** - Physics Strand, Electronics Elective, Agriculture Elective"
        ]
      }
    ]
  },
  {
    title: "Work Experience",
    entries: [
      {
        title: "Pr1me Tutorial Services / Self-employed",
        date: "Sep 2025 - Present",
        meta: "**Tutor / Teacher / Academic Coach**, Quezon City, NCR, Philippines",
        bullets: [
          "Delivered one-on-one and group academic support to **200+ students** across **elementary, high school, and college** levels.",
          "Taught **Mathematics, Statistics, and Physics**, including regular tutorials, review sessions, and targeted remediation.",
          "Helped students prepare for and pass **removal examinations**, advance to the **next grade level**, and strengthen core subject mastery.",
          "Supported high-performing students in sustaining academic standing, with some reaching the **Dean's List**.",
          "Designed **review programs, preparatory exams, diagnostics, and assessments** for academic support and entrance-test preparation."
        ]
      },
      {
        title: "Moonton Student Leaders PH",
        date: "March 2024 - Present",
        meta: "**Campus Moonton Student Leader - UP Diliman**",
        bullets: [
          "Coordinated campus-level initiatives with **nationwide student leaders** to support community engagement and esports programming.",
          "Planned and executed **online and face-to-face tournaments**, handling coordination, participant flow, and event operations."
        ]
      },
      {
        title: "UP Esports Varsity Team",
        date: "March 2024 - May 2025",
        meta: "**Community Manager / Esports Varsity Player - MLBB**",
        bullets: [
          "Managed team communication among players, moderators, and stakeholders for esports events and tournament operations.",
          "Co-organized **Diliman Games MLBB tournaments**, supporting planning, match coordination, and event execution."
        ]
      },
      {
        title: "RASA Surveying and Realty",
        date: "July 2024 - August 2024",
        meta: "**Land Surveyor, GIS Specialist, and Aerial Surveyor (Drone Pilot) Intern**, Quezon City, NCR, Philippines",
        bullets: [
          "Supported field operations for **land, hydrographic, and aerial surveying** projects.",
          "Processed and organized spatial data using **GIS and remote sensing software**.",
          "Completed technical exposure in **LiDAR and bathymetric surveying** through seminars and training camps.",
          "Prepared **survey returns documents** aligned with government documentation standards."
        ]
      },
      {
        title: "Early Internship Exposure",
        date: "2018 - 2020",
        meta: "",
        bullets: [
          "**Malakas Farm Livelihood Development Enterprises** - Student Intern, Agriculture 1: Work Immersion (March 2020).",
          "**DOST Regional Science and Technology Laboratory 1** - Student Intern, Microbiology, Chemistry, and Metrology Labs (September 2018)."
        ]
      }
    ]
  },
  {
    title: "Skills",
    entries: [
      {
        title: "GIS and Mapping",
        bullets: [
          "**ArcGIS, QGIS, Civil 3D, and Autodesk workflows** for geospatial data handling, map creation, spatial analysis, and CAD-based mapping."
        ]
      },
      {
        title: "Surveying",
        bullets: [
          "**Land surveying, field measurements, hydrographic surveying exposure, and survey returns preparation**."
        ]
      },
      {
        title: "Remote Sensing and Photogrammetry",
        bullets: [
          "**Remote sensing, LiDAR, close-range photogrammetry, and Google Earth Engine** for academic and research workflows."
        ]
      },
      {
        title: "Programming and Web Development",
        bullets: [
          "**HTML, CSS, JavaScript, Python, Java, and R** for web projects, geospatial scripting, data automation, and academic tools."
        ]
      },
      {
        title: "Drone Operations",
        bullets: [
          "**Practical exposure to drone-assisted aerial surveying and flight handling** for spatial data capture and project documentation; **not yet certified**."
        ]
      },
      {
        title: "Data Processing and Documentation",
        bullets: [
          "**Microsoft Word, Excel, and PowerPoint** for technical documentation, data organization, reports, and presentation materials."
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
          "**Vice President for Internal Affairs** (AY 2025-2026)",
          "**Sirib ken Saririt 2025** - Ilocos Norte Co-Head, Provincials Leg (January 2025)",
          "**SURO 2025** - Facilitator and Mathematics Lecturer, Ilocos Norte (July 2025)"
        ]
      },
      {
        title: "Moonton Student Leaders Philippines",
        bullets: [
          "**Campus Student Leader** (March 2024 - Present)"
        ]
      },
      {
        title: "University of the Philippines Esports Varsity Team",
        bullets: [
          "**Community Manager** (March 2024 - May 2025)",
          "**Diliman Games MLBB Co-Organizer** (May 2024; May 2025)"
        ]
      },
      {
        title: "University of the Philippines Gaming Guild (UPGG)",
        bullets: [
          "**Honorary Member** (1AY-2AY 2023-2024; 2AY 2025-2026)",
          "**Oblation Esports Minokawa Player** (1AY-2AY 2023-2024)",
          "**Oblation Esports Arimaonga Player** (2AY 2025-2026)",
          "**Diliman Games 2026 MLBB Co-Organizer** (May 2026)"
        ]
      }
    ]
  }
];

function buildDefaultCvProfile() {
  return {
    name: "John Lloyd C. Ramirez",
    headline: "Academic and professional credentials",
    place: "",
    contact: `${DOCUMENT_EMAIL} | (+63) 916 7023 686 | LinkedIn`
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
        description: "Detail-oriented and highly motivated Bachelor of Science in Geodetic Engineering graduate from the University of the Philippines Diliman, with hands-on experience in traditional surveying, remote sensing, GIS, and photogrammetry. Eager to take on new challenges, continuously learn, and grow professionally."
      }]
    },
    {
      id: "education",
      title: "Education",
      items: [
        {
          id: "education-upd",
          title: "University of the Philippines Diliman",
          date: "2021 - 2026",
          meta: "",
          bullets: [
            "**Bachelor of Science in Geodetic Engineering**",
            "**DOST RA 7687 S&T Undergraduate Scholarship Grantee** (2021-2025)",
            "**UP Student Learning Assistance System (SLAS) Scholarship Awardee** (2023-2024)"
          ]
        },
        {
          id: "education-pshs",
          title: "Philippine Science High School - Ilocos Region Campus",
          date: "2015 - 2021",
          meta: "",
          bullets: [
            "**With High Honors** (2021)",
            "**Proficiency Award in Arts, Design, and Technology** (2021)",
            "**STEM Track** - Physics Strand, Electronics Elective, Agriculture Elective"
          ]
        }
      ]
    },
    {
      id: "licenses-and-certifications",
      title: "Credentials and Eligibility",
      items: []
    },
    {
      id: "works",
      title: "Projects and Selected Works",
      items: [
        {
          id: "works-undergraduate-thesis",
          title: "Assessment of Aboveground Carbon Change of Aquaculture-Mangrove Converted Ecosystems in Aklan Using Global Ecosystems Dynamics Investigation (GEDI) LiDAR",
          meta: "**Unpublished Undergraduate Thesis**",
          bullets: ["C.E.A. Biagtan, J.L.C. Ramirez, A.M.T. Tamondong, A.B. Baloloy, R. Suwa"]
        },
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
        },
        {
          id: "works-pr1me-tutorial-services",
          title: "PR1ME Tutorial Services",
          meta: "pr1metutorialservices.com",
          description: "**Responsive web project** - pr1metutorialservices.com",
          bullets: [
            "Developed a responsive website presenting **services, tutors, packages, and client inquiry flows**.",
            "Implemented front-end structure and deployment workflow for publication on **Vercel**.",
            "Link: pr1metutorialservices.com"
          ]
        }
      ]
    },
    {
      id: "work-experience",
      title: "Work Experience",
      items: sourceCvSections.find((section) => section.title === "Work Experience").entries.map((entry, index) => ({ id: `work-${index + 1}`, ...entry }))
    },
    {
      id: "professional-development",
      title: "Professional Development",
      items: [
        {
          id: "professional-development-future-earth-cns",
          title: "Regional Future Earth Meta-Network and Core Network Systems (CNS) Workshop and Field Visits",
          date: "March 28-29, 2026",
          meta: "BFAR-PFO New Washington and Boracay Island, Aklan, Philippines",
          description: "Participant",
          bullets: [
            "Participated in seminars and workshops on **sustainable environmental management, monitoring, and protection**.",
            "Demonstrated **drone flight and automated aerial surveying workflows** during field activities."
          ]
        }
      ]
    },
    {
      id: "skills",
      title: "Technical Skills",
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
  return orderCvSections(dedupeCvSectionItems(ensureCvCareerAdditions([
    ...defaults.map((section) => byId[section.id] || section),
    ...normalized.filter((section) => !defaultIds.has(section.id))
  ])));
}

function orderCvSections(sections) {
  return [...(sections || [])].sort((a, b) => {
    const aIndex = CV_SECTION_ORDER.indexOf(a.id);
    const bIndex = CV_SECTION_ORDER.indexOf(b.id);
    const normalizedA = aIndex < 0 ? Number.MAX_SAFE_INTEGER : aIndex;
    const normalizedB = bIndex < 0 ? Number.MAX_SAFE_INTEGER : bIndex;
    return normalizedA - normalizedB;
  });
}

function dedupeCvSectionItems(sections) {
  return (sections || []).map((section) => {
    const seen = new Set();
    return {
      ...section,
      items: (section.items || []).filter((item) => {
        const titleKey = String(item.title || "").trim().toLowerCase();
        const key = section.id === "professional-development"
          ? titleKey
          : [titleKey, item.date || "", item.meta || "", item.description || ""].join("|").toLowerCase();
        if (!key || seen.has(key)) return false;
        seen.add(key);
        return true;
      })
    };
  });
}

function replaceKnownCvItems(section, desiredItems, sectionTitle, knownPatterns = []) {
  const desired = (desiredItems || []).map((item, index) => normalizeCvItem(item, sectionTitle, index));
  const desiredTitles = new Set(desired.map((item) => String(item.title || "").trim().toLowerCase()));
  const extras = (section.items || []).filter((item) => {
    const title = String(item.title || "").trim();
    if (!title) return false;
    if (desiredTitles.has(title.toLowerCase())) return false;
    return !knownPatterns.some((pattern) => pattern.test(title));
  });
  section.items = [...desired, ...extras];
}

function ensureCvCareerAdditions(sections) {
  const additions = [
    {
      sectionId: "skills",
      sectionTitle: "Technical Skills",
      item: {
        id: "skill-gis-mapping",
        title: "GIS and Mapping",
        bullets: [
          "ArcGIS, QGIS, Civil 3D, and Autodesk workflows for geospatial data handling, map creation, spatial analysis, and CAD-based mapping."
        ]
      }
    },
    {
      sectionId: "skills",
      sectionTitle: "Technical Skills",
      item: {
        id: "skill-surveying",
        title: "Surveying",
        bullets: [
          "Land surveying, field measurements, hydrographic surveying exposure, and survey returns preparation."
        ]
      }
    },
    {
      sectionId: "skills",
      sectionTitle: "Technical Skills",
      item: {
        id: "skill-remote-sensing-photogrammetry",
        title: "Remote Sensing and Photogrammetry",
        bullets: [
          "Remote sensing, LiDAR, close-range photogrammetry, and Google Earth Engine for academic and research workflows."
        ]
      }
    },
    {
      sectionId: "skills",
      sectionTitle: "Technical Skills",
      item: {
        id: "skill-programming-web-development",
        title: "Programming and Web Development",
        bullets: [
          "HTML, CSS, JavaScript, Python, Java, and R for web projects, geospatial scripting, data automation, and academic tools."
        ]
      }
    },
    {
      sectionId: "skills",
      sectionTitle: "Technical Skills",
      item: {
        id: "skill-drone-operations",
        title: "Drone Operations",
        bullets: [
          "Practical exposure to drone-assisted aerial surveying and flight handling for spatial data capture and project documentation; not yet certified."
        ]
      }
    },
    {
      sectionId: "skills",
      sectionTitle: "Technical Skills",
      item: {
        id: "skill-data-processing-documentation",
        title: "Data Processing and Documentation",
        bullets: [
          "Microsoft Word, Excel, and PowerPoint for technical documentation, data organization, reports, and presentation materials."
        ]
      }
    },
    {
      sectionId: "works",
      sectionTitle: "Projects and Selected Works",
      item: {
        id: "works-freelance-programming",
        title: "Self-employed / Commission-based",
        date: "2024 - Present",
        meta: "Freelance Programmer / Web Developer",
        bullets: [
          "Built responsive websites and browser-based tools for academic, service-based, and commission-based projects.",
          "Provided programming support for thesis work, academic tasks, geospatial workflows, and technical commissions.",
          "Handled front-end project setup, interface implementation, and deployment preparation."
        ]
      }
    },
    {
      sectionId: "works",
      sectionTitle: "Projects and Selected Works",
      item: {
        id: "works-undergraduate-thesis",
        title: "Assessment of Aboveground Carbon Change of Aquaculture-Mangrove Converted Ecosystems in Aklan Using Global Ecosystems Dynamics Investigation (GEDI) LiDAR",
        meta: "**Unpublished Undergraduate Thesis**",
        bullets: ["C.E.A. Biagtan, J.L.C. Ramirez, A.M.T. Tamondong, A.B. Baloloy, R. Suwa"]
      }
    },
    {
      sectionId: "professional-development",
      sectionTitle: "Professional Development",
      item: {
        id: "professional-development-future-earth-cns",
        title: "Regional Future Earth Meta-Network and Core Network Systems (CNS) Workshop and Field Visits",
        date: "March 28-29, 2026",
        meta: "BFAR-PFO New Washington and Boracay Island, Aklan, Philippines",
        description: "Participant",
        bullets: [
          "Participated in seminars and workshops on **sustainable environmental management, monitoring, and protection**.",
          "Demonstrated **drone flight and automated aerial surveying workflows** during field activities."
        ]
      }
    },
    {
      sectionId: "works",
      sectionTitle: "Works",
      item: {
        id: "works-pr1me-tutorial-services",
        title: "PR1ME Tutorial Services",
        meta: "pr1metutorialservices.com",
        description: "**Responsive web project** - pr1metutorialservices.com",
        bullets: [
          "Developed a responsive website presenting **services, tutors, packages, and client inquiry flows**.",
          "Implemented front-end structure and deployment workflow for publication on **Vercel**.",
          "Link: pr1metutorialservices.com"
        ]
      }
    }
  ];
  const skillsSection = sections.find((item) => item.id === "skills");
  if (skillsSection) {
    skillsSection.title = "Technical Skills";
    const staleSkillTitles = new Set(["surveying and mapping", "mapping and gis", "programming and web deployment", "data handling"]);
    skillsSection.items = (skillsSection.items || []).filter((item) => !staleSkillTitles.has(String(item.title || "").trim().toLowerCase()));
  }
  const worksSection = sections.find((item) => item.id === "works");
  if (worksSection) worksSection.title = "Projects and Selected Works";
  const credentialsSection = sections.find((item) => item.id === "licenses-and-certifications");
  if (credentialsSection) credentialsSection.title = "Credentials and Eligibility";
  const workExperienceSection = sections.find((item) => item.id === "work-experience");
  if (workExperienceSection) {
    workExperienceSection.items = (workExperienceSection.items || []).filter((item) => String(item.title || "").trim().toLowerCase() !== "freelance programmer / web developer");
    replaceKnownCvItems(
      workExperienceSection,
      sourceCvSections.find((section) => section.title === "Work Experience").entries,
      "Work Experience",
      [
        /geodetic engineering student intern/i,
        /student intern/i,
        /community manager/i,
        /campus moonton/i,
        /part-time tutor/i,
        /pr1me tutorial services/i,
        /moonton student leaders/i,
        /up esports varsity team/i,
        /rasa surveying/i,
        /early internship exposure/i
      ]
    );
  }
  if (skillsSection) {
    replaceKnownCvItems(
      skillsSection,
      sourceCvSections.find((section) => section.title === "Skills").entries,
      "Technical Skills",
      [/surveying/i, /mapping/i, /gis/i, /remote sensing/i, /photogrammetry/i, /programming/i, /web/i, /drone/i, /data/i, /event handling/i, /flexible/i]
    );
  }
  const affiliationSection = sections.find((item) => item.id === "affiliations-and-leadership");
  if (affiliationSection) {
    replaceKnownCvItems(
      affiliationSection,
      sourceCvSections.find((section) => section.title === "Affiliations & Leadership").entries,
      "Affiliations and Leadership",
      [/up namnama/i, /moonton student leaders/i, /up esports varsity team/i, /university of the philippines esports varsity team/i, /\bUPGG\b/i, /gaming guild/i]
    );
  }
  additions.forEach((addition) => {
    const section = sections.find((item) => item.id === addition.sectionId);
    if (!section) return;
    const existing = (section.items || []).find((item) => String(item.title || "").trim().toLowerCase() === addition.item.title.toLowerCase());
    if (existing && (addition.item.id === "works-pr1me-tutorial-services" || addition.item.id === "professional-development-future-earth-cns" || addition.item.id === "works-undergraduate-thesis")) {
      existing.meta = addition.item.meta;
      existing.description = addition.item.description;
      existing.bullets = [...addition.item.bullets];
    } else if (existing && addition.sectionId === "skills") {
      existing.bullets = [...(addition.item.bullets || [])];
    } else if (!existing) {
      section.items.push(normalizeCvItem(addition.item, addition.sectionTitle, section.items?.length || 0));
    }
  });
  const graduateSummary = "Detail-oriented and highly motivated Bachelor of Science in Geodetic Engineering graduate from the University of the Philippines Diliman, with hands-on experience in traditional surveying, remote sensing, GIS, and photogrammetry. Eager to take on new challenges, continuously learn, and grow professionally.";
  const summarySection = sections.find((item) => item.id === "summary");
  const summaryItem = summarySection?.items?.find((item) => item.id === "summary-main" || /professional summary/i.test(item.title || ""));
  if (summaryItem && /4th-year|student at the University of the Philippines Diliman/i.test(summaryItem.description || "")) {
    summaryItem.description = graduateSummary;
  }
  const educationSection = sections.find((item) => item.id === "education");
  const geodeticDegree = educationSection?.items?.find((item) => /bachelor of science in geodetic engineering|University of the Philippines Diliman/i.test([item.title, item.meta].filter(Boolean).join(" ")));
  if (geodeticDegree) {
    geodeticDegree.title = "University of the Philippines Diliman";
    geodeticDegree.date = "2021 - 2026";
    geodeticDegree.meta = "";
    geodeticDegree.bullets = [
      "**Bachelor of Science in Geodetic Engineering**",
      "**DOST RA 7687 S&T Undergraduate Scholarship Grantee** (2021-2025)",
      "**UP Student Learning Assistance System (SLAS) Scholarship Awardee** (2023-2024)"
    ];
  }
  const highSchool = educationSection?.items?.find((item) => /high school|Philippine Science High School/i.test([item.title, item.meta].filter(Boolean).join(" ")));
  if (highSchool) {
    highSchool.title = "Philippine Science High School - Ilocos Region Campus";
    highSchool.date = "2015 - 2021";
    highSchool.meta = "";
    highSchool.bullets = [
      "**With High Honors** (2021)",
      "**Proficiency Award in Arts, Design, and Technology** (2021)",
      "**STEM Track** - Physics Strand, Electronics Elective, Agriculture Elective"
    ];
  }
  return sections;
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
  next.place = "";
  next.contact = `${DOCUMENT_EMAIL} | (+63) 916 7023 686 | LinkedIn`;
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
  if (/^(skill|skills|technical skills)$/i.test(value)) return "Technical Skills";
  if (/^(works?|projects?(\s+and\s+selected\s+works?)?|selected works?)$/i.test(value)) return "Projects and Selected Works";
  if (/^(credential|credentials|eligibility|credentials?\s*(and|&)\s*eligibility|license|licenses|certification|certifications|licenses?\s*(and|&)\s*certifications?)$/i.test(value)) return "Credentials and Eligibility";
  if (/^records?\s*only$/i.test(value)) return "Records Only";
  if (/^affiliations\s*&\s*leadership$/i.test(value)) return "Affiliations and Leadership";
  return value || "Projects and Selected Works";
}

function sectionIdFromTitle(title) {
  return normalizeCvSectionId(slugify(normalizeCvSectionTitle(title || "Works")));
}

function normalizeCvSectionId(id) {
  const value = String(id || "").trim();
  if (value === "affiliations-leadership") return "affiliations-and-leadership";
  if (value === "technical-skills") return "skills";
  if (value === "projects-and-selected-works" || value === "selected-works") return "works";
  if (value === "credentials-and-eligibility" || value === "credentials" || value === "eligibility") return "licenses-and-certifications";
  return value;
}

function ensureUpggArimaongaEntry(targetState) {
  const hasBullet = (items = []) => items.some((item) => String(item || "").trim().toLowerCase() === UPGG_ARIMAONGA_BULLET.toLowerCase());
  const addBullet = (item) => {
    item.bullets = Array.isArray(item.bullets) ? item.bullets : parseBulletLines(item.bullets || "");
    item.bullets = item.bullets.map((bullet) =>
      String(bullet || "").replace(/\*\*/g, "").trim().toLowerCase() === UPGG_ARIMAONGA_BULLET.replace(/\*\*/g, "").toLowerCase()
        ? UPGG_ARIMAONGA_BULLET
        : bullet
    );
    if (!hasBullet(item.bullets)) item.bullets.push(UPGG_ARIMAONGA_BULLET);
  };
  const isUpgg = (item) => /\bUPGG\b|University of the Philippines Gaming Guild/i.test(item?.title || "");
  targetState.records ||= [];
  const upggRecord = targetState.records.find((record) =>
    sectionIdFromTitle(record.category || "") === "affiliations-and-leadership" && isUpgg(record)
  );
  if (upggRecord) {
    addBullet(upggRecord);
  } else {
    targetState.records.push({
      id: "record-upgg-affiliation",
      startDate: "",
      endDate: "",
      category: "Affiliations and Leadership",
      title: UPGG_TITLE,
      organization: "",
      location: "",
      file: "",
      fileName: "",
      fileData: "",
      attachmentId: "",
      attachmentUrl: "",
      description: "",
      bullets: [UPGG_ARIMAONGA_BULLET]
    });
  }
  const affiliationSection = (targetState.cvSections || []).find((section) => section.id === "affiliations-and-leadership");
  const upggCvItem = affiliationSection?.items?.find(isUpgg);
  if (upggCvItem) addBullet(upggCvItem);
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
  management: {
    salaries: [],
    allocations: [],
    bills: []
  },
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
    { id: uid(), tutor: "Graduate Tutor", classType: "Elem/JHS", mode: "F2F", packageName: "5 Hours", amount: 420 },
    { id: uid(), tutor: "Graduate Tutor", classType: "SHS", mode: "F2F", packageName: "5 Hours", amount: 480 },
    { id: uid(), tutor: "Graduate Tutor", classType: "College", mode: "F2F", packageName: "5 Hours", amount: 540 },
    { id: uid(), tutor: "Graduate Tutor", classType: "Elem/JHS", mode: "Virtual", packageName: "10 Hours", amount: 360 },
    { id: uid(), tutor: "Graduate Tutor", classType: "SHS", mode: "Virtual", packageName: "10 Hours", amount: 420 },
    { id: uid(), tutor: "Graduate Tutor", classType: "College", mode: "Virtual", packageName: "10 Hours", amount: 480 },
    { id: uid(), tutor: "Graduate Tutor", classType: "Elem/JHS", mode: "F2F", packageName: "10 Hours", amount: 360 },
    { id: uid(), tutor: "Graduate Tutor", classType: "SHS", mode: "F2F", packageName: "10 Hours", amount: 420 },
    { id: uid(), tutor: "Graduate Tutor", classType: "College", mode: "F2F", packageName: "10 Hours", amount: 480 },
    { id: uid(), tutor: "Graduate Tutor", classType: "Elem/JHS", mode: "Virtual", packageName: "15 Hours", amount: 300 },
    { id: uid(), tutor: "Graduate Tutor", classType: "SHS", mode: "Virtual", packageName: "15 Hours", amount: 340 },
    { id: uid(), tutor: "Graduate Tutor", classType: "College", mode: "Virtual", packageName: "15 Hours", amount: 380 },
    { id: uid(), tutor: "Graduate Tutor", classType: "Elem/JHS", mode: "F2F", packageName: "15 Hours", amount: 300 },
    { id: uid(), tutor: "Graduate Tutor", classType: "SHS", mode: "F2F", packageName: "15 Hours", amount: 340 },
    { id: uid(), tutor: "Graduate Tutor", classType: "College", mode: "F2F", packageName: "15 Hours", amount: 380 },
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
const hadCurrentSeedAtStartup = Boolean(window.salarySheetCurrentState);
let state = loadState();
let recentlyClaimedPackageKeys = new Set();
let cvSelectionMode = false;
let selectedCvItems = new Set();
let currentManagementTab = "salary";
let cloudSync = {
  enabled: false,
  loading: false,
  saving: false,
  error: "",
  lastSavedAt: "",
  timer: null,
  saveQueued: false,
  revision: 0,
  lastSavedRevision: 0
};

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

document.addEventListener("DOMContentLoaded", () => {
  setupNavigation();
  setupForms();
  setupActions();
  removeLapsedOneTimeSchedules();
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

function localIsoDate(date = new Date()) {
  const pad = (value) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function isoToLocalDate(dateString) {
  const [year, month, day] = String(dateString || "").split("-").map(Number);
  return new Date(year || 1970, (month || 1) - 1, day || 1);
}

function hasStoredState() {
  try {
    return Boolean(localStorage.getItem(STORAGE_KEY));
  } catch (error) {
    return false;
  }
}

function loadState() {
  const currentSeed = window.salarySheetCurrentState ? migrateState(structuredClone(window.salarySheetCurrentState)) : null;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const storedState = migrateState(JSON.parse(stored));
      return currentSeed && currentMonthSessionHistoryIsAhead(currentSeed, storedState) ? currentSeed : storedState;
    }
  } catch (error) {
    console.warn("Could not load saved Salary Sheet data.", error);
  }
  return currentSeed || migrateState(buildInitialState());
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

function ensureStudyBuddyRates(targetState) {
  targetState.settings ||= structuredClone(defaultState.settings);
  targetState.settings.packages = uniqueDisplayValues([
    ...(targetState.settings.packages || []).map((packageName) => packageName === "Group (5 and up)" ? "Group (5-9)" : packageName),
    ...studyBuddyRatePackages.map((rate) => rate.packageName)
  ]);
  targetState.rates ||= [];
  targetState.rates.forEach((rate) => {
    if (rate.tutor === CURRENT_RATE_TUTOR && rate.classType === "Group" && rate.packageName === "Group (5 and up)") {
      rate.packageName = "Group (5-9)";
      rate.amount = 500;
    }
  });
  studyBuddyRatePackages.forEach((ratePackage) => {
    studyBuddyRateModes.forEach((mode) => {
      const existing = targetState.rates.find((rate) => (
        rate.tutor === CURRENT_RATE_TUTOR &&
        rate.classType === "Group" &&
        sameMode(rate.mode, mode) &&
        rate.packageName === ratePackage.packageName
      ));
      if (existing) {
        existing.amount = ratePackage.amount;
        existing.mode = mode;
      } else {
        targetState.rates.push({
          id: uid(),
          tutor: CURRENT_RATE_TUTOR,
          classType: "Group",
          mode,
          packageName: ratePackage.packageName,
          amount: ratePackage.amount
        });
      }
    });
  });
}

function ensureGraduateTutorRates(targetState) {
  targetState.rates ||= [];
  targetState.rates = targetState.rates.filter((rate) => rate.tutor === CURRENT_RATE_TUTOR);
  graduateTutorRatePackages.forEach((ratePackage) => {
    Object.entries(ratePackage.amounts).forEach(([classType, amount]) => {
      graduateTutorRateModes.forEach((mode) => {
        const existing = targetState.rates.find((rate) => (
          rate.tutor === CURRENT_RATE_TUTOR &&
          rate.classType === classType &&
          sameMode(rate.mode, mode) &&
          rate.packageName === ratePackage.packageName
        ));
        if (existing) {
          existing.amount = amount;
          existing.mode = mode;
        } else {
          targetState.rates.push({
            id: uid(),
            tutor: CURRENT_RATE_TUTOR,
            classType,
            mode,
            packageName: ratePackage.packageName,
            amount
          });
        }
      });
    });
  });
}

function migrateState(inputState) {
  const next = inputState || buildInitialState();
  const imported = window.salarySheetWorkbookData;
  const importedRows = (imported?.sessions || []).filter((session) => !REMOVED_IMPORTED_SESSION_IDS.has(session.id));
  const importedSessions = Object.fromEntries(importedRows.map((session) => [session.id, session]));
  const shouldResetImportedOpenStatuses = next.importStatusPolicyVersion !== IMPORT_STATUS_POLICY_VERSION;

  next.settings ||= structuredClone(defaultState.settings);
  next.settings.modes = ["Virtual", "F2F", "Hybrid"];
  ensureGraduateTutorRates(next);
  ensureStudyBuddyRates(next);
  next.settings.students = uniqueNormalizedNames(
  (next.settings.students || [])
    .map(normalizeStudentName)
    .filter((name) => name && normalizeStudentName(name) !== "SUBS"));

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
  next.management = normalizeManagementState(next.management);
  next.cvProfile = normalizeCvProfile(next.cvProfile);
  next.cvSections = normalizeCvSections(next.cvSections || buildDefaultCvSections());
  ensureUpggArimaongaEntry(next);
  next.cvResumeItemIds = uniqueValues(next.cvResumeItemIds || []);
  const knownSessionIds = new Set(next.sessions.map((session) => session.id));
  importedRows.forEach((session) => {
    if (!knownSessionIds.has(session.id)) next.sessions.push(hydrateSession(session));
  });
  next.settings.students = uniqueNormalizedNames([
    ...next.settings.students,
    ...next.sessions.map((session) => session.student).filter((name) => normalizeStudentName(name) !== "SUBS")
  ]);
  const recordsByName = new Map((next.studentRecords || []).map((student) => [studentKey(student.name || student.key), student]));
  next.studentRecords = next.settings.students.map((name) => recordsByName.get(studentKey(name)) || { key: name, name, status: "Active", notes: "" });
  syncStudentRecords(next, { persist: false });
  if (next.studentStatusPolicyVersion !== STUDENT_STATUS_POLICY_VERSION) {
    const openStudents = new Set(next.sessions.filter(isOpenStatus).map((session) => studentKey(session.student)).filter(Boolean));
    next.studentRecords = next.studentRecords.map((student) => ({
      ...student,
      status: openStudents.has(studentKey(student.name)) ? "Active" : "Inactive"
    }));
    next.studentStatusPolicyVersion = STUDENT_STATUS_POLICY_VERSION;
  }
  next.claimHistory = normalizeClaimHistory(next.claimHistory, imported?.claimHistory || []);
  next.importStatusPolicyVersion = IMPORT_STATUS_POLICY_VERSION;

  next.schedules = (next.schedules || [])
    .filter((item) => !REMOVED_IMPORTED_SCHEDULE_IDS.has(item.id))
    .map((item) => ({
    ...item,
    student: normalizeStudentName(item.student),
    mode: normalizeModeLabel(item.mode)
  }));
  next.rates = (next.rates || []).map((rate) => ({ ...rate, mode: normalizeModeLabel(rate.mode) }));
  return next;
}

function saveState() {
  state.localUpdatedAt = new Date().toISOString();
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
      state = remoteState;
      const cleanedOneTimeSchedules = removeLapsedOneTimeSchedules(new Date(), false);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      cloudSync.dirty = cleanedOneTimeSchedules;
      cloudSync.saveQueued = cleanedOneTimeSchedules;
      hydrateControls();
      render();
      migrateLegacyRecordAttachments();
    } else if (hadLocalStateAtStartup) {
      await syncCloudSave(true);
    } else {
      cloudSync.error = "No cloud data found";
    }
    await syncPendingRecordAttachments();
  } catch (error) {
    cloudSync.error = error.message || "Cloud sync unavailable";
    console.warn("Cloud sync unavailable.", error);
  } finally {
  cloudSync.loading = false;

  /*
    If the user created/edited a record while cloud data was loading,
    save that newer local version after loading completes.
  */
  if (cloudSync.saveQueued) {
    cloudSync.saveQueued = false;
    window.setTimeout(() => syncCloudSave(), 0);
  }

  renderCloudStatus();
}
}

function localStateShouldWinCloud() {
  return false;
}

function currentMonthSessionHistoryIsAhead(localState, remoteState) {
  const month = new Date().toISOString().slice(0, 7);
  const rowsForMonth = (stateToCheck) => (stateToCheck?.sessions || [])
    .filter(hasUsableDate)
    .filter((session) => session.date?.startsWith(month));
  const localRows = rowsForMonth(localState);
  const remoteRows = rowsForMonth(remoteState);
  const latest = (rows) => rows.reduce((date, row) => row.date > date ? row.date : date, "");
  return localRows.length > remoteRows.length || latest(localRows) > latest(remoteRows);
}

function queueCloudSave() {
  if (!cloudSync.enabled) return;

  cloudSync.revision += 1;
  cloudSync.saveQueued = true;

  clearTimeout(cloudSync.timer);

  if (cloudSync.loading) {
    renderCloudStatus();
    return;
  }

  cloudSync.timer = window.setTimeout(() => {
    syncCloudSave();
  }, CLOUD_SYNC_DEBOUNCE_MS);

  renderCloudStatus();
}

async function syncCloudSave(force = false) {
  if (!cloudSync.enabled && !force) return;

  if (cloudSync.loading) {
    cloudSync.saveQueued = true;
    return;
  }

  if (cloudSync.saving) {
    cloudSync.saveQueued = true;
    return;
  }

  const revisionBeingSaved = cloudSync.revision;
  const stateSnapshot = structuredClone(state);

  cloudSync.saving = true;
  cloudSync.error = "";
  cloudSync.saveQueued = false;
  renderCloudStatus();

  try {
    const response = await fetch(CLOUD_STATE_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({ state: stateSnapshot })
    });

    if (!response.ok) {
      throw new Error(`Cloud save failed: ${response.status}`);
    }

    const payload = await response.json();

    cloudSync.lastSavedAt = payload.updatedAt || new Date().toISOString();
    cloudSync.lastSavedRevision = revisionBeingSaved;
  } catch (error) {
    cloudSync.error = "Cloud save failed";
    console.warn("Cloud save failed.", error);
  } finally {
    cloudSync.saving = false;

    /*
      If the user added/edited something while this save was running,
      send the newer state immediately after this request ends.
    */
    if (
      cloudSync.saveQueued ||
      cloudSync.revision > revisionBeingSaved
    ) {
      cloudSync.saveQueued = false;
      window.setTimeout(() => syncCloudSave(), 0);
    }

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
    const cleanedOneTimeSchedules = removeLapsedOneTimeSchedules(new Date(), false);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    cloudSync.lastSavedAt = payload.updatedAt;
    cloudSync.error = "";
    hydrateControls();
    render();
    if (cleanedOneTimeSchedules) saveState();
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

function isPersonalUnlocked() {
  return sessionStorage.getItem(PERSONAL_ACCESS_STORAGE_KEY) === "true";
}

function isManagementUnlocked() {
  return sessionStorage.getItem(MANAGEMENT_ACCESS_STORAGE_KEY) === "true";
}

async function sha256Text(value) {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest)).map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function showAccessDialog({ title, message, validate, unavailableMessage }) {
  return new Promise((resolve) => {
    const previousActiveElement = document.activeElement;
    const backdrop = document.createElement("div");
    backdrop.className = "access-modal-backdrop";
    backdrop.innerHTML = `
      <form class="access-modal" role="dialog" aria-modal="true" aria-labelledby="accessModalTitle">
        <p class="eyebrow">Protected Area</p>
        <h2 id="accessModalTitle">${escapeHtml(title)}</h2>
        <p class="access-modal-copy">${escapeHtml(message)}</p>
        <label class="access-password-label">
          <span>Password</span>
          <span class="access-password-wrap">
            <input id="accessPasswordInput" type="password" autocomplete="current-password" required>
            <button class="access-eye-button" type="button" aria-label="Show password">Show</button>
          </span>
        </label>
        <p class="access-error" id="accessError" hidden>Incorrect password.</p>
        <div class="access-modal-actions">
          <button class="ghost" type="button" data-access-cancel>Cancel</button>
          <button class="primary" type="submit">Unlock</button>
        </div>
      </form>`;

    const cleanup = (result) => {
      document.removeEventListener("keydown", handleKeydown);
      backdrop.remove();
      previousActiveElement?.focus?.();
      resolve(result);
    };

    const form = backdrop.querySelector("form");
    const input = backdrop.querySelector("#accessPasswordInput");
    const error = backdrop.querySelector("#accessError");
    const submitButton = backdrop.querySelector("button[type='submit']");
    const eyeButton = backdrop.querySelector(".access-eye-button");

    const handleKeydown = (event) => {
      if (event.key === "Escape") cleanup(false);
    };

    eyeButton.addEventListener("click", () => {
      const isHidden = input.type === "password";
      input.type = isHidden ? "text" : "password";
      eyeButton.textContent = isHidden ? "Hide" : "Show";
      eyeButton.setAttribute("aria-label", isHidden ? "Hide password" : "Show password");
      input.focus();
    });

    backdrop.querySelector("[data-access-cancel]").addEventListener("click", () => cleanup(false));
    backdrop.addEventListener("click", (event) => {
      if (event.target === backdrop) cleanup(false);
    });

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      error.hidden = true;
      submitButton.disabled = true;

      try {
        if (await validate(input.value)) {
          input.value = "";
          cleanup(true);
          return;
        }
      } catch (error) {
        window.alert(unavailableMessage);
        cleanup(false);
        return;
      } finally {
        submitButton.disabled = false;
      }

      input.value = "";
      error.hidden = false;
      input.focus();
    });

    document.body.appendChild(backdrop);
    document.addEventListener("keydown", handleKeydown);
    window.setTimeout(() => input.focus(), 0);
  });
}

async function requestPersonalAccess() {
  if (isPersonalUnlocked()) return true;

  const unlocked = await showAccessDialog({
    title: "Personal Records",
    message: "Enter your Personal password to continue.",
    unavailableMessage: "Personal lock is unavailable in this browser session.",
    validate: async (value) => await sha256Text(value) === PERSONAL_ACCESS_HASH
  });

  if (unlocked) sessionStorage.setItem(PERSONAL_ACCESS_STORAGE_KEY, "true");
  return unlocked;
}

function lockPersonalAccess() {
  sessionStorage.removeItem(PERSONAL_ACCESS_STORAGE_KEY);

  if (PERSONAL_VIEW_IDS.has(location.hash.replace("#", ""))) {
    location.hash = "#dashboard";
  }

  window.alert("Personal records have been locked.");
}

async function requestManagementAccess() {
  if (isManagementUnlocked()) return true;

  const unlocked = await showAccessDialog({
    title: "Management",
    message: "Enter your Management password to continue.",
    unavailableMessage: "Management lock is unavailable in this browser session.",
    validate: async (value) => await sha256Text(value) === MANAGEMENT_ACCESS_HASH
  });

  if (unlocked) sessionStorage.setItem(MANAGEMENT_ACCESS_STORAGE_KEY, "true");
  return unlocked;
}
function setupNavigation() {
  const menuToggle = $("#menuToggle");
  const sidebar = $("#sidebar");

  const setMenuOpen = (open) => {
    sidebar?.classList.toggle("open", open);
    menuToggle?.setAttribute("aria-expanded", String(open));
  };

  menuToggle?.addEventListener("click", () => {
    setMenuOpen(!sidebar?.classList.contains("open"));
  });

  const activate = async () => {
    const requestedId = (location.hash || "#dashboard").replace("#", "");
    let target = document.getElementById(requestedId) ? requestedId : "dashboard";

    const leavingPersonal =
      PERSONAL_VIEW_IDS.has(currentActiveView) &&
      !PERSONAL_VIEW_IDS.has(target);

    if (leavingPersonal) {
      sessionStorage.removeItem(PERSONAL_ACCESS_STORAGE_KEY);
    }
    const leavingManagement =
      MANAGEMENT_VIEW_IDS.has(currentActiveView) &&
      !MANAGEMENT_VIEW_IDS.has(target);

    if (leavingManagement) {
      sessionStorage.removeItem(MANAGEMENT_ACCESS_STORAGE_KEY);
    }

    if (PERSONAL_VIEW_IDS.has(target) && !(await requestPersonalAccess())) {
      target = "dashboard";

      if (location.hash !== "#dashboard") {
        location.hash = "#dashboard";
        return;
      }
    }

    if (MANAGEMENT_VIEW_IDS.has(target) && !(await requestManagementAccess())) {
      target = "dashboard";

      if (location.hash !== "#dashboard") {
        location.hash = "#dashboard";
        return;
      }
    }

    $$(".view").forEach((view) => {
      view.classList.toggle("active", view.id === target);
    });

    $$(".nav a").forEach((link) => {
      link.classList.toggle("active", link.dataset.view === target);
    });

    $$(".nav-group").forEach((group) => {
      if (group.querySelector(`[data-view="${target}"]`)) {
        group.open = true;
      }
    });

    $("#viewTitle").textContent =
      document.getElementById(target)?.dataset.title || "Dashboard";

    $("#monthFilter")
      ?.closest("label")
      ?.classList.toggle("hidden-control", target !== "dashboard");

    setMenuOpen(false);
    currentActiveView = target;
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
    $("#" + id).addEventListener("change", () => setSuggestedRate());
  });
  $("#sessionRate").addEventListener("input", () => {
    sessionRateManuallyEdited = true;
  });
  $("#sessionStudent").addEventListener("change", () => {
    updateSessionPackageOptions();
    setSuggestedRate();
  });

  $("#personalSessionStudent")?.addEventListener("input", resetPersonalPackageLabelForStudent);
  $("#personalSessionStudent")?.addEventListener("change", resetPersonalPackageLabelForStudent);

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
  $("#studentGroupSortBy")?.addEventListener("change", renderGroups);
  $("#studentGroupSortDirection")?.addEventListener("change", renderGroups);
  $("#packageSearch")?.addEventListener("input", renderPackages);
  $("#personalPackageSearch")?.addEventListener("input", renderPersonalPackages);
  $("#personalReceiptDate")?.addEventListener("change", renderPersonalReceipt);
  $("#claimDate").addEventListener("change", () => {
    enforceClaimCutoffInputs();
    saveState();
    render();
  });

  $("#clearSessionForm").addEventListener("click", resetSessionForm);
  $("#clearPersonalSessionForm")?.addEventListener("click", resetPersonalSessionForm);
  $("#clearRecordForm")?.addEventListener("click", resetRecordForm);
  $("#managementSalaryForm")?.addEventListener("submit", saveManagementSalary);
  $("#managementAllocationForm")?.addEventListener("submit", saveManagementAllocation);
  $("#managementBillForm")?.addEventListener("submit", saveManagementBill);
  $("#billMonth")?.addEventListener("change", () => {
    loadManagementBillForm($("#billMonth").value);
    renderManagementBills();
  });
  $$("[data-management-tab]").forEach((button) => button.addEventListener("click", () => setManagementTab(button.dataset.managementTab)));
  ["airconPrevious", "airconCurrent", "airconRate", "refPrevious", "refCurrent", "refRate"].forEach((id) => {
    $("#" + id)?.addEventListener("input", updateBillDevicePreview);
  });
  $("#saveBillPurchase")?.addEventListener("click", saveBillPurchase);
  $("#clearBillPurchase")?.addEventListener("click", resetBillPurchaseForm);
  $("#managementMonth")?.addEventListener("change", () => {
    syncManagementMonthInputs();
    renderManagement();
  });
  $("#clearManagementSalary")?.addEventListener("click", resetManagementSalaryForm);
  $("#clearManagementAllocation")?.addEventListener("click", resetManagementAllocationForm);
  $("#clearScheduleForm").addEventListener("click", resetScheduleForm);
}

function setupActions() {
  $("#printView").addEventListener("click", () => window.print());
  $("#markClaimed").addEventListener("click", confirmBefore("Claim all packages shown in Claiming View?", markClaimed));
  $("#exportSessionsCsv").addEventListener("click", () => exportCsv("session-log.csv", sessionCsvRows(sessionLogRows())));
  $("#exportPersonalCsv")?.addEventListener("click", () => exportCsv("personal-session-log.csv", sessionCsvRows(personalSessionRows())));
  $("#exportPersonalReceiptCsv")?.addEventListener("click", () => exportCsv("personal-receipt-view.csv", sessionCsvRows(personalReceiptSessions())));
  $("#claimPersonalReceipt")?.addEventListener("click", confirmBefore("Mark all closed personal packages in Receipt View as claimed?", claimPersonalReceipt));
  $("#exportClaimCsv").addEventListener("click", () => exportCsv("claiming-view.csv", sessionCsvRows(claimableSessions())));
  $("#exportJson").addEventListener("click", () => downloadFile("salary-sheet-backup.json", JSON.stringify(state, null, 2), "application/json"));
  $("#importJson").addEventListener("change", importJson);
  $("#syncCloudNow")?.addEventListener("click", syncCloudNow);
  $("#inactiveExceptOpen")?.addEventListener("click", setInactiveExceptOpenStudents);
  $("#resetDemo").addEventListener("click", confirmBefore("Reset all local data to the demo workbook?", () => {
    state = migrateState(buildInitialState());
    saveState();
    hydrateControls();
    render();
  }));
  $("#closeSelectedPackages").addEventListener("click", confirmBefore("Close the selected packages for claiming?", () => setSelectedPackagesStatus("For Claiming")));
  $("#reopenSelectedPackages").addEventListener("click", confirmBefore("Reopen the selected packages as pending?", () => setSelectedPackagesStatus("Pending")));
  $("#closePersonalPackages")?.addEventListener("click", confirmBefore("Close the selected personal packages?", () => setPersonalSelectedPackagesStatus("Closed")));
  $("#openPersonalPackages")?.addEventListener("click", confirmBefore("Reopen the selected personal packages?", () => setPersonalSelectedPackagesStatus("Pending")));
}

function hydrateControls() {
  const today = new Date().toISOString().slice(0, 10);
  const claimDate = claimCutoffDate();
  $("#monthFilter").value ||= today.slice(0, 7);
  $("#claimDate").value ||= claimDate;
  if ($("#packageClaimDate")) $("#packageClaimDate").value ||= claimDate;
  if ($("#personalReceiptDate")) $("#personalReceiptDate").value ||= today;
  if ($("#billMonth")) $("#billMonth").value ||= nextMonthValue(today.slice(0, 7));
  const managementMonth = today.slice(0, 7);
  if ($("#managementMonth")) $("#managementMonth").value ||= managementMonth;
  syncManagementMonthInputs();
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

  fillSelect($("#scheduleDay"), scheduleDayOptions);
  fillDatalist($("#scheduleStudentOptions"), activeStudentNames());
  $("#scheduleTutor").value = "Lloyd Ramirez";
  fillSelect($("#scheduleMode"), state.settings.modes);
  fillSelect($("#scheduleFrequency"), state.settings.frequencies);
  fillSelect($("#scheduleStatus"), state.settings.scheduleStatuses);

  fillSelect($("#rateTutor"), [CURRENT_RATE_TUTOR], CURRENT_RATE_TUTOR);
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
  renderPersonalReceipt();
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
  renderManagement();
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

function recentSevenDayWindow(baseDate = new Date()) {
  const endDate = new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate());
  const startDate = new Date(endDate);
  startDate.setDate(endDate.getDate() - 6);
  return {
    start: localIsoDate(startDate),
    end: localIsoDate(endDate)
  };
}

function recentSevenDaySessions() {
  const { start, end } = recentSevenDayWindow();
  return state.sessions
    .filter(hasUsableDate)
    .filter((session) => session.status !== "Cancelled")
    .filter((session) => session.date >= start && session.date <= end);
}

function currentMonthWindow(baseDate = new Date()) {
  const today = new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate());
  const startDate = new Date(today.getFullYear(), today.getMonth(), 1);
  const endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  return {
    start: localIsoDate(startDate),
    today: localIsoDate(today),
    end: localIsoDate(endDate),
    elapsedDays: today.getDate(),
    daysInMonth: endDate.getDate(),
    remainingDays: Math.max(0, endDate.getDate() - today.getDate())
  };
}

function currentMonthToDateSessions(range = currentMonthWindow()) {
  return state.sessions
    .filter(hasUsableDate)
    .filter((session) => session.status !== "Cancelled")
    .filter((session) => session.date >= range.start && session.date <= range.today);
}

function nextMonthWindow(baseDate = new Date()) {
  const startDate = new Date(baseDate.getFullYear(), baseDate.getMonth() + 1, 1);
  const endDate = new Date(baseDate.getFullYear(), baseDate.getMonth() + 2, 0);
  return {
    start: localIsoDate(startDate),
    end: localIsoDate(endDate),
    month: localIsoDate(startDate).slice(0, 7)
  };
}

function isOneTimeSchedule(item) {
  return /^one-time$/i.test(item?.frequency || "") || /^one-time$/i.test(item?.status || "");
}

function scheduleStatusAllowsProjection(item) {
  const status = String(item?.status || "Active").toLowerCase();
  return status === "active" || status === "one-time";
}

function scheduleMinutes(timeText) {
  return Math.round(timeToDecimal(timeText) * 60);
}

function scheduleOccurrenceThisWeek(item, baseDate = new Date()) {
  if (!item?.day || !item.start || !item.end) return null;
  const itemDayIndex = days.indexOf(item.day);
  const todayIndex = days.indexOf(dayName(localIsoDate(baseDate)));
  if (itemDayIndex < 0 || todayIndex < 0) return null;

  const startOfToday = new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate());
  const start = new Date(startOfToday);
  start.setDate(startOfToday.getDate() + (itemDayIndex - todayIndex));

  const startMinutes = scheduleMinutes(item.start);
  let endMinutes = scheduleMinutes(item.end);
  if (endMinutes <= startMinutes) endMinutes += 24 * 60;

  start.setHours(Math.floor(startMinutes / 60), startMinutes % 60, 0, 0);
  const end = new Date(start);
  end.setHours(0, 0, 0, 0);
  end.setMinutes(endMinutes);

  return {
    start,
    end,
    date: localIsoDate(start)
  };
}

function oneTimeScheduleIsLapsed(item, baseDate = new Date()) {
  if (!isOneTimeSchedule(item)) return false;
  const occurrence = scheduleOccurrenceThisWeek(item, baseDate);
  return occurrence ? occurrence.end < baseDate : false;
}

function removeLapsedOneTimeSchedules(baseDate = new Date(), persist = true) {
  const schedules = state.schedules || [];
  const nextSchedules = schedules.filter((item) => !oneTimeScheduleIsLapsed(item, baseDate));
  if (nextSchedules.length === schedules.length) return false;
  state.schedules = nextSchedules;
  if (persist) saveState();
  return true;
}

function projectionNameKey(value) {
  return normalizeStudentName(value).toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function isPshsMc9Schedule(item) {
  const key = projectionNameKey(item?.student);
  return /\bpshs\b/.test(key) && (/\bmc\b/.test(key) || /\bmc9\b/.test(key)) && (/\b(?:9|g9)\b/.test(key) || /\bmc9\b/.test(key));
}

function scheduleProjectionRate(item, fallbackRate = 300) {
  const key = projectionNameKey(item?.student);
  if (/\bupis\b/.test(key) && /\b(?:8|g8)\b/.test(key)) return 450;
  if (isPshsMc9Schedule(item)) return 550;
  if ((/\bfabi\b/.test(key) && /\bkarlo\b/.test(key)) || (/\bkarlo\b/.test(key) && /\bfabi\b/.test(key))) return 350;
  if (/\bfritzie\b/.test(key) || /\bbella\b/.test(key)) return 340;
  return fallbackRate;
}

function weekKeyForDate(date) {
  const copy = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const offset = (copy.getDay() + 6) % 7;
  copy.setDate(copy.getDate() - offset);
  return localIsoDate(copy);
}

function scheduledProjectionForMonth(range, hourlyRate = 300) {
  const scheduleItems = (state.schedules || [])
    .filter(scheduleStatusAllowsProjection)
    .filter((item) => item.start && item.end);
  const start = isoToLocalDate(range.start);
  let weeklyHours = 0;
  let oneTimeHours = 0;
  let pay = 0;
  const pshsMc9Occurrences = [];
  const hours = scheduleItems.reduce((total, item) => {
    const duration = computeHours(item.start, item.end);
    const rate = scheduleProjectionRate(item, hourlyRate);
    if (isOneTimeSchedule(item)) {
      const occurrence = scheduleOccurrenceThisWeek(item);
      if (occurrence && occurrence.end >= new Date() && occurrence.date >= range.start && occurrence.date <= range.end) {
        oneTimeHours += duration;
        pay += duration * rate;
        return total + duration;
      }
      return total;
    }

    if (isPshsMc9Schedule(item)) {
      for (let date = new Date(start); localIsoDate(date) <= range.end; date.setDate(date.getDate() + 1)) {
        if (dayName(localIsoDate(date)) === item.day) {
          pshsMc9Occurrences.push({ date: new Date(date), duration, rate });
        }
      }
      return total;
    }

    weeklyHours += duration;
    let occurrences = 0;
    for (let date = new Date(start); localIsoDate(date) <= range.end; date.setDate(date.getDate() + 1)) {
      if (dayName(localIsoDate(date)) === item.day) occurrences += 1;
    }
    pay += occurrences * duration * rate;
    return total + occurrences * duration;
  }, 0);
  const pshsByWeek = new Map();
  pshsMc9Occurrences.forEach((occurrence) => {
    const key = weekKeyForDate(occurrence.date);
    const current = pshsByWeek.get(key);
    if (!current || occurrence.duration > current.duration) pshsByWeek.set(key, occurrence);
  });
  const pshsHours = sum([...pshsByWeek.values()], (occurrence) => occurrence.duration);
  pay += sum([...pshsByWeek.values()], (occurrence) => occurrence.duration * occurrence.rate);
  if (pshsByWeek.size) weeklyHours += Math.max(...[...pshsByWeek.values()].map((occurrence) => occurrence.duration));
  return {
    hours: hours + pshsHours,
    weeklyHours,
    oneTimeHours,
    pay,
    rate: hours + pshsHours ? pay / (hours + pshsHours) : hourlyRate
  };
}

function recentWeekDailySummary(rows, range) {
  const byDate = groupBy(rows, (session) => session.date);
  const start = isoToLocalDate(range.start);
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    const iso = localIsoDate(date);
    const items = byDate[iso] || [];
    return {
      date: iso,
      ...summarize(items)
    };
  });
}

function salaryGradeProjection(amount) {
  if (!amount) {
    return {
      label: "No salary grade yet",
      base: 0,
      next: { grade: 1, base: salaryGradeStepOne2026[0] }
    };
  }

  let match = null;
  let next = null;
  salaryGradeStepOne2026.forEach((base, index) => {
    const grade = index + 1;
    if (amount >= base) match = { grade, base };
    else if (!next) next = { grade, base };
  });

  if (!match) {
    return {
      label: "Below SG 1",
      base: 0,
      next: { grade: 1, base: salaryGradeStepOne2026[0] }
    };
  }

  return {
    label: `SG ${match.grade} Step 1`,
    base: match.base,
    next
  };
}

function shortSalaryGradeLabel(grade) {
  const match = String(grade?.label || "").match(/SG\s+\d+/i);
  return match ? match[0].toUpperCase() : grade?.label || "No SG";
}

function topValues(values, count = 3) {
  return [...new Set(values.filter((value) => value > 0).sort((a, b) => b - a))].slice(0, count);
}

function rankClassForValue(value, rankedValues, prefix) {
  const index = rankedValues.indexOf(value);
  if (index < 0) return "";
  return `${prefix}-${index + 1}`;
}

function renderDashboard() {
  const rows = dashboardSessions();
  const totals = summarize(rows);
  const allRows = state.sessions.filter((row) => row.status !== "Cancelled");
  const recentRows = recentSevenDaySessions();
  const recentTotals = summarize(recentRows);
  const recentRange = recentSevenDayWindow();
  const recentDays = recentWeekDailySummary(recentRows, recentRange);
  const recentDayMax = Math.max(1, ...recentDays.map((row) => row.pay));
  const currentMonthRange = currentMonthWindow();
  const currentMonthKey = currentMonthRange.today.slice(0, 7);
  const nextMonthRange = nextMonthWindow();
  const nextMonthProjection = scheduledProjectionForMonth(nextMonthRange, 300);
  const monthToDateTotals = summarize(currentMonthToDateSessions(currentMonthRange));
  const currentMonthLoggedDays = new Set(currentMonthToDateSessions(currentMonthRange).map((row) => row.date)).size || 0;
  const monthDailyPace = monthToDateTotals.pay / Math.max(1, currentMonthRange.elapsedDays);
  const monthlyProjection = Math.max(monthToDateTotals.pay, monthDailyPace * currentMonthRange.daysInMonth);
  const projectionGrade = salaryGradeProjection(monthlyProjection);
  const claimed = claimedPayrollTotal();
  const forClaiming = sum(allRows.filter(isClaimingStatus), totalPay);
  const pending = sum(allRows.filter((row) => row.status === "Pending"), totalPay);
  const currentUnclaimed = currentUnclaimedTotal();
  const peak = peakDay(rows);
  const monthLabel = $("#monthFilter").value ? monthName($("#monthFilter").value) : "selected month";
  const currentMonthLabel = monthName(currentMonthKey);
  const activeDays = new Set(rows.map((row) => row.date)).size || 0;
  const avgHours = activeDays ? totals.hours / activeDays : 0;
  const avgEarnings = activeDays ? totals.pay / activeDays : 0;

  $("#dashboardMetrics").innerHTML = [
    metric("Monthly Earnings", money(totals.pay), `${monthLabel} / ${totals.sessions} sessions`, "earnings"),
    metric("Ready For Claiming", money(forClaiming), "closed packages waiting to claim", "unclaimed"),
    metric("Total Unclaimed", money(currentUnclaimed), `${unclaimedSinceLabel()} / ${unclaimedSessions().length} logs`, "total"),
    metric("Peak Day of the Month", peak ? money(peak.pay) : money(0), peak ? `${formatDate(peak.date)} (${peak.sessions} sessions)` : "No sessions", "peak")
  ].join("");

  const months = monthlySummary(state.sessions.filter((row) => row.status !== "Cancelled").filter(hasUsableDate)).slice(-12);
  const topMonthPay = Math.max(0, ...months.map((row) => row.pay));
  const topHistoricalMonthPay = Math.max(0, ...months.filter((row) => row.month !== currentMonthKey).map((row) => row.pay));
  const max = Math.max(1, ...months.map((row) => row.pay), monthlyProjection);
  $("#monthlyChart").innerHTML = months.map((row) => {
    const isCurrentMonth = row.month === currentMonthKey;
    const projectedExtra = isCurrentMonth ? Math.max(0, monthlyProjection - row.pay) : 0;
    const totalHeight = Math.max(4, ((row.pay + projectedExtra) / max) * 84);
    const projectionShare = projectedExtra ? Math.max(5, (projectedExtra / (row.pay + projectedExtra)) * 100) : 0;
    const actualShare = Math.max(0, 100 - projectionShare);
    const monthClass = isCurrentMonth ? "current-month" : topHistoricalMonthPay > 0 && row.pay === topHistoricalMonthPay ? "top-month" : "";
    const grade = salaryGradeProjection(row.pay);
    const showValue = topMonthPay > 0 && row.pay === topMonthPay;
    const tooltip = `${money(row.pay)} / ${number(row.hours)} hrs`;
    return `<div class="bar ${monthClass}" tabindex="0" title="${escapeAttr(tooltip)}" aria-label="${escapeAttr(`${monthName(row.month)}: ${tooltip}`)}">
      <span class="bar-value">${showValue ? moneyShort(row.pay) : ""}</span>
      <span class="bar-stack" style="height:${totalHeight}%">
        ${projectedExtra ? `<span class="bar-projection-fill" style="height:${projectionShare}%"></span>` : ""}
        <span class="bar-fill" style="height:${projectedExtra ? actualShare : 100}%"></span>
        <span class="bar-tooltip">${escapeHtml(money(row.pay))}<small>${number(row.hours)} hrs</small></span>
      </span>
      <span class="bar-grade">${escapeHtml(shortSalaryGradeLabel(grade))}</span>
      <span class="bar-label">${escapeHtml(monthName(row.month, true))}</span>
    </div>`;
  }).join("") || `<p class="empty">No monthly data yet.</p>`;

  $("#recentWeekRange").textContent = `${formatShortDate(recentRange.start)} - ${formatShortDate(recentRange.end)}`;
  const recentRankValues = topValues(recentDays.map((row) => row.pay), 3);
  $("#recentWeekChart").innerHTML = recentDays.map((row) => {
    const height = Math.max(row.pay ? 8 : 3, (row.pay / recentDayMax) * 88);
    const todayClass = row.date === recentRange.end ? " today-bar" : "";
    const rankClass = rankClassForValue(row.pay, recentRankValues, "day-rank");
    const showValue = rankClass === "day-rank-1";
    const tooltip = `${money(row.pay)} / ${number(row.hours)} hrs`;
    return `<div class="week-bar ${rankClass}${todayClass}" tabindex="0" title="${escapeAttr(tooltip)}" aria-label="${escapeAttr(`${formatDate(row.date)}: ${tooltip}`)}">
      <span class="week-value">${showValue && row.pay ? moneyShort(row.pay) : ""}</span>
      <span class="week-fill" style="height:${height}%"><span class="bar-tooltip">${escapeHtml(money(row.pay))}<small>${number(row.hours)} hrs</small></span></span>
      <span class="week-day">${escapeHtml(dayName(row.date).slice(0, 3))}</span>
      <span class="week-date">${escapeHtml(formatShortDate(row.date))}</span>
    </div>`;
  }).join("");

  $("#projectionMetrics").innerHTML = `<article class="projection-card">
    <div class="projection-lines">
      <div><span>${escapeHtml(currentMonthLabel)}</span><strong>${money(monthlyProjection)}</strong></div>
      <div><span>${escapeHtml(monthName(nextMonthRange.month))}</span><strong>${money(nextMonthProjection.pay)}</strong></div>
    </div>
    <div class="salary-grade-chip">
      <b>${escapeHtml(shortSalaryGradeLabel(projectionGrade))}</b>
      <span>Current: ${currentMonthLoggedDays} logged days</span>
      <span class="salary-grade-next">Next: ${number(nextMonthProjection.weeklyHours)} hrs/week</span>
    </div>
    <div class="projection-grade-summary">
      <span>Salary Grade Step</span><strong>${escapeHtml(projectionGrade.label)}</strong>
      <span>Base Pay Level</span><strong>${money(projectionGrade.base)}</strong>
    </div>
  </article>`;

  const averageTitle = $("#averagePanelTitle");
  if (averageTitle) averageTitle.textContent = `${monthName(currentMonthKey).replace(/\s+\d{4}$/, "")} Average`;
  $("#averageMetrics").innerHTML = [
    metric("Avg Hours / Day", number(avgHours), activeDays ? `${activeDays} logged days` : "No logged days", "unclaimed"),
    metric("Avg Earnings / Day", money(avgEarnings), "", "earnings")
  ].join("");

  $("#recentSevenMetrics").innerHTML = [
    metric("7-Day Earnings", money(recentTotals.pay), `${formatShortDate(recentRange.start)} - ${formatShortDate(recentRange.end)}`, "earnings"),
    metric("7-Day Hours", number(recentTotals.hours), `${recentTotals.sessions} sessions`, "unclaimed"),
    metric("Today", money(sum(recentRows.filter((session) => session.date === recentRange.end), totalPay)), "", "unclaimed")
  ].join("");

  const statusRows = [
    ["Claimed", claimed],
    ["For Claiming", forClaiming],
    ["Pending", pending]
  ];
  $("#statusStack").innerHTML = statusRows.map(([label, value]) => (
    `<article class="status-card status-${statusClass(label)}"><span>${escapeHtml(label)}</span><strong>${money(value)}</strong></article>`
  )).join("");

  const rankedDays = dailySummary(rows)
    .sort((a, b) => b.pay - a.pay || b.date.localeCompare(a.date));
  const peakDayRankValues = topValues(rankedDays.map((row) => row.pay), 3);
  $("#peakDays").innerHTML = rankedDays.slice(0, 6).map((row) => {
    const rankClass = rankClassForValue(row.pay, peakDayRankValues, "peak-row");
    return `<tr class="${rankClass}"><td>${formatDate(row.date)}</td><td>${escapeHtml(dayName(row.date))}</td><td>${row.sessions}</td><td>${number(row.hours)}</td><td>${money(row.pay)}</td></tr>`;
  }).join("") || emptyRow(5);

  $("#unclaimedStudentRows").innerHTML = unclaimedByStudent().map((row) => (
    `<tr><td>${escapeHtml(row.student)}</td><td>${row.sessions}</td><td>${number(row.hours)}</td><td>${money(row.claiming)}</td><td>${money(row.open)}</td><td>${money(row.pay)}</td></tr>`
  )).join("") || emptyRow(6);
}

function renderSessions() {
  $("#sessionRows").innerHTML = sessionLogRows().map((session) => {
    const hours = totalHours(session);
    const pay = totalPay(session);
    return `<tr class="${sessionRowClass(session)}">
      <td>${formatDate(session.date)}</td>
      <td>${escapeHtml(packageLabel(session))}</td>
      <td>${escapeHtml(formatTimeRange(session.start, session.end))}</td>
      <td>${escapeHtml(session.student)}</td>
      <td>${escapeHtml(session.classType)}</td>
      <td>${escapeHtml(session.mode)}</td>
      <td>${number(hours)}</td>
      <td>${money(session.rate)}</td>
      <td>${money(pay)}</td>
      <td><div class="row-actions"><button class="mini" type="button" data-edit-session="${escapeAttr(session.id)}">Edit</button><button class="mini" type="button" data-delete-session="${escapeAttr(session.id)}">Delete</button></div></td>
    </tr>`;
  }).join("") || emptyRow(10);

  $$("[data-edit-session]").forEach((button) => button.addEventListener("click", () => editSession(button.dataset.editSession)));
  $$("[data-delete-session]").forEach((button) => button.addEventListener("click", confirmBefore("Delete this Pr1me session?", () => deleteItem("sessions", button.dataset.deleteSession))));
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
      <td>${escapeHtml(formatTimeRange(session.start, session.end))}</td>
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
  $$("[data-delete-personal]").forEach((button) => button.addEventListener("click", confirmBefore("Delete this personal session?", () => deleteItem("personalSessions", button.dataset.deletePersonal))));
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
  const claimed = pkg.sessions.length && pkg.sessions.every(isClaimedStatus);
  const closed = !claimed && pkg.sessions.length && pkg.sessions.every((session) => session.status === "Closed");
  const stateClass = claimed ? "personal-claimed" : closed ? "personal-closed" : "personal-open";
  const stateLabel = claimed ? "Claimed" : closed ? "Closed" : "Open";
  const pillClass = claimed ? "claimed" : closed ? "claimed" : "pending";
  return `<article class="package-card personal-package-card ${stateClass}">
    <label class="package-select"><input type="checkbox" class="personal-package-check" value="${escapeAttr(pkg.key)}"><span>${escapeHtml(pkg.label)}</span></label>
    <div class="package-stats"><span>${pkg.sessions.length} logs &middot; ${number(pkg.hours)} hrs</span><span>${money(pkg.pay)}</span></div>
    <span class="pill ${pillClass}">${stateLabel}</span>
  </article>`;
}


function personalReceiptSessions() {
  return (state.personalSessions || [])
    .filter(isPersonalReceiptStatus)
    .sort((a, b) => a.student.localeCompare(b.student) || packageLabel(a).localeCompare(packageLabel(b)) || a.date.localeCompare(b.date) || a.start.localeCompare(b.start));
}

function isPersonalReceiptStatus(session) {
  return session.status === "Closed" && !isClaimedStatus(session);
}

function renderPersonalReceipt() {
  const metricsTarget = $("#personalReceiptMetrics");
  const rowsTarget = $("#personalReceiptRows");
  if (!metricsTarget || !rowsTarget) return;

  const rows = personalReceiptSessions();
  const totals = summarize(rows);
  const receiptDate = $("#personalReceiptDate")?.value || new Date().toISOString().slice(0, 10);
  metricsTarget.innerHTML = [
    metric("Receipt Amount", money(totals.pay), `${totals.sessions} sessions`, "earnings"),
    metric("Total Hours", number(totals.hours), "closed personal packages", "unclaimed"),
    metric("Receipt Date", receiptDate ? formatDate(receiptDate) : "Not set", "personal receipt", "total")
  ].join("");

  const groups = packageSummaries(rows)
    .sort((a, b) => a.student.localeCompare(b.student) || (packageNumber(a.label) ?? 999) - (packageNumber(b.label) ?? 999) || a.label.localeCompare(b.label));

  rowsTarget.innerHTML = groups.map((pkg) => {
    const body = pkg.sessions.map((session) => (
      `<tr class="claim-row personal-receipt-row personal-row">
        <td>${formatDate(session.date)}</td>
        <td>${escapeHtml(session.student)}</td>
        <td>${escapeHtml(formatTimeRange(session.start, session.end))}</td>
        <td>${number(totalHours(session))}</td>
        <td>${money(session.rate)}</td>
        <td>${money(totalPay(session))}</td>
      </tr>`
    )).join("");
    return `<tr class="claim-package-head personal-receipt-head"><td colspan="6"><strong>${escapeHtml(pkg.student)} / ${escapeHtml(pkg.label)}</strong><span>${pkg.sessions.length} logs &middot; ${number(pkg.hours)} hrs &middot; ${money(pkg.pay)}</span></td></tr>${body}<tr class="claim-package-total personal-receipt-total"><td colspan="3">TOTAL HRS</td><td>${number(pkg.hours)}</td><td>TOTAL</td><td>${money(pkg.pay)}</td></tr>`;
  }).join("") || emptyRow(6);
}

function claimPersonalReceipt() {
  const receiptDate = $("#personalReceiptDate")?.value || new Date().toISOString().slice(0, 10);
  const ids = new Set(personalReceiptSessions().map((session) => session.id));
  if (!ids.size) return;
  state.personalSessions ||= [];
  state.personalSessions.forEach((session) => {
    if (!ids.has(session.id)) return;
    session.status = "Claimed";
    session.claimed = true;
    session.claimDate = receiptDate;
  });
  saveState();
  render();
}
function renderPersonalGroups() {
  const target = $("#personalStudentGroups");
  if (!target) return;
  target.innerHTML = groupedPanels("student", personalSessionRows());
}

function renderRates() {
  const visibleRates = state.rates.filter((rate) => rate.tutor === CURRENT_RATE_TUTOR);
  $("#rateRows").innerHTML = visibleRates.map((rate) => (
    `<tr>
      <td>${rateSelect(rate.id, "tutor", [CURRENT_RATE_TUTOR], rate.tutor)}</td>
      <td>${rateSelect(rate.id, "classType", state.settings.classTypes, rate.classType)}</td>
      <td>${rateSelect(rate.id, "mode", state.settings.modes, rate.mode)}</td>
      <td>${rateSelect(rate.id, "packageName", state.settings.packages, rate.packageName)}</td>
      <td><input class="rate-edit" data-rate-id="${escapeAttr(rate.id)}" data-rate-field="amount" type="number" min="0" step="0.01" value="${escapeAttr(rate.amount)}"></td>
      <td><div class="row-actions"><button class="mini" type="button" data-delete-rate="${escapeAttr(rate.id)}">Delete</button></div></td>
    </tr>`
  )).join("") || emptyRow(6);

  $$(".rate-edit").forEach((control) => control.addEventListener("change", () => updateRateCell(control)));
  $$("[data-delete-rate]").forEach((button) => button.addEventListener("click", confirmBefore("Delete this rate?", () => deleteItem("rates", button.dataset.deleteRate))));
}

function rateSelect(id, field, options, value) {
  return `<select class="rate-edit" data-rate-id="${escapeAttr(id)}" data-rate-field="${escapeAttr(field)}">${options.map((option) => `<option value="${escapeAttr(option)}"${option === value ? " selected" : ""}>${escapeHtml(option)}</option>`).join("")}</select>`;
}

function updateRateCell(control) {
  const rate = state.rates.find((item) => item.id === control.dataset.rateId);
  if (!rate) return;
  if (!window.confirm("Save this rate change?")) { renderRates(); return; }
  rate[control.dataset.rateField] = control.dataset.rateField === "amount" ? Number(control.value || 0) : control.value;
  saveState();
  setSuggestedRate();
}

function renderSchedule() {
  const order = Object.fromEntries(days.map((day, index) => [day, index]));
  const rows = [...state.schedules]
    .sort((a, b) => order[a.day] - order[b.day] || a.start.localeCompare(b.start));

  $("#scheduleRows").innerHTML = rows.map((item) => (
    `<tr>
      <td>${escapeHtml(item.day)}</td>
      <td>${escapeHtml(formatScheduleTimeRange(item.start, item.end))}</td>
      <td>${escapeHtml(item.student)}</td>
      <td><span class="mode-badge ${normalizeMode(item.mode)}">${escapeHtml(item.mode)}</span></td>
      <td>${escapeHtml(item.frequency)}</td>
      <td>${escapeHtml(item.status)}</td>
      <td>${escapeHtml(item.notes || "")}</td>
      <td>
        <div class="row-actions">
          <button class="mini" type="button" data-edit-schedule="${escapeAttr(item.id)}">Edit</button>
          <button class="mini" type="button" data-delete-schedule="${escapeAttr(item.id)}">Delete</button>
        </div>
      </td>
    </tr>`
  )).join("") || emptyRow(8);

  $$("[data-edit-schedule]").forEach((button) =>
    button.addEventListener("click", () => editSchedule(button.dataset.editSchedule))
  );

  $$("[data-delete-schedule]").forEach((button) =>
    button.addEventListener("click", confirmBefore("Delete this schedule item?", () => deleteItem("schedules", button.dataset.deleteSchedule)))
  );
}

function renderWeekly() {
  const startHour = 8;
  const endHour = 23;
  const pixelsPerHour = 56;
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
    const height = Math.max(34, (block.end - block.start) * pixelsPerHour - 4);
    const left = `calc(${(block.column / columnCount) * 100}% + 6px)`;
    const width = `calc(${100 / columnCount}% - 12px)`;
    return `<div class="schedule-block ${normalizeMode(block.item.mode)} ${scheduleTypeClass(block.item)}" style="top:${top}px;height:${height}px;left:${left};right:auto;width:${width}"><strong>${escapeHtml(block.item.student)}</strong><span>${escapeHtml(formatScheduleTimeRange(block.item.start, block.item.end))}</span></div>`;
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
      <span>${pkg.sessions.length} logs &middot; ${number(pkg.hours)} hrs</span>
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

  const groups = packageSummaries(rows)
    .sort((a, b) => a.student.localeCompare(b.student) || (packageNumber(a.label) ?? 999) - (packageNumber(b.label) ?? 999) || a.label.localeCompare(b.label));
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
  const claimRows = archiveClaimRows();

  $("#archiveMetrics").innerHTML = [
    metric("Total Claimed Payroll", money(claimedPayrollTotal()), `${claimRows.length} claim dates`),
    metric("Total Payroll Ever Since", money(totalEver), `${state.sessions.length} logs`),
    metric("Current Unclaimed", money(currentUnclaimedTotal()), "open or ready for claiming")
  ].join("");

  $("#archiveRows").innerHTML = claimRows.map((claim, index) => (
    `<tr><td>${formatDate(claim.claimDate)}</td><td>${escapeHtml(claim.label || "Claimed Payroll")}</td><td>${escapeHtml(claim.logs || "")}</td><td><div class="history-amount-cell"><span>${money(claim.amount)}</span><button class="mini" type="button" data-view-claim="${index}">View</button></div></td></tr>`
  )).join("") || emptyRow(4);

  $$("[data-view-claim]").forEach((button) => button.addEventListener("click", () => showClaimHistoryDetails(claimRows[Number(button.dataset.viewClaim)])));
}

function archiveClaimRows() {
  return (state.claimHistory || []).length
    ? [...state.claimHistory].sort((a, b) => b.claimDate.localeCompare(a.claimDate))
    : claimHistoryFromSessions();
}

function claimedPayrollTotal() {
  const historyTotal = sum(archiveClaimRows(), (claim) => Number(claim.amount || 0));
  const sessionClaimed = sum(state.sessions.filter(isClaimedStatus), totalPay);
  return historyTotal || sessionClaimed;
}

function showClaimHistoryDetails(claim) {
  const target = $("#archiveClaimDetails");
  if (!target || !claim) return;
  const sessions = claimSessionsForHistory(claim);
  const rows = sessions.map((session) => (
    `<tr><td>${formatDate(session.date)}</td><td>${escapeHtml(session.student)}</td><td>${escapeHtml(packageLabel(session))}</td><td>${number(totalHours(session))}</td><td>${money(session.rate)}</td><td>${money(totalPay(session))}</td></tr>`
  )).join("");
  target.innerHTML = `<section class="panel claim-detail-panel"><div class="panel-head"><h2>${escapeHtml(claim.label || "Claimed Payroll")} - ${formatDate(claim.claimDate)}</h2><strong>${money(claim.amount || sum(sessions, totalPay))}</strong></div><div class="table-wrap"><table><thead><tr><th>Date</th><th>Student</th><th>Package</th><th>Hours</th><th>Rate</th><th>Total Pay</th></tr></thead><tbody>${rows || emptyRow(6)}</tbody></table></div></section>`;
  target.scrollIntoView({ behavior: "smooth", block: "start" });
}

function claimSessionsForHistory(claim) {
  const ids = new Set(claim.sessionIds || []);
  if (ids.size) return state.sessions.filter((session) => ids.has(session.id)).sort((a, b) => a.date.localeCompare(b.date));
  const sameDate = state.sessions
    .filter((session) => session.claimDate === claim.claimDate && isClaimedStatus(session))
    .sort((a, b) => a.date.localeCompare(b.date) || a.student.localeCompare(b.student));
  if (!sameDate.length) return [];
  const claimedAmount = Number(claim.amount || 0);
  const sameDateAmount = sum(sameDate, totalPay);
  if (!claimedAmount || Math.abs(sameDateAmount - claimedAmount) < 0.02) return sameDate;
  return sameDate;
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

function unclaimedSinceLabel() {
  const dates = unclaimedSessions().filter(hasUsableDate).map((session) => session.date).sort();
  return dates.length ? `Since ${formatDate(dates[0])}` : "No unclaimed logs";
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
    .filter((session) => session.status !== "Cancelled");
  $("#studentGroups").innerHTML = groupedPanels("student", rows, studentGroupComparator());
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
  $$("[data-delete-record]").forEach((button) => button.addEventListener("click", confirmBefore("Delete this credential record?", () => deleteItem("records", button.dataset.deleteRecord))));
}

function renderCareerDocuments() {
  updateDocumentProfile();
  renderResumeFromSelection($("#resumeContent"));
  renderCurriculumVitae($("#cvContent"));
  renderCvAttachments();
}

function updateDocumentProfile() {
  const profile = normalizeCvProfile(state.cvProfile || {});
  [["#resumeDocumentName", profile.name], ["#cvDocumentName", profile.name]].forEach(([selector, value]) => {
    const element = $(selector);
    if (element) element.textContent = value || "";
  });
  const contactHtml = documentContactHtml();
  ["#resumeDocumentContact", "#cvDocumentContact"].forEach((selector) => {
    const element = $(selector);
    if (element) element.innerHTML = contactHtml;
  });
}

function documentContactHtml() {
  return [
    `<span class="contact-item"><a href="mailto:${escapeAttr(DOCUMENT_EMAIL)}">${escapeHtml(DOCUMENT_EMAIL)}</a></span>`,
    `<span class="contact-item">(+63) 916 7023 686</span>`,
    `<span class="contact-item"><a href="${escapeAttr(DOCUMENT_LINKEDIN_URL)}" target="_blank" rel="noopener noreferrer">LinkedIn</a></span>`
  ].join("");
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
  $$(`[data-cv-record-edit]`).forEach((button) => button.addEventListener("click", () => editCvRecordItem(button.dataset.sectionId, button.dataset.cvRecordEdit)));
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
  const cleanedSections = dedupeCvSectionItems(sections);
  sections.splice(0, sections.length, ...cleanedSections);
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
  return sections.filter((section) => section.id !== "summary");
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
    date: Object.prototype.hasOwnProperty.call(record, "cvDate") ? record.cvDate : formatRecordPeriod(record),
    meta: Object.prototype.hasOwnProperty.call(record, "cvMeta") ? record.cvMeta : [record.organization, record.location].filter(Boolean).join(" / "),
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
    ? `<button class="mini cv-edit-button no-print" type="button" data-section-id="${escapeAttr(options.sectionId || "")}" data-cv-record-edit="${escapeAttr(item.recordId)}">Edit</button>`
    : `<button class="mini cv-edit-button no-print" type="button" data-section-id="${escapeAttr(options.sectionId || "")}" data-edit-cv-item="${escapeAttr(item.id)}">Edit</button>`;
  const removeButton = options.resume
    ? `<button class="mini cv-edit-button no-print" type="button" data-remove-resume-item="${escapeAttr(item.id)}">Remove</button>`
    : "";
  const bulletHtml = item.bullets?.length
    ? options.sectionId === "works"
      ? `<div class="document-inline-details">${item.bullets.map((bullet) => `<p>${formatDocumentText(bullet)}</p>`).join("")}</div>`
      : `<ul>${item.bullets.map((bullet) => `<li>${formatDocumentText(bullet)}</li>`).join("")}</ul>`
    : "";
  return `<article class="document-item cv-detail-item">
    <div class="document-item-main">
      ${selector}
      <div class="document-item-body">
        <div class="document-item-title"><strong>${escapeHtml(item.title)}</strong>${item.date ? `<span>${escapeHtml(item.date)}</span>` : ""}</div>
        ${item.meta ? `<p class="document-item-meta">${formatDocumentText(item.meta)}</p>` : ""}
        ${item.description ? `<p class="${item.descriptionItalic ? "document-item-description is-italic" : "document-item-description"}">${formatDocumentText(item.description)}</p>` : ""}
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

function editCvRecordItem(sectionId, recordId) {
  const record = (state.records || []).find((item) => item.id === recordId);
  if (!record) return;
  const section = sectionId || sectionIdFromTitle(record.category || "Works");
  const item = recordToCvItem(record);
  $("#cvDetailEditingSection").value = section;
  $("#cvDetailEditingId").value = item.id;
  $("#cvDetailSection").value = section;
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
  if (itemId.startsWith("record:")) {
    saveCvRecordDetail(itemId.slice("record:".length), targetSectionId || originalSectionId);
    return;
  }

  if (!window.confirm("Save the updated CV detail?")) return;
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
  state.cvSections = dedupeCvSectionItems(state.cvSections);
  saveState();
  resetCvDetailEditor();
  renderCareerDocuments();
}

function saveCvRecordDetail(recordId, targetSectionId) {
  const record = (state.records || []).find((item) => item.id === recordId);
  if (!record) return;
  if (!window.confirm("Save the updated CV record detail?")) return;
  const targetSection = (state.cvSections || []).find((section) => section.id === targetSectionId);
  const selectedSectionLabel = $("#cvDetailSection")?.selectedOptions?.[0]?.textContent || "";
  Object.assign(record, {
    category: normalizeCvSectionTitle(targetSection?.title || selectedSectionLabel || record.category || "Works"),
    title: $("#cvDetailTitle")?.value.trim() || "",
    cvDate: $("#cvDetailDate")?.value.trim() || "",
    cvMeta: $("#cvDetailMeta")?.value.trim() || "",
    description: $("#cvDetailDescription")?.value.trim() || "",
    bullets: ($("#cvDetailBullets")?.value || "").split(/\r?\n/).map((line) => line.trim()).filter(Boolean)
  });
  saveState();
  resetCvDetailEditor();
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

function groupedPanels(key, rows, comparator = null) {
  const groups = groupBy(rows, (row) => row[key] || "Unassigned");
  return Object.entries(groups)
    .map(([name, items]) => ({ name, items, totals: summarize(items.filter((item) => item.status !== "Cancelled")), hasOpen: items.some((item) => !isClaimedStatus(item)) }))
    .sort(comparator || ((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: "base" })))
    .map(({ name, items, totals }) => {
    const rowHtml = (session) => (
      `<tr class="${sessionRowClass(session)}"><td>${formatDate(session.date)}</td><td>${escapeHtml(dayName(session.date))}</td><td>${escapeHtml(formatTimeRange(session.start, session.end))}</td><td>${escapeHtml(session.student)}</td><td>${escapeHtml(packageLabel(session))}</td><td>${escapeHtml(session.classType)}</td><td>${number(totalHours(session))}</td><td>${money(session.rate)}</td><td>${money(totalPay(session))}</td><td>${statusPill(session.status)}</td></tr>`
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

function resetPersonalPackageLabelForStudent() {
  const input = $("#personalSessionPackageLabel");
  if (input && !$("#personalSessionId")?.value) input.value = "";
  updatePersonalSessionPackageOptions();
}

function updatePersonalSessionPackageOptions(selected = "") {
  const input = $("#personalSessionPackageLabel");
  if (!input) return;
  const editing = Boolean($("#personalSessionId")?.value);
  const current = selected || input.value.trim();
  const nextLabel = nextPersonalPackageLabel(current, { editing });
  input.value = nextLabel;
}

function nextPersonalPackageLabel(selected = "", options = {}) {
  selected = normalizePackageEntryLabel(selected);
  const student = normalizeStudentName($("#personalSessionStudent")?.value.trim() || "");
  if (!student) return selected || "";
  const summaries = packageSummaries((state.personalSessions || []).filter((session) => session.student === student));
  const isClosed = (pkg) => pkg.sessions.length && pkg.sessions.every((session) => session.status === "Closed");
  const selectedPackage = summaries.find((pkg) => samePackageLabel(pkg.label, selected));
  if (options.editing && selected) return selected;
  if (selected && (!selectedPackage || !isClosed(selectedPackage))) return selected;
  const openPackage = summaries.find((pkg) => !isClosed(pkg))?.label;
  if (openPackage) return openPackage;
  const numbers = summaries.map((pkg) => packageNumber(pkg.label)).filter(Boolean);
  return `PACKAGE ${Math.max(0, ...numbers) + 1}`;
}

function normalizePackageEntryLabel(value) {
  const text = String(value || "").trim();
  const match = text.match(/^(?:package\s*)?(\d+)$/i);
  return match ? `PACKAGE ${Number(match[1])}` : text;
}

function samePackageLabel(a, b) {
  const first = normalizePackageEntryLabel(a);
  const second = normalizePackageEntryLabel(b);
  if (!first || !second) return false;
  const firstNo = packageNumber(first);
  const secondNo = packageNumber(second);
  if (firstNo && secondNo) return firstNo === secondNo;
  return first.toLowerCase() === second.toLowerCase();
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
  updatePersonalSessionPackageOptions();
}

function syncStudentRecords(targetState = state, options = {}) {
  targetState.settings ||= {};
  targetState.settings.students ||= [];
  targetState.studentRecords ||= [];

  const byNormalized = new Map();
  const aliasToFullKey = new Map();
  targetState.studentRecords.forEach((student) => {
    const name = normalizeStudentName(student.name || student.key || "");
    const fullKey = studentKey(name);
    if (!fullKey || byNormalized.has(fullKey)) return;
    const normalizedRecord = {
      ...student,
      key: name,
      name
    };
    byNormalized.set(fullKey, normalizedRecord);
    [student.key, student.name, name].forEach((alias) => {
      const aliasKey = studentKey(alias);
      if (aliasKey) aliasToFullKey.set(aliasKey, fullKey);
    });
  });

  const surnameFragments = new Set();
  [
    ...targetState.settings.students,
    ...targetState.studentRecords.map((student) => student.name)
  ].forEach((value) => {
    const normalized = normalizeStudentName(value);
    const commaIndex = normalized.indexOf(",");
    if (commaIndex > 0) surnameFragments.add(normalized.slice(0, commaIndex).trim().toLowerCase());
  });

  const sessionStudentNames = (targetState.sessions || []).map((session) => session.student);
  const validNames = [];
  const seen = new Set();
  [
    ...targetState.settings.students,
    ...sessionStudentNames
  ].forEach((value) => {
    const normalizedName = normalizeStudentName(value);
    let key = studentKey(normalizedName);
    if (!normalizedName || key === "subs") return;
    if (!normalizedName.includes(",") && surnameFragments.has(key)) return;
    const fullKey = aliasToFullKey.get(key) || key;
    if (seen.has(fullKey)) return;
    seen.add(fullKey);
    const existing = byNormalized.get(fullKey);
    validNames.push(existing?.name || normalizedName);
  });

  targetState.studentRecords = sortStudentRecords(validNames.map((name) => {
    const existing = byNormalized.get(studentKey(name));
    return existing || {
      key: name,
      name,
      status: "Active",
      notes: ""
    };
  }));
  targetState.settings.students = sortNames(validNames);
}

function updateStudentRecord(key, changes) {
  const record = state.studentRecords.find((student) => student.key === key || studentKey(student.name) === studentKey(key));
  if (!record) return;
  if (!window.confirm("Save this student detail change?")) { hydrateControls(); renderStudentStatuses(); return; }
  Object.assign(record, changes);
  saveState();
  hydrateControls();
}

function ensureStudent(name, source = "session log") {
  const cleanName = String(name || "").trim();

  if (!cleanName) return;

  state.settings.students ||= [];
  state.studentRecords ||= [];

  const alreadyExists = state.settings.students.some(
    (student) =>
      studentKey(student) === studentKey(cleanName)
  );

  if (!alreadyExists) {
    state.settings.students.push(cleanName);
  }

  const hasRecord = state.studentRecords.some(
    (student) =>
      studentKey(student.name) === studentKey(cleanName)
  );

  if (!hasRecord) {
    state.studentRecords.push({
      key: cleanName,
      name: cleanName,
      status: "Active",
      notes: `Created from ${source}`
    });
  }

  syncStudentRecords();
}

function activeStudentNames() {
  syncStudentRecords();
  const inactive = new Set(state.studentRecords.filter((student) => student.status !== "Active").map((student) => studentKey(student.name)));
  return sortNames(state.settings.students.filter((student) => normalizeStudentName(student) !== "SUBS" && !inactive.has(studentKey(student))));
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

function studentKey(name) {
  const key = normalizeStudentName(name).toLowerCase();
  if (key === "thirdy" || key === "abella, thirdy") return "abella, thirdy";
  return key;
}

function studentGroupComparator() {
  const sortBy = $("#studentGroupSortBy")?.value || "open-alpha";
  const direction = ($("#studentGroupSortDirection")?.value || "asc") === "desc" ? -1 : 1;
  const alpha = (a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: "base" });
  return (a, b) => {
    if (sortBy === "open-alpha") {
      return Number(b.hasOpen) - Number(a.hasOpen) || alpha(a, b);
    }
    if (sortBy === "pay") return ((a.totals.pay - b.totals.pay) || alpha(a, b)) * direction;
    if (sortBy === "hours") return ((a.totals.hours - b.totals.hours) || alpha(a, b)) * direction;
    if (sortBy === "sessions") return ((a.totals.sessions - b.totals.sessions) || alpha(a, b)) * direction;
    return alpha(a, b) * direction;
  };
}

function confirmBefore(message, action) {
  return (...args) => {
    if (!window.confirm(message)) return;
    return action(...args);
  };
}

function setInactiveExceptOpenStudents() {
  syncStudentRecords();
  const openStudents = new Set(state.sessions.filter(isOpenStatus).map((session) => studentKey(session.student)).filter(Boolean));
  state.studentRecords = state.studentRecords.map((student) => ({
    ...student,
    status: openStudents.has(studentKey(student.name)) ? "Active" : "Inactive"
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
      amount: sum(sessions, totalPay),
      sessionIds: sessions.map((session) => session.id)
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
  const id = $("#sessionId").value || uid();
  const existing = state.sessions.find((item) => item.id === id);
  if (existing && !window.confirm("Save the updated Pr1me session details?")) return;
  ensureStudent(studentName);
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
  const existing = state.personalSessions?.find((item) => item.id === id);
  if (existing && !window.confirm("Save the updated personal session details?")) return;
  const hours = Number($("#personalSessionHours").value || 0);
  const studentName = normalizeStudentName($("#personalSessionStudent").value.trim());
  const selectedPackageLabel = $("#personalSessionPackageLabel").value.trim() || existing?.packageLabel || existing?.packageName || "";
  const packageLabel = nextPersonalPackageLabel(selectedPackageLabel, { editing: Boolean(existing) });
  const rate = Number($("#personalSessionRate").value || 0);
  const session = {
    id,
    date: $("#personalSessionDate").value,
    start: $("#personalSessionStart").value,
    end: $("#personalSessionEnd").value,
    timeText: `${$("#personalSessionStart").value}-${$("#personalSessionEnd").value}`,
    tutor: "Personal",
    student: studentName,
    packageName: $("#personalSessionPackage").value,
    packageLabel,
    classType: $("#personalSessionClassType").value,
    mode: $("#personalSessionMode").value ? normalizeModeLabel($("#personalSessionMode").value) : "",
    studentCount: 1,
    hours,
    rate,
    totalPay: hours * rate,
    status: existing?.status || "Pending",
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
  if (existing && !window.confirm("Save the updated credential record details?")) return;
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
    cvDate: existing?.cvDate || "",
    cvMeta: existing?.cvMeta || "",
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
  const existing = state.rates.find((item) => item.id === $("#rateId").value);
  if (existing && !window.confirm("Save the updated rate details?")) return;
  const rate = {
    id: $("#rateId").value || uid(),
    tutor: existing?.tutor || CURRENT_RATE_TUTOR,
    classType: $("#rateClassType").value,
    mode: $("#rateMode").value ? normalizeModeLabel($("#rateMode").value) : "",
    packageName: $("#ratePackage").value,
    amount: Number($("#rateAmount").value || 0)
  };
  upsert("rates", rate);
  $("#rateForm").reset();
  $("#rateId").value = "";
  fillSelect($("#rateTutor"), [CURRENT_RATE_TUTOR], CURRENT_RATE_TUTOR);
  saveState();
  render();
}

function saveSchedule(event) {
  event.preventDefault();
  const existing = state.schedules.find((item) => item.id === $("#scheduleId").value);
  const selectedDay = $("#scheduleDay").value;
  if (existing && selectedDay === "Weekday") {
    window.alert("Weekday can only be used when adding a new schedule. Choose one day when editing.");
    return;
  }
  if (existing && !window.confirm("Save the updated schedule details?")) return;
  const scheduleBase = {
    start: $("#scheduleStart").value,
    end: $("#scheduleEnd").value,
    student: normalizeStudentName($("#scheduleStudent").value),
    tutor: $("#scheduleTutor").value,
    mode: $("#scheduleMode").value ? normalizeModeLabel($("#scheduleMode").value) : "",
    frequency: $("#scheduleFrequency").value,
    status: $("#scheduleStatus").value,
    notes: $("#scheduleNotes").value.trim()
  };
  if (!scheduleBase.student) return;
  ensureStudent(scheduleBase.student, "schedule");
  const scheduleDays = selectedDay === "Weekday" ? weekdays : [selectedDay];
  scheduleDays.forEach((day) => {
    upsert("schedules", {
      id: existing ? existing.id : uid(),
      day,
      ...scheduleBase
    });
  });
  resetScheduleForm();
  saveState();
  hydrateControls();
  render();
}

function saveSettings(event) {
  event.preventDefault();
  const previousStudents = sortNames(state.settings.students || []);
  const editedStudents = parseLines($("#settingStudents").value).map(normalizeStudentName).filter((name) => name !== "SUBS");
  const nextStudents = uniqueNormalizedNames(editedStudents);
  state.settings.tutors = parseLines($("#settingTutors").value);
  applyStudentSettingRenames(previousStudents, editedStudents);
  state.settings.students = nextStudents;
  syncStudentRecords();
  state.settings.packages = parseLines($("#settingPackages").value);
  state.settings.classTypes = parseLines($("#settingClassTypes").value);
  state.settings.modes = ["Virtual", "F2F", "Hybrid"];
  state.settings.scheduleStatuses = parseLines($("#settingScheduleStatuses").value);
  saveState();
  hydrateControls();
  render();
}

function applyStudentSettingRenames(previousStudents, nextStudents) {
  if (previousStudents.length !== nextStudents.length) return;

  const renameMap = new Map();
  previousStudents.forEach((oldName, index) => {
    const newName = nextStudents[index];
    const oldKey = studentKey(oldName);
    const newKey = studentKey(newName);
    if (!oldKey || !newKey || oldKey === newKey) return;
    renameMap.set(oldKey, newName);
  });

  if (!renameMap.size) return;

  const renameStudent = (item) => {
    const replacement = renameMap.get(studentKey(item?.student));
    if (replacement) item.student = replacement;
  };

  (state.sessions || []).forEach(renameStudent);
  (state.schedules || []).forEach(renameStudent);
  (state.studentRecords || []).forEach((student) => {
    const replacement = renameMap.get(studentKey(student.name || student.key));
    if (replacement) {
      student.name = replacement;
      student.key = replacement;
    }
  });
}

function upsert(collection, item) {
  const index = state[collection].findIndex((existing) => existing.id === item.id);
  if (index >= 0) state[collection][index] = item;
  else state[collection].push(item);
}

function editSession(id) {
  const session = state.sessions.find((item) => item.id === id);
  if (!session) return;
  sessionRateManuallyEdited = false;
  $("#sessionId").value = session.id;
  $("#sessionDate").value = session.date;
  $("#sessionStart").value = session.start;
  $("#sessionEnd").value = session.end;
  $("#sessionTutor").value = session.tutor;
  $("#sessionStudent").value = session.student;
  updateSessionPackageOptions(session.packageLabel);
  $("#sessionPackage").value = session.packageName || "";
  $("#sessionClaimPackage").value = session.packageLabel || session.packageName || "";
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
  $("#personalSessionPackageLabel").value = session.packageLabel || session.packageName || "";
  updatePersonalSessionPackageOptions(session.packageLabel || session.packageName || "");
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
  fillSelect($("#rateTutor"), uniqueDisplayValues([rate.tutor, CURRENT_RATE_TUTOR]), rate.tutor || CURRENT_RATE_TUTOR);
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


function normalizeManagementBill(bill = {}) {
  const aircon = normalizeBillDevice(bill.aircon || bill.ac || {});
  const refrigerator = normalizeBillDevice(bill.refrigerator || bill.ref || {});
  return {
    id: bill.id || uid(),
    month: bill.month || "",
    rent: Number(bill.rent || 0),
    water: Number(bill.water || 0),
    baseElectricity: Number(bill.baseElectricity || 0),
    otherUtilities: Number(bill.otherUtilities || 0),
    aircon,
    refrigerator,
    purchases: (bill.purchases || bill.groceries || []).map(normalizeBillPurchase),
    notes: bill.notes || "",
    computedAt: bill.computedAt || ""
  };
}

function normalizeBillDevice(device = {}) {
  const previous = Number(device.previous || 0);
  const current = Number(device.current || 0);
  const rate = Number(device.rate || 0);
  const computed = computeBillDevice(previous, current, rate);
  return {
    previous,
    current,
    rate,
    usage: Number.isFinite(Number(device.usage)) ? Number(device.usage) : computed.usage,
    amount: Number.isFinite(Number(device.amount)) ? Number(device.amount) : computed.amount
  };
}

function computeBillDevice(previous, current, rate) {
  const usage = Math.max(0, Number(current || 0) - Number(previous || 0));
  const amount = usage * Number(rate || 0);
  return { usage, amount };
}

function nextMonthValue(month) {
  const base = month ? new Date(month + "-01T00:00:00") : new Date();
  if (Number.isNaN(base.getTime())) return new Date().toISOString().slice(0, 7);
  base.setMonth(base.getMonth() + 1);
  return base.toISOString().slice(0, 7);
}
function normalizeBillPurchase(purchase = {}) {
  return {
    id: purchase.id || uid(),
    date: purchase.date || "",
    item: purchase.item || purchase.name || "Purchase",
    amount: Number(purchase.amount || 0),
    notes: purchase.notes || ""
  };
}
function normalizeManagementState(management = {}) {
  return {
    salaries: (management.salaries || []).map((salary) => ({
      id: salary.id || uid(),
      month: salary.month || "",
      gross: Number(salary.gross || 0),
      taxPercent: Number(salary.taxPercent || 0),
      notes: salary.notes || ""
    })),
    allocations: (management.allocations || []).map((allocation) => ({
      id: allocation.id || uid(),
      month: allocation.month || "",
      name: allocation.name || "",
      percent: Number(allocation.percent || 0),
      notes: allocation.notes || ""
    })),
    bills: (management.bills || []).map(normalizeManagementBill)
  };
}

function currentManagementMonth() {
  return $("#managementMonth")?.value || new Date().toISOString().slice(0, 7);
}

function syncManagementMonthInputs() {
  const month = currentManagementMonth();
  if ($("#salaryMonth")) $("#salaryMonth").value ||= month;
  if ($("#allocationMonth")) $("#allocationMonth").value ||= month;
  if ($("#billMonth")) $("#billMonth").value = month;
  loadManagementBillForm(month, false);
}

function managementSalaryForMonth(month = currentManagementMonth()) {
  state.management = normalizeManagementState(state.management);
  return state.management.salaries.find((salary) => salary.month === month) || null;
}

function managementTaxAmount(salary) {
  return Number(salary?.gross || 0) * Number(salary?.taxPercent || 0) / 100;
}

function managementNetIncome(salary) {
  return Math.max(0, Number(salary?.gross || 0) - managementTaxAmount(salary));
}

function managementAllocationsForMonth(month = currentManagementMonth()) {
  state.management = normalizeManagementState(state.management);
  return state.management.allocations
    .filter((allocation) => allocation.month === month)
    .sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: "base" }));
}


function setManagementTab(tab = "salary") {
  currentManagementTab = tab === "bills" ? "bills" : "salary";
  renderManagementTabs();
}

function renderManagementTabs() {
  $$("[data-management-tab]").forEach((button) => {
    const active = button.dataset.managementTab === currentManagementTab;
    button.classList.toggle("active", active);
    button.setAttribute("aria-selected", String(active));
  });
  $("#managementSalaryTab")?.classList.toggle("active", currentManagementTab === "salary");
  $("#managementBillsTab")?.classList.toggle("active", currentManagementTab === "bills");
}

function managementBills() {
  state.management = normalizeManagementState(state.management);
  return state.management.bills.sort((a, b) => a.month.localeCompare(b.month));
}

function managementBillForMonth(month = $("#billMonth")?.value || currentManagementMonth()) {
  return managementBills().find((bill) => bill.month === month) || null;
}

function managementBillTotals(bill) {
  const fixedUtilities = Number(bill?.water || 0) + Number(bill?.baseElectricity || 0) + Number(bill?.otherUtilities || 0);
  const aircon = Number(bill?.aircon?.amount || 0);
  const refrigerator = Number(bill?.refrigerator?.amount || 0);
  const purchases = sum(bill?.purchases || [], (purchase) => Number(purchase.amount || 0));
  const total = Number(bill?.rent || 0) + fixedUtilities + aircon + refrigerator + purchases;
  return { fixedUtilities, aircon, refrigerator, purchases, total };
}

function renderManagementBills() {
  if (!$("#billMetrics")) return;
  const selectedMonth = $("#billMonth")?.value || currentManagementMonth();
  if ($("#billMonth") && !$("#billMonth").value) $("#billMonth").value = selectedMonth;
  const bill = managementBillForMonth(selectedMonth) || normalizeManagementBill({ month: selectedMonth });
  if (!document.activeElement || !$("#managementBillForm")?.contains(document.activeElement)) {
    loadManagementBillForm(selectedMonth, false);
  } else {
    updateBillDevicePreview();
  }
  const totals = managementBillTotals(bill);
  $("#billSummaryLabel").textContent = `${monthName(selectedMonth)} / ${bill.computedAt ? "computed" : "not computed yet"}`;
  $("#billMetrics").innerHTML = [
    metric("Final Bills", money(totals.total), monthName(selectedMonth), "total"),
    metric("Rent", money(bill.rent), "fixed monthly", "earnings"),
    metric("Utilities", money(totals.fixedUtilities), "water + base electricity + other", "unclaimed"),
    metric("Submeters", money(totals.aircon + totals.refrigerator), `${number((bill.aircon?.usage || 0) + (bill.refrigerator?.usage || 0))} kWh`, "peak"),
    metric("Purchases", money(totals.purchases), `${bill.purchases.length} entries`, "earnings")
  ].join("");
  renderBillFinalSummary(bill, totals);
  renderBillPurchaseList(bill);
  renderBillChart();
  renderBillHistoryRows(selectedMonth);
}

function loadManagementBillForm(month, setMonth = true) {
  if (!$("#managementBillForm")) return;
  const targetMonth = month || $("#billMonth")?.value || currentManagementMonth();
  const bill = managementBillForMonth(targetMonth) || normalizeManagementBill({ month: targetMonth });
  if (setMonth && $("#billMonth")) $("#billMonth").value = targetMonth;
  setInputValue("billRent", bill.rent);
  setInputValue("billWater", bill.water);
  setInputValue("billBaseElectricity", bill.baseElectricity);
  setInputValue("billOtherUtilities", bill.otherUtilities);
  setInputValue("airconPrevious", bill.aircon.previous);
  setInputValue("airconCurrent", bill.aircon.current);
  setInputValue("airconRate", bill.aircon.rate);
  setInputValue("refPrevious", bill.refrigerator.previous);
  setInputValue("refCurrent", bill.refrigerator.current);
  setInputValue("refRate", bill.refrigerator.rate);
  if ($("#billNotes")) $("#billNotes").value = bill.notes || "";
  renderBillPurchaseList(bill);
  resetBillPurchaseForm(false);
  updateBillDevicePreview();
}

function setInputValue(id, value) {
  const input = $("#" + id);
  if (input) input.value = Number(value || 0) || "";
}

function readManagementBillForm() {
  const aircon = computeBillDevice($("#airconPrevious").value, $("#airconCurrent").value, $("#airconRate").value);
  const refrigerator = computeBillDevice($("#refPrevious").value, $("#refCurrent").value, $("#refRate").value);
  const month = $("#billMonth").value || currentManagementMonth();
  const existing = managementBillForMonth(month);
  return {
    id: existing?.id || uid(),
    month,
    rent: Number($("#billRent").value || 0),
    water: Number($("#billWater").value || 0),
    baseElectricity: Number($("#billBaseElectricity").value || 0),
    otherUtilities: Number($("#billOtherUtilities").value || 0),
    aircon: {
      previous: Number($("#airconPrevious").value || 0),
      current: Number($("#airconCurrent").value || 0),
      rate: Number($("#airconRate").value || 0),
      ...aircon
    },
    refrigerator: {
      previous: Number($("#refPrevious").value || 0),
      current: Number($("#refCurrent").value || 0),
      rate: Number($("#refRate").value || 0),
      ...refrigerator
    },
    purchases: existing?.purchases || [],
    notes: $("#billNotes").value.trim(),
    computedAt: new Date().toISOString()
  };
}

function updateBillDevicePreview() {
  const aircon = computeBillDevice($("#airconPrevious")?.value, $("#airconCurrent")?.value, $("#airconRate")?.value);
  const refrigerator = computeBillDevice($("#refPrevious")?.value, $("#refCurrent")?.value, $("#refRate")?.value);
  if ($("#airconResult")) $("#airconResult").textContent = `${number(aircon.usage)} kWh / ${money(aircon.amount)}`;
  if ($("#refResult")) $("#refResult").textContent = `${number(refrigerator.usage)} kWh / ${money(refrigerator.amount)}`;
}

function renderBillFinalSummary(bill, totals = managementBillTotals(bill)) {
  const target = $("#billFinalSummary");
  if (!target) return;
  if ($("#billFinalMonth")) $("#billFinalMonth").textContent = monthName(bill.month || currentManagementMonth());
  const purchaseRows = (bill.purchases || []).map((purchase) => `
    <tr><td>${escapeHtml(formatDate(purchase.date))}</td><td>${escapeHtml(purchase.item)}</td><td>${money(purchase.amount)}</td><td>${escapeHtml(purchase.notes || "")}</td></tr>`).join("");
  target.innerHTML = `
    <div class="bill-final-grid">
      <div><span>Rent</span><strong>${money(bill.rent)}</strong></div>
      <div><span>Utilities</span><strong>${money(totals.fixedUtilities)}</strong></div>
      <div><span>Aircon</span><strong>${money(totals.aircon)}</strong><small>${number(bill.aircon?.usage || 0)} kWh</small></div>
      <div><span>Refrigerator</span><strong>${money(totals.refrigerator)}</strong><small>${number(bill.refrigerator?.usage || 0)} kWh</small></div>
      <div><span>Purchases</span><strong>${money(totals.purchases)}</strong><small>${(bill.purchases || []).length} entries</small></div>
      <div class="bill-final-total"><span>Total</span><strong>${money(totals.total)}</strong></div>
    </div>
    <div class="table-wrap compact-table bill-purchase-summary">
      <table><thead><tr><th>Date</th><th>Purchase</th><th>Amount</th><th>Notes</th></tr></thead><tbody>${purchaseRows || emptyRow(4)}</tbody></table>
    </div>`;
}

function renderBillPurchaseList(bill = managementBillForMonth() || normalizeManagementBill({ month: currentManagementMonth() })) {
  const target = $("#billPurchaseList");
  if (!target) return;
  const purchases = [...(bill.purchases || [])].sort((a, b) => (b.date || "").localeCompare(a.date || "") || a.item.localeCompare(b.item));
  const total = sum(purchases, (purchase) => Number(purchase.amount || 0));
  target.innerHTML = `<div class="bill-purchase-list-head"><strong>Purchases</strong><span>${money(total)}</span></div>` + (purchases.map((purchase) => `
    <article class="bill-purchase-item">
      <div><strong>${escapeHtml(purchase.item)}</strong><span>${escapeHtml(formatDate(purchase.date))}${purchase.notes ? " / " + escapeHtml(purchase.notes) : ""}</span></div>
      <strong>${money(purchase.amount)}</strong>
      <div class="row-actions"><button class="mini" type="button" data-edit-bill-purchase="${escapeAttr(purchase.id)}">Edit</button><button class="mini" type="button" data-delete-bill-purchase="${escapeAttr(purchase.id)}">Delete</button></div>
    </article>`).join("") || `<p class="empty">No purchases yet.</p>`);
  bindBillPurchaseActions();
}

function resetBillPurchaseForm(clearDate = true) {
  if ($("#billPurchaseId")) $("#billPurchaseId").value = "";
  if ($("#billPurchaseItem")) $("#billPurchaseItem").value = "";
  if ($("#billPurchaseAmount")) $("#billPurchaseAmount").value = "";
  if ($("#billPurchaseNotes")) $("#billPurchaseNotes").value = "";
  if (clearDate && $("#billPurchaseDate")) $("#billPurchaseDate").value = new Date().toISOString().slice(0, 10);
}

function readBillPurchaseForm() {
  return normalizeBillPurchase({
    id: $("#billPurchaseId")?.value || uid(),
    date: $("#billPurchaseDate")?.value || new Date().toISOString().slice(0, 10),
    item: $("#billPurchaseItem")?.value.trim() || "Purchase",
    amount: Number($("#billPurchaseAmount")?.value || 0),
    notes: $("#billPurchaseNotes")?.value.trim() || ""
  });
}

function saveBillPurchase() {
  state.management = normalizeManagementState(state.management);
  const month = $("#billMonth")?.value || currentManagementMonth();
  const bill = normalizeManagementBill(readManagementBillForm());
  const purchase = readBillPurchaseForm();
  const index = bill.purchases.findIndex((item) => item.id === purchase.id);
  if (index >= 0) bill.purchases[index] = purchase;
  else bill.purchases.push(purchase);
  bill.computedAt = new Date().toISOString();
  upsertManagementItem("bills", bill);
  saveState();
  resetBillPurchaseForm();
  loadManagementBillForm(month);
  renderManagementBills();
}

function editBillPurchase(id) {
  const bill = managementBillForMonth();
  const purchase = bill?.purchases?.find((item) => item.id === id);
  if (!purchase) return;
  if ($("#billPurchaseId")) $("#billPurchaseId").value = purchase.id;
  if ($("#billPurchaseDate")) $("#billPurchaseDate").value = purchase.date || "";
  if ($("#billPurchaseItem")) $("#billPurchaseItem").value = purchase.item || "";
  if ($("#billPurchaseAmount")) $("#billPurchaseAmount").value = purchase.amount || "";
  if ($("#billPurchaseNotes")) $("#billPurchaseNotes").value = purchase.notes || "";
  $("#billPurchaseItem")?.focus();
}

function deleteBillPurchase(id) {
  state.management = normalizeManagementState(state.management);
  const month = $("#billMonth")?.value || currentManagementMonth();
  const bill = managementBillForMonth(month);
  if (!bill) return;
  bill.purchases = bill.purchases.filter((purchase) => purchase.id !== id);
  bill.computedAt = new Date().toISOString();
  upsertManagementItem("bills", bill);
  saveState();
  loadManagementBillForm(month);
  renderManagementBills();
}

function bindBillPurchaseActions() {
  $$('[data-edit-bill-purchase]').forEach((button) => button.addEventListener("click", () => editBillPurchase(button.dataset.editBillPurchase)));
  $$('[data-delete-bill-purchase]').forEach((button) => button.addEventListener("click", confirmBefore("Delete this purchase?", () => deleteBillPurchase(button.dataset.deleteBillPurchase))));
}
function saveManagementBill(event) {
  event.preventDefault();
  state.management = normalizeManagementState(state.management);
  const bill = normalizeManagementBill(readManagementBillForm());
  upsertManagementItem("bills", bill);
  if ($("#billMonth")) $("#billMonth").value = bill.month;
  saveState();
  renderManagement();
}

function renderBillChart() {
  const target = $("#billChart");
  if (!target) return;
  const bills = managementBills().slice(-12);
  if (!bills.length) {
    target.innerHTML = `<p class="empty">No bill records yet.</p>`;
    return;
  }
  const maxTotal = Math.max(1, ...bills.map((bill) => managementBillTotals(bill).total));
  target.innerHTML = bills.map((bill) => {
    const totals = managementBillTotals(bill);
    const height = Math.max(8, (totals.total / maxTotal) * 140);
    const rentPct = totals.total ? (bill.rent / totals.total) * 100 : 0;
    const utilitiesPct = totals.total ? (totals.fixedUtilities / totals.total) * 100 : 0;
    const airconPct = totals.total ? (totals.aircon / totals.total) * 100 : 0;
    const refPct = totals.total ? (totals.refrigerator / totals.total) * 100 : 0;
    const purchasesPct = totals.total ? (totals.purchases / totals.total) * 100 : 0;
    const title = `${monthName(bill.month)}\nTotal: ${money(totals.total)}\nRent: ${money(bill.rent)}\nUtilities: ${money(totals.fixedUtilities)}\nAircon: ${money(totals.aircon)}\nRefrigerator: ${money(totals.refrigerator)}\nPurchases: ${money(totals.purchases)}`;
    return `<article class="bill-bar" title="${escapeAttr(title)}" tabindex="0">
      <span class="bill-bar-value">${money(totals.total).replace("PHP ", "")}</span>
      <div class="bill-bar-stack" style="height:${height}px">
        <span class="bill-segment rent" style="height:${rentPct}%"></span>
        <span class="bill-segment utilities" style="height:${utilitiesPct}%"></span>
        <span class="bill-segment aircon" style="height:${airconPct}%"></span>
        <span class="bill-segment ref" style="height:${refPct}%"></span>
        <span class="bill-segment purchases" style="height:${purchasesPct}%"></span>
      </div>
      <strong>${monthName(bill.month, true)}</strong>
    </article>`;
  }).join("");
}

function renderBillHistoryRows(selectedMonth) {
  const target = $("#billHistoryRows");
  if (!target) return;
  const bills = [...managementBills()].sort((a, b) => b.month.localeCompare(a.month));
  target.innerHTML = bills.map((bill) => {
    const totals = managementBillTotals(bill);
    const active = bill.month === selectedMonth ? " class=\"selected-row\"" : "";
    return `<tr${active}><td>${escapeHtml(monthName(bill.month))}</td><td>${money(bill.rent)}</td><td>${money(totals.fixedUtilities)}</td><td>${money(totals.aircon)}</td><td>${money(totals.refrigerator)}</td><td>${money(totals.purchases)}</td><td>${money(totals.total)}</td><td><div class="row-actions"><button class="mini" type="button" data-edit-management-bill="${escapeAttr(bill.month)}">Edit</button><button class="mini" type="button" data-delete-management-bill="${escapeAttr(bill.id)}">Delete</button></div></td></tr>`;
  }).join("") || emptyRow(8);
}

function bindManagementBillRowActions() {
  $$('[data-edit-management-bill]').forEach((button) => button.addEventListener("click", () => {
    setManagementTab("bills");
    loadManagementBillForm(button.dataset.editManagementBill);
    renderManagementBills();
  }));
  $$('[data-delete-management-bill]').forEach((button) => button.addEventListener("click", confirmBefore("Delete this monthly bill record?", () => deleteManagementBill(button.dataset.deleteManagementBill))));
}

function deleteManagementBill(id) {
  state.management = normalizeManagementState(state.management);
  state.management.bills = state.management.bills.filter((bill) => bill.id !== id);
  saveState();
  renderManagement();
}
function renderManagement() {
  if (!$("#managementMetrics")) return;
  state.management = normalizeManagementState(state.management);
  const month = currentManagementMonth();
  const salary = managementSalaryForMonth(month);
  const tax = managementTaxAmount(salary);
  const net = managementNetIncome(salary);
  const allocations = managementAllocationsForMonth(month);
  const allocatedPercent = sum(allocations, (allocation) => Number(allocation.percent || 0));
  const allocated = sum(allocations, (allocation) => net * Number(allocation.percent || 0) / 100);
  const remaining = net - allocated;

  $("#managementMetrics").innerHTML = [
    metric("Gross Salary", money(salary?.gross || 0), monthName(month), "earnings"),
    metric("Less Tax", money(tax), `${number(salary?.taxPercent || 0)}%`, "peak"),
    metric("Net Income", money(net), "after tax", "unclaimed"),
    metric("Remaining", money(remaining), `${number(allocatedPercent)}% allocated`, "total")
  ].join("");

  if ($("#managementBreakdownMonth")) $("#managementBreakdownMonth").textContent = monthName(month);
  if ($("#managementPie")) $("#managementPie").innerHTML = managementPieHtml(allocations, net);
  if ($("#managementBreakdownList")) $("#managementBreakdownList").innerHTML = managementBreakdownListHtml(allocations, net);
  if ($("#managementMonthGroups")) $("#managementMonthGroups").innerHTML = managementMonthGroupsHtml(month);

  bindManagementRowActions();
}

function bindManagementRowActions() {
  $$('[data-edit-management-salary]').forEach((button) => button.addEventListener("click", () => editManagementSalary(button.dataset.editManagementSalary)));
  $$('[data-delete-management-salary]').forEach((button) => button.addEventListener("click", confirmBefore("Delete this salary record?", () => deleteManagementSalary(button.dataset.deleteManagementSalary))));
  $$('[data-edit-management-allocation]').forEach((button) => button.addEventListener("click", () => editManagementAllocation(button.dataset.editManagementAllocation)));
  $$('[data-delete-management-allocation]').forEach((button) => button.addEventListener("click", confirmBefore("Delete this allocation?", () => deleteManagementAllocation(button.dataset.deleteManagementAllocation))));
  bindManagementPieHover();
  renderManagementTabs();
  renderManagementBills();
  bindManagementBillRowActions();
}

function managementBreakdownSegments(allocations, net) {
  const positiveNet = Math.max(0, Number(net || 0));
  const allocationSegments = allocations
    .map((allocation, index) => {
      const percent = Number(allocation.percent || 0);
      const amount = positiveNet * percent / 100;
      return {
        label: allocation.name || "Allocation",
        percent,
        amount,
        color: managementPieColor(index),
        type: "allocation"
      };
    })
    .filter((segment) => segment.amount > 0 || segment.percent > 0);
  const allocated = sum(allocationSegments, (segment) => segment.amount);
  const remaining = positiveNet - allocated;
  if (remaining > 0) {
    allocationSegments.push({
      label: "Unallocated",
      percent: positiveNet ? (remaining / positiveNet) * 100 : 0,
      amount: remaining,
      color: "#94a3b8",
      type: "remaining"
    });
  }
  if (remaining < 0) {
    allocationSegments.push({
      label: "Overallocated",
      percent: positiveNet ? (Math.abs(remaining) / positiveNet) * 100 : 0,
      amount: Math.abs(remaining),
      color: "#dc2626",
      type: "over"
    });
  }
  return allocationSegments;
}

function managementPieHtml(allocations, net) {
  const segments = managementBreakdownSegments(allocations, net);
  const total = sum(segments, (segment) => Math.max(0, segment.amount));
  if (!total) {
    return `<div class="management-pie-empty">No allocation yet</div>`;
  }
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;
  const rings = segments.map((segment) => {
    const share = Math.max(0, segment.amount) / total;
    const dash = share * circumference;
    const gap = circumference - dash;
    const title = `${segment.label}: ${money(segment.amount)} (${number(segment.percent)}%)`;
    const circle = `<circle class="management-pie-segment" r="${radius}" cx="50" cy="50" fill="transparent" stroke="${escapeAttr(segment.color)}" stroke-width="18" stroke-dasharray="${dash} ${gap}" stroke-dashoffset="${-offset}" tabindex="0" data-pie-summary="${escapeAttr(title)}"><title>${escapeHtml(title)}</title></circle>`;
    offset += dash;
    return circle;
  }).join("");
  const allocatedPercent = number(Math.min(100, sum(segments.filter((segment) => segment.type === "allocation"), (segment) => segment.percent)));
  const defaultSummary = "Hover a slice to view amount and percent";
  return `<div class="management-pie-stage">
    <svg class="management-pie" viewBox="0 0 100 100" role="img" aria-label="Allocation breakdown for ${escapeAttr(monthName(currentManagementMonth()))}">
      <circle r="42" cx="50" cy="50" fill="transparent" stroke="#e2edf0" stroke-width="18"></circle>
      <g transform="rotate(-90 50 50)">${rings}</g>
      <text x="50" y="47" text-anchor="middle" class="pie-center-main">${allocatedPercent}%</text>
      <text x="50" y="59" text-anchor="middle" class="pie-center-sub">allocated</text>
    </svg>
    <div class="management-pie-hover" id="managementPieHover">${escapeHtml(defaultSummary)}</div>
  </div>`;
}

function bindManagementPieHover() {
  const readout = $("#managementPieHover");
  if (!readout) return;
  const defaultText = readout.textContent;
  $$(".management-pie-segment").forEach((segment) => {
    const show = () => {
      readout.textContent = segment.dataset.pieSummary || defaultText;
      readout.classList.add("active");
    };
    const reset = () => {
      readout.textContent = defaultText;
      readout.classList.remove("active");
    };
    segment.addEventListener("mouseenter", show);
    segment.addEventListener("focus", show);
    segment.addEventListener("mouseleave", reset);
    segment.addEventListener("blur", reset);
  });
}
function managementBreakdownListHtml(allocations, net) {
  const segments = managementBreakdownSegments(allocations, net);
  if (!segments.length) return `<p class="empty">Add allocation segments to see the breakdown.</p>`;
  return segments.map((segment) => (
    `<article class="management-breakdown-item ${escapeAttr(segment.type)}" title="${escapeAttr(`${segment.label}: ${money(segment.amount)} (${number(segment.percent)}%)`)}">
      <span class="management-dot" style="--dot:${escapeAttr(segment.color)}"></span>
      <strong>${escapeHtml(segment.label)}</strong>
      <span>${money(segment.amount)}</span>
      <small>${number(segment.percent)}%</small>
    </article>`
  )).join("");
}

function managementMonthGroupsHtml(selectedMonth = currentManagementMonth()) {
  const months = uniqueValues([
    ...(state.management.salaries || []).map((salary) => salary.month),
    ...(state.management.allocations || []).map((allocation) => allocation.month)
  ].filter(Boolean)).sort((a, b) => b.localeCompare(a));
  if (!months.length) return `<p class="empty">No management records yet.</p>`;
  return months.map((month) => managementMonthGroupHtml(month, month === selectedMonth)).join("");
}

function managementMonthGroupHtml(month, open = false) {
  const salary = managementSalaryForMonth(month);
  const allocations = managementAllocationsForMonth(month);
  const tax = managementTaxAmount(salary);
  const net = managementNetIncome(salary);
  const allocatedPercent = sum(allocations, (allocation) => Number(allocation.percent || 0));
  const allocated = sum(allocations, (allocation) => net * Number(allocation.percent || 0) / 100);
  const remaining = net - allocated;
  const salaryRows = salary ? `<tr><td>Gross Salary</td><td>${money(salary.gross)}</td><td>${money(tax)} (${number(salary.taxPercent)}%)</td><td>${money(net)}</td><td>${escapeHtml(salary.notes || "")}</td><td><div class="row-actions"><button class="mini" type="button" data-edit-management-salary="${escapeAttr(salary.id)}">Edit</button><button class="mini" type="button" data-delete-management-salary="${escapeAttr(salary.id)}">Delete</button></div></td></tr>` : emptyRow(6);
  const allocationRows = allocations.map((allocation) => {
    const amount = net * Number(allocation.percent || 0) / 100;
    return `<tr><td>${escapeHtml(allocation.name)}</td><td>${number(allocation.percent)}%</td><td>${money(amount)}</td><td colspan="2">${escapeHtml(allocation.notes || "")}</td><td><div class="row-actions"><button class="mini" type="button" data-edit-management-allocation="${escapeAttr(allocation.id)}">Edit</button><button class="mini" type="button" data-delete-management-allocation="${escapeAttr(allocation.id)}">Delete</button></div></td></tr>`;
  }).join("") || emptyRow(6);
  return `<details class="management-month-group"${open ? " open" : ""}>
    <summary>
      <span>${escapeHtml(monthName(month))}</span>
      <small>Net ${money(net)} &middot; Allocated ${number(allocatedPercent)}% &middot; Remaining ${money(remaining)}</small>
    </summary>
    <div class="management-month-body">
      <div class="table-wrap compact-table">
        <table>
          <thead><tr><th>Salary</th><th>Gross</th><th>Tax</th><th>Net</th><th>Notes</th><th></th></tr></thead>
          <tbody>${salaryRows}</tbody>
        </table>
      </div>
      <div class="table-wrap compact-table">
        <table>
          <thead><tr><th>Segment</th><th>Percent</th><th>Amount</th><th colspan="2">Notes</th><th></th></tr></thead>
          <tbody>${allocationRows}</tbody>
        </table>
      </div>
    </div>
  </details>`;
}

function managementPieColor(index) {
  return ["#06b6d4", "#2dd4bf", "#f59e0b", "#8b5cf6", "#14b8a6", "#0ea5e9", "#f97316", "#64748b"][index % 8];
}
function saveManagementSalary(event) {
  event.preventDefault();
  state.management = normalizeManagementState(state.management);
  const id = $("#managementSalaryId").value || uid();
  const existing = state.management.salaries.find((item) => item.id === id);
  if (existing && !window.confirm("Save the updated salary record?")) return;
  const salary = {
    id,
    month: $("#salaryMonth").value,
    gross: Number($("#salaryGross").value || 0),
    taxPercent: Number($("#salaryTaxPercent").value || 0),
    notes: $("#salaryNotes").value.trim()
  };
  upsertManagementItem("salaries", salary);
  $("#managementMonth").value = salary.month;
  resetManagementSalaryForm();
  saveState();
  renderManagement();
}

function saveManagementAllocation(event) {
  event.preventDefault();
  state.management = normalizeManagementState(state.management);
  const id = $("#managementAllocationId").value || uid();
  const existing = state.management.allocations.find((item) => item.id === id);
  if (existing && !window.confirm("Save the updated allocation?")) return;
  const allocation = {
    id,
    month: $("#allocationMonth").value,
    name: $("#allocationName").value.trim(),
    percent: Number($("#allocationPercent").value || 0),
    notes: $("#allocationNotes").value.trim()
  };
  upsertManagementItem("allocations", allocation);
  $("#managementMonth").value = allocation.month;
  resetManagementAllocationForm();
  saveState();
  renderManagement();
}

function upsertManagementItem(collection, item) {
  state.management ||= { salaries: [], allocations: [], bills: [] };
  const rows = state.management[collection] || [];
  const index = rows.findIndex((existing) => existing.id === item.id);
  if (index >= 0) rows[index] = item;
  else rows.push(item);
  state.management[collection] = rows;
}

function editManagementSalary(id) {
  const item = state.management?.salaries?.find((salary) => salary.id === id);
  if (!item) return;
  $("#managementSalaryId").value = item.id;
  $("#salaryMonth").value = item.month;
  $("#salaryGross").value = item.gross;
  $("#salaryTaxPercent").value = item.taxPercent;
  $("#salaryNotes").value = item.notes || "";
}

function editManagementAllocation(id) {
  const item = state.management?.allocations?.find((allocation) => allocation.id === id);
  if (!item) return;
  $("#managementAllocationId").value = item.id;
  $("#allocationMonth").value = item.month;
  $("#allocationName").value = item.name;
  $("#allocationPercent").value = item.percent;
  $("#allocationNotes").value = item.notes || "";
}

function deleteManagementSalary(id) {
  state.management = normalizeManagementState(state.management);
  state.management.salaries = state.management.salaries.filter((item) => item.id !== id);
  saveState();
  renderManagement();
}

function deleteManagementAllocation(id) {
  state.management = normalizeManagementState(state.management);
  state.management.allocations = state.management.allocations.filter((item) => item.id !== id);
  saveState();
  renderManagement();
}

function resetManagementSalaryForm() {
  if (!$("#managementSalaryForm")) return;
  $("#managementSalaryForm").reset();
  $("#managementSalaryId").value = "";
  $("#salaryMonth").value = currentManagementMonth();
  $("#salaryTaxPercent").value = "0";
}

function resetManagementAllocationForm() {
  if (!$("#managementAllocationForm")) return;
  $("#managementAllocationForm").reset();
  $("#managementAllocationId").value = "";
  $("#allocationMonth").value = currentManagementMonth();
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
  sessionRateManuallyEdited = false;
  $("#sessionId").value = "";
  $("#sessionDate").value = new Date().toISOString().slice(0, 10);
  $("#sessionStart").value = DEFAULT_SESSION_START_TIME;
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
  $("#personalSessionStart").value = DEFAULT_SESSION_START_TIME;
  $("#personalSessionEnd").value = "";
  $("#personalSessionStudent").value = "";
  $("#personalSessionPackage").value = "";
  $("#personalSessionPackageLabel").value = "";
  $("#personalSessionClassType").value = "";
  $("#personalSessionMode").value = "";
  $("#personalSessionRate").value = "";
  $("#personalSessionHours").value = "";
  updatePersonalSessionPackageOptions("");
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

function setSuggestedRate({ force = false } = {}) {
  const rateInput = $("#sessionRate");
  const editingExistingSession = Boolean($("#sessionId").value);
  if (!force && (editingExistingSession || sessionRateManuallyEdited)) return;
  const rate = lookupRate({
    tutor: $("#sessionTutor").value,
    classType: $("#sessionClassType").value,
    mode: $("#sessionMode").value,
    packageName: $("#sessionPackage").value
  });
  rateInput.value = rate || "";
}

function lookupRate(session) {
  const scoreRate = (rate) => {
    let score = 0;
    if (rate.tutor === CURRENT_RATE_TUTOR) score += 16;
    if (rate.classType === session.classType) score += 4;
    if (sameMode(rate.mode, session.mode)) score += 2;
    if (rate.packageName === session.packageName) score += 1;
    return score;
  };
  const candidates = state.rates
    .filter((rate) => rate.tutor === CURRENT_RATE_TUTOR)
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
      source: "claiming-view",
      sessionIds: sessions.map((session) => session.id)
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
  const typeClass = isGroupName(item.student) ? "group-session" : "individual-session";
  const oneTime = /^one-time$/i.test(item.frequency || item.status || "");
  return oneTime ? `${typeClass} one-time-session` : typeClass;
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
  if (Object.prototype.hasOwnProperty.call(session, "totalPay") && Number.isFinite(Number(session.totalPay))) {
    return Number(session.totalPay);
  }
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
  return values.map(normalizeStudentName).filter((value) => {
    const normalized = studentKey(value);
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
  if (/^thirdy$/i.test(raw)) return "Abella, Thirdy";
  if (isProgramName(raw)) return raw;

  const parenthetical = raw.match(/^(.*?)\s*\(([^)]+)\)\s*$/);
  let base = parenthetical ? parenthetical[1].trim() : raw;
  let info = parenthetical ? parenthetical[2].trim() : "";
  const trailingInfo = extractTrailingStudentInfo(base);
  if (trailingInfo) {
    base = trailingInfo.base;
    info = uniqueValues([trailingInfo.info, info]).join(" / ");
  }

  const alias = studentNameAlias(base);
  if (alias) return appendStudentInfo(alias, info);
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

function studentNameAlias(name) {
  const key = String(name || "").trim().toLowerCase();
  const aliases = {
    ash: "Villena, Ash",
    anna: "Rugayan, Anna",
    ashley: "Abella, Ashley",
    beltran: "Beltran, Eiliyah",
    eiliyah: "Beltran, Eiliyah",
    erin: "Ratio, Erin",
    hannah: "Chan, Hannah",
    hans: "Dumlao, Hans",
    jacob: "Nolido, Jacob",
    janver: "Cabahug, Janver",
    jeisha: "Refuerzo, Jeisha",
    kaela: "Capinpin, Michaela",
    lia: "Beltran, Eiliyah",
    luke: "Ureta, Luke",
    mariah: "Tibig, Maria",
    megan: "Nidea, Megan",
    miguel: "Katigbak, Miguel",
    poseidon: "Salarda, Poseidon",
    rafa: "Go, Rafa",
    reeva: "Tapia, Reeva",
    sachy: "Patdu, Sachy",
    sam: "Pagayanan, Sam",
    teo: "Salandanan, Teo",
    thirdy: "Abella, Thirdy"
  };
  return aliases[key] || "";
}

function appendStudentInfo(name, info) {
  if (!info) return name;
  if (/\([^)]*\)$/.test(name)) return name;
  return `${name} (${info})`;
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
  return `<article class="metric${toneClass}"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong>${note ? `<small>${escapeHtml(note)}</small>` : ""}</article>`;
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

function formatTime12Hour(time) {
  if (!time) return "";

  const [hourText, minuteText] = String(time).split(":");
  const hour = Number(hourText);
  const minute = Number(minuteText);

  if (!Number.isFinite(hour) || !Number.isFinite(minute)) {
    return String(time);
  }

  const suffix = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  const displayMinute = String(minute).padStart(2, "0");

  return `${displayHour}:${displayMinute} ${suffix}`;
}

function formatTimeRange(start, end) {
  if (!start || !end) return "";
  return `${formatTime12Hour(start)} - ${formatTime12Hour(end)}`;
}

function formatDate(dateString) {
  if (!dateString) return "";
  return new Date(dateString + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function formatShortDate(dateString) {
  if (!dateString) return "";
  return new Date(dateString + "T00:00:00").toLocaleDateString("en-US", { month: "2-digit", day: "2-digit" });
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

function formatScheduleTime(timeText) {
  if (!timeText) return "";

  const [hourRaw, minuteRaw] = String(timeText).split(":");
  const hour = Number(hourRaw);
  const minute = Number(minuteRaw);

  if (!Number.isFinite(hour) || !Number.isFinite(minute)) {
    return String(timeText);
  }

  const suffix = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  const displayMinute = String(minute).padStart(2, "0");

  return `${displayHour}:${displayMinute} ${suffix}`;
}

function formatScheduleTimeRange(start, end) {
  if (!start || !end) return "";

  return `${formatScheduleTime(start)} - ${formatScheduleTime(end)}`;
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

function linkifyText(value) {
  return linkifyEscapedText(escapeHtml(value));
}

function formatDocumentText(value) {
  const emphasized = escapeHtml(value).replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  return linkifyEscapedText(emphasized);
}

function linkifyEscapedText(escaped) {
  return escaped.replace(/\b((?:https?:\/\/)?(?:www\.)?[a-z0-9.-]+\.[a-z]{2,}(?:\/[^\s<]*)?)/gi, (match) => {
    const trailing = match.match(/[.,;:!?)]$/)?.[0] || "";
    const cleanMatch = trailing ? match.slice(0, -1) : match;
    const href = /^https?:\/\//i.test(cleanMatch) ? cleanMatch : `https://${cleanMatch}`;
    return `<a href="${escapeAttr(href)}" target="_blank" rel="noopener noreferrer">${cleanMatch}</a>${trailing}`;
  });
}





















