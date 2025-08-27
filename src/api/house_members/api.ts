import { Database } from "../../../supabase/functions/_shared/database-types";
import { supabase } from "../../supabase";

export type THouseMembersRow =
  Database["public"]["Tables"]["house_members"]["Row"];
export type THouseMembersInsert =
  Database["public"]["Tables"]["house_members"]["Insert"];
import { BaseApi } from "../base";

export class HouseMembersApi extends BaseApi {
  async addHouseMember(
    variables: THouseMembersInsert,
  ): Promise<THouseMembersRow[]> {
    const { house_id, member_id, role } = variables;
    const { data, error } = await supabase.from("house_members").insert({
      house_id,
      member_id,
      role,
    });

    if (error) {
      this.showError("Error adding house member");
      throw new Error(`Error adding house member: ${error.message}`);
    }

    return data || [];
  }
}
