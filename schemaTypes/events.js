import StateSelector from "../components/StateSelector";
import { CalendarIcon } from '@sanity/icons'


const event = {
    name: "event",
    title: "Eventos",
    type: "document",
    icon: CalendarIcon,
    fields: [
        {
            name: "title",
            title: "Nombre del evento",
            type: "string",
        },
        {
            name: "image",
            title: "Imagen de portada",
            type: "image",
            options: {
                hotspot: true
            },
            fields: [
                {
                    name: "alt",
                    title: "Alt",
                    type: "string"
                }
            ]
        },
        {
            name: "shortDescription",
            title: "Descripción breve",
            type: "string",
        },
        {
            name: "country",
            title: "País",
            type: "reference",
            to: [{ type: "country" }],
        },
        {
            name: "state",
            title: "Estado",
            type: "string",
            components: {
                input: StateSelector,
            },
        },
        {
            name: "eventDate",
            title: "Fecha del evento",
            type: "date",
        },
        {
            name: "content",
            title: "Content",
            type: "array",
            of: [{ type: "block" }]
        }
    ],
};

export default event;