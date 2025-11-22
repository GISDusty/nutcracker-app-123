

const BASE_URL = 'http://localhost:3000/api/leaderboard';

async function testLeaderboard() {
    console.log('Starting Leaderboard Test...');

    // 1. Submit scores with different ages
    console.log('\n1. Submitting scores...');
    const scores = [
        { initials: 'KID', score: 40, age: 5 },
        { initials: 'JUN', score: 45, age: 7 },
        { initials: 'MID', score: 42, age: 9 },
        { initials: 'SEN', score: 48, age: 12 },
        { initials: 'OLD', score: 35, age: 15 }
    ];

    for (const entry of scores) {
        try {
            const response = await fetch(BASE_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(entry)
            });
            const data = await response.json();
            if (response.ok) {
                console.log(`Submitted: ${entry.initials} (Age: ${entry.age}) - Success`);
            } else {
                console.error(`Failed to submit ${entry.initials}:`, data);
            }
        } catch (error) {
            console.error(`Error submitting ${entry.initials}:`, error.message);
        }
    }

    // 2. Fetch leaderboards for each age group
    console.log('\n2. Fetching leaderboards...');
    const groups = ['all', '5_under', '6_7', '8_10', '11_up'];

    for (const group of groups) {
        try {
            const url = group === 'all' ? BASE_URL : `${BASE_URL}?ageGroup=${group}`;
            const response = await fetch(url);
            const data = await response.json();

            console.log(`\n--- Group: ${group} ---`);
            if (Array.isArray(data)) {
                if (data.length === 0) {
                    console.log('No scores found.');
                } else {
                    data.forEach((entry, index) => {
                        console.log(`${index + 1}. ${entry.initials} - Score: ${entry.score}, Age: ${entry.age}`);
                    });
                }
            } else {
                console.error('Invalid response format:', data);
            }
        } catch (error) {
            console.error(`Error fetching group ${group}:`, error.message);
        }
    }
}

testLeaderboard();
