"use client";

import React, { useEffect, useState } from "react";
import { useClient } from "sanity";
import { Box, Select } from "@sanity/ui";
import { set, unset } from "sanity";

const GlobalDepartmentSelector = (props) => {
    const { onChange, value, elementProps } = props;
    const [departments, setDepartments] = useState([]);
    const client = useClient();

    useEffect(() => {
        const fetchData = async () => {
            const result = await client.fetch(`*[_type == "globalDepartment"]{name}`);
            setDepartments(result.map(dept => dept.name));
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
                <option value="">Selecciona un departamento</option>
                {departments.map((dept) => (
                    <option key={dept} value={dept}>
                        {dept}
                    </option>
                ))}
            </Select>
        </Box>
    );
};

export default GlobalDepartmentSelector;
