import { TimeScale } from "../types/TimeScale";

export const chartTimeScales: TimeScale[] = [
  { title: "Last Hour", query: { h: 1 } },
  { title: "Last Day", query: { d: 1 } },
  { title: "Last Week", query: { d: 7 } }
];
