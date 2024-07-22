import ChartOrderType from "../../components/courtowner/chart/ChartOrderType";
import ChartOrder from "../../components/courtowner/chart/ChartOrder";
import ChartPrice from "../../components/courtowner/chart/ChartPrice";
import ChartOrderOfCourt from "../../components/courtowner/chart/ChartTrenCourt";
import Sidebar from "../../components/courtowner/sidebar/Sidebar";
import Widget from "../../components/courtowner/widget/Widget";
import "./Home.css"

const OwnerHome = () => {
  return (
    <div className="home">
    <>
        <Sidebar />
        <div className="homeContainer">
          <div className="widgets">
            {/* <Widget type="customer" /> */}
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
          <div className="charts-container">
            <div className="chart-item ">
              <ChartOrderType />
            </div>
            <div className="chart-item">
              <ChartOrderOfCourt />
            </div>
          </div>
        </div>
      </>
  </div>
  );
};
export default OwnerHome;
