import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import { getPriceByIdCourt } from '../../services/UserServices';

const CourtPrice = ({ courtID }) => {
  const [listPrice, setListPrice] = useState([]);


  const fetchData = async () => {
    try {
      console.log(courtID)
      const response = await getPriceByIdCourt(courtID);
      setListPrice(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [courtID]);

  return (
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
  );
};

export default CourtPrice;
