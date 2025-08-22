import * as Sentry from "@sentry/node";

// Ensure to call this before importing any other modules!
Sentry.init({
  dsn: process.env.dsn,
  tracesSampleRate: 1.0,
  integrations: [
    Sentry.httpIntegration({
      trackIncomingRequestsAsSessions: false, // default: true
    }),
  ],
  enableLogs: true,
  sendDefaultPii: true,
});
