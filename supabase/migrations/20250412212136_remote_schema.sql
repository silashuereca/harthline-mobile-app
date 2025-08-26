

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

CREATE SCHEMA IF NOT EXISTS pgsodium;
CREATE EXTENSION IF NOT EXISTS "pgsodium" WITH SCHEMA "pgsodium";






COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE TYPE "public"."budget_category_type" AS ENUM (
    'income',
    'insurance',
    'personal',
    'debt',
    'health',
    'giving',
    'savings',
    'housing',
    'transportation',
    'food',
    'lifestyle'
);


ALTER TYPE "public"."budget_category_type" OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
begin
  insert into public.users (
    id,
    github_id,
    email,
    name,
    avatar_url
  )
  values (
    new.id,
    new.raw_user_meta_data->>'provider_id',
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$;


ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."budget_expenses" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "budget_item_id" "uuid",
    "amount" numeric(10,2) NOT NULL,
    "date" "date" DEFAULT CURRENT_DATE NOT NULL,
    "created_at" timestamp without time zone DEFAULT "now"()
);


ALTER TABLE "public"."budget_expenses" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."budget_items" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "budget_month_id" "uuid",
    "name" "text" NOT NULL,
    "type" "public"."budget_category_type" NOT NULL,
    "budgeted_amount" numeric(10,2) DEFAULT 0.00 NOT NULL,
    "is_paid" boolean DEFAULT false,
    "is_recurring" boolean DEFAULT false,
    "created_at" timestamp without time zone DEFAULT "now"()
);


ALTER TABLE "public"."budget_items" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."budget_month_summary" AS
 SELECT "bi"."budget_month_id",
    "bi"."type",
    "count"(*) AS "total_items",
    "sum"("bi"."budgeted_amount") AS "total_budgeted",
    "sum"(
        CASE
            WHEN "bi"."is_paid" THEN 1
            ELSE 0
        END) AS "paid_items",
    "round"(((100.0 * ("sum"(
        CASE
            WHEN "bi"."is_paid" THEN 1
            ELSE 0
        END))::numeric) / ("count"(*))::numeric), 1) AS "percent_paid"
   FROM "public"."budget_items" "bi"
  GROUP BY "bi"."budget_month_id", "bi"."type"
  ORDER BY "bi"."budget_month_id", "bi"."type";


ALTER TABLE "public"."budget_month_summary" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."budget_months" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "user_id" "uuid",
    "month_start" "date" NOT NULL,
    "created_at" timestamp without time zone DEFAULT "now"()
);


ALTER TABLE "public"."budget_months" OWNER TO "postgres";


ALTER TABLE ONLY "public"."budget_expenses"
    ADD CONSTRAINT "budget_expenses_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."budget_items"
    ADD CONSTRAINT "budget_items_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."budget_months"
    ADD CONSTRAINT "budget_months_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."budget_months"
    ADD CONSTRAINT "budget_months_user_id_month_start_key" UNIQUE ("user_id", "month_start");



ALTER TABLE ONLY "public"."budget_expenses"
    ADD CONSTRAINT "budget_expenses_budget_item_id_fkey" FOREIGN KEY ("budget_item_id") REFERENCES "public"."budget_items"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."budget_items"
    ADD CONSTRAINT "budget_items_budget_month_id_fkey" FOREIGN KEY ("budget_month_id") REFERENCES "public"."budget_months"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."budget_months"
    ADD CONSTRAINT "budget_months_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;





ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";




















































































































































































GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";


















GRANT ALL ON TABLE "public"."budget_expenses" TO "anon";
GRANT ALL ON TABLE "public"."budget_expenses" TO "authenticated";
GRANT ALL ON TABLE "public"."budget_expenses" TO "service_role";



GRANT ALL ON TABLE "public"."budget_items" TO "anon";
GRANT ALL ON TABLE "public"."budget_items" TO "authenticated";
GRANT ALL ON TABLE "public"."budget_items" TO "service_role";



GRANT ALL ON TABLE "public"."budget_month_summary" TO "anon";
GRANT ALL ON TABLE "public"."budget_month_summary" TO "authenticated";
GRANT ALL ON TABLE "public"."budget_month_summary" TO "service_role";



GRANT ALL ON TABLE "public"."budget_months" TO "anon";
GRANT ALL ON TABLE "public"."budget_months" TO "authenticated";
GRANT ALL ON TABLE "public"."budget_months" TO "service_role";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";






























RESET ALL;
