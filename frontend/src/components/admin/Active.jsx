import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Active.css';

function Active(props) {
    const [members, setMembers] = useState([]);
    const [searchTerm, setSearchTerm] = useState(''); 
    // const backendUrl = process.env.BACKEND_URL;// State to store the search input

    const backendUrl = process.env.REACT_APP_BACKEND_URL;
    useEffect(() => {
        
        axios.get(`${backendUrl}/api/contacts/`)
            .then(response => setMembers(response.data))
            .catch(err => console.log(err));
    }, []);

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
                        <th scope="col">Rem</th>
                        <th scope="col">Start Date</th>
                        <th scope="col">End Date</th>
                    </tr>
                </thead>
                <tbody>
                    {members
                        .filter(user => 
                            user.status === "Active" && 
                            user.gender === props.gender && 
                            user.phone.includes(searchTerm) // Filter by phone number based on search term
                        )
                        .sort((a, b) => new Date(b.date) - new Date(a.date)) // Sorting by date in descending order
                        .map((user) => {
                            // Helper function to format a date as 'dd-mm-yyyy'
                            const formatDate = (dateString) => {
                                const date = new Date(dateString);
                                const day = String(date.getDate()).padStart(2, '0');
                                const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
                                const year = date.getFullYear();
                                return `${day}-${month}-${year}`;
                            };

                            // Format the start date and end date
                            const formattedStartDate = formatDate(user.date);
                            const formattedEndDate = formatDate(user.endDate);

                            return (
                                <tr key={user._id}>
                                    <td>{user.name}</td>
                                    <td>{user.phone}</td>
                                    <td>{user.status}</td>
                                    <td>{user.dews}</td>
                                    <td>{formattedStartDate}</td>
                                    <td>{formattedEndDate}</td>
                                </tr>
                            );
                        })
                    }
                </tbody>
            </table>
        </div>
    );
}

export default Active;
