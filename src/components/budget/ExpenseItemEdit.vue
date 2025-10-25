<template>
  <IonModal :is-open="open" :backdrop-dismiss="false">
    <IonHeader>
      <IonToolbar>
        <IonTitle>
          Edit Expense
        </IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonContent class="ion-padding">
      <div class="flex flex-col gap-6 pb-14">
        <section class="flex flex-col gap-1">
          <p class="text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400">
            Expense details
          </p>
          <p class="text-xl font-semibold text-gray-900 dark:text-white" v-text="state.form.name || props.expense?.name || 'Expense'" />
          <p v-if="formattedCreatedAt" class="text-sm text-gray-500 dark:text-gray-400 flex gap-1">
            Logged
            <span v-text="formattedCreatedAt" />
          </p>
        </section>

        <section class="rounded-2xl border border-gray-200/60 dark:border-white/10 bg-white dark:bg-neutral-900 p-4">
          <IonList lines="none">
            <IonInput v-model="state.form.name" label="Expense name" placeholder="Give it a clear label" label-placement="stacked" />
            <InputValidation :errors="$v.state?.form?.name?.$errors" />
            <IonInput
              :value="formattedAmount"
              type="text"
              inputmode="numeric"
              placeholder="Enter amount"
              label="Amount"
              label-placement="stacked"
              error-text="Required"
              @ion-blur="handleBlur"
              @ion-input="handleInput"
              @keydown.enter="handleKeydown"
            />
            <InputValidation :errors="$v.state?.form?.amount?.$errors" />
          </IonList>
        </section>
      </div>

      <IonButton
        class="mt-4"
        color="danger"
        expand="block"
        fill="clear"
        :disabled="state.loading.delete || state.loading.createOrEditBudgetItem"
        @click="deleteExpense()"
      >
        Delete Expense
      </IonButton>
    </IonContent>
    <IonFooter>
      <IonToolbar>
        <div class="flex justify-between w-full px-2">
          <IonButton expand="block" fill="clear" color="medium" @click="closeModal()">
            Cancel
          </IonButton>
          <IonButton
            expand="block"
            :strong="true"
            :disabled="state.loading.createOrEditBudgetItem || state.loading.delete"
            @click="saveExpense()"
          >
            Save Changes
          </IonButton>
        </div>
      </IonToolbar>
    </IonFooter>
  </IonModal>
</template>

<script lang="ts" setup>
import {
  IonButton,
  IonContent,
  IonFooter,
  IonHeader,
  IonInput,
  IonList,
  IonModal,
  IonTitle,
  IonToolbar,
} from "@ionic/vue";
import useVuelidate from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { computed, PropType, reactive, watch } from "vue";

import {
  BudgetExpenseApi,
  TBudgetExpenseRow,
} from "../../api/budget-expenses/api";
import { formatDate } from "../../api/utils/common";
import { useActionSheet } from "../../composables/useActionSheet";
import { useMoneyInput } from "../../composables/useMoneyInput";
import { useToast } from "../../composables/useToast";
import InputValidation from "../InputValidation.vue";

const props = defineProps({
  expense: {
    default: null,
    required: true,
    type: Object as PropType<TBudgetExpenseRow | null>,
  },
  open: {
    default: false,
    type: Boolean,
  },
});

type TEmits = {
  "update:close": [void];
  "update:expenses": [void];
};

const emit = defineEmits<TEmits>();

type TState = {
  form: {
    amount: string;
    name: string;
  };
  loading: {
    createOrEditBudgetItem: boolean;
    delete: boolean;
  };
};

const { confirmDelete } = useActionSheet();
const budgetExpenseApi: BudgetExpenseApi = new BudgetExpenseApi();
const { presentToast } = useToast();
const state: TState = reactive({
  form: {
    amount: "",
    name: "",
  },
  loading: {
    createOrEditBudgetItem: false,
    delete: false,
  },
});

const {
  formatAmountOnMount,
  formatAmountToSave,
  formattedAmount,
  handleBlur,
  handleInput,
  handleKeydown,
} = useMoneyInput({
  amountProp: props.expense?.amount ?? 0,
  edit: false,
  form: state.form,
  nameProp: props.expense?.name ?? "",
});

const rules = computed(() => {
  const validations = {
    state: {
      form: {
        amount: { required },
        name: { required },
      },
    },
  };

  return validations;
});

const $v: any = useVuelidate(rules, { state });

const formattedCreatedAt = computed(() => {
  if (!props.expense) return "";
  return formatDate(props.expense.created_at);
});

function populateForm(expense: TBudgetExpenseRow): void {
  state.form.name = expense.name ?? "";
  state.form.amount = formatAmountOnMount(expense.amount ?? 0);
  $v.value.$reset();
}

function resetForm(): void {
  state.form.amount = "";
  state.form.name = "";
  state.loading.createOrEditBudgetItem = false;
  state.loading.delete = false;
  $v.value?.$reset();
}

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen && props.expense) {
      populateForm(props.expense);
    }
    if (!isOpen) {
      resetForm();
    }
  },
);

watch(
  () => props.expense,
  (expense) => {
    if (props.open && expense) {
      populateForm(expense);
    }
  },
);

function closeModal(): void {
  if (state.loading.createOrEditBudgetItem) {
    return;
  }
  resetForm();
  emit("update:close");
}

async function saveExpense(): Promise<void> {
  if (
    !props.expense ||
    state.loading.createOrEditBudgetItem ||
    state.loading.delete
  ) {
    return;
  }

  const valid = await $v.value.$validate();
  if (!valid) {
    if ($v.value.state.form.amount.$error) {
      await presentToast("Please enter a valid amount", {
        color: "danger",
        placement: "bottom",
      });
    }

    if ($v.value.state.form.name.$error) {
      await presentToast("Please enter a valid expense name", {
        color: "danger",
        placement: "bottom",
      });
    }
    return;
  }

  try {
    state.loading.createOrEditBudgetItem = true;
    const { amount, name } = state.form;
    const inputAmount = formatAmountToSave(amount);
    await budgetExpenseApi.updateBudgetExpense({
      amount: inputAmount,
      id: props.expense.id,
      name,
    });
  } finally {
    state.loading.createOrEditBudgetItem = false;
    emit("update:expenses");
  }
}

async function deleteExpense(): Promise<void> {
  if (
    !props.expense ||
    state.loading.delete ||
    state.loading.createOrEditBudgetItem
  )
    return;
  const confirmAction = await confirmDelete();

  if (!confirmAction) return;

  try {
    state.loading.delete = true;
    await budgetExpenseApi.deleteBudgetExpense({
      id: props.expense.id,
    });
  } finally {
    state.loading.delete = false;
    emit("update:expenses");
  }
}
</script>
