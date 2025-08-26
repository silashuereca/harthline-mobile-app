import { Database } from "../../../supabase/functions/_shared/database-types";
import { supabase } from "../../supabase";
import { BaseApi } from "../base";

export type THouseMemberUser =
  Database["public"]["Views"]["house_members_with_user"]["Row"];

export class HouseMembersWithUserApi extends BaseApi {
  async getHouseMembersWithUser(variables: {
    houseId: number;
  }): Promise<THouseMemberUser[]> {
    const { data, error } = await supabase
      .from("house_members_with_user")
      .select("*")
      .eq("house_id", variables.houseId);

    if (error) {
      this.showError("Failed to fetch house members with user");
      throw new Error(error.message);
    }

    return data;
  }
}
