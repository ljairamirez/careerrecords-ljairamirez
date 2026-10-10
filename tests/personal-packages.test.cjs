const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

const source = fs.readFileSync(path.join(__dirname, "../script.js"), "utf8").replace(/\r\n/g, "\n");
const functions = [
  "normalizeStudentName", "normalizeProgramAlias", "isProgramName", "extractTrailingStudentInfo",
  "studentNameAlias", "appendStudentInfo", "uniqueValues", "normalizePackageEntryLabel",
  "samePackageLabel", "packageLabel", "packageNumber", "packageGroupLabel", "isSubsSession",
  "groupBy", "sum", "totalHours", "totalPay", "computeHours", "summarize", "packageSummaries",
  "isClaimedStatus", "isClaimingStatus", "isOpenStatus", "personalPackageIsOpen",
  "currentPersonalPackage", "nextPersonalPackageLabel", "applyPersonalSessionDefaults",
  "personalRateForMode", "setPersonalSuggestedRate", "updatePersonalSessionPackageOptions",
  "resetPersonalPackageLabelForStudent", "groupedPanels"
];

function context(rows) {
  const controls = Object.fromEntries([
    "personalSessionStudent", "personalSessionId", "personalSessionPackageLabel",
    "personalSessionPackageDisplay", "personalSessionClassType", "personalSessionMode", "personalSessionRate"
  ].map((id) => [`#${id}`, { value: "" }]));
  const scope = {
    personalDefaultsKey: "",
    state: { sessions: [], personalSessions: rows },
    $: (selector) => controls[selector],
    normalizeMode: (mode) => String(mode).toLowerCase(),
    escapeHtml: (value) => String(value),
    formatDate: (value) => value,
    dayName: () => "Monday",
    formatTimeRange: (start, end) => `${start}-${end}`,
    sessionRowClass: () => "",
    statusPill: (status) => status,
    number: (value) => String(value),
    money: (value) => `PHP ${value.toFixed(2)}`,
    emptyRow: (columns) => `<tr><td colspan="${columns}">No records yet.</td></tr>`
  };
  vm.createContext(scope);
  functions.forEach((name) => {
    const start = source.indexOf(`function ${name}(`);
    assert(start >= 0, name);
    const next = source.indexOf("\nfunction ", start + 1);
    vm.runInContext(source.slice(start, next < 0 ? source.length : next), scope);
  });
  controls["#personalSessionStudent"].value = "Nidea, Megan";
  return { scope, controls };
}

function row(packageLabel, status, date, extra = {}) {
  return {
    student: "Nidea, Megan", packageLabel, packageName: packageLabel, status, date,
    start: "19:00", end: "20:00", hours: 1, rate: 400,
    classType: "Elem/JHS", mode: "Virtual", ...extra
  };
}

test("new recordings prefer the current open package over a stale automatic label", () => {
  const rows = [row("PACKAGE 4", "Claimed", "2026-09-01"), row("PACKAGE 5", "Pending", "2026-10-09")];
  const { scope } = context(rows);
  assert.equal(scope.nextPersonalPackageLabel("PACKAGE 6"), "PACKAGE 5");
  assert.equal(scope.nextPersonalPackageLabel("PACKAGE 4"), "PACKAGE 5");
  assert.equal(scope.nextPersonalPackageLabel("PACKAGE 4", { editing: true }), "PACKAGE 4");
});

test("name normalization and latest active package determine the defaults", () => {
  const rows = [row("PACKAGE 4", "Pending", "2026-09-01"), row("PACKAGE 5", "Pending", "2026-10-09", { mode: "F2F", classType: "SHS", student: "Megan Nidea" })];
  const snapshot = JSON.stringify(rows);
  const { scope, controls } = context(rows);
  scope.resetPersonalPackageLabelForStudent();
  assert.equal(controls["#personalSessionPackageDisplay"].value, "PACKAGE 5");
  assert.equal(controls["#personalSessionClassType"].value, "SHS");
  assert.equal(controls["#personalSessionMode"].value, "F2F");
  assert.equal(controls["#personalSessionRate"].value, 450);
  assert.equal(JSON.stringify(rows), snapshot);
  controls["#personalSessionMode"].value = "Virtual";
  scope.setPersonalSuggestedRate();
  assert.equal(controls["#personalSessionRate"].value, 400);
  scope.resetPersonalPackageLabelForStudent();
  assert.equal(controls["#personalSessionMode"].value, "Virtual");
  assert.equal(controls["#personalSessionRate"].value, 400);
});

test("closed, cancelled and collected packages are not selected as open", () => {
  const { scope } = context([
    row("PACKAGE 1", "Closed", "2026-10-01"),
    row("PACKAGE 2", "Cancelled", "2026-10-02"),
    row("PACKAGE 3", "Pending", "2026-10-03", { claimed: true }),
    row("PACKAGE 4", "For Claiming", "2026-10-04")
  ]);
  assert.equal(scope.currentPersonalPackage("Nidea, Megan"), undefined);
  assert.equal(scope.nextPersonalPackageLabel(), "PACKAGE 5");
});

test("editing an older log does not replace its package, mode, rate or class type", () => {
  const { scope, controls } = context([row("PACKAGE 5", "Pending", "2026-10-09", { mode: "F2F" })]);
  controls["#personalSessionId"].value = "older-log";
  controls["#personalSessionPackageLabel"].value = "PACKAGE 1";
  controls["#personalSessionRate"].value = 350;
  controls["#personalSessionMode"].value = "Virtual";
  controls["#personalSessionClassType"].value = "College";
  scope.resetPersonalPackageLabelForStudent();
  assert.equal(controls["#personalSessionPackageDisplay"].value, "PACKAGE 1");
  assert.equal(controls["#personalSessionRate"].value, 350);
  assert.equal(controls["#personalSessionMode"].value, "Virtual");
  assert.equal(controls["#personalSessionClassType"].value, "College");
});

test("current package subtotals include pending and closed logs but exclude collected and cancelled pay", () => {
  const rows = [
    row("PACKAGE 1", "Claimed", "2026-09-01", { totalPay: 9700 }),
    row("PACKAGE 5", "Pending", "2026-10-09", { rate: 450, totalPay: 450 }),
    row("PACKAGE 5", "Pending", "2026-10-08", { totalPay: 400 }),
    row("PACKAGE 5", "Cancelled", "2026-10-07", { hours: 10, totalPay: 4000 }),
    row("PACKAGE 6", "Closed", "2026-10-06", { hours: 2, totalPay: 900 })
  ];
  const { scope } = context(rows);
  const html = scope.groupedPanels("student", rows);
  const current = html.split("Collected Packages")[0];
  assert.match(current, /PACKAGE 5 total <span>2 sessions<\/span>[\s\S]*?PHP 850.00/);
  assert.match(current, /PACKAGE 6 total <span>1 session<\/span>[\s\S]*?PHP 900.00/);
  assert.match(current, /Current packages total<\/td><td>4<\/td><td><\/td><td>PHP 1750.00/);
  assert(!current.includes("PACKAGE 1 total"));
  assert.equal((html.match(/student-package-total/g) || []).length, 2);
});
