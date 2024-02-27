const courses = [];

function calculateSGPA() {
    const courseName = document.getElementById('courseName').value;
    const credits = parseFloat(document.getElementById('credits').value);
    const ciaMarks1 = parseFloat(document.getElementById('ciaMarks1').value);
    const ciaMarks2 = parseFloat(document.getElementById('ciaMarks2').value);
    const eteMarks = parseFloat(document.getElementById('eteMarks').value);
    const eteMarksObj = parseFloat(document.getElementById('eteMarksObj').value);

    if (!courseName || isNaN(credits) || isNaN(ciaMarks1) || isNaN(ciaMarks2) || isNaN(eteMarks) || isNaN(eteMarksObj)) {
        alert('Please fill in all fields with valid numeric values.');
        return;
    }

    const totalCiaMarks = ciaMarks1 + ciaMarks2;
    const totalMarks = totalCiaMarks + eteMarks + eteMarksObj;
    const { grade, gradePoints, creditPoints } = calculateGradePoints(totalMarks, credits);

    courses.push({
        courseName,
        credits,
        grade,
        gradePoints,
        creditPoints
    });

    // Clear the form
    document.getElementById('courseName').value = '';
    document.getElementById('credits').value = '';
    document.getElementById('ciaMarks1').value = '';
    document.getElementById('ciaMarks2').value = '';
    document.getElementById('eteMarks').value = '';
    document.getElementById('eteMarksObj').value = '';

    updateCourseList();
    calculateOverallSGPA();
}
function calculateGradePoints(totalMarks, credits) {
    let grade = '';
    let gradePoints = 0;
    let creditPoints = 0;

    // Calculate Grade Points based on the new formula
    gradePoints = (totalMarks / 100) * 10;

    // Determine the corresponding grade based on the given Grade Points
    if (gradePoints >= 9.10) {
        grade = 'O';
    } else if (gradePoints >= 8.10) {
        grade = 'A+';
    } else if (gradePoints >= 7.10) {
        grade = 'A';
    } else if (gradePoints >= 6.10) {
        grade = 'B+';
    } else if (gradePoints >= 5.10) {
        grade = 'B';
    } else if (gradePoints >= 4.50) {
        grade = 'C';
    } else if (gradePoints >= 4.00) {
        grade = 'P';
    } else {
        grade = 'F';
    }

    // Calculate Credit Points by multiplying Grade Points with Credits
    creditPoints = gradePoints * credits;

    return { grade, gradePoints, creditPoints };
}

function updateCourseList() {
    const courseList = document.getElementById('courseList');
    courseList.innerHTML = '';

    courses.forEach((course, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = `${course.courseName} - ${course.credits} credits `;
        
        // Add Remove button
        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.addEventListener('click', () => removeCourse(index));
        listItem.appendChild(removeButton);

        // Add Edit button
        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.addEventListener('click', () => editCourse(index));
        listItem.appendChild(editButton);

        courseList.appendChild(listItem);
    });
}

function removeCourse(index) {
    courses.splice(index, 1);
    updateCourseList();
    calculateOverallSGPA();
}

function editCourse(index) {
    const course = courses[index];
    // Set the form values for editing
    document.getElementById('courseName').value = course.courseName;
    document.getElementById('credits').value = course.credits;

    // Remove the edited course from the list
    removeCourse(index);
}

function calculateOverallSGPA() {
    const totalCredits = courses.reduce((sum, course) => sum + course.credits, 0);
    const totalWeightedGradePoints = courses.reduce((sum, course) => sum + (course.gradePoints * course.credits), 0);
    const totalCreditPoints = courses.reduce((sum, course) => sum + course.creditPoints, 0);

    const overallSGPA = totalWeightedGradePoints / totalCredits || 0;

    document.getElementById('overallSGPA').textContent = overallSGPA.toFixed(2);

    // Display results in a table
    const resultTable = document.getElementById('resultTable').getElementsByTagName('tbody')[0];
    resultTable.innerHTML = '';

    courses.forEach(course => {
        const row = resultTable.insertRow();
        row.insertCell(0).textContent = course.courseName;
        row.insertCell(1).textContent = course.credits;
        row.insertCell(2).textContent = course.grade;
        row.insertCell(3).textContent = course.gradePoints.toFixed(2);
        row.insertCell(4).textContent = course.creditPoints.toFixed(2);
    });
}
