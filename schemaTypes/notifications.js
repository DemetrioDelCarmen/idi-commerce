// localities.js
import { BillIcon } from '@sanity/icons'
const notifications = {
    name: "notifications",
    title: "Notificaciones Generales",
    type: "document",
    icon: BillIcon,
    fields: [
        {
            name: "name",
            title: "Nombre de la Localidad (Iglesia)",
            type: "string",
            validation: Rule => Rule.required(),
        },
        {
            name: "description",
            title: "Descripción de la notificación",
            type: "string",
            validation: Rule => Rule.required(),
        },
        {
            name: "attached",
            title: "Acuse",
            type: "file",
            fields: [
                {
                    name: 'description',
                    type: 'string',
                    title: 'Descripción'
                },
            ],
            validation: Rule => Rule.required(),
        },
        {
            name: "date",
            title: "Fecha",
            type: "date"
        },

    ],
};

export default notifications;
