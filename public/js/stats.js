// Fetch all workout data from back-end
fetch("/api/workouts/range")
  .then(response => {
    if (!response.ok) {
      throw new Error("Network response was not ok " + response.statusText);
    }
    return response.json();
  })
  .then(data => {
    console.log(data); // Log the data to check its structure
    populateChart(data);
  })
  .catch(error => {
    console.error("There was a problem with the fetch operation:", error);
  });

// Function to generate color palette for charts
function generatePalette() {
  return [
    "#003f5c",
    "#2f4b7c",
    "#665191",
    "#a05195",
    "#d45087",
    "#f95d6a",
    "#ff7c43",
    "ffa600",
    "#003f5c",
    "#2f4b7c",
    "#665191",
    "#a05195",
    "#d45087",
    "#f95d6a",
    "#ff7c43",
    "ffa600"
  ];
}

// Function for populating charts
function populateChart(data) {
  if (!data || data.length === 0) {
    console.error("No workout data available.");
    return;
  }

  let durations = duration(data);
  let pounds = calculateTotalWeight(data);
  let workouts = workoutNames(data);
  const colors = generatePalette();

  // Create new line chart for workout duration
  let line = document.querySelector("#canvas").getContext("2d");
  let lineChart = new Chart(line, {
    type: "line",
    data: {
      labels: [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
      ],
      datasets: [
        {
          label: "Workout Duration In Minutes",
          backgroundColor: "red",
          borderColor: "red",
          data: durations,
          fill: false
        }
      ]
    },
    options: {
      responsive: true,
      title: {
        display: true,
        text: "Workout Duration Over the Week"
      },
      scales: {
        xAxes: [{
          display: true,
          scaleLabel: {
            display: true,
            labelString: 'Days of the Week'
          }
        }],
        yAxes: [{
          display: true,
          scaleLabel: {
            display: true,
            labelString: 'Duration (minutes)'
          }
        }]
      }
    }
  });

  // Create bar chart for total weight lifted
  let bar = document.querySelector("#canvas2").getContext("2d");
  let barChart = new Chart(bar, {
    type: "bar",
    data: {
      labels: [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ],
      datasets: [
        {
          label: "Total Weight Lifted (lbs)",
          data: pounds,
          backgroundColor: colors,
          borderColor: colors,
          borderWidth: 1
        }
      ]
    },
    options: {
      title: {
        display: true,
        text: "Total Weight Lifted Over the Week"
      },
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      }
    }
  });

  // Create pie chart for exercises performed
  let pie = document.querySelector("#canvas3").getContext("2d");
  let pieChart = new Chart(pie, {
    type: "pie",
    data: {
      labels: workouts,
      datasets: [{
        label: "Exercises Performed",
        backgroundColor: colors,
        data: durations
      }]
    },
    options: {
      title: {
        display: true,
        text: "Exercises Performed Distribution"
      }
    }
  });

  // Create doughnut chart for exercises performed by weight
  let donut = document.querySelector("#canvas4").getContext("2d");
  let donutChart = new Chart(donut, {
    type: "doughnut",
    data: {
      labels: workouts,
      datasets: [{
        label: "Exercises Performed by Weight",
        backgroundColor: colors,
        data: pounds
      }]
    },
    options: {
      title: {
        display: true,
        text: "Exercises Performed by Weight Distribution"
      }
    }
  });
}

// Function to get workout duration
function duration(data) {
  let durations = [];
  data.forEach(workout => {
    workout.exercises.forEach(exercise => {
      durations.push(exercise.duration);
 });
  });
  return durations;
}

// Function to calculate total weight lifted
function calculateTotalWeight(data) {
  let totalWeights = [];
  data.forEach(workout => {
    let total = 0;
    workout.exercises.forEach(exercise => {
      total += exercise.weight || 0; // Add weight if it exists
    });
    totalWeights.push(total);
  });
  return totalWeights;
}

// Function to get workout names
function workoutNames(data) {
  let names = [];
  data.forEach(workout => {
    workout.exercises.forEach(exercise => {
      if (!names.includes(exercise.name)) {
        names.push(exercise.name);
      }
    });
  });
  return names;
}