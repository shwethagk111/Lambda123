function roundToNearest(num, arr) {
    return arr.reduce((prev, curr) => Math.abs(curr - num) < Math.abs(prev - num) ? curr : prev);
}
function calculateAge(dateOfBirth) {
    const dob = new Date(dateOfBirth);
    const currentDate = new Date();
    const ageInMilliseconds = currentDate - dob;
    const ageInYears = ageInMilliseconds / (1000 * 60 * 60 * 24 * 365);
    return Math.floor(ageInYears);
}

function calculateBMR(gender, weightKg, heightCm, age) {
    let bmr;
    if (gender === 'male') {
        bmr = (9.99 * weightKg) + (6.25 * heightCm) - (4.92 * age) + 5;
    } else if (gender === 'female') {
        bmr = (9.99 * weightKg) + (6.25 * heightCm) - (4.92 * age) - 161;
    } else {
        throw new Error('Invalid gender');
    }
    return bmr;
}

// Function to calculate TDEE
function calculateTDEE(bmr, exerciseIntensity) {
    let activityLevelMultiplier;
    switch (exerciseIntensity) {
        case 'Sedentary':
            activityLevelMultiplier = 1.2;
            break;
        case 'LightlyActive':
            activityLevelMultiplier = 1.375;
            break;
        case 'ModeratelyActive':
            activityLevelMultiplier = 1.55;
            break;
        case 'VeryActive':
            activityLevelMultiplier = 1.725;
            break;
        case 'ExtraActive':
            activityLevelMultiplier = 1.9;
            break;
        default:
            throw new Error('Invalid exercise intensity');
    }
    return bmr * activityLevelMultiplier;
}

module.exports.handler = async (event) => {
    try {
        const requestBody = JSON.parse(event.body);

        const { weight, height, dateOfBirth, gender, exerciseIntensity } = requestBody;

        // Calculate age
        const age = calculateAge(dateOfBirth);

        // Calculate BMR
        const bmr = calculateBMR(gender, weight, height, age);

        // Calculate TDEE
        const tdee = calculateTDEE(bmr, exerciseIntensity);
        const nearestRoundOffTDEE = roundToNearest(tdee, [1400, 1500, 1600, 1700, 1800]);
        const nearestRoundOffBMR = roundToNearest(bmr, [1400, 1500, 1600, 1700, 1800]);

        return {
            statusCode: 200,
            body: JSON.stringify({ bmr, age, tdee, nearestRoundOffTDEE, nearestRoundOffBMR }),
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        };
    } catch (error) {
        console.error('Error calculating:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to calculate.' }),
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        };
    }
};