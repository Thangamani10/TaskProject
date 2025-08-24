import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const EmployeesTable = () => {
  const [employees, setEmployees] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [pageSize] = useState(5);
  const [total, setTotal] = useState(0);

  const [inputFilters, setInputFilters] = useState({
    employeeName: '',
    department: '',
    location: '',
  });

  const [filters, setFilters] = useState({
    employeeName: '',
    department: '',
    location: '',
  });

  // ✅ Wrap fetchEmployees with useCallback
  const fetchEmployees = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:8082/api/employees', {
        params: {
          pageNumber,
          pageSize,
          ...filters,
        },
      });
      setEmployees(response.data.data);
      setTotal(response.data.total);
    } catch (err) {
      console.error('Failed to fetch employees:', err);
    }
  }, [pageNumber, pageSize, filters]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFilterSubmit = () => {
    setFilters(inputFilters);
    setPageNumber(0);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Employees List</h2>

      <div style={{ marginBottom: '15px' }}>
        <label style={{ marginRight: '10px' }}>Employee Name:</label>
        <input
          type="text"
          name="employeeName"
          value={inputFilters.employeeName}
          onChange={handleInputChange}
          style={{ marginRight: '30px' }}
        />

        <label style={{ marginRight: '10px' }}>Department:</label>
        <input
          type="text"
          name="department"
          value={inputFilters.department}
          onChange={handleInputChange}
          style={{ marginRight: '30px' }}
        />

        <label style={{ marginRight: '10px' }}>Location:</label>
        <input
          type="text"
          name="location"
          value={inputFilters.location}
          onChange={handleInputChange}
          style={{ marginRight: '20px' }}
        />

        <button onClick={handleFilterSubmit}>Submit</button>
      </div>

      <table
        border="1"
        cellPadding="8"
        style={{ width: '100%', borderCollapse: 'collapse' }}
      >
        <thead>
          <tr style={{ backgroundColor: '#f2f2f2' }}>
            <th>Name</th>
            <th>Department</th>
            <th>Location</th>
          </tr>
        </thead>
        <tbody>
          {employees.length > 0 ? (
            employees.map((emp) => (
              <tr key={emp.id}>
                <td>{emp.employeeName}</td>
                <td>{emp.department}</td>
                <td>{emp.location}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" style={{ textAlign: 'center' }}>
                No records found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div style={{ marginTop: '15px' }}>
        <button
          onClick={() => setPageNumber((prev) => Math.max(prev - 1, 0))}
          disabled={pageNumber === 0}
        >
          Previous
        </button>

        <span style={{ margin: '0 10px' }}>Page {pageNumber + 1}</span>

        <button
          onClick={() =>
            setPageNumber((prev) =>
              (prev + 1) * pageSize < total ? prev + 1 : prev
            )
          }
          disabled={(pageNumber + 1) * pageSize >= total}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default EmployeesTable;
