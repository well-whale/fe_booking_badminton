import axios from "./axios";

const newUser = (user) => {
  return axios.post('demo/create-users', user);
};

const fetchAllUsers = () => {
  return axios.get('demo/list-users');
};

const deleteByUserID = (userid) => {
  return axios.delete(`demo/${userid}`);
};

const updateByUserID = (userId, newUser) => {
  return axios.put(`/demo/${userId}`, newUser);
};


const fetchAllCourts = () => {
  return axios.get('court/getAllCourt');
};

const searchByDistrict = (district) => {
  return axios.get(`court/${district}`);
};

const getCourtByIdCourt = (idcourt) => {
  return axios.get(`court/id/${idcourt}`);
};


export const loginUser = async (username, password) => {
  const response = await axios.post(`login`, { username, password });
  return response.data;
};
  const checkSubCourt = (data) => {
    return axios.post('booking/check',data);
  }

  const getSubCourtStatus = () =>{
    return axios.get('booking/getCourtStatus');
  }
export { newUser, fetchAllUsers,fetchAllCourts,searchByDistrict,getCourtByIdCourt,deleteByUserID,updateByUserID,checkSubCourt,getSubCourtStatus};
