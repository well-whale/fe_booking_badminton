import Navbar from "../../components/admin/navbar/Navbar";
import Widget from "../../components/admin/widget/Widget";
import Sidebar from "../../components/courtowner/sidebar/Sidebar";
import "./Home.css"

const OwnerHome = () => {
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
export default OwnerHome;
