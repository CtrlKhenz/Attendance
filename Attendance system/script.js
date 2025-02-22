document.addEventListener("DOMContentLoaded", () => {
    loadAttendance();

    // Allow Enter key to submit attendance
    document.getElementById("nameInput").addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            event.preventDefault(); // Prevents accidental form submission
            markAttendance();
        }
    });

    document.getElementById("dateInput").addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            markAttendance();
        }
    });
});

// ✅ Mark Attendance for Entered Date
function markAttendance() {
    let nameInput = document.getElementById("nameInput");
    let dateInput = document.getElementById("dateInput");
    let name = nameInput.value.trim();
    let date = dateInput.value.trim();

    if (name === "" || date === "") {
        alert("Please enter a name and date.");
        return;
    }

    let attendanceData = JSON.parse(localStorage.getItem("attendance")) || {};

    if (!attendanceData[date]) {
        attendanceData[date] = [];
    }

    if (attendanceData[date].some(entry => entry.name === name)) {
        alert("This person is already marked present for this date.");
        return;
    }

    attendanceData[date].push({ name: name, status: "Present" });
    localStorage.setItem("attendance", JSON.stringify(attendanceData));

    updateTable();
    nameInput.value = "";
}

// ✅ Load Attendance for Entered Date
function loadAttendance() {
    updateTable();
}

// ✅ Update Table Based on Entered Date
function updateTable() {
    let table = document.getElementById("attendanceList");
    let dateInput = document.getElementById("dateInput");
    let selectedDate = dateInput.value.trim();

    table.innerHTML = "";

    if (!selectedDate) return;

    let attendanceData = JSON.parse(localStorage.getItem("attendance")) || {};
    let attendanceList = attendanceData[selectedDate] || [];

    attendanceList.forEach((entry, index) => {
        let newRow = table.insertRow();
        let dateCell = newRow.insertCell(0);
        let nameCell = newRow.insertCell(1);
        let statusCell = newRow.insertCell(2);
        let deleteCell = newRow.insertCell(3); // ✅ Delete button column

        dateCell.innerText = selectedDate;
        nameCell.innerText = entry.name;
        statusCell.innerText = entry.status;

        let deleteButton = document.createElement("button");
        deleteButton.innerText = "Delete";
        deleteButton.style.backgroundColor = "red";
        deleteButton.style.color = "white";
        deleteButton.style.border = "none";
        deleteButton.style.padding = "5px 10px";
        deleteButton.style.cursor = "pointer";

        deleteButton.onclick = function () {
            deleteEntry(selectedDate, index);
        };

        deleteCell.appendChild(deleteButton);
    });
}

// ✅ Delete a specific entry
function deleteEntry(date, index) {
    let attendanceData = JSON.parse(localStorage.getItem("attendance")) || {};

    if (attendanceData[date]) {
        attendanceData[date].splice(index, 1);

        // Remove the date entry if no more names are present
        if (attendanceData[date].length === 0) {
            delete attendanceData[date];
        }

        localStorage.setItem("attendance", JSON.stringify(attendanceData));
        updateTable();
    }
}

// ✅ Export Attendance Data for Entered Date as TXT
function exportTextFile() {
    let attendanceData = JSON.parse(localStorage.getItem("attendance")) || {};
    let selectedDate = document.getElementById("dateInput").value.trim();

    if (!attendanceData[selectedDate] || attendanceData[selectedDate].length === 0) {
        alert("No attendance records for this date.");
        return;
    }

    let textContent = `Attendance for ${selectedDate}\n\n` + 
        attendanceData[selectedDate].map(e => `- ${e.name}: ${e.status}`).join("\n");

    let blob = new Blob([textContent], { type: "text/plain" });
    let link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `attendance_${selectedDate}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// ✅ Clear All Attendance Records
function clearAttendance() {
    if (confirm("Are you sure you want to clear all records?")) {
        localStorage.removeItem("attendance");
        updateTable();
    }
}

// ✅ Reset Input Fields
function resetForm() {
    document.getElementById("nameInput").value = "";
    document.getElementById("dateInput").value = "";
    updateTable();
}
