import joi from 'joi'
import { generalFeilds } from '../../../middlewares/validation.middleware.js'

export const headersSchema= generalFeilds.headers

export const authRegisterSchema= joi.object(
    {
        userName: generalFeilds.userName.required().trim(),

        firstName: generalFeilds.firstName.required().trim(),

        lastName: generalFeilds.lastName.required().trim(),

        email: generalFeilds.email.required().lowercase().trim(),

        age:generalFeilds.age,

        password:generalFeilds.password.required(),

        cPassword:generalFeilds.cPassword.valid(joi.ref("password")).required() .messages({
            'any.only': 'Confirm password must match password',
            'any.required': 'Confirm password is required'
        }),

        gender:generalFeilds.gender,
        
        phone:generalFeilds.phone.required()
    }
).required()

export const logInSchema=joi.object(
    {
       
        userNameOrEmail:generalFeilds.userNameOrEmail.required(),

        password:generalFeilds.password.required(),

        rememberMe: joi.boolean().optional().default(false)
        
    }
).required()

export const reActivateAccSchema=joi.object(
    {
        email:generalFeilds.email.required().trim().lowercase()
    }
).required()

export const forgetPasswordSchema=joi.object(
    {
        email:generalFeilds.email.required().trim().lowercase()
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