export const faitPoints = {
    name: "faitPoints",
    title: "Puntos de Fe",
    type: "document",
    fields: [
        {
            name: "title",
            title: "Título",
            type: "string"
        },
        {
            name: "poinNumber",
            title: "Número",
            type: "number"
        },
        {
            name: "content",
            title: "Contenido",
            type: "array",
            of: [{ type: "block" }]
        },
    ]
}