export const routes = {
    home: "/",
    login: "/login",
    googleOAuth: "/googleoauth",
    loginOTP: "/loginotp",
    courtDetail: "/view/:idCourt",
    search: "/search",
    bookingday: "/bookingday/:idCourt",
    bookingmonth: "/bookingmonth/:idCourt",
    payment: "/bookingday/payment",
    paymentMonth: "/paymentMonth",

    adminHome: "/admin/home",
    adminListUsers: "/admin/listUsers",
    adminListAdmins: "/admin/listAdmin",
    adminListOwners: "/admin/listOwners",
    adminListStaff: "/admin/listStaff",
    adminListCourtPending: "/admin/listCourtPending",
    adminListCourtPause: "/admin/listCourtPause",
    adminCourtActive: "/admin/listCourtActive",
    adminNewUser: "/admin/users/new",
    adminUpdateCourt: "/admin/court/update/:courtId",

    adminProfile: "/admin/Profile",
    bill: "/bill",
    paymentSuccess: "/payment-success",
    booked: "/booked",
    ownerHome: "/ownerCourt/home",
    ownerUpdateCourt: "/ownerCourt/court/update/:courtId",

    listCourtForOwnerActive: "/ownerCourt/listCourtActive",
    listCourtForOwnerPending: "/ownerCourt/listCourtPending",
    listCourtForOwnerPause: "/ownerCourt/listCourtPause",
    listOrderDay: "/ownerCourt/listOrderDay",
    listOrderRecurring: "/ownerCourt/listOrderRecurring",

    newCourt: "/ownerCourt/newCourt",
    ownerProfile: "/ownerCourt/Profile",
    ownerProfile: "/ownerCourt/Profile",




    staffHome: "/staff/home",
    checkIn :"/staff/checkIn",
    staffProfile: "/staff/Profile",

};
