import TimeAgo from "javascript-time-ago";

import en from "javascript-time-ago/locale/en.json";

TimeAgo.addDefaultLocale(en);

export const timezoneOffset = new Date().getTimezoneOffset() * 60 * 1000 * -1;
