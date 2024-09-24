import React, { memo } from 'react';

const InputSelect = ({ changeValue, value, options }) => {
    return (
        <select value={value} onChange={e => changeValue(e.target.value)} className="w-full p-2 text-sm border border-gray-300 rounded">
            <option value="">Select an option</option>
            {options.map(option => (
                <option key={option.id} value={option.value}>
                    {option.text}
                </option>
            ))}
        </select>
    );
};

export default memo(InputSelect);
