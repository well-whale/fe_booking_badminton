import axios from "./axios";

const newUser = (user) => {
  return axios.post('api/v1/admin/createUser', user);
};

const fetchAllUsers = () => {
  return axios.get('api/v1/admin/getListInfoUser');
};

const deleteByUserID = (userid) => {
  return axios.delete(`demo/${userid}`);
};

const updateByUserID = (userId, newUser) => {
  return axios.put(`api/v1/admin/updateUser/${userId}`, newUser);
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

const getPriceByIdCourt = (idcourt) => {
  return axios.get(`price/id/${idcourt}`);
}
 const loginUser = async (userName, password) => {
  return  axios.post(`auth/login`, { userName, password });
  
};

const checkSubCourt = (data) => {
  return axios.post('booking/check',data);
}
  const register = (data) => {
    return axios.post('api/v1/user/register',data);
  }

  const getSubCourtStatus = () =>{
    return axios.get('booking/getCourtStatus');
  }

  const verifyToken = (token) => {
    return axios.post('auth/verifyToken', { token });
    }

  const book = (data) =>{
    return axios.post('booking/book',data);
  }
  const payment = (total,idcourt) => {
    return axios.get(`payV2/${total}/${idcourt}`);
  }
export {payment,verifyToken,loginUser, book,register,newUser, fetchAllUsers,fetchAllCourts,searchByDistrict,getCourtByIdCourt,deleteByUserID,updateByUserID,checkSubCourt,getSubCourtStatus,getPriceByIdCourt};
