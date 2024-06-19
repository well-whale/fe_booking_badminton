import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { TextField, Button, Container } from "@mui/material";
import { datacourt } from "../../datatableSource";
import Sidebar from "../../components/admin/sidebar/Sidebar";
import "./UpdateCourt.css";

const UpdateCourt = () => {
  const { courtId } = useParams();
  const navigate = useNavigate();
  const [court, setCourt] = useState(null);
  const [courtPrices, setCourtPrices] = useState([]);

  useEffect(() => {
    const selectedCourt = datacourt.find(
      (court) => court.courtId === parseInt(courtId)
    );
    setCourt(selectedCourt);

    const priceData = [
      { courtid: 1, opening_time: "05:00:00", close_time: "16:00:00", active_status: "TT", unit_price: 70 },
      { courtid: 1, opening_time: "16:00:00", close_time: "23:00:00", active_status: "TT", unit_price: 130 },
      { courtid: 1, opening_time: "05:00:00", close_time: "08:00:00", active_status: "CT", unit_price: 70 },
      { courtid: 1, opening_time: "08:00:00", close_time: "23:00:00", active_status: "TT", unit_price: 5000 },
      { courtid: 2, opening_time: "05:00:00", close_time: "17:00:00", active_status: "ALL", unit_price: 50 },
      { courtid: 2, opening_time: "17:00:00", close_time: "21:00:00", active_status: "ALL", unit_price: 60 },
      { courtid: 2, opening_time: "21:00:00", close_time: "23:00:00", active_status: "ALL", unit_price: 70 }
    ];

    // Filter price data for the specific court
    const filteredPrices = priceData.filter((price) => price.courtid === selectedCourt?.courtId);
    setCourtPrices(filteredPrices);
  }, [courtId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourt((prev) => ({ ...prev, [name]: value }));
  };

  const handlePriceChange = (index, field, value) => {
    const updatedPrices = [...courtPrices];
    updatedPrices[index][field] = value;
    setCourtPrices(updatedPrices);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send a request to update the court details on the server
    console.log("Updated court details:", court);
    navigate("/admin/courts");
  };

  const handleUpdatePrice = (index) => {
    console.log("Updated price details:", courtPrices[index]);
    // Here you would typically send a request to update the price details on the server
  };

  const handleDeletePrice = (index) => {
    const updatedPrices = courtPrices.filter((_, i) => i !== index);
    setCourtPrices(updatedPrices);
    // Here you would typically send a request to delete the price entry on the server
  };

  const handleAddNewPrice = () => {
    const newPrice = { courtid: court.courtId, opening_time: "", close_time: "", active_status: "", unit_price: 0 };
    setCourtPrices((prev) => [...prev, newPrice]);
  };

  if (!court) return <div>Loading...</div>;

  return (
    <div className="updateCourtContainer">
      <div className="updateCourtSidebar">
        <Sidebar />
      </div>
      <div className="updateCourtContent">
        <div className="updateCourtForm">
          <h2>Update Court</h2>
          <form onSubmit={handleSubmit}>
            <TextField
              name="courtName"
              label="Court Name"
              value={court.courtName}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              name="district"
              label="District"
              value={court.district}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              name="courtAddress"
              label="Court Address"
              value={court.courtAddress}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              name="courtQuantity"
              label="Court Quantity"
              value={court.courtQuantity}
              onChange={handleChange}
              fullWidth
              type="number"
              margin="normal"
            />
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Update
            </Button>
          </form>
        </div>
        <div className="updateTimeForm">
          <h2>Update Court Prices</h2>
          <div className="courtPriceSlot">
            <table>
              <thead>
                <tr>
                  <th>Opening Time</th>
                  <th>Closing Time</th>
                  <th>Active Status</th>
                  <th>Unit Price</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {courtPrices.map((price, index) => (
                  <tr key={index}>
                    <td>
                      <TextField
                        value={price.opening_time}
                        type="time"
                        onChange={(e) => handlePriceChange(index, "opening_time", e.target.value)}
                      />
                    </td>
                    <td>
                      <TextField
                        value={price.close_time}
                        type="time"
                        onChange={(e) => handlePriceChange(index, "close_time", e.target.value)}
                      />
                    </td>
                    <td>
                      <TextField
                        value={price.active_status}
                        onChange={(e) => handlePriceChange(index, "active_status", e.target.value)}
                      />
                    </td>
                    <td>
                      <TextField
                        type="number"
                        value={price.unit_price}
                        onChange={(e) => handlePriceChange(index, "unit_price", e.target.value)}
                      />
                    </td>
                    <td>
                      <Button
                        variant="outlined"
                        color="warning"
                        onClick={() => handleUpdatePrice(index)}
                      >
                        Update
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => handleDeletePrice(index)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Button variant="contained" color="primary" onClick={handleAddNewPrice}>
              Add New
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateCourt;
