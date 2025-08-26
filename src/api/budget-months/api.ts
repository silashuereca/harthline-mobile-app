import { Database } from "../../../supabase/functions/_shared/database-types";
import { supabase } from "../../supabase";
import { BaseApi } from "../base";
export type TBudgetMonth = Database["public"]["Tables"]["budget_months"]["Row"];

export class BudgetMonthApi extends BaseApi {
  async getBudgetMonth(variables: {
    month?: string;
    monthId?: string;
  }): Promise<TBudgetMonth | null> {
    const { month, monthId } = variables;

    let data: TBudgetMonth[] = [];
    let error: Error | null = null;

    if (monthId) {
      const resultById = await supabase
        .from("budget_months")
        .select("*")
        .eq("id", monthId);

      //if monthId is not found, we need to double check if the month exists
      if (!resultById.data.length) {
        const resultByDate = await supabase
          .from("budget_months")
          .select("*")
          .eq("month_start", month)
          .eq("house_id", this.houseId());
        if (resultByDate.data.length) {
          data = resultByDate.data;
          error = resultByDate.error;
        }
      } else {
        data = resultById.data;
        error = resultById.error;
      }
    } else if (month) {
      const result = await supabase
        .from("budget_months")
        .select("*")
        .eq("month_start", month)
        .eq("house_id", this.houseId());
      data = result.data;
      error = result.error;
    }

    if (error) {
      throw new Error(error.message);
    }

    return data[0] || null;
  }
}
