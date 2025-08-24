import axios from 'axios';

  export const fetchEmployees = async (params) => {
    const response = await axios.get('http://localhost:8082/api/employees',{
        params,
    });
    
    return response.data;
  };
