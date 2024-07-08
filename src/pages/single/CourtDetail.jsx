import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Slide,
  ImageList,
  ImageListItem,
  TableRow,
  TableCell,
  Table,
  TableHead,
  TableBody,
} from "@mui/material";
import { CiWifiOn } from "react-icons/ci";
import { FaMotorcycle } from "react-icons/fa";
import { GiWaterBottle } from "react-icons/gi";
import { MdOutlineFastfood } from "react-icons/md";
import { IoMdRestaurant } from "react-icons/io";
import "./CourtDetail.css";
import { getPriceByIdCourt } from "../../services/UserServices";

const CourtDetail = ({ open, onClose, court }) => {
  const Transition = React.forwardRef((props, ref) => (
    <Slide direction="up" ref={ref} {...props} />
  ));

  const itemData = court.images;
  console.log(itemData);

  const [listPrice, setListPrice] = useState([]);

  const fetchData = async () => {
    try {
      console.log(court.courtID);
      const response = await getPriceByIdCourt(court.courtID);
      setListPrice(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [court.courtID]);

  return (
    <Dialog
      fullScreen={false}
      TransitionComponent={Transition}
      open={open}
      onClose={onClose}
      aria-labelledby="responsive-dialog-title"
    >
      <DialogContent>
        <div className="singleCourt">
          <div className="singleCourtContainer">
            <div className="courtTitle">Information Court</div>
            <div className="courtBody">
              <div className="courtImage">
                <ImageList sx={{ width: "full", height: "full" }} cols={3}>
                  {itemData.map((item) => (
                    <ImageListItem key={item.imageID}>
                      <img
                        srcSet={item.image}
                        src={item.image}
                        loading="lazy"
                      />
                    </ImageListItem>
                  ))}
                </ImageList>
              </div>
              <div className="courtDetails">
                <div className="courtDetail">
                <div className="amenities-container">

                <div className="courtDetailItem">
                    <span className="courtItemKey">ID Sân: </span>
                    <span className="courtItemValue">{court.courtID}</span>
                  </div>
                  <div className="courtDetailItem">
                    <span className="courtItemKey">Tên Sân : </span>
                    <span className="courtItemValue">{court.courtName}</span>
                  </div>
                  <div className="courtDetailItem">
                    <span className="courtItemKey">Khu Vực: </span>
                    <span className="courtItemValue">{court.district}</span>
                  </div>
                  <div className="courtDetailItem">
                    <span className="courtItemKey">Địa Chỉ: </span>
                    <span className="courtItemValue">{court.courtAddress}</span>
                  </div>
                  <div className="courtDetailItem">
                    <span className="courtItemKey">Quy Mô: </span>
                    <span className="courtItemValue">
                      {court.courtQuantity} Sân
                    </span>
                  </div>
                  <div className="courtDetailItem">
                    <span className="courtItemKey">Thời Gian Mỗi Slot: </span>
                    <span className="courtItemValue">
                      {court.duration} phút
                    </span>
                  </div>
                </div>

                </div>

                <div className="courtPriceSlot">
                  <div className="amenities-container">
                    <ul className="amenities-list">
                      {court.serviceCourt.map((amenity, index) => (
                        <li key={index} className="amenity-item">
                          <div className="amenity-icon">
                            {amenity.serviceName === "WIFI" ? (
                              <CiWifiOn />
                            ) : amenity.serviceName === "WATER" ? (
                              <GiWaterBottle />
                            ) : amenity.serviceName === "PARKING" ? (
                              <FaMotorcycle />
                            ) : amenity.serviceName === "RESTAURANT" ? (
                              <IoMdRestaurant />
                            ) : amenity.serviceName === "FOOD" ? (
                              <MdOutlineFastfood />
                            ) : (
                              "Không có tiện ích"
                            )}
                          </div>
                          <div>{amenity.serviceName}</div>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Open Time</TableCell>
                        <TableCell>Close Time</TableCell>
                        <TableCell>Unit Price (VND/1h)</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {listPrice.map((price) => (
                        <TableRow key={price.priceID}>
                          <TableCell>{price.startTime}</TableCell>
                          <TableCell>{price.endTime}</TableCell>
                          <TableCell>{price.unitPrice * 1000}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} autoFocus>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CourtDetail;
