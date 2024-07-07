import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  TextField,
  Button,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import "../new/NewCourt.css";
import { ref, uploadBytes, getDownloadURL, getStorage } from "firebase/storage";
import Sidebar from "../../components/courtowner/sidebar/Sidebar";
import app from "../../firebase";
import dayjs from "dayjs";
import { createCourt } from "../../services/UserServices";
import { useSelector } from "react-redux";
import { selectUser } from "../../redux/userSlice";

const districtList = [
  "Quận 1", "Quận 3", "Quận 4", "Quận 5", "Quận 6", "Quận 7", "Quận 8",
  "Quận 10", "Quận 11", "Quận 12", "Phú Nhuận", "Bình Thạnh",
  "Gò Vấp", "Tân Bình", "Bình Tân", "Tân Phú",
  "Thủ Đức", "Bình Chánh", "Hóc Môn", "Củ Chi", "Cần Giờ", "Nhà Bè"
];

const NewCourt = () => {
  const user = useSelector(selectUser)?.user;

  const initialFormData = {
    courtName: "",
    district: "",
    courtAddress: "",
    courtQuantity: null,
    duration: null,
    startTime: null,
    endTime: null,
    images: [],
    userID: user.userID,
    statusCourt: 0,
    serviceCourt: [],
    prices: [
      { startTime: null, endTime: null, unitPrice: null },
      { startTime: null, endTime: null, unitPrice: null },
    ],
  };

  const [formData, setFormData] = useState(initialFormData);
  const [imageFiles, setImageFiles] = useState(new Array(5).fill(null));
  const [upLoading, setUploading] = useState(false);
  const [imageURLs, setImageURLs] = useState([]);
  const [services, setServices] = useState({
    WIFI: false,
    WATER: false,
    PARKING: false,
    RESTAURANT: false,
    FOOD: false,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "courtQuantity" ? parseInt(value, 10) : value,
    });
  };

  const handleSlotDurationChange = (e) => {
    setFormData({
      ...formData,
      duration: e.target.value,
    });
  };

  const handleImageChange = (index) => (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      const updatedImageFiles = [...imageFiles];
      updatedImageFiles[index] = files[0];
      setImageFiles(updatedImageFiles);
    }
  };

  const handleTimeChange = (name) => (newValue) => {
    setFormData((prevFormData) => {
      let updatedPrices = [...prevFormData.prices];
      if (name === "startTime") {
        updatedPrices[0].startTime = newValue; // Start Time AM
      } else if (name === "endTime") {
        updatedPrices[1].endTime = newValue; // End Time PM
      } else if (name === "end_time_am") {
        updatedPrices[0].endTime = newValue; // End Time AM
        updatedPrices[1].startTime = newValue; // Start Time PM
      }
      return {
        ...prevFormData,
        [name]: newValue,
        prices: updatedPrices,
      };
    });
  };

  const handleServiceChange = (e) => {
    const { name, checked } = e.target;
    setServices({
      ...services,
      [name]: checked,
    });
  };

  const handlePriceChange = (index, field) => (e) => {
    const value =
      field === "unitPrice" ? parseFloat(e.target.value) : e.target.value;
    const updatedPrices = [...formData.prices];
    updatedPrices[index][field] = value;
    setFormData({
      ...formData,
      prices: updatedPrices,
    });
  };

  const uploadImages = async () => {
    const storage = getStorage(app);
    const uploadPromises = imageFiles.map(async (image) => {
      if (image) {
        const storageRef = ref(storage, `images/${Date.now()}_${image.name}`);
        await uploadBytes(storageRef, image);
        const downloadURL = await getDownloadURL(storageRef);
        return downloadURL;
      }
      return null;
    });

    return Promise.all(uploadPromises);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (
      !formData.courtName ||
      !formData.district ||
      !formData.courtAddress ||
      !formData.courtQuantity ||
      !formData.duration ||
      !formData.startTime ||
      !formData.endTime ||
      imageFiles.some((image) => image === null) ||
      !formData.prices[0].endTime ||
      !formData.prices[1].unitPrice
    ) {
      toast.error("Please fill out all required fields and upload 5 images.");
      return;
    }

    if (dayjs(formData.endTime).isBefore(dayjs(formData.startTime))) {
      toast.error("End time must be after start time.");
      return;
    }

    if (
      dayjs(formData.prices[0].endTime).isBefore(dayjs(formData.startTime)) ||
      dayjs(formData.prices[0].endTime).isAfter(dayjs(formData.endTime))
    ) {
      toast.error("End Time AM must be between Start Time and End Time.");
      return;
    }

    setUploading(true);
    try {
      const uploadedImageURLs = await uploadImages();
      const selectedServices = Object.keys(services).filter(
        (service) => services[service]
      );

      const { end_time_am, ...finalFormData } = {
        ...formData,
        images: uploadedImageURLs.filter((url) => url !== null),
        serviceCourt: selectedServices,
        startTime: formData.startTime
          ? formData.startTime.format("HH:00:00")
          : "",
        endTime: formData.endTime ? formData.endTime.format("HH:00:00") : "",
        prices: formData.prices.map((price) => ({
          ...price,
          startTime: price.startTime ? price.startTime.format("HH:00:00") : "",
          endTime: price.endTime ? price.endTime.format("HH:00:00") : "",
          unitPrice: price.unitPrice !== null ? Number(price.unitPrice) : null,
        })),
      };

      console.log(finalFormData);
      const res = await createCourt(finalFormData);
      console.log(res.status);
      if (res.status === 200) {
        toast.success("Court created successfully!");
        setFormData(initialFormData);
        setImageFiles(new Array(5).fill(null));
        setImageURLs(uploadedImageURLs.filter((url) => url !== null));
      } else {
        toast.error("Failed to fetch court details");
      }

      setFormData(initialFormData);
      setImageFiles(new Array(5).fill(null));
      setImageURLs(uploadedImageURLs.filter((url) => url !== null));
    } catch (err) {
      toast.error("An error occurred while fetching court details");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="newCourt">
      <Sidebar />
      <div className="newCourtContainer">
        <ToastContainer />

        <div className="newCourtHeader">
          <h3>
            <PersonAddAlt1Icon style={{ fontSize: "70px" }} />
            Add Court Form
          </h3>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="colum">
            <div className="formSection top-left">
              <h2 style={{ textAlign: "center" }}>Information</h2>
              <TextField
                id="courtName"
                label="Court Name*"
                variant="outlined"
                name="courtName"
                value={formData.courtName}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
              <FormControl fullWidth margin="normal">
                <InputLabel id="districtLabel">District*</InputLabel>
                <Select
                label= 'District'
                  labelId="districtLabel"
                  id="district"
                  name="district"
                  value={formData.district}
                  onChange={handleInputChange}
                >
                  {districtList.map((district, index) => (
                    <MenuItem key={index} value={district}>
                      {district}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                id="courtAddress"
                label="Court Address*"
                variant="outlined"
                name="courtAddress"
                value={formData.courtAddress}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
              <TextField
                id="courtQuantity"
                label="Court Quantity*"
                variant="outlined"
                name="courtQuantity"
                value={formData.courtQuantity}
                onChange={handleInputChange}
                type="number"
                fullWidth
                margin="normal"
              />
              {[...Array(5)].map((_, index) => (
                <div key={index} style={{ marginBottom: "15px" }}>
                  <input type="file" onChange={handleImageChange(index)} />
                  {/* {imageURLs[index] && (
                    <img
                      src={imageURLs[index]}
                      alt={`Uploaded ${index + 1}`}
                      style={{ maxWidth: 150 }}
                    />
                  )} */}
                </div>
              ))}
            </div>

            <div className="formSection top-right">
              <h2 style={{ textAlign: "center" }}>Services</h2>

              <FormControlLabel
                control={
                  <Checkbox
                    checked={services.WIFI}
                    onChange={handleServiceChange}
                    name="WIFI"
                  />
                }
                label="Wifi"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={services.WATER}
                    onChange={handleServiceChange}
                    name="WATER"
                  />
                }
                label="Nước uống"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={services.PARKING}
                    onChange={handleServiceChange}
                    name="PARKING"
                  />
                }
                label="Bãi đỗ xe máy"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={services.RESTAURANT}
                    onChange={handleServiceChange}
                    name="RESTAURANT"
                  />
                }
                label="Căng tin"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={services.FOOD}
                    onChange={handleServiceChange}
                    name="RESTAURANT"
                  />
                }
                label="Đồ ăn"
              />
            </div>
          </div>
          <div className="colum">
            <div className="formSection bottom-left">
              <h2 style={{ textAlign: "center" }}>Time</h2>
              <div className="aaaaaa">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <TimePicker
                    label="Start Time*"
                    views={["hours"]}
                    value={formData.startTime}
                    onChange={handleTimeChange("startTime")}
                    renderInput={(params) => (
                      <TextField {...params} fullWidth margin="normal" />
                    )}
                  />

                  <TimePicker
                    label="End Time*"
                    views={["hours"]}
                    value={formData.endTime}
                    onChange={handleTimeChange("endTime")}
                    renderInput={(params) => (
                      <TextField {...params} fullWidth margin="normal" />
                    )}
                  />
                </LocalizationProvider>
              </div>
              <FormControl fullWidth margin="normal">
                <InputLabel id="slotDurationLabel">
                  Slot Duration (minutes)*
                </InputLabel>
                <Select
                label='Slot Duration (minutes)*'
                  labelId="slotDurationLabel"
                  id="slotDuration"
                  value={formData.duration}
                  name="slot_duration"
                  onChange={handleSlotDurationChange}
                >
                  <MenuItem value={30}>30</MenuItem>
                  <MenuItem value={60}>60</MenuItem>
                </Select>
              </FormControl>
            </div>

            <div className="formSection bottom-right">
              <h2 style={{ textAlign: "center" }}>Prices</h2>

              <div className="aaaaaa"></div>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <div className="aaaaaa">
                  <TimePicker
                    label="Start Time AM"
                    views={["hours"]}
                    value={formData.startTime}
                    onChange={handleTimeChange("startTime")}
                    renderInput={(params) => (
                      <TextField {...params} fullWidth margin="normal" />
                    )}
                    disabled
                  />
                  <TimePicker
                    label="End Time AM"
                    views={["hours"]}
                    value={formData.prices[0].endTime}
                    onChange={handleTimeChange("end_time_am")}
                    renderInput={(params) => (
                      <TextField {...params} fullWidth margin="normal" />
                    )}
                  />
                </div>

                <TextField
                  label="Unit Price AM"
                  type="number"
                  value={formData.prices[0].unitPrice}
                  onChange={handlePriceChange(0, "unitPrice")}
                  fullWidth
                  margin="normal"
                />
                <div className="aaaaaa">
                  <TimePicker
                    label="Start Time PM"
                    views={["hours"]}
                    value={formData.prices[1].startTime}
                    onChange={handleTimeChange("end_time_am")}
                    renderInput={(params) => (
                      <TextField {...params} fullWidth margin="normal" />
                    )}
                    disabled
                  />
                  <TimePicker
                    label="End Time PM"
                    views={["hours"]}
                    value={formData.endTime}
                    onChange={handleTimeChange("endTime")}
                    renderInput={(params) => (
                      <TextField {...params} fullWidth margin="normal" />
                    )}
                    disabled
                  />
                </div>

                <TextField
                  label="Unit Price PM"
                  type="number"
                  value={formData.prices[1].unitPrice}
                  onChange={handlePriceChange(1, "unitPrice")}
                  fullWidth
                  margin="normal"
                />
              </LocalizationProvider>
              <Button
                type="submit"
                variant="contained"
                color="success"
                disabled={upLoading}
                fullWidth
              >
                {upLoading ? "Uploading" : "Submit"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewCourt;
