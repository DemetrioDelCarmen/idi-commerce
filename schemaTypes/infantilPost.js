// culturapost.js
import { HeartFilledIcon } from '@sanity/icons'
const infantilPost = {
    name: "infantilPost",
    title: "Infantil",
    type: "document",
    icon: HeartFilledIcon,
    fields: [
        {
            name: "title",
            title: "Nombre del post",
            type: "string",
            validation: Rule => Rule.required(),
        },
        {
            name: "description",
            title: "Descripción de la revista",
            type: "string",
            validation: Rule => Rule.required(),
        },
        {
            name: "link",
            title: "Enlace para compartir",
            type: "slug",
            options: {
                source: "title",
                maxLenght: 96
            }
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
            name: "attached",
            title: "Revista",
            type: "file",
            options: {
                storeOriginalFilename: true // Mantiene el nombre original del archivo
            }
        },
        {
            name: "videoLink",
            title: "Enlace del video",
            type: "string"
        },
        {
            name: "date",
            title: "Fecha de creación de la revista",
            type: "date"
        },
        {
            name: "content",
            title: "Content",
            type: "array",
            of: [{ type: "block" }]
        },
    ],
};

export default infantilPost;
