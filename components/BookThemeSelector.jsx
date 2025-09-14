"use client";

import React, { useEffect, useState } from "react";
import { useClient } from "sanity";
import { Box, Select } from "@sanity/ui";
import { set, unset } from "sanity";

const BookThemeSelector = (props) => {
    const { onChange, value, elementProps } = props;
    const [books, setBooks] = useState([]);
    const client = useClient();

    useEffect(() => {
        const fetchData = async () => {
            const result = await client.fetch(`*[_type == "book"]`);
            setBooks(result.map(book => book));
        };
        fetchData();
    }, [client]);

    const handleChange = (event) => {
        const selectedValue = event.target.value;
        onChange(selectedValue ? set(selectedValue) : unset());
    };

    return (
        <Box>
            <Select
                {...elementProps}
                value={value}
                onChange={handleChange}
            >
                <option value="">Selecciona libro</option>
                {books.map((book) => (
                    <option key={book.id} value={book._id}>
                        {book.title}
                    </option>
                ))}
            </Select>
        </Box>
    );
};

export default BookThemeSelector;
