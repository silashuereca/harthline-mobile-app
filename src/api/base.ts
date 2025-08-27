import { toastController } from "@ionic/vue";

import { useAppStore } from "../store";
export class BaseApi {
  protected toast = toastController;
  protected appStore = useAppStore();

  protected async showSuccess(message: string) {
    const toast = await this.toast.create({
      color: "success",
      duration: 1500,
      message,
      position: "top",
    });

    await toast.present();
  }

  protected async showError(message: string) {
    const toast = await this.toast.create({
      color: "danger",
      duration: 3000,
      message,
      position: "top",
    });

    await toast.present();
  }

  protected houseId(): number {
    return this.appStore.state.houseId;
  }
}
