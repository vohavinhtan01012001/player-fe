import React, { useEffect, useState } from 'react'
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { LineChart } from '@mui/x-charts';
import { RentalRequestService } from '../../../../services/rentalRequestService';

const optionsStatus = [
    {
        label: 'Completed',
        value: 2,
    },    // Đã giao dịch
    {
        label: 'In Progress',
        value: 1
    } // Đang giao dịch
];
const getCurrentYear = () => new Date().getFullYear();
export default function TransactionVolume() {
    const [dataRental, setDataRental] = useState<any[]>([]);
    const [selectedStatus, setSelectedStatus] = useState(optionsStatus[0].value);
    const [selectedYear, setSelectedYear] = useState(getCurrentYear());
    const mapMonthCountsToEnglish = (monthlyCounts: number[]): any[] => {
        const monthsInEnglish = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];

        if (monthlyCounts.length !== 12) {
            throw new Error("The input array must have 12 elements, one for each month.");
        }

        return monthlyCounts.map((count, index) => ({
            label: monthsInEnglish[index],
            value: count
        }));
    }

    const getRentalRequestAllByStatuss = async () => {
        try {
            const res = await RentalRequestService.getAllRentalRequestByStatus(selectedStatus, selectedYear);
            setDataRental(mapMonthCountsToEnglish(res.data.data));
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getRentalRequestAllByStatuss();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedStatus, selectedYear]);


    const handleChange = (e: any) => {
        setSelectedStatus(e.target.value)
    }

    const handleChangeYear = (e: any) => {
        setSelectedYear(e.target.value)
    }
    return (
        <div className="flex flex-col justify-center items-center w-full  bg-white shadow-lg py-6 rounded-lg px-4 border">
            <h1 className="font-semibold text-2xl tracking-wider uppercase text-center">total transaction volume</h1>
            <div className='py-2'>
                <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                    <InputLabel id="demo-select-small-label">Year</InputLabel>
                    <Select
                        labelId="demo-select-small-label"
                        id="demo-select-small"
                        label="Year"
                        onChange={handleChangeYear}
                        value={selectedYear}
                        className='bg-white'
                    >
                        {Array.from({ length: 10 }, (_, i) => {
                            const year = getCurrentYear() - 3 + i;
                            return (
                                <MenuItem key={year} value={year}>
                                    {year}
                                </MenuItem>
                            );
                        })}
                    </Select>
                </FormControl>
                <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                    <InputLabel id="demo-select-small-label">Status</InputLabel>
                    <Select
                        labelId="demo-select-small-label"
                        id="demo-select-small"
                        label="Status"
                        onChange={handleChange}
                        value={selectedStatus}
                        className='bg-white'
                    >
                        {
                            optionsStatus.map((item, index) =>
                                <MenuItem key={index} value={item.value}>{item.label}</MenuItem>
                            )
                        }
                    </Select>
                </FormControl>
            </div>
            <LineChart
                xAxis={[{ scaleType: 'point', data: [...dataRental.map(item => item.label)] }]}
                series={[
                    {
                        data: [...dataRental.map(item => item.value)],
                        label: 'Number of transactions',
                        area: true,
                    },
                ]}
                width={850}
                height={320}
            />
        </div>
    )
}
