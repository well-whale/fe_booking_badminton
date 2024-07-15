import * as React from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import {
    Container,
    Box,
    Typography,
    FormControl,
    RadioGroup,
    FormControlLabel,
    Radio,
    TextField,
    Button,
    Divider,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
  } from "@mui/material";

  const pData = [2, 3, 5, 8, 8, 10, 13];
  const xLabels = [
    'Tháng 1',
    'Tháng 2',
    'Tháng 3',
    'Tháng 4',
    'Tháng 5',
    'Tháng 6',
    'Tháng 7',
    'Tháng 8',
    'Tháng 9',
    'Tháng 10',
    'Tháng 11',
    'Tháng 12',

    

  ];
  
  export default function ChartCourt() {
    return (
        <div className='chartProfit'>
             <LineChart
        width={800}
        height={300}
        series={[
          { data: pData,area: true, showMark: false },
        //   { data: uData, label: 'uv' },
        ]}
        xAxis={[{ scaleType: 'point', data: xLabels }]}
      />
        </div>
      
    );
  }