const CALENDAR_ID = String(
  PropertiesService.getScriptProperties().getProperty("CALENDAR_ID")
);
const WEBHOOK_URL = String(
  PropertiesService.getScriptProperties().getProperty("WEBHOOK_URL")
);

const buildPayload = (
  event: GoogleAppsScript.Calendar.CalendarEvent
): GoogleAppsScript.URL_Fetch.Payload => {
  const title = event.getTitle();
  const startTime = Utilities.formatDate(
    event.getStartTime(),
    "JST",
    "yyyy-MM-dd HH:mm"
  );

  return {
    content: `${title}が${startTime}に開始されます`,
  };
};

const notify = (payload: GoogleAppsScript.URL_Fetch.Payload) => {
  return UrlFetchApp.fetch(WEBHOOK_URL, {
    method: "post",
    payload,
  });
};

const getEvents = (): GoogleAppsScript.Calendar.CalendarEvent[] => {
  const calendar = CalendarApp.getCalendarById(`${CALENDAR_ID}`);
  const today = new Date();
  return calendar.getEventsForDay(today);
};

const main = () => {
  getEvents().forEach((event) => {
    notify(buildPayload(event));
  });
};
