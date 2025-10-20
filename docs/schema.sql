--
-- PostgreSQL database dump
--
-- Dumped from database version 17.6 (Postgres.app)
-- Dumped by pg_dump version 17.6 (Postgres.app)
SET
  statement_timeout = 0;

SET
  lock_timeout = 0;

SET
  idle_in_transaction_session_timeout = 0;

SET
  transaction_timeout = 0;

SET
  client_encoding = 'UTF8';

SET
  standard_conforming_strings = on;

SELECT
  pg_catalog.set_config ('search_path', '', false);

SET
  check_function_bodies = false;

SET
  xmloption = content;

SET
  client_min_messages = warning;

SET
  row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--
CREATE SCHEMA public;

SET
  default_table_access_method = heap;

--
-- Name: kysely_migration; Type: TABLE; Schema: public; Owner: -
--
CREATE TABLE public.kysely_migration (
  name character varying(255) NOT NULL,
  "timestamp" character varying(255) NOT NULL
);

--
-- Name: kysely_migration_lock; Type: TABLE; Schema: public; Owner: -
--
CREATE TABLE public.kysely_migration_lock (
  id character varying(255) NOT NULL,
  is_locked integer DEFAULT 0 NOT NULL
);

--
-- Name: options; Type: TABLE; Schema: public; Owner: -
--
CREATE TABLE public.options (
  slug text NOT NULL,
  question_slug text NOT NULL,
  label text NOT NULL,
  description text,
  active boolean DEFAULT true NOT NULL,
  "order" integer NOT NULL,
  added_at date
);

--
-- Name: questions; Type: TABLE; Schema: public; Owner: -
--
CREATE TABLE public.questions (
  slug text NOT NULL,
  section_slug text NOT NULL,
  title text NOT NULL,
  description text,
  type text NOT NULL,
  active boolean DEFAULT true NOT NULL,
  "order" integer NOT NULL,
  multiple_max integer,
  added_at date,
  randomize boolean DEFAULT false NOT NULL
);

--
-- Name: responses; Type: TABLE; Schema: public; Owner: -
--
CREATE TABLE public.responses (
  session_id uuid NOT NULL,
  iso_week integer NOT NULL,
  iso_year integer NOT NULL,
  question_slug text NOT NULL,
  skipped boolean DEFAULT false NOT NULL,
  single_option_slug text,
  single_writein_response text,
  multiple_option_slugs text[],
  multiple_writein_responses text[],
  experience_awareness integer,
  experience_sentiment integer,
  freeform_response text,
  numeric_response numeric,
  comment text
);

--
-- Name: sections; Type: TABLE; Schema: public; Owner: -
--
CREATE TABLE public.sections (
  slug text NOT NULL,
  title text NOT NULL,
  description text,
  active boolean DEFAULT true NOT NULL,
  "order" integer NOT NULL,
  added_at date
);

--
-- Name: sessions; Type: TABLE; Schema: public; Owner: -
--
CREATE TABLE public.sessions (
  id uuid NOT NULL,
  created_at timestamp without time zone DEFAULT '2025-10-20 13:12:33.183295'::timestamp without time zone NOT NULL,
  updated_at timestamp without time zone DEFAULT '2025-10-20 13:12:33.183295'::timestamp without time zone NOT NULL
);

--
-- Name: kysely_migration_lock kysely_migration_lock_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--
ALTER TABLE ONLY public.kysely_migration_lock
ADD CONSTRAINT kysely_migration_lock_pkey PRIMARY KEY (id);

--
-- Name: kysely_migration kysely_migration_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--
ALTER TABLE ONLY public.kysely_migration
ADD CONSTRAINT kysely_migration_pkey PRIMARY KEY (name);

--
-- Name: options options_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--
ALTER TABLE ONLY public.options
ADD CONSTRAINT options_pkey PRIMARY KEY (slug);

--
-- Name: questions questions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--
ALTER TABLE ONLY public.questions
ADD CONSTRAINT questions_pkey PRIMARY KEY (slug);

--
-- Name: responses responses_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--
ALTER TABLE ONLY public.responses
ADD CONSTRAINT responses_pkey PRIMARY KEY (session_id, iso_week, iso_year, question_slug);

--
-- Name: sections sections_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--
ALTER TABLE ONLY public.sections
ADD CONSTRAINT sections_pkey PRIMARY KEY (slug);

--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--
ALTER TABLE ONLY public.sessions
ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);

--
-- Name: options_question_slug_idx; Type: INDEX; Schema: public; Owner: -
--
CREATE INDEX options_question_slug_idx ON public.options USING btree (question_slug);

--
-- Name: responses_question_slug_idx; Type: INDEX; Schema: public; Owner: -
--
CREATE INDEX responses_question_slug_idx ON public.responses USING btree (question_slug);

--
-- Name: responses_session_week_year_idx; Type: INDEX; Schema: public; Owner: -
--
CREATE INDEX responses_session_week_year_idx ON public.responses USING btree (session_id, iso_week, iso_year);

--
-- Name: options options_question_slug_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--
ALTER TABLE ONLY public.options
ADD CONSTRAINT options_question_slug_fkey FOREIGN KEY (question_slug) REFERENCES public.questions (slug) ON DELETE CASCADE;

--
-- Name: questions questions_section_slug_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--
ALTER TABLE ONLY public.questions
ADD CONSTRAINT questions_section_slug_fkey FOREIGN KEY (section_slug) REFERENCES public.sections (slug) ON DELETE CASCADE;

--
-- Name: responses responses_question_slug_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--
ALTER TABLE ONLY public.responses
ADD CONSTRAINT responses_question_slug_fkey FOREIGN KEY (question_slug) REFERENCES public.questions (slug) ON DELETE CASCADE;

--
-- Name: responses responses_session_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--
ALTER TABLE ONLY public.responses
ADD CONSTRAINT responses_session_id_fkey FOREIGN KEY (session_id) REFERENCES public.sessions (id) ON DELETE CASCADE;

--
-- PostgreSQL database dump complete
--
