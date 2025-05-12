import React, { useState } from 'react';
import axios from 'axios';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import './NewMember.css';
import { useNavigate } from 'react-router-dom';


function NewMember() {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [plan, setPlan] = useState("");
    const [date, setDate] = useState("");
    const [gender, setGender] = useState(""); // State for gender
    const navigate = useNavigate();
    const backendUrl = process.env.REACT_APP_BACKEND_URL;
    

    const Submit = async (e) => {
        e.preventDefault();
        try {
            const result = await axios.post(`${backendUrl}/api/contacts/`, {
                name,
                phone,
                plan,
                date,
                gender // Include gender in the data sent to the backend
            });
            console.log('Member added successfully:', result.data);
            navigate('/active');

        } catch (err) {
            console.error('Error adding member:', err.response ? err.response.data : err.message);
        }
    }

    return (
        <div className="form-container">
            <form onSubmit={Submit} className="new-member-form">
                <label className="form-label">
                    Name:
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="form-input" />
                </label>
                <br />
                <label className="form-label">
                    Phone:
                    <PhoneInput
                        country={'in'}
                        value={phone}
                        onChange={(value) => {
                            if (!value.startsWith('+')) {
                                value = '+' + value;
                            }
                            setPhone(value);
                        }}
                        containerClass="phone-input-container"
                        inputClass="phone-input"
                    />
                </label>
                <br />
                <label className="form-label">
                    Plan:
                    <select value={plan} onChange={(e) => setPlan(e.target.value)} className="form-select">
                        <option value="">Select a plan</option>
                        <option value="1-Month">1 month</option>
                        <option value="2-Month">2 months</option>
                        <option value="3-Month">3 months</option>
                    </select>
                </label>
                <br />
                <label className="form-label">
                    Gender:
                    <div className="radio-group">
                        <label>
                            <input
                                type="radio"
                                name="gender"
                                value="Male"
                                checked={gender === 'Male'}
                                onChange={(e) => setGender(e.target.value)}
                            />
                            Male
                        </label>
                        <label style={{ marginLeft: '20px' }}>
                            <input
                                type="radio"
                                name="gender"
                                value="Female"
                                checked={gender === 'Female'}
                                onChange={(e) => setGender(e.target.value)}
                            />
                            Female
                        </label>
                    </div>
                </label>
                <br />
                <label className="form-label">
                    Date:
                    <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="form-input" />
                </label>
                <br />
                <button type="submit" className="submit-button">ADD</button>
            </form>
        </div>
    );
}

export default NewMember;