"use client";

import React, { useEffect, useState } from "react";
import { useClient } from "sanity";
import { Box, Select } from "@sanity/ui";
import { set, unset } from "sanity";

const CategoryBookSelector = (props) => {
    const { onChange, value, elementProps } = props;
    const [categories, setCategories] = useState([]);
    const client = useClient();

    useEffect(() => {
        const fetchData = async () => {
            const result = await client.fetch(`*[_type == "booksCategories"]{title}`);
            setCategories(result.map(category => category.name));
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
                <option value="">Seleccionar categoría</option>
                {categories.map((category) => (
                    <option key={category} value={category}>
                        {category}
                    </option>
                ))}
            </Select>
        </Box>
    );
};

export default CategoryBookSelector;
