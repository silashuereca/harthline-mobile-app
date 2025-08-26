/* eslint-disable no-unused-vars */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  graphql_public: {
    CompositeTypes: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          extensions?: Json;
          operationName?: string;
          query?: string;
          variables?: Json;
        };
        Returns: Json;
      };
    };
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
  };
  public: {
    CompositeTypes: {
      [_ in never]: never;
    };
    Enums: {
      budget_category_type:
        | "income"
        | "insurance"
        | "personal"
        | "debt"
        | "health"
        | "giving"
        | "savings"
        | "housing"
        | "transportation"
        | "food"
        | "lifestyle";
      invite_status: "pending" | "rejected" | "accepted";
      member_role: "owner" | "editor";
    };
    Functions: {
      is_user_in_house: {
        Args: { target_house_id: number };
        Returns: boolean;
      };
    };
    Tables: {
      budget_expenses: {
        Insert: {
          amount: number;
          budget_item_id?: string | null;
          budget_month_id: string;
          created_at?: string | null;
          date?: string;
          house_id: number;
          id?: string;
          name: string;
          user_id?: string;
        };
        Relationships: [
          {
            columns: ["budget_item_id"];
            foreignKeyName: "budget_expenses_budget_item_id_fkey";
            isOneToOne: false;
            referencedColumns: ["id"];
            referencedRelation: "budget_items";
          },
          {
            columns: ["budget_month_id"];
            foreignKeyName: "budget_expenses_budget_month_id_fkey";
            isOneToOne: false;
            referencedColumns: ["id"];
            referencedRelation: "budget_months";
          },
        ];
        Row: {
          amount: number;
          budget_item_id: string | null;
          budget_month_id: string;
          created_at: string | null;
          date: string;
          house_id: number;
          id: string;
          name: string;
          user_id: string;
        };
        Update: {
          amount?: number;
          budget_item_id?: string | null;
          budget_month_id?: string;
          created_at?: string | null;
          date?: string;
          house_id?: number;
          id?: string;
          name?: string;
          user_id?: string;
        };
      };
      budget_items: {
        Insert: {
          budget_month_id?: string | null;
          budgeted_amount?: number;
          created_at?: string | null;
          house_id: number;
          id?: string;
          is_paid?: boolean | null;
          is_recurring?: boolean | null;
          name: string;
          need?: boolean | null;
          type: Database["public"]["Enums"]["budget_category_type"];
          user_id?: string;
        };
        Relationships: [
          {
            columns: ["budget_month_id"];
            foreignKeyName: "budget_items_budget_month_id_fkey";
            isOneToOne: false;
            referencedColumns: ["id"];
            referencedRelation: "budget_months";
          },
        ];
        Row: {
          budget_month_id: string | null;
          budgeted_amount: number;
          created_at: string | null;
          house_id: number;
          id: string;
          is_paid: boolean | null;
          is_recurring: boolean | null;
          name: string;
          need: boolean | null;
          type: Database["public"]["Enums"]["budget_category_type"];
          user_id: string;
        };
        Update: {
          budget_month_id?: string | null;
          budgeted_amount?: number;
          created_at?: string | null;
          house_id?: number;
          id?: string;
          is_paid?: boolean | null;
          is_recurring?: boolean | null;
          name?: string;
          need?: boolean | null;
          type?: Database["public"]["Enums"]["budget_category_type"];
          user_id?: string;
        };
      };
      budget_months: {
        Insert: {
          created_at?: string | null;
          house_id: number;
          id?: string;
          month_start: string;
          user_id: string;
        };
        Relationships: [];
        Row: {
          created_at: string | null;
          house_id: number;
          id: string;
          month_start: string;
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          house_id?: number;
          id?: string;
          month_start?: string;
          user_id?: string;
        };
      };
      house_members: {
        Insert: {
          created_at?: string;
          house_id: number;
          id?: number;
          member_id: string;
          role: Database["public"]["Enums"]["member_role"];
        };
        Relationships: [];
        Row: {
          created_at: string;
          house_id: number;
          id: number;
          member_id: string;
          role: Database["public"]["Enums"]["member_role"];
        };
        Update: {
          created_at?: string;
          house_id?: number;
          id?: number;
          member_id?: string;
          role?: Database["public"]["Enums"]["member_role"];
        };
      };
      houses: {
        Insert: {
          created_at?: string;
          id?: number;
          name: string;
          owner_id?: string;
        };
        Relationships: [];
        Row: {
          created_at: string;
          id: number;
          name: string;
          owner_id: string;
        };
        Update: {
          created_at?: string;
          id?: number;
          name?: string;
          owner_id?: string;
        };
      };
      invite_members: {
        Insert: {
          created_at?: string;
          email: string;
          house_id: number;
          house_name: string;
          id?: number;
          invited_by_email: string;
          role: Database["public"]["Enums"]["member_role"];
          status?: Database["public"]["Enums"]["invite_status"];
        };
        Relationships: [];
        Row: {
          created_at: string;
          email: string;
          house_id: number;
          house_name: string;
          id: number;
          invited_by_email: string;
          role: Database["public"]["Enums"]["member_role"];
          status: Database["public"]["Enums"]["invite_status"];
        };
        Update: {
          created_at?: string;
          email?: string;
          house_id?: number;
          house_name?: string;
          id?: number;
          invited_by_email?: string;
          role?: Database["public"]["Enums"]["member_role"];
          status?: Database["public"]["Enums"]["invite_status"];
        };
      };
      kitchen_grocery_lists: {
        Insert: {
          content: string;
          created_at?: string;
          house_id: number;
          id?: number;
        };
        Relationships: [];
        Row: {
          content: string;
          created_at: string;
          house_id: number;
          id: number;
        };
        Update: {
          content?: string;
          created_at?: string;
          house_id?: number;
          id?: number;
        };
      };
      kitchen_recipe_ingredients: {
        Insert: {
          created_at?: string;
          house_id: number;
          id?: number;
          ingredient: string;
          recipe_id?: string;
          step_number: number;
        };
        Relationships: [
          {
            columns: ["recipe_id"];
            foreignKeyName: "kitchen_recipe_ingredients_recipe_id_fkey";
            isOneToOne: false;
            referencedColumns: ["id"];
            referencedRelation: "kitchen_recipes";
          },
        ];
        Row: {
          created_at: string;
          house_id: number;
          id: number;
          ingredient: string;
          recipe_id: string;
          step_number: number;
        };
        Update: {
          created_at?: string;
          house_id?: number;
          id?: number;
          ingredient?: string;
          recipe_id?: string;
          step_number?: number;
        };
      };
      kitchen_recipe_instructions: {
        Insert: {
          created_at?: string;
          house_id: number;
          id?: number;
          instruction: string;
          recipe_id?: string;
          step_number: number;
        };
        Relationships: [
          {
            columns: ["recipe_id"];
            foreignKeyName: "kitchen_recipe_instructions_recipe_id_fkey";
            isOneToOne: false;
            referencedColumns: ["id"];
            referencedRelation: "kitchen_recipes";
          },
        ];
        Row: {
          created_at: string;
          house_id: number;
          id: number;
          instruction: string;
          recipe_id: string;
          step_number: number;
        };
        Update: {
          created_at?: string;
          house_id?: number;
          id?: number;
          instruction?: string;
          recipe_id?: string;
          step_number?: number;
        };
      };
      kitchen_recipes: {
        Insert: {
          cook_time_minutes?: number | null;
          created_at?: string;
          description?: string | null;
          house_id: number;
          id?: string;
          image_url?: string | null;
          prep_time_minutes?: number | null;
          servings?: number | null;
          source_url?: string | null;
          title: string;
        };
        Relationships: [];
        Row: {
          cook_time_minutes: number | null;
          created_at: string;
          description: string | null;
          house_id: number;
          id: string;
          image_url: string | null;
          prep_time_minutes: number | null;
          servings: number | null;
          source_url: string | null;
          title: string;
        };
        Update: {
          cook_time_minutes?: number | null;
          created_at?: string;
          description?: string | null;
          house_id?: number;
          id?: string;
          image_url?: string | null;
          prep_time_minutes?: number | null;
          servings?: number | null;
          source_url?: string | null;
          title?: string;
        };
      };
      settings: {
        Insert: {
          created_at?: string;
          id?: number;
          selected_house_id: number;
          user_id?: string;
        };
        Relationships: [
          {
            columns: ["selected_house_id"];
            foreignKeyName: "settings_selected_house_id_fkey";
            isOneToOne: false;
            referencedColumns: ["id"];
            referencedRelation: "houses";
          },
        ];
        Row: {
          created_at: string;
          id: number;
          selected_house_id: number;
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: number;
          selected_house_id?: number;
          user_id?: string;
        };
      };
    };
    Views: {
      budget_month_summary: {
        Relationships: [
          {
            columns: ["budget_month_id"];
            foreignKeyName: "budget_items_budget_month_id_fkey";
            isOneToOne: false;
            referencedColumns: ["id"];
            referencedRelation: "budget_months";
          },
        ];
        Row: {
          budget_month_id: string | null;
          paid_items: number | null;
          percent_paid: number | null;
          total_budgeted: number | null;
          total_items: number | null;
          type: Database["public"]["Enums"]["budget_category_type"] | null;
        };
      };
      house_members_with_user: {
        Relationships: [];
        Row: {
          avatar_url: string | null;
          created_at: string | null;
          email: string | null;
          full_name: string | null;
          house_id: number | null;
          house_member_id: number | null;
          member_id: string | null;
          role: Database["public"]["Enums"]["member_role"] | null;
        };
      };
    };
  };
};

type DefaultSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  } ? keyof (
      & Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
      & Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"]
    )
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database } ? (
    & Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    & Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"]
  )[TableName] extends {
    Row: infer R;
  } ? R
  : never
  : DefaultSchemaTableNameOrOptions extends keyof (
    & DefaultSchema["Tables"]
    & DefaultSchema["Views"]
  ) ? (
      & DefaultSchema["Tables"]
      & DefaultSchema["Views"]
    )[DefaultSchemaTableNameOrOptions] extends {
      Row: infer R;
    } ? R
    : never
  : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  } ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][
    TableName
  ] extends {
    Insert: infer I;
  } ? I
  : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Insert: infer I;
    } ? I
    : never
  : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  } ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][
    TableName
  ] extends {
    Update: infer U;
  } ? U
  : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Update: infer U;
    } ? U
    : never
  : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database;
  } ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
  : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]][
      "CompositeTypes"
    ]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][
    CompositeTypeName
  ]
  : PublicCompositeTypeNameOrOptions extends
    keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never;

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      budget_category_type: [
        "income",
        "insurance",
        "personal",
        "debt",
        "health",
        "giving",
        "savings",
        "housing",
        "transportation",
        "food",
        "lifestyle",
      ],
      invite_status: ["pending", "rejected", "accepted"],
      member_role: ["owner", "editor"],
    },
  },
} as const;
