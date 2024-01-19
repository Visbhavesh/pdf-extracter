import React, { useState } from 'react';
import './Table.css'; // Import your CSS file

const Table = ({ data }) => {
    const itemsPerPage = 10;
    const [currentPage, setCurrentPage] = useState(1);

    const columns = Object.keys(data[0]);

    //   const formatDateTime = (absoluteValue) => {
    //     // Assuming absoluteValue is in milliseconds
    //     const date = new Date(absoluteValue);
    //     const formattedDate = date.toLocaleDateString('en-GB'); // dd-mm-yyyy
    //     const formattedTime = date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }); // 24-hour time

    //     return `${formattedDate} ${formattedTime}`;
    //   };

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    const currentRows = data.slice(startIndex, endIndex);

    const totalPages = Math.ceil(data.length / itemsPerPage);

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };
    const formatDateTime = (columnName, value) => {
        return value;
        // Assuming absoluteValue is in milliseconds
        // if (columnName === 'Pay Cycle End Date' || columnName === 'Pay Cycle Start Date') {
        //     const date = new Date(value);
        //     return date.toLocaleDateString('en-GB'); // dd-mm-yyyy
        // } else if (columnName === 'Time' || columnName === 'Time Out') {
        //     const date = new Date(value);
        //     return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }); // 24-hour time
        // } else if (columnName === 'Timecard Hours (as Time)') {
        //     // Assuming value is in minutes
        //     const hours = Math.floor(value / 60);
        //     const minutes = value % 60;
        //     return `${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
        // } else {
        //     return value;
        // }
    };
    return (
        <div className="table-container">
            <table className="custom-table">
                <thead>
                    <tr>
                        {columns.map((column, index) => (
                            <th key={index}>{column}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {currentRows.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            {/* {columns.map((column, colIndex) => (
                <td key={colIndex}>
                  {column === 'startCycle' || column === 'endCycle'
                    ? formatDateTime(row[column])
                    : row[column]}
                </td>
              ))} */}
                            {columns.map((column, colIndex) => (
                                <td key={colIndex}>
                                    {formatDateTime(column, row[column])}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="pagination-container">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    Previous
                </button>
                <span>{`Page ${currentPage} of ${totalPages}`}</span>
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default Table;
