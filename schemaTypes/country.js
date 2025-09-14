import { EarthAmericasIcon } from '@sanity/icons'
const country = {
    name: "country",
    title: "Países",
    type: "document",
    icon: EarthAmericasIcon,
    fields: [
        {
            name: "name",
            title: "Nombre del País",
            type: "string",
        },
        {
            name: "image",
            title: "Imagen",
            type: "image",
            options: {
                hotspot: true
            },
            fields: [
                {
                    name: "alt",
                    title: "Alt",
                    type: "string",
                    // Automatically set the alt text to the title using initialValue
                    initialValue: (document, context) => document.title || "Default Alt Text"
                }
            ]
        },
        {
            name: "states",
            title: "Estados",
            type: "array",
            of: [{ type: "string" }],
        },
    ],
};

export default country;