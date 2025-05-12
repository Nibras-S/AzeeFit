import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Active.css';

function Active(props) {
    const [members, setMembers] = useState([]);
    const [expandedRow, setExpandedRow] = useState(null);
    const [selectedOption, setSelectedOption] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [customDate, setCustomDate] = useState('');
    const backendUrl = process.env.REACT_APP_BACKEND_URL;

    useEffect(() => {
        axios.get(`${backendUrl}/api/contacts/`)
            .then(response => setMembers(response.data))
            .catch(err => console.log(err));
    }, []);

    const handleWhatsAppClick = (phone, name) => {
        const message = encodeURIComponent(`Hello ${name}, we noticed that your membership is inactive. Please contact us for more details.`);
        const whatsappUrl = `https://wa.me/${phone}?text=${message}`;
        window.open(whatsappUrl, '_blank');
    };

    const handleExpandClick = (userId) => {
        setExpandedRow(expandedRow === userId ? null : userId);
    };

    const handleRadioChange = (event) => {
        setSelectedOption(event.target.value);
    };

    const handleCustomDateChange = (event) => {
        setCustomDate(event.target.value);
    };

    const handleRenewClick = async (userId) => {
        let daysToAdd = 0;
        switch (selectedOption) {
            case '1-Month': daysToAdd = 30; break;
            case '2-Month': daysToAdd = 60; break;
            case '3-Month': daysToAdd = 90; break;
            default:
                console.error('No valid option selected');
                return;
        }

        try {
            const contactResponse = await axios.get(`${backendUrl}/api/contacts/${userId}`);
            const contact = contactResponse.data;

            const newStartDate = customDate ? new Date(customDate).toISOString()
                : (contact.endDate ? new Date(contact.endDate).toISOString() : new Date().toISOString());

            const newEndDate = customDate ? new Date(customDate)
                : (contact.endDate ? new Date(contact.endDate) : new Date());
            newEndDate.setDate(newEndDate.getDate() + daysToAdd);
            const newEndDateISO = newEndDate.toISOString();

            // Calculate the duration between the new start and end date in days
            const today = new Date();
            const endDate = new Date(newEndDateISO);
            const adjustedToday = new Date(today);
            adjustedToday.setDate(adjustedToday.getDate() - 1);
            const durationInDays = Math.floor((endDate - adjustedToday) / (1000 * 60 * 60 * 24)); // Days difference

            // Set the total dews as the duration (no per-day cost)
            const dews = durationInDays; // Directly use the duration as the dews

  
            await axios.put(`${backendUrl}/api/contacts/${userId}`, {
                date: newStartDate,
                endDate: newEndDateISO,
                status: 'Active',
                plan: selectedOption,
                dews:dews,
            });

            const response = await axios.get(`${backendUrl}/api/contacts/`);
            setMembers(response.data);
            setExpandedRow(null);
        } catch (error) {
            console.error('Error renewing contact:', error);
        }
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    return (
        <div>
            {/* Search Bar */}
            <div className="search-bar-container">
                <input
                    type="text"
                    className="search-bar-input"
                    placeholder="Search by phone number or name"
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
            </div>

            <div className="container mt-5">
                <div className='desktop-table'>
                    <table className="table table-dark table-striped">
                        <thead className="thead-dark">
                            <tr>
                                <th>Name</th>
                                <th>Phone</th>
                                <th>Status</th>
                                <th>Due</th>
                                <th>Send Message</th>
                                <th>Expand</th>
                            </tr>
                        </thead>
                        <tbody>
                            {members
                                .filter(user =>
                                    user.status === "InActive" &&
                                    user.dews >= -30 &&
                                    user.gender === props.gender &&
                                    (
                                        user.phone.includes(searchTerm) ||
                                        user.name.toLowerCase().includes(searchTerm.toLowerCase())
                                    )
                                )
                                .sort((a, b) => b.dews - a.dews)
                                .map(user => (
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
                                                        <button
                                                            className='renew'
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
                                ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile View */}
                <div className="mobile-card-view1">
                    {members
                        .filter(user =>
                            user.status === "InActive" &&
                            user.dews >= -30 &&
                            user.gender === props.gender &&
                            (
                                user.phone.includes(searchTerm) ||
                                user.name.toLowerCase().includes(searchTerm.toLowerCase())
                            )
                        )
                        .sort((a, b) => b.dews - a.dews)
                        .map(user => (
                            <div className="mobile-card" key={user._id}>
                                <div className="status-badge inactive">{user.status}</div>
                                <div className="info-row">
                                    <i className="fas fa-user icon"></i>
                                    <span>{user.name}</span>
                                </div>
                                <div className="info-row">
                                    <i className="fas fa-phone icon"></i>
                                    <span>{user.phone}</span>
                                </div>
                                <div className="info-row">
                                    <i className="fas fa-coins icon"></i>
                                    <span>{user.dews}</span>
                                </div>
                                <div className="mobile-card-buttons">
                                    <button
                                        className='submitbutton'
                                        onClick={() => handleWhatsAppClick(user.phone, user.name)}
                                    >
                                        Send
                                    </button>
                                    <button
                                        className='submitbutton'
                                        onClick={() => handleExpandClick(user._id)}
                                    >
                                        Renew
                                    </button>
                                    {expandedRow === user._id && (
                                        <div className="expand">
                                            <label>
                                                <input
                                                    type="radio"
                                                    name="mobile-options"
                                                    value="1-Month"
                                                    checked={selectedOption === '1-Month'}
                                                    onChange={handleRadioChange}
                                                /> 1 Month
                                            </label>
                                            <label style={{ marginLeft: '10px' }}>
                                                <input
                                                    type="radio"
                                                    name="mobile-options"
                                                    value="2-Month"
                                                    checked={selectedOption === '2-Month'}
                                                    onChange={handleRadioChange}
                                                /> 2 Month
                                            </label>
                                            <label style={{ marginLeft: '10px' }}>
                                                <input
                                                    type="radio"
                                                    name="mobile-options"
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
                                            <button
                                                className='renew'
                                                onClick={() => handleRenewClick(user._id)}
                                            >
                                                Renew
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                </div>
            </div>
        </div>
    );
}

export default Active;