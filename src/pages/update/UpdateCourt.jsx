import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Container,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import Sidebar from "../../components/admin/sidebar/Sidebar";
import {
  getCourtByIdCourt,
  updateCourtByIdCourt,
} from "../../services/UserServices";
import "./UpdateCourt.css";

const UpdateCourt = () => {
  const { courtId } = useParams();
  const navigate = useNavigate();
  const [court, setCourt] = useState(null);
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const fetchData = async () => {
    try {
      const response = await getCourtByIdCourt(courtId);
      setCourt(response.data);
      // If your API returns image URLs, set them here
      const imagesFromAPI = response.data.images || [];
      setImages(imagesFromAPI);
      setImagePreviews(imagesFromAPI);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [courtId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourt((prev) => ({ ...prev, [name]: value }));
  };

  const handleSlotDurationChange = (e) => {
    const { value } = e.target;
    setCourt((prev) => ({ ...prev, slot_duration: value }));
  };

  const handleImageChange = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const newImages = [...images];
      newImages[index] = file;
      setImages(newImages);

      const newImagePreviews = [...imagePreviews];
      newImagePreviews[index] = URL.createObjectURL(file);
      setImagePreviews(newImagePreviews);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Handle form submission and image upload here
      // await updateCourtByIdCourt(courtId, court);
      navigate("/admin/courts");
    } catch (error) {
      console.error("Error updating court:", error);
    }
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
          <form className="updateProfile" onSubmit={handleSubmit}>
            <div className="updateProfileLeft">
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
            </div>
            <div className="updateProfileLeft">
              <TextField
                name="startTime"
                label="Start Time"
                value={court.startTime}
                onChange={handleChange}
                fullWidth
                type="time"
                margin="normal"
              />
              <TextField
                name="endTime"
                label="End Time"
                value={court.endTime}
                onChange={handleChange}
                fullWidth
                type="time"
                margin="normal"
              />
              <FormControl fullWidth margin="normal">
                <InputLabel id="slotDurationLabel">
                  Slot Duration (minutes)
                </InputLabel>
                <Select
                  labelId="slotDurationLabel"
                  id="slotDuration"
                  value={court.duration}
                  name="duration"
                  onChange={handleSlotDurationChange}
                  label="Slot Duration (minutes)"
                >
                  <MenuItem value={30}>30</MenuItem>
                  <MenuItem value={60}>60</MenuItem>
                </Select>
              </FormControl>
            </div>
            <div className="updateProfileLeft updateCourtFormImages">
              <h3>Images</h3>
              <div className="imagePreviews">
                {imagePreviews.slice(0, 5).map((src, index) => (
                  <div key={index} className="imagePreviewContainer">
                    <img
                      src={src.replace("blob:", "")}
                      alt={`Preview ${index}`}
                      className="imagePreview"
                    />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageChange(e, index)}
                    />
                  </div>
                ))}
              </div>

              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
              >
                Update
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateCourt;
