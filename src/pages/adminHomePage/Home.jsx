import ChartOrder from "../../components/admin/chart/ChartOrder";
import ChartPrice from "../../components/admin/chart/ChartPrice";
import ChartProfit from "../../components/admin/chart/ChartProfit";
import Navbar from "../../components/admin/navbar/Navbar";
import Sidebar from "../../components/admin/sidebar/Sidebar";
import Widget from "../../components/admin/widget/Widget";
import "./Home.css";

const AdminHome = () => {
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
          <div className="charts-container">
            <div className="chart-item ">
              <ChartOrder />
            </div>
            <div className="chart-item">
              <ChartPrice />
            </div>
          </div>
        </div>
      </>
    </div>
  );
};

export default AdminHome;
