import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { SystemService } from "../../../services/systemService";
import { UserService } from "../../../services/userService";

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
    { label: "December", value: 12 },
];

const getCurrentMonth = () => new Date().getMonth() + 1;
const getCurrentYear = () => new Date().getFullYear();

export default function TransactionHistory() {
    const [selectedYear, setSelectedYear] = useState(getCurrentYear());
    const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
    const [transactions, setTransactions] = useState<any[]>([]);

    const fetchTransactions = async () => {
        try {
            const user = await UserService.getUser();
            const res = await SystemService.getTrans(selectedMonth, selectedYear, user.data.data.id);
            setTransactions(res.data.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchTransactions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedYear, selectedMonth]);

    const handleChangeYear = (e: any) => {
        setSelectedYear(e.target.value);
    };

    const handleChangeMonth = (e: any) => {
        setSelectedMonth(e.target.value);
    };

    return (
        <div className="flex flex-col py-6 justify-center items-center w-full bg-white shadow-lg rounded-lg px-4 border">
            <h1 className="font-semibold text-2xl tracking-wider uppercase text-center">Transaction History</h1>
            <div className="py-2 flex">
                <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                    <InputLabel id="select-year-label">Year</InputLabel>
                    <Select
                        labelId="select-year-label"
                        id="select-year"
                        value={selectedYear}
                        onChange={handleChangeYear}
                        className="bg-white"
                        label="Year"
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
                    <InputLabel id="select-month-label">Month</InputLabel>
                    <Select
                        labelId="select-month-label"
                        id="select-month"
                        value={selectedMonth}
                        onChange={handleChangeMonth}
                        className="bg-white"
                        label="Month"
                    >
                        {monthsInEnglish.map((month) => (
                            <MenuItem key={month.value} value={month.value}>
                                {month.label}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </div>
            <div className="my-2">
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 800 }} aria-label="transaction history table">
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Amount (USD)</TableCell>
                                <TableCell>FullName</TableCell>
                                <TableCell>Type</TableCell>
                                <TableCell>Description</TableCell>
                                <TableCell>Created At</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {transactions.map((transaction) => (
                                <TableRow
                                    key={transaction.id}
                                    className={`${transaction.amount < 0 ? "bg-red-100" : "bg-green-100"}`}
                                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                                >
                                    <TableCell>{transaction.id}</TableCell>
                                    <TableCell className="font-semibold">{new Intl.NumberFormat("en-US", {
                                        style: "currency",
                                        currency: "USD",
                                    }).format(transaction.amount)}</TableCell>
                                    <TableCell className="font-semibold">{transaction.User.fullName}</TableCell>
                                    <TableCell>{transaction.type}</TableCell>
                                    <TableCell>{transaction.description}</TableCell>
                                    <TableCell>{new Date(transaction.created_at).toLocaleString()}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </div>
    );
}
