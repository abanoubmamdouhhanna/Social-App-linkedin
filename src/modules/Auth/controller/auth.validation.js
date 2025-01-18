import joi from 'joi'
import { generalFeilds } from '../../../middlewares/validation.middleware.js'

export const headersSchema= generalFeilds.headers

export const authRegisterSchema= joi.object(
    {
        userName: generalFeilds.userName.required(),

        firstName: generalFeilds.firstName.required(),

        lastName: generalFeilds.lastName.required(),

        email: generalFeilds.email.required(),

        age:generalFeilds.age,

        password:generalFeilds.password.required(),

        cPassword:generalFeilds.cPassword.valid(joi.ref("password")).required(),

        gender:generalFeilds.gender,
        
        phone:generalFeilds.phone.required()
    }
).required()

export const logInSchema=joi.object(
    {
        // userName:generalFeilds.userName.required(),

        // email:generalFeilds.email.required(),

        userNameOrEmail:generalFeilds.userNameOrEmail.required(),

        password:generalFeilds.password.required()
    }
).required()

export const reActivateAccSchema=joi.object(
    {
        email:generalFeilds.email.required()
    }
)

export const forgetPasswordSchema=joi.object(
    {
        email:generalFeilds.email.required()
    }
).required()

export const resetPasswordSchema=joi.object(
    {
        password:generalFeilds.password.required()
    }
).required()

export const resetPasswordOTPSchema=joi.object(
    {
        userEmail:generalFeilds.email.required(),
        password:generalFeilds.password.required(),
        otp:generalFeilds.otp
    }
).required()