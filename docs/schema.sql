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
-- Name: todos; Type: TABLE; Schema: public; Owner: -
--
CREATE TABLE public.todos (
  id integer NOT NULL,
  text character varying(500) NOT NULL,
  completed boolean DEFAULT false NOT NULL,
  created_at timestamp without time zone DEFAULT '2025-10-18 11:28:02.130682'::timestamp without time zone NOT NULL,
  updated_at timestamp without time zone DEFAULT '2025-10-18 11:28:02.130682'::timestamp without time zone NOT NULL
);

--
-- Name: todos_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--
CREATE SEQUENCE public.todos_id_seq AS integer START
WITH
  1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

--
-- Name: todos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--
ALTER SEQUENCE public.todos_id_seq OWNED BY public.todos.id;

--
-- Name: todos id; Type: DEFAULT; Schema: public; Owner: -
--
ALTER TABLE ONLY public.todos
ALTER COLUMN id
SET DEFAULT nextval('public.todos_id_seq'::regclass);

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
-- Name: todos todos_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--
ALTER TABLE ONLY public.todos
ADD CONSTRAINT todos_pkey PRIMARY KEY (id);

--
-- PostgreSQL database dump complete
--
