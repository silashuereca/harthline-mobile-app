import { useToast } from "primevue/usetoast";

import { useAppStore } from "../store";
export class BaseApi {
  protected toast = useToast();
  protected appStore = useAppStore();

  protected showSuccess(message: string) {
    this.toast.add({
      detail: message,
      life: 3000,
      severity: "success",
      summary: "Success",
    });
  }

  protected showError(message: string) {
    this.toast.add({
      detail: message,
      life: 3000,
      severity: "error",
      summary: "Error",
    });
  }

  protected houseId(): number {
    return this.appStore.state.houseId;
  }
}
