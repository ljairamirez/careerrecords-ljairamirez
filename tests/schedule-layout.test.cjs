const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

const source = fs.readFileSync(path.join(__dirname, "../script.js"), "utf8").replace(/\r\n/g, "\n");
function context(state = { schedules: [] }) {
  const controls = Object.fromEntries([
    "scheduleId", "scheduleWeekDate", "scheduleStart", "scheduleEnd", "scheduleStudent",
    "scheduleTutor", "scheduleMode", "scheduleFrequency", "scheduleNotes"
  ].map((id) => [`#${id}`, { value: "" }]));
  const scope = vm.createContext({
    state, WORK_SCHEDULE_TIME_VERSION: 2,
    controls, selectedDays: ["Monday"],
    $: (selector) => controls[selector],
    window: { confirm: () => true, alert: (message) => { throw new Error(message); } },
    selectedScheduleDays: () => scope.selectedDays,
    setScheduleDays: (days) => { scope.selectedDays = days; },
    fillScheduleTimeOptions: (control, value) => { control.value = value; },
    normalizeStudentName: (name) => name,
    normalizeModeLabel: (mode) => mode,
    ensureStudent: () => {},
    uid: () => "new-schedule",
    resetScheduleForm: () => {},
    saveState: () => {},
    hydrateControls: () => {},
    render: () => {},
    renderWeekly: () => {},
    days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    escapeHtml: (value) => String(value),
    normalizeMode: () => "",
    scheduleTypeClass: () => "",
    isPersonalTrainingSchedule: () => false,
    formatScheduleTimeRange: (start, end) => `${start} - ${end}`
  });
  for (const name of [
    "localIsoDate", "isoToLocalDate", "dayName", "timeToDecimal", "isOneTimeSchedule",
    "isWorkSchedule", "ensureWorkScheduleTimes", "consumePendingStateMigration",
    "scheduleWeekWindow", "weeklyScheduleItems", "scheduleBlocksForDay",
    "scheduleMinutes", "scheduleOccurrenceThisWeek", "saveSchedule", "editSchedule", "upsert"
  ]) {
    const start = source.indexOf(`function ${name}(`);
    const end = source.indexOf("\nfunction ", start + 1);
    assert(start >= 0, name);
    vm.runInContext(source.slice(start, end), scope);
  }
  return scope;
}

const item = (student, start, end, extra = {}) => ({
  student, start, end, day: "Friday", frequency: "Weekly", status: "Active", ...extra
});

