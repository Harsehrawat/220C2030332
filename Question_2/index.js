const express = require("express");
require("dotenv").config();

const app = express();
app.use(express.json());


let numberWindow = [];

// In-memory variable i had to use becasue i am unable to getting invalid authorization whenever trying to fetch any response from the /test server even i had Authorization and token all correct and at right place
const IN_MEMORY_NUMBERS = new Map([
    ["p", [2, 3, 5, 7, 11, 13, 17, 19, 23, 29]], // for prime
    ["f", [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]], // Fibonacci 
    ["e", [2, 4, 6, 8, 10, 12, 14, 16, 18, 20]], // numbers
    ["r", [10, 23, 45, 67, 89, 12, 34, 56, 78, 90]] // Rand
]);

async function fetchNumbers(numberId) {
    return IN_MEMORY_NUMBERS.get(numberId) || null;
}

app.get("/numbers/:numberId", async (req, res) => {
    const { numberId } = req.params;

    // see if input numberId is stored in map or not
    if (!IN_MEMORY_NUMBERS.has(numberId)) {
        return res.status(404).json({ error: "No such numberId present" });
    }

    const prevState = [...numberWindow]; 

    // fn to fetch new numbers from valid numberId input
    const newNumbers = await fetchNumbers(numberId);

    // Add only unique numbers
    newNumbers.forEach(num => {
        if (!numberWindow.includes(num)) {
            numberWindow.push(num);
        }
    });

    // keep remiving old ones if window>windoWSize
    while (numberWindow.length > process.env.WINDOW_SIZE) {
        numberWindow.shift(); 
    }

    // Calculate average
    const avg = numberWindow.length > 0 ? (numberWindow.reduce((sum, num) => sum + num,0)/ numberWindow.length).toFixed(2)
        : 0; // else return 0 

    res.json({
        windowPrevState: prevState,
        windowCurrState: numberWindow,
        numbers: newNumbers,
        avg: parseFloat(avg)
    });
});

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});