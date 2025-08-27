import { Database } from "../../../supabase/functions/_shared/database-types";
import { supabase } from "../../supabase";
import { BaseApi } from "../base";

export type TSettingsRow = Database["public"]["Tables"]["settings"]["Row"];

export class SettingsApi extends BaseApi {
  async get(): Promise<TSettingsRow> {
    const { data, error } = await supabase
      .from("settings")
      .select("*")
      .single();

    if (error) {
      this.showError("Error fetching settings");
      throw new Error(`Error fetching settings: ${error.message}`);
    }

    return data;
  }

  async updateSelectedHouse(variables: {
    houseId: number;
    settingsId: number;
  }): Promise<void> {
    const { houseId, settingsId } = variables;
    const { error } = await supabase
      .from("settings")
      .update({ selected_house_id: houseId })
      .eq("id", settingsId);

    if (error) {
      this.showError("Error updating settings");
      throw new Error(`Error updating settings: ${error.message}`);
    } else {
      this.showSuccess("Settings updated successfully");
    }
  }
}
