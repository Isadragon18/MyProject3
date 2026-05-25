const express = require('express');
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
    const { std_id, name, age } = req.body;
    const newStudent = { std_id, name, age };
    database.push(newStudent);
    res.status(201).json(newStudent);
});
// Route to update a student by std_id
app.patch('/update/:std_id', (req, res) => {
    const std_id = parseInt(req.params.std_id);
    const { name, age } = req.body;
    const student = database.find(s => s.std_id === std_id);
    if (!student) {
        return res.status(404).json({ error: 'Student not found' });
    }
    student.name = name;
    student.age = age;
    res.status(200).json(student);
});
// Route to delete a student by std_id
app.delete('/delete/:std_id', (req, res) => {
    const std_id = parseInt(req.params.std_id);
    const studentIndex = database.findIndex(s => s.std_id === std_id);
    if (studentIndex === -1) {
        return res.status(404).json({ error: 'Student not found' });
    }
    database.splice(studentIndex, 1);
    res.status(200).json({ message: 'Student deleted successfully' });
});

app.listen(PORT, () => {
    console.log(`Your Sever is running on port ${PORT}`);
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: `Something went wrong! ${err.message}` });
});