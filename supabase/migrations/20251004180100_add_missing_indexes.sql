/*
  # Add Missing Database Indexes

  ## Overview
  Adds performance indexes for commonly queried columns that were missing
  from the initial schema.

  ## Indexes Added
  - newsletter_issues.sent_at: For analytics time-based queries
  - subscribers.email: For fast email lookups
  - subscribers.status: For filtering active subscribers
  - newsletter_subscriptions.status: For filtering active subscriptions
  - newsletter_analytics.updated_at: For recent analytics queries

  ## Performance Impact
  These indexes will significantly improve query performance for:
  - Newsletter analytics dashboard
  - Subscriber management
  - Email verification
  - Status-based filtering
*/

-- Add index for newsletter issues sent date (used in analytics queries)
CREATE INDEX IF NOT EXISTS idx_newsletter_issues_sent_at
  ON newsletter_issues(sent_at)
  WHERE status = 'sent';

-- Add index for subscriber email lookups
CREATE INDEX IF NOT EXISTS idx_subscribers_email
  ON subscribers(email);

-- Add index for subscriber status filtering
CREATE INDEX IF NOT EXISTS idx_subscribers_status
  ON subscribers(status);

-- Add index for subscription status filtering
CREATE INDEX IF NOT EXISTS idx_newsletter_subscriptions_status
  ON newsletter_subscriptions(status);

-- Add index for analytics updated_at
CREATE INDEX IF NOT EXISTS idx_newsletter_analytics_updated_at
  ON newsletter_analytics(updated_at);

-- Add composite index for common join queries
CREATE INDEX IF NOT EXISTS idx_newsletter_issues_newsletter_status
  ON newsletter_issues(newsletter_id, status);

-- Add index for discovered artists queries
CREATE INDEX IF NOT EXISTS idx_discovered_artists_status_confidence
  ON discovered_artists(status, ai_confidence DESC);
