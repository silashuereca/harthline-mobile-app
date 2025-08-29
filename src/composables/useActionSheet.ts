import { actionSheetController } from "@ionic/vue";

export function useActionSheet() {
  async function confirmDelete(): Promise<boolean> {
    const actionSheet = await actionSheetController.create({
      buttons: [
        {
          role: "cancel",
          text: "Cancel",
        },
        {
          role: "destructive",
          text: "Delete",
        },
      ],
      header: "Confirm Delete",
    });

    await actionSheet.present();
    const result = await actionSheet.onDidDismiss();
    return result.role === "destructive";
  }

  return {
    confirmDelete,
  };
}
