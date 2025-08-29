import { toastController } from "@ionic/vue";

export function useToast() {
  async function presentToast(
    message: string,
    options?: {
      color?: "danger" | "success";
      placement?: "top" | "middle" | "bottom";
    },
  ): Promise<void> {
    const toast = await toastController.create({
      color: options?.color || "success",
      duration: 2000,
      message,
      position: options?.placement || "top",
    });

    await toast.present();
  }

  return {
    presentToast,
  };
}
