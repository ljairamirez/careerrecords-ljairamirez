const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

const source = fs.readFileSync(path.join(__dirname, "../script.js"), "utf8").replace(/\r\n/g, "\n");
const scope = vm.createContext({});
for (const name of ["fillScheduleTimeOptions", "formatScheduleTime"]) {
  const start = source.indexOf(`function ${name}(`);
  const end = source.indexOf("\nfunction ", start + 1);
  assert(start >= 0, name);
  vm.runInContext(source.slice(start, end), scope);
}

test("new schedules offer half-hour choices from 8 AM through 11 PM only", () => {
  const select = {};
  scope.fillScheduleTimeOptions(select);
  const times = [...select.innerHTML.matchAll(/value="(\d\d:\d\d)"/g)].map((match) => match[1]);
  assert.equal(times.length, 31);
  assert.equal(times[0], "08:00");
  assert.equal(times.at(-1), "23:00");
  times.forEach((time, index) => {
    const [hour, minute] = time.split(":").map(Number);
    assert.equal(hour * 60 + minute, 8 * 60 + index * 30);
  });
  assert.equal(select.value, "");
  assert.match(select.innerHTML, />8:00 AM<\/option>/);
  assert.match(select.innerHTML, />12:30 PM<\/option>/);
  assert.match(select.innerHTML, />11:00 PM<\/option>/);
});

test("editing keeps the selected time and does not round old schedule data", () => {
  const select = {};
  scope.fillScheduleTimeOptions(select, "18:45");
  assert.equal(select.value, "18:45");
  assert.match(select.innerHTML, /value="18:45">6:45 PM \(existing\)<\/option>/);
  scope.fillScheduleTimeOptions(select, "18:10");
  assert.equal(select.value, "18:10");
  assert.match(select.innerHTML, /value="18:10">6:10 PM \(existing\)<\/option>/);
  for (const time of ["07:00", "23:30"]) {
    scope.fillScheduleTimeOptions(select, time);
    assert.equal(select.value, time);
    assert(select.innerHTML.includes(`value="${time}"`));
    assert(select.innerHTML.includes("(existing)"));
  }
  scope.fillScheduleTimeOptions(select);
  assert(!select.innerHTML.includes("18:45"));
  assert(!select.innerHTML.includes("18:10"));
  assert(!select.innerHTML.includes("07:00"));
  assert(!select.innerHTML.includes("23:30"));
  assert.equal(select.value, "");
});

test("only schedule time controls change; both session logs retain time inputs", () => {
  const html = fs.readFileSync(path.join(__dirname, "../index.html"), "utf8");
  for (const id of ["scheduleStart", "scheduleEnd"]) {
    assert.match(html, new RegExp(`<select id="${id}" required>`));
  }
  for (const id of ["sessionStart", "sessionEnd", "personalSessionStart", "personalSessionEnd"]) {
    assert.match(html, new RegExp(`<input id="${id}" type="time"`));
  }
});
