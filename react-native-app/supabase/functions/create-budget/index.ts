import { createClient } from "npm:@supabase/supabase-js";
import { DateTime } from "npm:luxon";

import { corsHeaders } from "../_shared/cores.ts";
import { Database } from "../_shared/database-types.ts";

type TBudgetItemInsert = Database["public"]["Tables"]["budget_items"]["Insert"];
// eslint-disable-next-line no-undef
Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Get the session or user object
    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const supabaseClient = createClient<Database>(
      // eslint-disable-next-line no-undef
      Deno.env.get("SUPABASE_URL") ?? "",
      // eslint-disable-next-line no-undef
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      },
    );
    const { houseId, month: monthRequest } = await req.json();
    const selectedMonth = DateTime.fromISO(monthRequest).toFormat("yyyy-MM-dd");
    const { data } = await supabaseClient.auth.getUser(token);
    const user = data.user;

    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 401,
      });
    }

    let error = null;

    const { data: latestMonthRow } = await supabaseClient
      .from("budget_months")
      .select("*")
      .eq("user_id", user.id)
      .eq("house_id", houseId)
      .order("month_start", { ascending: false })
      .limit(1);
    const { data: currentMonthRows } = await supabaseClient
      .from("budget_months")
      .select("*")
      .eq("month_start", selectedMonth)
      .eq("house_id", houseId);

    if (latestMonthRow?.length && latestMonthRow[0].month_start !== selectedMonth) {
      const { data: rows } = await supabaseClient
        .from("budget_items")
        .select("*")
        .eq("budget_month_id", latestMonthRow[0].id)
        .eq("house_id", houseId);

      await supabaseClient.from("budget_months").insert({
        house_id: houseId,
        month_start: selectedMonth,
        user_id: user.id,
      });

      const getCreatedMonth = await supabaseClient
        .from("budget_months")
        .select("*")
        .eq("user_id", user.id)
        .eq("month_start", selectedMonth)
        .eq("house_id", houseId);

      const createdMonth = getCreatedMonth.data;
      if (createdMonth?.length) {
        const budgetItem = {
          budget_month_id: createdMonth[0].id,
          budgeted_amount: 0,
          is_paid: false,
          is_recurring: false,
        };

        const budgetItems: TBudgetItemInsert[] = (rows ?? []).map((row) => {
          return {
            ...budgetItem,
            budgeted_amount: row.budgeted_amount,
            house_id: houseId,
            name: row.name,
            type: row.type,
            user_id: user.id,
          };
        });

        if (budgetItems.length) {
          await supabaseClient.from("budget_items").insert(budgetItems);
        }
      }
    } else if (!currentMonthRows?.length) {
      // create a new budget month here
      const { error: createBudgetMonthError } = await supabaseClient.from("budget_months").insert({
        house_id: houseId,
        month_start: selectedMonth,
        user_id: user.id,
      });

      error = createBudgetMonthError;
      const getCreatedMonth = await supabaseClient
        .from("budget_months")
        .select("*")
        .eq("user_id", user.id)
        .eq("month_start", selectedMonth)
        .eq("house_id", houseId);

      const createdMonth = getCreatedMonth.data;
      if (createdMonth?.length) {
        const createdMonthId = createdMonth[0].id;
        const budgetItem = {
          budget_month_id: createdMonthId,
          budgeted_amount: 0,
          house_id: houseId,
          is_paid: false,
          is_recurring: false,
        };

        const { error: createBudgetItemsError } = await supabaseClient.from("budget_items").insert([
          {
            ...budgetItem,
            name: "Paycheck 1",
            type: "income",
          },
          {
            ...budgetItem,
            name: "Paycheck 2",
            type: "income",
          },
          {
            ...budgetItem,
            name: "Savings",
            type: "savings",
          },
          {
            ...budgetItem,
            name: "Mortgage/Rent",
            type: "housing",
          },
          {
            ...budgetItem,
            name: "Gas",
            type: "transportation",
          },
          {
            ...budgetItem,
            name: "Groceries",
            type: "food",
          },
          {
            ...budgetItem,
            name: "Cell Phone",
            type: "personal",
          },
          {
            ...budgetItem,
            name: "Gym Membership",
            type: "lifestyle",
          },
          {
            ...budgetItem,
            name: "Doctor Visit",
            type: "health",
          },
          {
            ...budgetItem,
            name: "Car Insurance",
            type: "insurance",
          },
          {
            ...budgetItem,
            name: "Credit Card",
            type: "debt",
          },
        ]);

        error = createBudgetItemsError;
      }
    }

    //I think the return response needs to just say it was successful
    return new Response(JSON.stringify({ error, success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
