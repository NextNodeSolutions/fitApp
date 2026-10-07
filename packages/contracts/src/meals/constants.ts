export const MEALS_MAX_RANGE_DAYS = 31

// Hard cap on one range read, far above real use (about 30 meals a day over
// the longest range): keeps the Worker's load bounded whatever was ingested.
export const MEALS_RANGE_MAX_ENTRIES = 1000
