import { defineStore } from "pinia";
import { reactive } from "vue";

export const useAppStore = defineStore("app", () => {
  type TState = {
    header: string;
    houseId: number | null;
    projectSet: boolean;
  };

  const state: TState = reactive({
    header: "",
    houseId: null,
    projectSet: false,
  });

  function setHeader(header: string, options?: { projectSet: boolean }) {
    state.header = header;
    if (options?.projectSet) {
      state.projectSet = true;
    }
  }

  function setHouseId(houseId: number) {
    state.houseId = houseId;
  }

  return { setHeader, setHouseId, state };
});
