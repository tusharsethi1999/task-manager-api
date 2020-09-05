const express = require('express')
const Task = require('../models/task')
//const User = require('../models/user')
const auth = require('../middleware/auth')
const router = new express.Router()

router.post('/tasks', auth,  async (req, res) => {
    const task = new Task({
        ...req.body,
        author: req.user._id
    })

    try {
        await task.save()    
        res.status(201).send(task)
    } catch(e) {
        res.status(500).send(e)
    }
    
    // task.save().then(() => {
    //     res.status(201).send(task)
    // }).catch((e) => {
    //     res.status(400).send(e)
    // })
})

// GET /tasks
router.get('/tasks', auth,async (req, res) => {
    const match = {}
    const sort = {}
    if(req.query.completed) {
        match.completed = req.query.completed === 'true'
        console.log('Checking match completed parameter');
    }
    if(req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }
    try {
        // const tasks = await Task.find({author: req.user._id})
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort,
            }
        }).execPopulate()
        res.send(req.user.tasks)
    } catch(e) {
        res.status(500).send(e)
    }

    // Task.find({}).then((tasks) => {
    //     res.send(tasks)
    // }).catch((e) => {
    //     res.status(500).send()
    // })
})

router.get('/tasks/:id',auth , async (req, res) => {
    const _id = req.params.id
    try {   
        const task = await Task.findOne({ _id, author: req.user._id})

        if(!task) {
            return res.status(404).send()
        }
        res.send(task)
    } catch(e) {
        res.status(500).send(e)
    }
    // Task.findById(_id).then((task) => {
    //     if(!task) {
    //         return res.status(404).send()
    //     }
    //     res.send(task)
    // }).catch((e) => {
    //     res.status(500).send()
    // })
})

router.patch('/tasks/:id', async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidOp = updates.every((update) => allowedUpdates.includes(update))

    if(!isValidOp) {
        res.status(404).send({ error : 'Please enter a valid property' })
    }

    try {
        const task = await Task.findOne({_id: req.params.id, author: req.user._id})
        if(!task) {
            res.status(404).send()
        }
        // const task = await  Task.findById(req.params.id)
        updates.forEach((update) => task[update] = req.body[update])
        await task.save()

        // const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
        //     new: true,
        //     runValidators: true,
        //     useFindAndModify: false,
        // })
        res.send(task)
    } catch(e) {
        res.status(500).send(e)
    }
})

router.delete('/tasks/:id', auth,async (req, res) => {
    try {
        // const task = Task.findByIdAndDelete(req.params.id)
        const task = await Task.findOneAndDelete({_id: req.params.id, author: req.user._id})
        if(!task) {
            res.status(404).send()
        }
        res.send(task)
    } catch(e) {
        res.status(500).send(e)
    }
})

module.exports = router