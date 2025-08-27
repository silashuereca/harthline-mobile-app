import { Database } from "../../../supabase/functions/_shared/database-types";
import { supabase } from "../../supabase";
import { BaseApi } from "../base";

export type TInviteMembersRow =
  Database["public"]["Tables"]["invite_members"]["Row"];
export type TUserRole = Database["public"]["Enums"]["member_role"];
export class InviteMembersApi extends BaseApi {
  async createInvite(variables: {
    email: string;
    houseId: number;
    houseName: string;
    invitedByEmail: string;
    role: TUserRole;
  }): Promise<void> {
    const { email, houseId, houseName, invitedByEmail, role } = variables;
    const { error } = await supabase.from("invite_members").insert({
      email: email,
      house_id: houseId,
      house_name: houseName,
      invited_by_email: invitedByEmail,
      role: role,
    });

    if (error) {
      this.showError("Error creating invite");
      throw new Error(`Error creating invite: ${error.message}`);
    } else {
      this.showSuccess("Invite created successfully");
    }
  }

  async getHouseInvites(variables: {
    houseId: number;
  }): Promise<TInviteMembersRow[]> {
    const { houseId } = variables;
    const { data, error } = await supabase
      .from("invite_members")
      .select("*")
      .eq("house_id", houseId)
      .filter("status", "eq", "pending");

    if (error) {
      this.showError("Error fetching invites");
      throw new Error(`Error fetching invites: ${error.message}`);
    }

    return data || [];
  }

  async getMyInvites(variables: {
    email: string;
  }): Promise<TInviteMembersRow[]> {
    const { email } = variables;
    const { data, error } = await supabase
      .from("invite_members")
      .select("*")
      .eq("email", email)
      .filter("status", "eq", "pending");

    if (error) {
      this.showError("Error fetching your invites");
      throw new Error(`Error fetching your invites: ${error.message}`);
    }

    return data || [];
  }

  async declineInvite(variables: { inviteId: number }): Promise<void> {
    const { inviteId } = variables;
    const { error } = await supabase
      .from("invite_members")
      .update({ status: "rejected" })
      .eq("id", inviteId);
    if (error) {
      this.showError("Error declining invite");
      throw new Error(`Error declining invite: ${error.message}`);
    } else {
      this.showSuccess("Invite declined successfully");
    }
  }

  async inviteToAccepted(variables: {
    houseId: number;
    inviteId: number;
  }): Promise<void> {
    const { inviteId } = variables;
    const { error } = await supabase
      .from("invite_members")
      .update({ status: "accepted" })
      .eq("id", inviteId);

    if (error) {
      this.showError("Error accepting invite");
      throw new Error(`Error accepting invite: ${error.message}`);
    }
  }

  async deleteInvite(variables: { inviteId: number }): Promise<void> {
    const { inviteId } = variables;
    const { error } = await supabase
      .from("invite_members")
      .delete()
      .eq("id", inviteId);

    if (error) {
      this.showError("Error deleting invite");
      throw new Error(`Error deleting invite: ${error.message}`);
    } else {
      this.showSuccess("Invite deleted successfully");
    }
  }
}
