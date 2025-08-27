import { TBudgetItem } from "./api";

export function renderTypeHeader(type: TBudgetItem["type"]): string {
  switch (type) {
    case "income":
      return "Income";
    case "debt":
      return "Debt";
    case "savings":
      return "Savings";
    case "housing":
      return "Housing";
    case "transportation":
      return "Transportation";
    case "food":
      return "Food";
    case "personal":
      return "Personal";
    case "lifestyle":
      return "Lifestyle";
    case "health":
      return "Health";
    case "insurance":
      return "Insurance";
    default:
      return "Something Went wrong";
  }
}
