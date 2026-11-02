const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

const source = fs.readFileSync(path.join(__dirname, "../script.js"), "utf8").replace(/\r\n/g, "\n");
const names = [
  "localIsoDate", "isoToLocalDate", "dayName", "timeToDecimal", "computeHours",
  "scheduleMinutes", "scheduleOccurrenceThisWeek", "scheduleOccurrenceOnDate", "nextOneTimeOccurrence",
  "isOneTimeSchedule", "oneTimeScheduleIsLapsed", "activeScheduleItems", "isPersonalTrainingSchedule",
  "scheduleStatusAllowsProjection", "scheduledProjectionForMonth", "currentMonthToDateSessions",
  "sum", "totalHours", "totalPay", "summarize", "currentMonthEarningsProjection"
];

function context(schedules, sessions = []) {
  const scope = vm.createContext({
    Date,
    days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    state: { schedules, sessions },
    normalizeProgramAlias: (value) => String(value || "").trim(),
    scheduleProjectionRate: () => 300,
    hasUsableDate: (row) => /^\d{4}-\d{2}-\d{2}$/.test(row.date)
  });
  names.forEach((name) => {
    const start = source.indexOf(`function ${name}(`);
    const end = source.indexOf("\nfunction ", start + 1);
    assert(start >= 0, name);
    vm.runInContext(source.slice(start, end), scope);
  });
  return scope;
}

const range = { start: "2026-11-01", today: "2026-11-02", end: "2026-11-30" };
const now = new Date(2026, 10, 2, 12);
const weekly = (day, extra = {}) => ({ student: "Class", day, start: "18:00", end: "19:00", frequency: "Weekly", status: "Active", ...extra });
const once = (date, extra = {}) => ({ ...weekly("Thursday"), frequency: "One-time", occurrenceDate: date, ...extra });

test("November uses logged earnings plus remaining calendar sessions, not a two-day pace", () => {
  const sessions = [
    { date: "2026-11-01", hours: 2.5, totalPay: 1375, status: "Pending" },
    { date: "2026-11-02", hours: 8, totalPay: 4200, status: "Pending" },
    { date: "2026-11-02", hours: 1, totalPay: 9999, status: "Cancelled" }
  ];
  const before = JSON.stringify(sessions);
  const scope = context([
    weekly("Monday"), weekly("Thursday"), once("2026-11-12", { end: "20:00" }),
    once("2026-10-15"), once("2026-12-10"), once("2026-11-02"),
    weekly("Friday", { student: "GYM - AF", personalTraining: true }),
    weekly("Tuesday", { status: "Inactive" })
  ], sessions);
  const projected = scope.currentMonthEarningsProjection(range, 300, now);
  assert.equal(projected.logged.pay, 5575);
  assert.equal(projected.loggedDays, 2);
  assert.equal(projected.remaining.hours, 10);
  assert.equal(projected.remaining.oneTimeHours, 2);
  assert.equal(projected.remaining.pay, 3000);
  assert.equal(projected.pay, 8575);
  assert.notEqual(projected.pay, 5575 / 2 * 30);
  assert.equal(JSON.stringify(sessions), before);
});

test("a one-time booking is counted once, on its saved date and only in its month", () => {
  const scope = context([once("2026-12-10", { end: "20:00" })]);
  assert.equal(scope.scheduledProjectionForMonth({ start: "2026-11-01", end: "2026-11-30" }, 300, now).pay, 0);
  const december = scope.scheduledProjectionForMonth({ start: "2026-12-01", end: "2026-12-31" }, 300, now);
  assert.equal(december.hours, 2);
  assert.equal(december.pay, 600);
});

test("month end shows actual earnings only, with no remaining sessions or duplicate counting", () => {
  const scope = context([weekly("Monday"), once("2026-12-01")], [
    { date: "2026-11-30", hours: 1, totalPay: 750, status: "Claimed" },
    { date: "2026-12-01", hours: 1, totalPay: 300, status: "Pending" }
  ]);
  const projected = scope.currentMonthEarningsProjection({ ...range, today: "2026-11-30" }, 300, new Date(2026, 10, 30, 23));
  assert.equal(projected.logged.pay, 750);
  assert.equal(projected.remaining.pay, 0);
  assert.equal(projected.pay, 750);
});
