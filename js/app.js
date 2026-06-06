// Initialize the calculator UI once the DOM is ready.
window.addEventListener('DOMContentLoaded', function () {
    if (typeof CONFIG !== 'undefined' && CONFIG.populateDatalist) {
        CONFIG.populateDatalist();
    }

    if (typeof CONFIG !== 'undefined' && CONFIG.setupDistanceAutofill) {
        CONFIG.setupDistanceAutofill();
    }

    setupFormSubmit();
});

/**
 * Set up form submit handling for emission comparison.
 */
function setupFormSubmit() {
    const form = document.getElementById('calculator-form');
    if (!form) {
        return;
    }

    const originInput = document.getElementById('origin');
    const destinationInput = document.getElementById('destination');
    const distanceInput = document.getElementById('distance');
    const resultsContent = document.getElementById('results-content');
    const comparisonContent = document.getElementById('comparison-content');
    const submitButton = form.querySelector('button[type="submit"]');

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        const origin = originInput.value.trim();
        const destination = destinationInput.value.trim();
        const transportModeInput = form.querySelector('input[name="transport"]:checked');
        const distance = Number(distanceInput.value);

        if (!origin || !destination || !transportModeInput || !distance || Number.isNaN(distance)) {
            if (submitButton) {
                submitButton.blur();
            }
            return;
        }

        if (submitButton && typeof UI !== 'undefined' && UI.showLoading) {
            UI.showLoading(submitButton);
        }

        const selectedMode = transportModeInput.value;
        const emission = Calculator.calculateEmission(distance, selectedMode);
        const savings = selectedMode !== 'car'
            ? Calculator.calculateSavings(emission, Calculator.calculateEmission(distance, 'car'))
            : null;

        if (typeof UI !== 'undefined') {
            if (resultsContent) {
                resultsContent.innerHTML = UI.renderResults({
                    origin: origin,
                    destination: destination,
                    distance: distance,
                    emission: emission,
                    mode: selectedMode,
                    savings: savings
                });
            }

            if (comparisonContent) {
                const modesArray = Calculator.calculateAllModes(distance);
                comparisonContent.innerHTML = UI.renderComparison(modesArray, selectedMode);
            }

            UI.showElement('results');
            UI.showElement('comparison');
            UI.scrollToElement('results');
        }

        if (submitButton && typeof UI !== 'undefined' && UI.hideLoading) {
            UI.hideLoading(submitButton);
        }
    });

    const resetButton = document.getElementById('reset-button');
    if (resetButton) {
        resetButton.addEventListener('click', function () {
            window.location.reload();
        });
    }
}
