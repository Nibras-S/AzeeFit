import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Active.css';

function Active(props) {
    const [members, setMembers] = useState([]);
    const [expandedRow, setExpandedRow] = useState(null); // State to track the expanded row
    const [selectedOption, setSelectedOption] = useState(''); // State for selected radio button
    const [searchTerm, setSearchTerm] = useState(''); // State to store the search input
    const [customDate, setCustomDate] = useState(''); // State to store the value of custom date
    const backendUrl = process.env.REACT_APP_BACKEND_URL;


    useEffect(() => {
        axios.get(`${backendUrl}/api/contacts/`)
            .then(response => setMembers(response.data))
            .catch(err => console.log(err));
    }, []);

    const handleWhatsAppClick = (phone, name) => {
        const message = encodeURIComponent(`Hello ${name}, we noticed that your membership is inactive. Please contact us for more details.`);
        const whatsappUrl = `https://wa.me/${phone}?text=${message}`;
        window.open(whatsappUrl, '_blank'); // Opens WhatsApp in a new tab
    };

    const handleExpandClick = (userId) => {
        setExpandedRow(expandedRow === userId ? null : userId); // Toggle the expanded row
    };

    const handleRadioChange = (event) => {
        setSelectedOption(event.target.value);
    };

    // Handle change in the custom date input
    const handleCustomDateChange = (event) => {
        setCustomDate(event.target.value); // Set custom date state
    };

    const handleRenewClick = async (userId) => {
        let daysToAdd = 0;
        switch (selectedOption) {
            case '1-Month':
                daysToAdd = 30;
                break;
            case '2-Month':
                daysToAdd = 60;
                break;
            case '3-Month':
                daysToAdd = 90;
                break;
            default:
                console.error('No valid option selected');
                return;
        }

        try {
            // Fetch the contact details to get the current endDate
            const contactResponse = await axios.get(`${backendUrl}/api/contacts/${userId}`);
            const contact = contactResponse.data;

            // Determine the start date: use custom date if provided, otherwise fallback to existing logic
            const newStartDate = customDate ? new Date(customDate).toISOString() :
                (contact.endDate ? new Date(contact.endDate).toISOString() : new Date().toISOString());
            
            // Determine the end date: if custom date is used, calculate from that; otherwise use existing logic
            const newEndDate = customDate ? new Date(customDate) : (contact.endDate ? new Date(contact.endDate) : new Date());
            newEndDate.setDate(newEndDate.getDate() + daysToAdd);
            const newEndDateISO = newEndDate.toISOString();

            // Update the contact's details via API
            await axios.put(`${backendUrl}/api/contacts/${userId}`, {
                date: newStartDate,
                endDate: newEndDateISO,
                status: 'Active',
                plan: selectedOption
            });

            // Optionally, refresh the data or give feedback
            console.log(`Contact ${userId} renewed successfully.`);
            
            // Refresh data after update
            const response = await axios.get('${backendUrl}/api/contacts/');
            setMembers(response.data);
        } catch (error) {
            console.error('Error renewing contact:', error);
        }
    };

    // Function to handle the search input change
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    return (
        <div className="container mt-5">
            {/* Search Bar */}
            <div className="search-bar-container">
                <input
                    type="text"
                    className="search-bar-input"
                    placeholder="Search by phone number"
                    value={searchTerm}
                    onChange={handleSearchChange} // Update the search input state
                />
            </div>

            {/* Table */}
            <table className="table table-dark table-striped">
                <thead className="thead-dark">
                    <tr>
                        <th scope="col">Name</th>
                        <th scope="col">Phone</th>
                        <th scope="col">Status</th>
                        <th scope="col">Due</th>
                        <th scope="col">Send Message</th>
                        <th scope="col">Expand</th>
                    </tr>
                </thead>
                <tbody>
                    {members
                        .filter(user => 
                            user.status === "InActive" && user.dews >= -30 &&
                            user.gender === props.gender &&
                            user.phone.includes(searchTerm) // Filter by phone number based on search term
                        )
                        .sort((a, b) => b.dews - a.dews)  // Sort by 'dews' in descending order
                        .map((user) => {
                            return (
                                <React.Fragment key={user._id}>
                                    <tr>
                                        <td>{user.name}</td>
                                        <td>{user.phone}</td>
                                        <td>{user.status}</td>
                                        <td>{user.dews}</td>
                                        <td>
                                            <button onClick={() => handleWhatsAppClick(user.phone, user.name)} className='submitbutton'>Send</button>
                                        </td>
                                        <td>
                                            <button onClick={() => handleExpandClick(user._id)} className='submitbutton'>Renew</button>
                                        </td>
                                    </tr>
                                    {expandedRow === user._id && (
                                        <tr>
                                            <td colSpan="6">
                                                <div className='expand'>
                                                    <label>
                                                        <input
                                                            type="radio"
                                                            name="options"
                                                            value="1-Month"
                                                            checked={selectedOption === '1-Month'}
                                                            onChange={handleRadioChange}
                                                        /> 1 Month
                                                    </label>
                                                    <label style={{ marginLeft: '20px' }}>
                                                        <input
                                                            type="radio"
                                                            name="options"
                                                            value="2-Month"
                                                            checked={selectedOption === '2-Month'}
                                                            onChange={handleRadioChange}
                                                        /> 2 Month
                                                    </label>
                                                    <label style={{ marginLeft: '20px' }}>
                                                        <input
                                                            type="radio"
                                                            name="options"
                                                            value="3-Month"
                                                            checked={selectedOption === '3-Month'}
                                                            onChange={handleRadioChange}
                                                        /> 3 Month
                                                    </label>
                                                    <input 
                                                        type="date" 
                                                        className="date" 
                                                        value={customDate} 
                                                        onChange={handleCustomDateChange} 
                                                    />
                                                    <button className='renew'
                                                        style={{ marginLeft: '20px' }}
                                                        onClick={() => handleRenewClick(user._id)}
                                                    >
                                                        Renew
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            );
                        })
                    }
                </tbody>
            </table>
        </div>
    );
}

export default Active;

