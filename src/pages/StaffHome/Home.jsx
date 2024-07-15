import Navbar from "../../components/admin/navbar/Navbar";
import Widget from "../../components/admin/widget/Widget";
import Sidebar from "../../components/staff/sidebar/Sidebar";
import "./Home.css"

const StaffHome = () => {
  return (
    <div className="home">
    <>
      <Sidebar/>
   
      <div className="homeContainer">
        <div className="widgets">
          <Widget type="customer" />
          <Widget type="court" />
          <Widget type="earnings" />
        </div>
        
      </div>
    </>
  </div>
  );
};
export default StaffHome;
