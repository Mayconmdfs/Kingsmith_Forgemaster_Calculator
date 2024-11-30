function generatePossibilityMatrix(num_trials) {
    const num_rows = 2 ** num_trials;
    const matrix = Array.from({ length: num_rows }, () => Array(num_trials).fill(0));
    
    for (let row = 0; row < num_rows; row++) {
        const binaryRep = row.toString(2).padStart(num_trials, '0');
        for (let col = 0; col < num_trials; col++) {
            matrix[row][col] = parseInt(binaryRep[col]);
        }
    }
    return matrix;
}

function calculateProbabilities(matrix, success_probabilities, max_successes = 4) {
    const probabilities = Array(max_successes + 1).fill(0);
    
    matrix.forEach(row => {
        let num_successes = row.reduce((a, b) => a + b, 0);
        let probability = row.reduce((prod, value, index) => 
            prod * (value ? success_probabilities[index] : (1 - success_probabilities[index])), 1);
        
        if (num_successes <= max_successes) {
            probabilities[num_successes] += probability;
        } else {
            probabilities[max_successes] += probability;
        }
    });
    
    return probabilities;
}

function calculateExpectedOutput(probabilities, items_done, max_item_successes) {
    return probabilities.map((prob, i) => prob * items_done);
}

function arrayAddScalar(array, scalar) {
    return array.map(a => a + scalar);
}

function arrayDivide(array1, array2) {
    return array1.map((a, i) => a / array2[i]);
}

function generateStars(starCount) {
    return '★'.repeat(starCount);
}

function calculateStats() {
    const numTrials = parseInt(document.getElementById('num_trials').value);
    const blacksmithLevels = [];
    for (let i = 0; i < numTrials; i++) {
        blacksmithLevels.push(parseInt(document.getElementById(`blacksmith_level_${i}`).value));
    }
    const difficulty = parseInt(document.getElementById('difficulty').value);
    const maxItemSuccesses = 4; // The current max number of successes is 4
    const total_chance = arrayAddScalar(blacksmithLevels, difficulty);
    const success_probabilities = arrayDivide(blacksmithLevels, total_chance);
    const probability_matrix = generatePossibilityMatrix(numTrials);
    const probabilities = calculateProbabilities(probability_matrix, success_probabilities, maxItemSuccesses);
    
    let resultHtml = "<h3>Enhancement chances:</h3>";
    probabilities.forEach((prob, i) => {
        const stars = generateStars(i + 1);
        resultHtml += `<p>${stars}: ${(prob * 100).toFixed(2)}%</p>`;
    });
    
    resultHtml += "<h3>Average Items for rarity:</h3>";
    probabilities.forEach((prob, i) => {
        const stars = generateStars(i + 1);
        const expectedItems = prob > 0 ? (1 / prob).toFixed(2) : "N/A";
        resultHtml += `<p>${stars}: ${expectedItems}</p>`;
    });

    // Calcular a quantidade total esperada de aprimoramentos por 100 itens produzidos
    const totalEnhancementsPer100Items = probabilities.reduce((sum, prob, i) => sum + (100 * prob * (i)), 0);
    resultHtml += `<h3>Enhancements per 100 items:</h3>`;
    resultHtml += `<p>${totalEnhancementsPer100Items.toFixed(2)}</p>`;

    document.getElementById('result').innerHTML = resultHtml;
}