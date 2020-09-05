const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./task')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    }, 
    email : {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if(!validator.isEmail(value)) {
                throw new Error('Email is not valid!')
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(val) {
            if(val.toLowerCase().includes('password')) {
                throw new Error('Password cannot be "password"')
            }
        }
    },
    age : {
        type: Number,
        default: 0,
        validate(value) { // custom validation
            if(value < 0) {
                throw new Error('Age must be a positive nubmer!')
            }
        }
    },
    tokens : [{
        token : {
            type: String,
            required: true,
        }
    }],
    avatar: {
        type: Buffer,
    }
}, {
    timestamps: true
})

userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'author'
});

// userSchema.methods.getPublicProfile = async function() {
userSchema.methods.toJSON = function() {
    const user = this
    const userObject = user.toObject()
    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar
    return userObject
}

userSchema.methods.generateAuthToken = async function() {
    const token = jwt.sign({ _id : this._id.toString() }, process.env.JWT_SECRET)
    this.tokens = this.tokens.concat({token})
    await this.save()
    return token;
}

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({
        email,
    })
    if(!user) {
        throw new Error('Unable to Login!')
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if(!isMatch) {
        throw new Error('Unable to Login!')
    }
    return user;
}

// Hash the plain text password before saving
userSchema.pre('save', async function (next)  {
    if(this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 8)
    }  
    next()
})

// Delete user tasks when user is removed
userSchema.pre('remove', async function (next) {

    await Task.deleteMany({author: this._id})
    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User