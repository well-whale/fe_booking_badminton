import React, { useState } from "react";
import {
  TextField,
  Button,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Dialog,
  Slide,
} from "@mui/material";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import "../new/NewCourt.css";
import Sidebar from "../../components/admin/sidebar/Sidebar";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { imageDB } from "../../firebaseimage/Config";

const Transition = React.forwardRef((props, ref) => (
  <Slide direction="up" ref={ref} {...props} />
));

const NewCourt = ({ open, handleClose }) => {
  const initialFormData = {
    court_name: "",
    district: "",
    court_address: "",
    court_quantity: "",
    slot_duration: "",
    images: [],
  };

  const [formData, setFormData] = useState(initialFormData);
  const [imageFiles, setImageFiles] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSlotDurationChange = (e) => {
    setFormData({
      ...formData,
      slot_duration: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    setImageFiles([...e.target.files]);
  };

  const uploadImages = async () => {
    const uploadedImageURLs = await Promise.all(
      imageFiles.map(async (file) => {
        const storageRef = ref(imageDB, `courts/${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        return new Promise((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            (snapshot) => {
              // Handle progress if needed
            },
            (error) => {
              console.error("Upload failed:", error);
              reject(error);
            },
            () => {
              getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                resolve(downloadURL);
              });
            }
          );
        });
      })
    );

    return uploadedImageURLs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const uploadedImageURLs = await uploadImages();
    const updatedFormData = {
      ...formData,
      images: uploadedImageURLs,
    };
    console.log(updatedFormData);

    // Here you can add the API call to save the updatedFormData to your database

    setFormData(initialFormData);
    setImageFiles([]);
  };

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      aria-describedby="alert-dialog-slide-description"
    >
      <div className="newCourt">
        <div className="newCourtContainer">
          <div className="newCourtHeader">
            <h3>
              <PersonAddAlt1Icon style={{ fontSize: "70px" }} />
              Add Court Form
            </h3>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="newCourtFormRow">
              <div className="newCourtFormColumn">
                <TextField
                  id="courtName"
                  label="Court Name*"
                  variant="outlined"
                  name="court_name"
                  value={formData.court_name}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  id="district"
                  label="District*"
                  variant="outlined"
                  name="district"
                  value={formData.district}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                />
              </div>
              <div className="newCourtFormColumn">
                <TextField
                  id="courtAddress"
                  label="Court Address*"
                  variant="outlined"
                  name="court_address"
                  value={formData.court_address}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  id="courtQuantity"
                  label="Court Quantity*"
                  variant="outlined"
                  name="court_quantity"
                  value={formData.court_quantity}
                  onChange={handleInputChange}
                  type="number"
                  fullWidth
                  margin="normal"
                />
                <FormControl fullWidth margin="normal">
                  <InputLabel id="slotDurationLabel">Slot Duration (minutes)*</InputLabel>
                  <Select
                    labelId="slotDurationLabel"
                    id="slotDuration"
                    value={formData.slot_duration}
                    name="slot_duration"
                    onChange={handleSlotDurationChange}
                  >
                    <MenuItem value="30">30</MenuItem>
                    <MenuItem value="60">60</MenuItem>
                  </Select>
                </FormControl>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                />
                <div className="newCourtFormButtons">
                  <Button
                    type="submit"
                    variant="contained"
                    color="success"
                    className="newCourtFormButton"
                  >
                    Submit
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    className="newCourtFormButton"
                    onClick={() => {
                      setFormData(initialFormData);
                      setImageFiles([]);
                    }}
                  >
                    Reset
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </Dialog>
  );
};

export default NewCourt;
