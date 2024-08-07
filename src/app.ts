// elements
let billAmountInput = document.getElementById("billAmount") as HTMLInputElement;
let tipPercentageButtons = document.querySelectorAll(
  `.tipPercentage`
) as NodeListOf<HTMLElement>;
let customTipInput = document.getElementById("customTip") as HTMLInputElement;
let errorMsg = document.getElementById(`errorMsg`) as HTMLParagraphElement;
let peopleCountInput = document.getElementById(
  "peopleCount"
) as HTMLInputElement;
let tipPerPersonDisplay = document.getElementById(
  "tipPerPerson"
) as HTMLHeadingElement;
let totalPerPersonDisplay = document.getElementById(
  "totalPerPerson"
) as HTMLHeadingElement;
let resetButton = document.getElementById("resetButton") as HTMLButtonElement;

// interfaces
interface AllValues {
  amount: number;
  custom: number;
  numberOfPeople: number;
}

let selectedTipPercentage: number = 0;

// tip percentage selection
tipPercentageButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const isActive = button.classList.contains("active");

    tipPercentageButtons.forEach((btn) => btn.classList.remove("active"));

    if (!isActive) {
      button.classList.add("active");
      selectedTipPercentage = Number(button.getAttribute("data-value"));
      customTipInput.value = ""; // Reset custom input value when percentage is selected
    } else {
      selectedTipPercentage = 0;
    }
    calculate(); // Recalculate on percentage change
    console.log("Selected Tip Percentage:", selectedTipPercentage);
  });
});

// functions
function getValues(): AllValues {
  return {
    amount: Number(billAmountInput.value) || 0,
    custom: Number(customTipInput.value) || selectedTipPercentage || 0,
    numberOfPeople: Number(peopleCountInput.value) || 0,
  };
}

function validate(values: AllValues): boolean {
  let billAmountParent = billAmountInput.parentElement;
  let customTipParent = customTipInput.parentElement;
  let peopleCountParent = peopleCountInput.parentElement;

  let isValid = true;

  // Reset previous error states
  if (billAmountParent) {
    billAmountParent.classList.remove("no-value");
  }
  if (customTipParent) {
    customTipParent.classList.remove("no-value");
  }
  if (peopleCountParent) {
    peopleCountParent.classList.remove("no-value");
  }

  // Validate bill amount
  if (values.amount <= 0) {
    if (billAmountParent) {
      billAmountParent.classList.add("no-value");
    }
    isValid = false;
  }

  // Validate custom tip percentage
  if (values.custom <= 0) {
    if (customTipParent) {
      customTipParent.classList.add("no-value");
    }
    isValid = false;
  }

  // Validate number of people
  if (values.numberOfPeople <= 0) {
    if (peopleCountParent) {
      peopleCountParent.classList.add("no-value");
    }
    if (values.numberOfPeople === 0) {
      errorMsg.innerText = "Can't be zero";
    }
    isValid = false;
  } else {
    errorMsg.innerText = "";
  }

  console.log("Selected Tip Percentage:", selectedTipPercentage);
  console.log("Custom Tip Value:", values.custom);

  return isValid;
}

function calculate(): void {
  const values = getValues();

  if (validate(values)) {
    const totalTip = (values.amount * values.custom) / 100;
    const tipPerPerson =
      values.numberOfPeople > 0 ? totalTip / values.numberOfPeople : 0;
    const totalAmountPerPerson =
      values.numberOfPeople > 0
        ? (values.amount + totalTip) / values.numberOfPeople
        : 0;

    tipPerPersonDisplay.innerText = `$${tipPerPerson.toFixed(2)}`;
    totalPerPersonDisplay.innerText = `$${totalAmountPerPerson.toFixed(2)}`;
  } else {
    // Reset results if validation fails
    tipPerPersonDisplay.innerText = "$0.00";
    totalPerPersonDisplay.innerText = "$0.00";
  }
}

// Events
if (resetButton) {
  resetButton.addEventListener("click", () => {
    // Resetting values
    billAmountInput.value = "";
    customTipInput.value = "";
    peopleCountInput.value = "";

    // Clear all active classes
    tipPercentageButtons.forEach((btn) => btn.classList.remove("active"));

    // Clear selectedTipPercentage
    selectedTipPercentage = 0;

    // Reset button state
    resetButton.classList.add("btn-disabled");

    // Clear results
    tipPerPersonDisplay.innerText = "$0.00";
    totalPerPersonDisplay.innerText = "$0.00";

    // Reset error message
    errorMsg.innerText = "";

    console.log("Reset button clicked");
  });
} else {
  console.log("Reset button not found");
}

// Input events
billAmountInput &&
  billAmountInput.addEventListener(`input`, () => {
    resetButton.classList.remove("btn-disabled");
    calculate(); // Recalculate on bill amount input change
  });

customTipInput &&
  customTipInput.addEventListener(`input`, () => {
    resetButton.classList.remove("btn-disabled");
    // Clear tip percentage selection if custom tip input is used
    tipPercentageButtons.forEach((btn) => btn.classList.remove("active"));
    calculate(); // Recalculate on custom tip input change
  });

peopleCountInput &&
  peopleCountInput.addEventListener(`input`, () => {
    resetButton.classList.remove("btn-disabled");
    calculate(); // Recalculate on number of people input change
  });
