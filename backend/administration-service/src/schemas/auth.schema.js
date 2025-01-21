const z = require('zod');

const registerSchema = z.object({
    name: z.string({
        required_error: "Nombre es requerido"
    }).min(3).max(64),
    surename: z.string({
        required_error: "Apellido es requerido"
    }).min(3).max(64),
    email: z.string({
        required_error: "Email es requerido"
    }).email(),
    password: z.string({
        required_error: "Password es requerido"
    }).min(8).max(64),
});

const loginSchema = z.object({
    email: z.string({
        required_error: "Email es requerido"
    }).email(),
    password: z.string({
        required_error: "Password es requerido"
    }),
})


module.exports = {
    registerSchema,
    loginSchema
}
