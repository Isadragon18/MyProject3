const express = require('express');
//import express from 'express';
const app = express();
const PORT = process.env.PORT || 5001;


// Middleware to parse JSON bodies
app.use(express.json());
// Middleware to log incoming requests
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});
// Simulated database
const database = [
    { std_id: 1, name: 'John Doe', age: 20 },
    { std_id: 2, name: 'Jane Smith', age: 22 },
    { std_id: 3, name: 'Alice Johnson', age: 19 },
    { std_id: 4, name: 'Bob Brown', age: 21 }
];
// Route to get all students
app.get('/', (req, res) => {
    res.status(200).json(database);
});
// Route to add a new student
app.post('/new', (req, res) => {
    const { std_id, name, age } = req.query;
    const newStudent = { std_id: parseInt(std_id), name, age: parseInt(age) };
    if (database.some(student => student.std_id === newStudent.std_id)) {
        return res.status(400).json({ error: 'Student with this ID already exists' });
    }
    database.push(newStudent);
    res.status(201).json({ msg: 'Student added successfully', student: {std_id: newStudent.std_id, name: newStudent.name, age: newStudent.age} });
});
// Route to update a student by std_id
app.patch('/update/:std_id', (req, res) => {
    const {std_id} = parseInt(req.params.std_id);
    const name = req.query.name;
    const age = parseInt(req.query.age);
    //Finds The Student with the given std_id in the database
    const student = database.find(s => s.std_id === std_id);
    if (!student) {
        return res.status(404).json({ error: 'Student not found' });
    }
    student.name = name;
    student.age = age;
    res.status(200).json({msg: 'Student updated successfully', student: {std_id: student.std_id, name: student.name, age: student.age}});
});
// Route to delete a student by std_id
app.delete('/delete/:std_id', (req, res) => {
    const std_id = parseInt(req.params.std_id);
    //Finds The Index of the Student with the given std_id in the database
    const studentIndex = database.findIndex(s => s.std_id === std_id);
    if (studentIndex === -1) {
        return res.status(404).json({ error: 'Student not found' });
    }
    //Removes the student from the database using splice and returns the deleted student's information
    const deletedStudent = database.splice(studentIndex, 1)[0];
    res.status(200).json({ msg: 'Student deleted successfully', student : {std_id: deletedStudent.std_id, name: deletedStudent.name, age: deletedStudent.age} });
});

app.listen(PORT, () => {

    console.log(`Your Sever is running on port ${PORT}`);
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: `Something went wrong! ${err.message}` });
});