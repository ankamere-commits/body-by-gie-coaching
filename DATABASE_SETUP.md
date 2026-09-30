# BODY BY GIE Database Setup

This app is ready to save onboarding and progress data to Supabase through server-side Next.js API routes.

## 1. Create the Supabase tables

1. Open your Supabase project.
2. Go to SQL Editor.
3. Paste and run the SQL from `database/schema.sql`.

## 2. Add Vercel environment variables

In Vercel, open the project settings and add:

```text
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-server-only-service-role-key
```

Keep the service role key private. Do not add it to client-side code.

## 3. Redeploy

Redeploy the Vercel app after adding the environment variables.

When the database is configured, the app saves:

- onboarding profile details
- coaching insight summaries
- mission completion events
- missed workout events
- daily check-ins
- weekly reflections

If the database is not configured yet, the app still works in local/demo mode.
