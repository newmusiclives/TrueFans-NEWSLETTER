/*
  # Fix Production RLS Policies

  ## Overview
  Replaces overly permissive RLS policies with proper admin-only checks.
  This is a CRITICAL security fix that must be applied before production.

  ## Changes Made

  ### Tables Fixed
  - newsletters: Admin-only write, public read
  - newsletter_issues: Admin-only write for drafts/scheduled, public read for sent
  - subscribers: Public insert (signup), admin-only for other operations
  - newsletter_subscriptions: Users manage own, admin manages all
  - newsletter_analytics: Admin-only write, public read
  - discovered_artists: Admin-only write, public read

  ## Security Notes
  - Uses JWT role checks instead of database queries to avoid circular dependencies
  - Follows principle of least privilege
  - Public can only read published content and create subscriptions
  - All administrative operations require admin role
*/

-- Drop all overly permissive policies
DROP POLICY IF EXISTS "Authenticated users can manage newsletters" ON newsletters;
DROP POLICY IF EXISTS "Authenticated users can manage issues" ON newsletter_issues;
DROP POLICY IF EXISTS "Authenticated users can manage subscribers" ON subscribers;
DROP POLICY IF EXISTS "Authenticated users can manage subscriptions" ON newsletter_subscriptions;
DROP POLICY IF EXISTS "Authenticated users can manage analytics" ON newsletter_analytics;
DROP POLICY IF EXISTS "Authenticated users can manage artists" ON discovered_artists;

-- Newsletters: Public read, admin write
CREATE POLICY "Admin users can insert newsletters"
  ON newsletters FOR INSERT
  TO authenticated
  WITH CHECK ((auth.jwt()->>'role')::text = 'admin');

CREATE POLICY "Admin users can update newsletters"
  ON newsletters FOR UPDATE
  TO authenticated
  USING ((auth.jwt()->>'role')::text = 'admin')
  WITH CHECK ((auth.jwt()->>'role')::text = 'admin');

CREATE POLICY "Admin users can delete newsletters"
  ON newsletters FOR DELETE
  TO authenticated
  USING ((auth.jwt()->>'role')::text = 'admin');

-- Newsletter Issues: Public read sent issues, admin manages all
CREATE POLICY "Admin users can insert issues"
  ON newsletter_issues FOR INSERT
  TO authenticated
  WITH CHECK ((auth.jwt()->>'role')::text = 'admin');

CREATE POLICY "Admin users can update issues"
  ON newsletter_issues FOR UPDATE
  TO authenticated
  USING ((auth.jwt()->>'role')::text = 'admin')
  WITH CHECK ((auth.jwt()->>'role')::text = 'admin');

CREATE POLICY "Admin users can delete issues"
  ON newsletter_issues FOR DELETE
  TO authenticated
  USING ((auth.jwt()->>'role')::text = 'admin');

-- Subscribers: Public can insert (signup), admin manages
CREATE POLICY "Admin users can update subscribers"
  ON subscribers FOR UPDATE
  TO authenticated
  USING ((auth.jwt()->>'role')::text = 'admin')
  WITH CHECK ((auth.jwt()->>'role')::text = 'admin');

CREATE POLICY "Admin users can delete subscribers"
  ON subscribers FOR DELETE
  TO authenticated
  USING ((auth.jwt()->>'role')::text = 'admin');

-- Newsletter Subscriptions: Users manage own, admin manages all
CREATE POLICY "Users can update own subscriptions"
  ON newsletter_subscriptions FOR UPDATE
  TO authenticated
  USING (
    (auth.jwt()->>'role')::text = 'admin' OR
    subscriber_id IN (SELECT id FROM subscribers WHERE email = auth.jwt()->>'email')
  )
  WITH CHECK (
    (auth.jwt()->>'role')::text = 'admin' OR
    subscriber_id IN (SELECT id FROM subscribers WHERE email = auth.jwt()->>'email')
  );

CREATE POLICY "Admin users can delete subscriptions"
  ON newsletter_subscriptions FOR DELETE
  TO authenticated
  USING ((auth.jwt()->>'role')::text = 'admin');

-- Newsletter Analytics: Admin write, public read
CREATE POLICY "Admin users can insert analytics"
  ON newsletter_analytics FOR INSERT
  TO authenticated
  WITH CHECK ((auth.jwt()->>'role')::text = 'admin');

CREATE POLICY "Admin users can update analytics"
  ON newsletter_analytics FOR UPDATE
  TO authenticated
  USING ((auth.jwt()->>'role')::text = 'admin')
  WITH CHECK ((auth.jwt()->>'role')::text = 'admin');

CREATE POLICY "Admin users can delete analytics"
  ON newsletter_analytics FOR DELETE
  TO authenticated
  USING ((auth.jwt()->>'role')::text = 'admin');

-- Discovered Artists: Admin write, public read
CREATE POLICY "Admin users can insert artists"
  ON discovered_artists FOR INSERT
  TO authenticated
  WITH CHECK ((auth.jwt()->>'role')::text = 'admin');

CREATE POLICY "Admin users can update artists"
  ON discovered_artists FOR UPDATE
  TO authenticated
  USING ((auth.jwt()->>'role')::text = 'admin')
  WITH CHECK ((auth.jwt()->>'role')::text = 'admin');

CREATE POLICY "Admin users can delete artists"
  ON discovered_artists FOR DELETE
  TO authenticated
  USING ((auth.jwt()->>'role')::text = 'admin');