function widths(scope, rows) {
  const html = scope.scheduleBlocksForDay(rows, 7, 23, 56);
  return Object.fromEntries([...html.matchAll(/width:calc\(([\d.]+)% - 12px\)"><strong>([^<]+)/g)]
    .map((match) => [match[2], Number(match[1])]));
}

test("only connected overlapping times share width; later sessions stay full-width", () => {
  const rows = [item("A", "08:00", "09:00"), item("B", "08:30", "09:30"),
    item("Afternoon", "17:30", "19:00"), item("Evening", "20:00", "22:00")];
  const snapshot = JSON.stringify(rows);
  assert.deepEqual(widths(context(), rows), { A: 50, B: 50, Afternoon: 100, Evening: 100 });
  assert.equal(JSON.stringify(rows), snapshot);
});

test("touching sessions do not overlap, and free columns expand after a triple overlap", () => {
  const scope = context();
  assert.deepEqual(widths(scope, [item("A", "08:00", "09:00"), item("B", "09:00", "10:00")]), { A: 100, B: 100 });
  const result = widths(scope, [
    item("Long", "08:00", "12:00"), item("B", "09:00", "10:00"),
    item("C", "09:15", "09:45"), item("D", "10:00", "11:00")
  ]);
  assert(Math.abs(result.Long - 100 / 3) < 0.0001);
  assert(Math.abs(result.D - 200 / 3) < 0.0001);
});

test("one-time sessions on separate dates stay in their own selectable weeks", () => {
  const rows = [
    item("This Friday", "20:00", "22:00", { frequency: "One-time", occurrenceDate: "2026-11-20", day: "Monday" }),
    item("Next Friday", "20:00", "22:00", { frequency: "One-time", occurrenceDate: "2026-11-27" })
  ];
  const scope = context({ schedules: rows });
  const snapshot = JSON.stringify(rows);
  const range = scope.scheduleWeekWindow(new Date(2026, 10, 20));
  assert.equal(range.start, "2026-11-16");
  assert.equal(range.end, "2026-11-22");
  const thisWeek = scope.weeklyScheduleItems(range);
  assert.equal(thisWeek.length, 1);
  assert.equal(thisWeek[0].day, "Friday");
  assert.deepEqual(widths(scope, thisWeek), { "This Friday": 100 });
  const nextWeek = scope.weeklyScheduleItems({ start: "2026-11-23", end: "2026-11-29" });
  assert.deepEqual(widths(scope, nextWeek), { "Next Friday": 100 });
  assert.equal(JSON.stringify(rows), snapshot);
});

test("legacy Monday WORK is corrected once without altering logs or other schedules", () => {
  const state = {
    schedules: [item("WORK", "20:00", "17:00", { day: "Monday" }), item("Tutor", "20:00", "22:00")],
    sessions: [{ id: "historical", hours: 2, rate: 300 }], personalSessions: [{ id: "personal", rate: 450 }]
  };
  const protectedData = JSON.stringify([state.sessions, state.personalSessions, state.schedules[1]]);
  const scope = context(state);
  assert.equal(scope.ensureWorkScheduleTimes(state), true);
  assert.equal(state.schedules[0].start, "08:00");
  assert.equal(state.schedules[0].end, "17:00");
  assert.equal(scope.consumePendingStateMigration(state), true);
  assert.equal(scope.consumePendingStateMigration(state), false);
  assert.equal(JSON.stringify([state.sessions, state.personalSessions, state.schedules[1]]), protectedData);
  assert.deepEqual(widths(scope, state.schedules), { WORK: 100, Tutor: 100 });
  state.schedules[0].start = "09:00";
  assert.equal(scope.ensureWorkScheduleTimes(state), false);
  assert.equal(state.schedules[0].start, "09:00");
});

test("only Tuesday–Friday WORK changes to 7:30 AM–4:30 PM in the new update", () => {
  const state = {
    workScheduleTimeVersion: 1,
    schedules: [
      item("WORK", "08:00", "17:00", { day: "Monday", id: "mon" }),
      ...["Tuesday", "Wednesday", "Thursday", "Friday"].map((day) => item("WORK", "08:00", "17:00", { day, id: day })),
      item("WORK", "09:00", "12:00", { day: "Saturday", id: "sat" }),
      item("Tutor", "18:00", "19:00", { day: "Tuesday", id: "tutor" })
    ],
    sessions: [{ id: "lesson", hours: 1, rate: 550 }],
    personalSessions: [{ id: "personal", hours: 3, rate: 350 }]
  };
  const untouched = JSON.stringify([state.schedules[0], ...state.schedules.slice(5), state.sessions, state.personalSessions]);
  const scope = context(state);
  assert.equal(scope.ensureWorkScheduleTimes(state), true);
  for (const schedule of state.schedules.slice(1, 5)) {
    assert.equal(schedule.start, "07:30");
    assert.equal(schedule.end, "16:30");
    assert.equal(schedule.id, schedule.day);
  }
  assert.equal(JSON.stringify([state.schedules[0], ...state.schedules.slice(5), state.sessions, state.personalSessions]), untouched);
  assert.equal(state.workScheduleTimeVersion, 2);
  assert.equal(scope.consumePendingStateMigration(state), true);
  state.schedules[1].start = "08:30";
  assert.equal(scope.ensureWorkScheduleTimes(state), false);
  assert.equal(state.schedules[1].start, "08:30");
});

function fillSchedule(scope, { week, day, frequency = "One-time" }) {
  const values = {
    scheduleWeekDate: week, scheduleStart: "18:00", scheduleEnd: "19:00",
    scheduleStudent: "Test class", scheduleTutor: "Lloyd Ramirez",
    scheduleMode: "Virtual", scheduleFrequency: frequency
  };
  Object.entries(values).forEach(([id, value]) => { scope.controls[`#${id}`].value = value; });
  scope.selectedDays = [day];
}

test("a December one-time session is saved into the chosen future week", () => {
  const scope = context();
  fillSchedule(scope, { week: "2026-11-30", day: "Wednesday" });
  scope.saveSchedule({ preventDefault() {} });
  assert.equal(scope.state.schedules[0].occurrenceDate, "2026-12-02");
});

test("editing a December session keeps its date and metadata, without changing other records", () => {
  const target = item("December class", "18:00", "19:00", {
    id: "december", day: "Tuesday", frequency: "One-time", occurrenceDate: "2026-12-08",
    tutor: "Lloyd Ramirez", mode: "Virtual", notes: "Keep this", source: "manual"
  });
  const state = { schedules: [target, item("Other", "08:00", "09:00")], sessions: [{ id: "log", rate: 550 }] };
  const snapshot = JSON.stringify([state.schedules[1], state.sessions]);
  const scope = context(state);
  scope.controls["#scheduleWeekDate"].value = "2026-11-23";
  scope.editSchedule("december");
  assert.equal(scope.controls["#scheduleWeekDate"].value, "2026-12-07");
  scope.controls["#scheduleEnd"].value = "20:00";
  scope.saveSchedule({ preventDefault() {} });
  assert.equal(state.schedules[0].occurrenceDate, "2026-12-08");
  assert.equal(state.schedules[0].end, "20:00");
  assert.equal(state.schedules[0].source, "manual");
  assert.equal(JSON.stringify([state.schedules[1], state.sessions]), snapshot);
});

test("future dates work across the year boundary and recurring sessions remain undated", () => {
  const scope = context();
  fillSchedule(scope, { week: "2026-12-28", day: "Friday" });
  scope.saveSchedule({ preventDefault() {} });
  assert.equal(scope.state.schedules[0].occurrenceDate, "2027-01-01");
  const recurring = context();
  fillSchedule(recurring, { week: "2027-01-04", day: "Monday", frequency: "Weekly" });
  recurring.saveSchedule({ preventDefault() {} });
  assert.equal(recurring.state.schedules[0].frequency, "Weekly");
  assert.equal(recurring.state.schedules[0].occurrenceDate, "");
});
