import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import { getPriceByIdCourt } from '../../services/UserServices';

const CourtPrice = ({ courtID }) => {
  const [listPrice, setListPrice] = useState([]);
  const [value, setValue] = useState('1');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

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

  const activePrices = listPrice.filter(price => price.activeStatus === "TT");
  const inactivePrices = listPrice.filter(price => price.activeStatus === "CT");
  const allPrices = listPrice.filter(price => price.activeStatus === "ALL");

  return (
    <Box sx={{ width: '100%', typography: 'body1' }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChange} aria-label="court price tabs">
            {allPrices.length > 0 && <Tab label="Thứ 2 - Chủ nhật" value="3" />}
            {activePrices.length > 0 && <Tab label="Thứ 2 - Thứ 6" value="1" />}
            {inactivePrices.length > 0 && <Tab label="Thứ 7 Chủ nhật" value="2" />}
          </TabList>
        </Box>
        {allPrices.length > 0 && (
          <TabPanel value="3">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Open Time</TableCell>
                  <TableCell>Close Time</TableCell>
                  <TableCell>Unit Price (VND/1h)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {allPrices.map(price => (
                  <TableRow key={price.priceID}>
                    <TableCell>{price.openTime}</TableCell>
                    <TableCell>{price.closeTime}</TableCell>
                    <TableCell>{price.unitPrice*1000}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabPanel>
        )}
        {activePrices.length > 0 && (
          <TabPanel value="1">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Open Time</TableCell>
                  <TableCell>Close Time</TableCell>
                  <TableCell>Unit Price (VND/1h)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {activePrices.map(price => (
                  <TableRow key={price.priceID}>
                    <TableCell>{price.openTime}</TableCell>
                    <TableCell>{price.closeTime}</TableCell>
                    <TableCell>{price.unitPrice*1000}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabPanel>
        )}
        {inactivePrices.length > 0 && (
          <TabPanel value="2">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Open Time</TableCell>
                  <TableCell>Close Time</TableCell>
                  <TableCell>Unit Price (VND)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {inactivePrices.map(price => (
                  <TableRow key={price.priceID}>
                    <TableCell>{price.openTime}</TableCell>
                    <TableCell>{price.closeTime}</TableCell>
                    <TableCell>{price.unitPrice*1000}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabPanel>
        )}
      </TabContext>
    </Box>
  );
};

export default CourtPrice;
