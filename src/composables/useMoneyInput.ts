import { computed, ComputedRef, onMounted } from "vue";
export function useMoneyInput(options: {
  amountProp?: number;
  edit?: boolean;
  form: { amount: string; id?: string; name: string };
  nameProp?: string;
}): {
  // eslint-disable-next-line no-unused-vars
  formatAmountOnMount: (amount: number) => string;
  // eslint-disable-next-line no-unused-vars
  formatAmountToSave: (amount: string) => number;
  formattedAmount: ComputedRef<string>;
  handleBlur: () => void;
  // eslint-disable-next-line no-unused-vars
  handleDigitsOnly: (event: Event) => string;
  // eslint-disable-next-line no-unused-vars
  handleInput: (event: Event) => void;
  // eslint-disable-next-line no-unused-vars
  handleKeydown: (event: KeyboardEvent) => void;
} {
  const { amountProp, edit, form, nameProp } = options;
  onMounted(() => {
    if (edit) {
      console.log("Edit", edit);
      form.amount = formatAmountOnMount(amountProp);
      form.name = nameProp;
    }
  });

  const formattedAmount: ComputedRef<string> = computed(() => {
    const value = form.amount.padStart(3, "0");
    const dollars = value.slice(0, -2);
    const cents = value.slice(-2);
    return `$${parseInt(dollars, 10).toLocaleString()}.${cents}`;
  });

  function handleDigitsOnly(event): string {
    // Ensure only digits are allowed in the input
    return event.target.value.replace(/\D/g, "");
  }

  function handleInput(event): void {
    const digitsOnly = event.target.value.replace(/\D/g, "");
    form.amount = digitsOnly;
  }

  function handleKeydown(event): void {
    // Prevent entering non-numeric characters manually
    if (event.key.length === 1 && !/\d/.test(event.key)) {
      event.preventDefault();
    }
  }

  function handleBlur(): void {
    if (form.amount === "") {
      form.amount = "0";
    }
  }

  function formatAmountOnMount(amount: number): string {
    return String(Math.round(Number(amount) * 100));
  }

  function formatAmountToSave(amount: string): number {
    return parseInt(amount) / 100;
  }

  return {
    formatAmountOnMount,
    formatAmountToSave,
    formattedAmount,
    handleBlur,
    handleDigitsOnly,
    handleInput,
    handleKeydown,
  };
}
