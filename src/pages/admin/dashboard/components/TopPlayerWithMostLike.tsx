import { useEffect, useState } from "react";
import { CommentService } from "../../../../services/commentService"
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
const monthsInEnglish = [
    { label: "January", value: 1 },
    { label: "February", value: 2 },
    { label: "March", value: 3 },
    { label: "April", value: 4 },
    { label: "May", value: 5 },
    { label: "June", value: 6 },
    { label: "July", value: 7 },
    { label: "August", value: 8 },
    { label: "September", value: 9 },
    { label: "October", value: 10 },
    { label: "November", value: 11 },
    { label: "December", value: 12 }
]
const getCurrentMonth = () => new Date().getMonth() + 1;
const getCurrentYear = () => new Date().getFullYear();
export default function TopPlayerWithMostLike() {
    const [selectedYear, setSelectedYear] = useState(getCurrentYear());
    const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
    const [data, setData] = useState<any[]>([])
    const getTopPlayer = async () => {
        try {
            const res = await CommentService.getTop5PlayersWithMostLikes(selectedMonth, selectedYear);
            setData(res.data.data)
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        getTopPlayer()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedYear, selectedMonth])
    const handleChangeYear = (e: any) => {
        setSelectedYear(e.target.value)
    }
    const handleChange = (e: any) => {
        setSelectedMonth(e.target.value)
    }
    return (
        <div className="flex flex-col py-6 justify-center items-center w-full bg-white shadow-lg rounded-lg px-4 border">
            <h1 className="font-semibold text-2xl tracking-wider uppercase text-center">Top 5 Most Favorite Players</h1>
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
                    <InputLabel id="demo-select-small-label">Month</InputLabel>
                    <Select
                        labelId="demo-select-small-label"
                        id="demo-select-small"
                        label="Month"
                        onChange={handleChange}
                        value={selectedMonth}
                        className='bg-white'
                    >
                        {
                            monthsInEnglish.map((item, index) => {
                                return <MenuItem key={index} value={item.value}>{item.label}</MenuItem>
                            })
                        }
                    </Select>
                </FormControl>
            </div>
            <div className="my-2">
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 800 }} aria-label="transaction history table">
                        <TableHead>
                            <TableRow>
                                <TableCell></TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Average rating (0 {'->'} 5)</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.map((row, index) => (
                                <TableRow
                                    key={row.id}
                                    className={`${index === 0 ? "bg-yellow-300" : ""}`}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row">
                                        Top {index + 1}
                                    </TableCell>
                                    <TableCell>{row.playerName}</TableCell>
                                    <TableCell>{row.playerEmail}</TableCell>
                                    <TableCell>{row.averageRating}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </div>
    )
}
