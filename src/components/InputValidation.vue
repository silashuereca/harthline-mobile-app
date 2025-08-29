<template>
  <div>
    <p
      v-for="error in errors"
      id="input-error-message"
      :key="error.$uid"
      class="mt-1 text-sm text-red-600"
      v-text="error.$message"
    />
    <p v-show="customMessage" id="input-error-message" class="mt-1 text-sm text-red-600" v-text="customMessage" />
  </div>
</template>

<script lang="ts" setup>
import { PropType } from "vue";

type TError = {
  $message: string;
  $uid: string;
};

defineProps({
  customMessage: {
    default: "",
    type: String,
  },
  errors: {
    default: () => [],
    type: Array as PropType<TError[]>,
  },
});
</script>
