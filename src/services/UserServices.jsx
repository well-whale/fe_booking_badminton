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
const getInfoUser= (userId)=>{
  return axios.get(`api/v1/admin/getInfoUser/${userId}`)
}

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
  const getSubCourtByIdCourt = (idsubcourt) => {
    return axios.get(`/subcourt/${idsubcourt}`);
  };
  const verifyToken = (token) => {
    return axios.post('auth/verifyToken', { token });
    }

  const book = (data) =>{
    return axios.post('booking/book',data);
  }
  const payment = (total,idcourt) => {
    return axios.get(`payV2/${total}/${idcourt}`);
  }
  const paymentSave = (data)=>{
    return axios.post(`booking/book/saveBookingV2`,data)
  }
  const getBookedByID = (idcustomer) =>{
    return axios.get(`booking/booked/${idcustomer}`);
  }
 const getAllBookingsOfCourt = (courtID) =>{
  return axios.get(`booking/AllBookingsOfCourt/${courtID}`);
 }

 const getAllCourtOfOwner = (ownerID) =>{
  return axios.get(`court/userid/${ownerID}`);
 }

 const createCourt = (dataCourt)=>{
  return axios.post(`court/createcourt`,dataCourt)
 }
 const updateStatusCourt = (dataCourt)=>{
  return axios.put(`court/updatestatuscourt`,dataCourt)
 }
  
export {updateStatusCourt,createCourt,getSubCourtByIdCourt,getInfoUser,getAllCourtOfOwner,getAllBookingsOfCourt,getBookedByID,paymentSave,payment,verifyToken,loginUser, book,register,newUser, fetchAllUsers,fetchAllCourts,searchByDistrict,getCourtByIdCourt,deleteByUserID,updateByUserID,checkSubCourt,getSubCourtStatus,getPriceByIdCourt};
