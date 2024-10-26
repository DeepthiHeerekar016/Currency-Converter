const BASE_URL = "https://v6.exchangerate-api.com/v6/330242ea0ac39d3bcefde407/latest/USD";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

// Populate dropdowns with currency options
for (let select of dropdowns) {
    for (let currCode in countryList) {
        let newOption = document.createElement("option");
        newOption.innerText = currCode;
        newOption.value = currCode;
        if (select.name === "from" && currCode === "USD") {
            newOption.selected = "selected";
        } else if (select.name === "to" && currCode === "INR") {
            newOption.selected = "selected";
        }
        select.append(newOption);
    }

    select.addEventListener("change", (evt) => {
        updateFlag(evt.target);
    });
}

const updateFlag = (element) => {
    let currCode = element.value;
    let countryCode = countryList[currCode];
    let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
    let img = element.parentElement.querySelector("img");
    img.src = newSrc;
};

btn.addEventListener("click", async (evt) => {
    evt.preventDefault();
    let amount = document.querySelector(".amount input");
    let amoVal = amount.value;
    if (amoVal === "" || amoVal < 1) {
        amoVal = 1;
        amount.value = "1";
    }

    // Fetch the exchange rates
    try {
        let response = await fetch(BASE_URL);
        if (!response.ok) throw new Error("Network response was not ok");
        
        let data = await response.json();
        let rate = data.conversion_rates[toCurr.value]; // Get the conversion rate

        let finalAmount = (amoVal * rate).toFixed(2); // Round to 2 decimal places
        msg.innerText = `${amoVal} ${fromCurr.value} = ${finalAmount} ${toCurr.value}`;
    } catch (error) {
        msg.innerText = "Error fetching exchange rates: " + error.message;
    }
});
