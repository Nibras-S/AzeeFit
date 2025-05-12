import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Active.css';

function Active() {
    const [members, setMembers] = useState([]);
    const [expandedRow, setExpandedRow] = useState(null);
    const [selectedOption, setSelectedOption] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
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
        setSelectedOption(''); // Reset option when expanding a new row
    };

    const handleRadioChange = (event) => {
        setSelectedOption(event.target.value);
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
            const contactResponse = await axios.get(`${backendUrl}/api/contacts/${userId}`);
            const contact = contactResponse.data;

            const newStartDate = new Date().toISOString();
            const newEndDate = new Date();
            newEndDate.setDate(newEndDate.getDate() + daysToAdd);
            const newEndDateISO = newEndDate.toISOString();

            await axios.put(`${backendUrl}/api/contacts/${userId}`, {
                date: newStartDate,
                endDate: newEndDateISO,
                status: 'Active',
                plan: selectedOption
            });

            console.log(`Contact ${userId} renewed successfully.`);
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

    const filteredMembers = members
        .filter(user =>
            user.status === "InActive" &&
            (
                user.phone.includes(searchTerm) ||
                user.name.toLowerCase().includes(searchTerm.toLowerCase())
            ) &&
            user.dews < -30
        )
        .sort((a, b) => b.dews - a.dews);

    return (
        <div>
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
                {/* Desktop Table */}
                <div className="desktop-table">
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
                            {filteredMembers.map((user) => (
                                <React.Fragment key={user._id}>
                                    <tr>
                                        <td>{user.name}</td>
                                        <td>{user.phone}</td>
                                        <td>{user.status}</td>
                                        <td>{user.dews}</td>
                                        <td>
                                            <button
                                                onClick={() => handleWhatsAppClick(user.phone, user.name)}
                                                className="submitbutton"
                                            >
                                                Send
                                            </button>
                                        </td>
                                        <td>
                                            <button
                                                onClick={() => handleExpandClick(user._id)}
                                                className="submitbutton"
                                            >
                                                Renew
                                            </button>
                                        </td>
                                    </tr>
                                    {expandedRow === user._id && (
                                        <tr>
                                            <td colSpan="6">
                                                <div className="renew-options">
                                                    <label>
                                                        <input
                                                            type="radio"
                                                            name={`options-${user._id}`}
                                                            value="1-Month"
                                                            checked={selectedOption === '1-Month'}
                                                            onChange={handleRadioChange}
                                                        /> 1 Month
                                                    </label>
                                                    <label>
                                                        <input
                                                            type="radio"
                                                            name={`options-${user._id}`}
                                                            value="2-Month"
                                                            checked={selectedOption === '2-Month'}
                                                            onChange={handleRadioChange}
                                                        /> 2 Month
                                                    </label>
                                                    <label>
                                                        <input
                                                            type="radio"
                                                            name={`options-${user._id}`}
                                                            value="3-Month"
                                                            checked={selectedOption === '3-Month'}
                                                            onChange={handleRadioChange}
                                                        /> 3 Month
                                                    </label>
                                                    <button
                                                        onClick={() => handleRenewClick(user._id)}
                                                        style={{ marginLeft: '20px' }}
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
                <div className="mobile-table">
                    {filteredMembers.map((user) => (
                        <div className="mobile-card" key={user._id}>
                            <p><strong>Name:</strong> {user.name}</p>
                            <p><strong>Phone:</strong> {user.phone}</p>
                            <p><strong>Status:</strong> {user.status}</p>
                            <p><strong>Due:</strong> {user.dews}</p>
                            <div className="mobile-card-buttons">
                                <button
                                    onClick={() => handleWhatsAppClick(user.phone, user.name)}
                                    className="submitbutton"
                                >
                                    Send
                                </button>
                                <button
                                    onClick={() => handleExpandClick(user._id)}
                                    className="submitbutton"
                                >
                                    Renew
                                </button>
                            </div>

                            {expandedRow === user._id && (
                                <div className="renew-options">
                                    <label>
                                        <input
                                            type="radio"
                                            name={`options-mobile-${user._id}`}
                                            value="1-Month"
                                            checked={selectedOption === '1-Month'}
                                            onChange={handleRadioChange}
                                        /> 1 Month
                                    </label>
                                    <label>
                                        <input
                                            type="radio"
                                            name={`options-mobile-${user._id}`}
                                            value="2-Month"
                                            checked={selectedOption === '2-Month'}
                                            onChange={handleRadioChange}
                                        /> 2 Month
                                    </label>
                                    <label>
                                        <input
                                            type="radio"
                                            name={`options-mobile-${user._id}`}
                                            value="3-Month"
                                            checked={selectedOption === '3-Month'}
                                            onChange={handleRadioChange}
                                        /> 3 Month
                                    </label>
                                    <button onClick={() => handleRenewClick(user._id)}>Renew</button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Active;