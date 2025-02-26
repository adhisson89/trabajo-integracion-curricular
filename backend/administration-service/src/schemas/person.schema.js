const mongoose = require("mongoose");
const { z } = require("zod");

// Validador de ObjectId con chequeo para valores opcionales
const objectIdValidator = z
    .string()
    .refine((id) => !id || mongoose.Types.ObjectId.isValid(id), {
        message: "El ID debe ser un ObjectId válido de MongoDB",
    });

const createPersonSchema = z.object({
    identification: z
        .string({
            required_error: "La identificación es requerida"
        })
        .min(9, "La identificación no puede estar vacía")
        .max(32, "La identificación es demasiado larga"),
    
    name: z
        .string({
            required_error: "El nombre es requerido"
        })
        .min(3, "El nombre debe tener al menos 3 caracteres")
        .max(64, "El nombre es demasiado largo"),
    
    surename: z
        .string({
            required_error: "El apellido es requerido"
        })
        .min(3, "El apellido debe tener al menos 3 caracteres")
        .max(64, "El apellido es demasiado largo"),
    
    role: z
        .enum(["ESTUDIANTE", "PROFESOR", "ADMINISTRATIVO", "COLABORADOR", "INDIVIDUAL", "GRUPAL"])
        .optional()
        .nullable(),

    photo_image_id: objectIdValidator.optional().nullable(),

    photo_vector_id: objectIdValidator.optional().nullable(),
     
    other_data: z
        .array(
            z.object({
                key: z.string({
                    required_error: "La clave del dato es requerida"
                }),
                value: z.any({
                    required_error: "El valor del dato es requerido"
                })
            })
        )
        .optional()
        .nullable()
});

const updatePersonSchema = z.object({
    identification: z
        .string()
        .min(9, "La identificación no puede estar vacía")
        .max(32, "La identificación es demasiado larga")
        .optional()
        .nullable(),
    
    name: z
        .string()
        .min(3, "El nombre debe tener al menos 3 caracteres")
        .max(64, "El nombre es demasiado largo")
        .optional()
        .nullable(),
    
    surename: z
        .string()
        .min(3, "El apellido debe tener al menos 3 caracteres")
        .max(64, "El apellido es demasiado largo")
        .optional()
        .nullable(),
    
    role: z
        .enum(["ESTUDIANTE", "PROFESOR", "ADMINISTRATIVO", "COLABORADOR", "INDIVIDUAL", "GRUPAL"])
        .optional()
        .nullable(),
    
    photo_image_id: objectIdValidator.optional().nullable(),
    
    photo_vector_id: objectIdValidator.optional().nullable(),
    
    other_data: z
        .array(
            z.object({
                key: z.string({
                    required_error: "La clave de otro dato es requerida"
                }),
                value: z.any({
                    required_error: "El valor de otro dato es requerido"
                })
            })
        )
        .optional()
        .nullable()
});

module.exports = {
    createPersonSchema,
    updatePersonSchema
};
