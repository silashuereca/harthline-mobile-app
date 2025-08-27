import { Database } from "../../../supabase/functions/_shared/database-types";
import { supabase } from "../../supabase";
import { BaseApi } from "../base";
export type THouseRow = Database["public"]["Tables"]["houses"]["Row"];
export type THouseInsert = Database["public"]["Tables"]["houses"]["Insert"];
export type THouseUpdate = Database["public"]["Tables"]["houses"]["Update"];

export class HousesApi extends BaseApi {
  async getHouse(variables: { houseId: number }): Promise<THouseRow | null> {
    const { data, error } = await supabase
      .from("houses")
      .select("*")
      .eq("id", variables.houseId);

    if (error) {
      this.showError("Failed to fetch house");
      throw new Error(error.message);
    }

    return data[0];
  }

  async createHouse(variables: {
    name: string;
    owner_id: string;
  }): Promise<{ success: boolean }> {
    const { error } = await supabase.from("houses").insert(variables);

    if (error) {
      this.showError("Failed to create house. Please try again.");
      throw new Error(error.message);
    }

    return { success: true };
  }

  async updateHouse(variables: {
    houseId: number;
    name: string;
  }): Promise<{ success: boolean }> {
    const { houseId, name } = variables;
    const { error } = await supabase
      .from("houses")
      .update({ name })
      .eq("id", houseId);

    if (error) {
      this.showError("Failed to update house. Please try again.");
      throw new Error(error.message);
    }

    this.showSuccess("House updated successfully");
    return { success: true };
  }

  async getHouses(): Promise<THouseRow[]> {
    const { data, error } = await supabase.from("houses").select("*");

    if (error) {
      this.showError("Failed to fetch houses");
      throw new Error(error.message);
    }

    return data;
  }
}
