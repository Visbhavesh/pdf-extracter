import React, { useState } from 'react';
import axios from 'axios';
import Table from './Table';

function PDFTextExtractor() {
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [extractedTexts, setExtractedTexts] = useState([]);
    const [wordCount, setWordCount] = useState(0);
    const [sentenceCount, setSentenceCount] = useState(0);
    const [loading, setLoading] = useState(false);

    const handleFileChange = (event) => {
        setSelectedFiles([...event.target.files]);

    };
    const formatDateTime = (absoluteValue) => {
        // Assuming absoluteValue is in milliseconds
        const date = new Date(absoluteValue);
        return date.toLocaleString(); // Adjust formatting based on your requirements
    };

    const handleUpload = async () => {
        setLoading(true);

        const formData = new FormData();
        for (const file of selectedFiles) {
            formData.append('dataFiles', file);
        }

        try {
            const response = await axios.post('http://localhost:3001/v3', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log(response.data.extractedData[0].data);
            const extractedData = response.data.extractedData[0].data;
            console.log("hello", extractedData[1]);
            setExtractedTexts(extractedData);
            setFilteredTexts(extractedData);
            // applyFilter();

        } catch (error) {
            console.error('Error occurred during file upload:', error);
        } finally {
            setLoading(false);
        }
    };



    const [filteredTexts, setFilteredTexts] = useState([]);

    const applyFilter = (filterType) => {
        let filteredData = [];

        switch (filterType) {
            case 'consecutiveDays':
                const sevenDaysInterval = 7;
                filteredData = extractedTexts.filter(worker => {
                    const startDate = worker['Pay Cycle Start Date'];
                    const endDate = worker['Pay Cycle End Date'];
                    const difference = endDate - startDate;
                    return difference >= sevenDaysInterval;
                });

                console.log("h1", filteredData);
                break;

            case 'timeBetweenShifts':
                filteredData = extractedTexts.filter(worker => {

                    const minutesInADay = 24 * 60;
                    const timeInMinutes = worker['Time'] * minutesInADay;
                    const timeOutMinutes = worker['Time Out'] * minutesInADay;
                    const timeBetweenShifts = timeOutMinutes - timeInMinutes;
                    return timeBetweenShifts > 60 && timeBetweenShifts < 600;
                });
                console.log("h2", filteredData);
                break;

            case 'singleShiftHours':
                filteredData = extractedTexts.filter(worker => {

                    const minutesInADay = 24 * 60;
                    const timeInMinutes = worker['Time'] * minutesInADay;
                    const timeOutMinutes = worker['Time Out'] * minutesInADay;
                    const timeBetweenShifts = timeOutMinutes - timeInMinutes;
                    return timeBetweenShifts > 14 * 60;
                });
                console.log("h3", filteredData);
                break;
            case 'show':
                filteredData=extractedTexts;
                // setFilteredTexts(extractedTexts);
                console.log("Filtered Data:", filteredData);
                break;
            case 'sortByWorkedTime':
                const minutesInADay = 24 * 60;
                filteredData = extractedTexts.slice();
                filteredData.sort((a, b) => {
                    const timeInMinutesA = a['Time'] * minutesInADay;
                    const timeOutMinutesA = a['Time Out'] * minutesInADay;
                    const timeBetweenShiftsA = timeOutMinutesA - timeInMinutesA;

                    const timeInMinutesB = b['Time'] * minutesInADay;
                    const timeOutMinutesB = b['Time Out'] * minutesInADay;
                    const timeBetweenShiftsB = timeOutMinutesB - timeInMinutesB;

                    return timeBetweenShiftsA - timeBetweenShiftsB;
                });

                console.log("Sorted Data by Worked Time:", filteredData);
                break;

            default:
                filteredData = extractedTexts;



        }

        setFilteredTexts(filteredData);
    };


    return (

        <>
            <div className="container">
                <h1>XLXS Text Extractor</h1>
                <div className="upload-section">
                    <input type="file" onChange={handleFileChange} multiple />
                    <button onClick={handleUpload} disabled={loading}>
                        {loading ? 'Extracting...' : 'Extract Text'}
                    </button>
                </div>
                <div className="count-buttons">
                    <button >Number of Rows: {filteredTexts.length} rows</button>
                </div>
                <div className="filter-buttons">
                    <button onClick={() => applyFilter('consecutiveDays')}>7 Consecutive Days</button>
                    <button onClick={() => applyFilter('timeBetweenShifts')}>Time Between Shifts</button>
                    <button onClick={() => applyFilter('singleShiftHours')}>Single Shift Hours</button>
                    <button onClick={() => applyFilter('show')}>Show All</button>
                    <button onClick={() => applyFilter('sortByWorkedTime')}>Sort by Worked Time</button>

                </div>
                {filteredTexts.length > 0 ? <Table data={filteredTexts} /> : <p>No data after filtering.</p>}
            </div>
        </>
    );
}

export default PDFTextExtractor;
