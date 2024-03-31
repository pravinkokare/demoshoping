// index.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

// MongoDB Connection
mongoose.connect('mongodb://127.0.0.1:27017/crudOperation');

// Define Task Schema
const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: Boolean, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Task = mongoose.model('Task', taskSchema);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Routes
app.get('/tasks', (req, res) => {
  Task.find().then( tasks => {
   
      res.json({ status: true, tasks });
    }
  ).catch(err=>{res.status(500).json({ status: false, message: err.message })})
});
//create data
app.post('/tasks', (req, res) => {
  const task = new Task({
    title: req.body.title,
    description: req.body.description,
    status: true, // Set status to true by default
  });

  task.save().then((err, newTask) => {
   
      res.status(201).json({ status: true, newTask });
    }
  ).catch(err=> res.status(500).json({ status: false, message: err.message }))
});
//read data
app.get('/tasks/:id', (req, res) => {
  Task.findById(req.params.id).then( task => {
  if (!task) {
      return res.status(404).json({ status: false, message: 'Task not found' });
    } 
    else{
      res.json({ status: true, task });
    }
    
  }).catch(err=>res.status(500).json({ status: false, message: err.message }))
});
//update data
app.put('/tasks/:id', (req, res) => {
  Task.findById(req.params.id).then( task => {
    if (!task) {
      return  res.status(404).json({ status: false, message: 'Task not found' });
     }
   
      if (req.body.title != null) {
        task.title = req.body.title;
      }
      if (req.body.description != null) {
        task.description = req.body.description;
      }
      if (req.body.status != null) {
        task.status = req.body.status;
      }
      task.updatedAt = Date.now();

      task.save().then(updatedTask => {
       
      
          res.json({ status: true, updatedTask });
        
      }).catch(err=> res.status(500).json({ status: false, message: err.message }))
    
  });
});
//delete data
app.delete('/tasks/:id', (req, res) => {
    Task.findOneAndDelete({ _id: req.params.id })
    .then(task => {
      if (!task) {
       return  res.status(404).json({ status: false, message: 'Task not found' });
      }
      res.json({ status: true, message: 'Task deleted' });
    })
    .catch(err => {
      res.status(500).json({ status: false, error: err.message });
    });
  

   
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
