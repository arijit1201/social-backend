const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema(
{
    username:{
        type: String,
        required: [true, 'Username is missing'],
        minLength: [3, 'Must be larger than 3, got {VALUE}'],
        maxLength: [30, 'Must be smaller than 30, got {VALUE}'],
        unique: true
    },
    email:{
        type: String,
        required: true,
        maxLength: 50,
        unique: true
    },
    password:{
        type: String,
        required: true,
        minLength:6,
        max:20
    },
    profilePicture:{
        type: String,
        default: ""
    },
    coverPicture:{
        type: String,
        default: ""
    },
    followers:{
        type: Array,
        default: []
    },
    followings:{
        type: Array,
        default: []
    },
    isAdmin:{
        type: Boolean,
        default: false
    },
    desc:{
        type: String,
        maxLength: 100
    },
    city:{
        type: String,
        maxLength: 50
    },
    from:{
        type: String,
        maxLength: 50
    },
    relationship:{
        type: Number,
        enum: [1,2,3]
    }
},
{
    timestamps: true
}
)

module.exports = mongoose.model("User", UserSchema)