"use strict";
"use client";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  useRangeCalendar: () => useRangeCalendar
});
module.exports = __toCommonJS(index_exports);
var import_react = require("react");
var import_core = require("@mini-date/core");
function useRangeCalendar({
  value,
  onChange,
  weekStartsOn = 1,
  min,
  max,
  isDisabled,
  initialMonth
}) {
  const base = initialMonth ?? value.start ?? /* @__PURE__ */ new Date();
  const [viewYear, setViewYear] = (0, import_react.useState)(base.getFullYear());
  const [viewMonthIndex, setViewMonthIndex] = (0, import_react.useState)(base.getMonth());
  const [hoverDate, setHoverDate] = (0, import_react.useState)(null);
  const weeks = (0, import_react.useMemo)(
    () => (0, import_core.buildMonthGrid)({
      year: viewYear,
      monthIndex: viewMonthIndex,
      weekStartsOn,
      min,
      max,
      isDisabled
    }),
    [viewYear, viewMonthIndex, weekStartsOn, min, max, isDisabled]
  );
  const goPrevMonth = (0, import_react.useCallback)(() => {
    setHoverDate(null);
    setViewMonthIndex((month) => {
      if (month === 0) {
        setViewYear((y) => y - 1);
        return 11;
      }
      return month - 1;
    });
  }, []);
  const goNextMonth = (0, import_react.useCallback)(() => {
    setHoverDate(null);
    setViewMonthIndex((month) => {
      if (month === 11) {
        setViewYear((y) => y + 1);
        return 0;
      }
      return month + 1;
    });
  }, []);
  const isRangeStart = (0, import_react.useCallback)(
    (date) => !!value.start && (0, import_core.isSameYMD)(date, value.start),
    [value.start]
  );
  const isRangeEnd = (0, import_react.useCallback)(
    (date) => !!value.end && (0, import_core.isSameYMD)(date, value.end),
    [value.end]
  );
  const previewRange = (0, import_react.useMemo)(() => {
    if (value.start && value.end) {
      return { start: value.start, end: value.end };
    }
    if (value.start && hoverDate) {
      const start = (0, import_core.compareYMD)(hoverDate, value.start) < 0 ? hoverDate : value.start;
      const end = (0, import_core.compareYMD)(hoverDate, value.start) < 0 ? value.start : hoverDate;
      return { start, end };
    }
    return null;
  }, [value.start, value.end, hoverDate]);
  const isInRange = (0, import_react.useCallback)(
    (date) => previewRange ? (0, import_core.isBetweenYMD)(date, previewRange.start, previewRange.end) : false,
    [previewRange]
  );
  const selectDate = (0, import_react.useCallback)(
    (clicked) => {
      const nextRange = (0, import_core.applyRangeClick)(value, clicked);
      onChange(nextRange);
    },
    [value, onChange]
  );
  function getDayProps(cell) {
    const { date, disabled } = cell;
    const selected = isInRange(date);
    return {
      role: "gridcell",
      tabIndex: disabled ? -1 : 0,
      "aria-disabled": disabled || void 0,
      "aria-selected": selected || void 0,
      onClick: () => {
        if (!disabled) {
          selectDate(date);
        }
      },
      onMouseEnter: () => {
        if (!disabled) {
          setHoverDate(date);
        }
      },
      onMouseLeave: () => setHoverDate(null)
    };
  }
  const monthLabel = (0, import_react.useMemo)(() => {
    return `${viewYear}.${String(viewMonthIndex + 1).padStart(2, "0")}`;
  }, [viewYear, viewMonthIndex]);
  return {
    weeks,
    monthLabel,
    viewYear,
    viewMonthIndex,
    goPrevMonth,
    goNextMonth,
    isRangeStart,
    isRangeEnd,
    isInRange,
    getDayProps
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  useRangeCalendar
});
