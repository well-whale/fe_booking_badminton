import ChartCourt from "../../components/admin/chart/ChartCourt";
import ChartProfit from "../../components/admin/chart/ChartProfit";
import Navbar from "../../components/admin/navbar/Navbar";
import Sidebar from "../../components/admin/sidebar/Sidebar";
import Widget from "../../components/admin/widget/Widget";
import "./Home.css"

const adminHome = () => {
  return (
    <div className="home">
    <>
      <Sidebar />
   
      <div className="homeContainer">
        <div className="widgets">
          <Widget type="customer" />
          <Widget type="court" />
          <Widget type="earnings" />
        </div>
        <ChartCourt/>
        <ChartProfit/>
      </div>
    </>
  </div>
  );
};
export default adminHome;
