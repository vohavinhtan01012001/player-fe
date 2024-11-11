import { Input, InputNumber, Modal, Select } from "antd";
import Label from "../../../../components/Label";
import { useEffect, useState } from "react";
import { Send, Wallet, X } from "lucide-react";
import { RentalRequestService } from "../../../../services/rentalRequestService";
import { toast } from "react-toastify";
import { UserService } from "../../../../services/userService";

type RentFormProps = {
    open: boolean
    setOpen: (value: boolean) => void
    player: any
    form: "Rent" | "Donate"
}

const RentForm = ({ open, setOpen, player, form }: RentFormProps) => {
    const [duration, setDuration] = useState<number>(1);
    const [price, setPrice] = useState(0)
    const [user, setUser] = useState<any>();
    const [message, setMessage] = useState("")

    const getUser = async () => {
        try {
            let res: any;
            if (localStorage.getItem('accessToken')) {
                res = await UserService.getUser();
                setUser(res.data.data);
            }
        } catch (error: any) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (open) {
            if (form === 'Rent') {
                setPrice(player?.price)
            }
            else {
                setPrice(0)
            }
            getUser()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open])

    const handleDurationChange = (value: number) => {
        setDuration(value);
        setPrice(player.price * value);
    };

    const handleClose = () => {
        setOpen(false);
        setDuration(1)
        setPrice(0)
    }


    const handleSubmit = async () => {
        try {
            if (form === "Rent") {
                const rental = await RentalRequestService.getRentalRequestByIdPlayer(player.id)
                const checkRental = rental.data.data.some((data: any) => data.userId === user.id);
                if (!checkRental) {
                    const payload = { totalPrice: price, hours: duration, playerId: player.id };
                    await RentalRequestService.createRentalRequest(payload);
                    toast.success("Rental request has been sent!")
                }
                else {
                    toast.warning("A rental request already exists!")
                }
            }
            else {
                if(price <= 0) {
                    toast.error("Price must be greater than 0");
                    return;
                }
                const payload = { price: price, playerId: player.id, message: message }
                await UserService.updatePrice(payload)
                toast.success("Donation successful!")
            }
            handleClose();
        } catch {
            toast.error("An error occurred!")
        }
    }

    return <Modal
        title={
            <div className="flex items-center gap-2 text-xl font-bold justify-center text-[#333]">
                {form === "Rent" ? "Rent Player" : "Donate Player"}
            </div>
        }
        open={open}
        onCancel={handleClose}
        width={500}
        footer={null}
        className="mt-6"
    >
        <div className="grid grid-cols-1 gap-4 border-t py-5">
            <div className="grid grid-cols-5 text-base font-semibold">
                {
                    form === "Rent" ? <>
                        <Label className={`col-span-3`}>Player:</Label>
                        <p className="col-span-2">{player?.name}</p>
                    </> : <>
                        <Label className={`col-span-1`}>Player:</Label>
                        <p className="col-span-4">{player?.name}</p>
                    </>
                }
            </div>
            {
                form === "Rent" ?
                    <>
                        <div className="grid grid-cols-5 text-base font-semibold">
                            <Label className="col-span-3">Duration:</Label>
                            <Select
                                className="col-span-2"
                                onChange={handleDurationChange}
                                defaultValue={1}
                                value={duration}
                                style={{ width: "100%" }}
                            >
                                {Array.from({ length: 24 }, (_, index) => (
                                    <Select.Option key={index + 1} value={index + 1}>
                                        {index + 1} hour
                                    </Select.Option>
                                ))}
                            </Select>

                        </div>
                        <div className="grid grid-cols-5 text-base font-semibold">
                            <Label className="col-span-3">Cost:</Label>
                            <p>{new Intl.NumberFormat('USD').format(price)} USD</p>
                        </div>
                    </> :
                    <>
                        <div className="text-base grid grid-cols-5 font-semibold gap-4">
                            <Label className="col-span-1">Amount:</Label>
                            <InputNumber
                                value={price}
                                type='number'
                                addonAfter="USD"
                                min={0}
                                max={user?.price}
                                defaultValue={0}
                                className="col-span-2"
                                onChange={(value) => {
                                    setPrice(value)
                                }}
                            />
                            <p className="col-span-2 flex flex-col items-start justify-center">{new Intl.NumberFormat('USD').format(price)} USD</p>
                        </div>
                        <div className="text-base grid grid-cols-5 font-semibold gap-4">
                            <Label>Note:</Label>
                            <Input type="text" className="col-span-4" onChange={(e) => setMessage(e.target.value)} />
                        </div>
                    </>
            }
            <div className="flex justify-center items-center gap-3">
                <button
                    type="button"
                    className='flex items-center gap-2 text-base font-semibold border bg-white hover:opacity-80 text-[#333] py-1 px-4 rounded-md'
                    onClick={handleClose}
                >
                    <div className='flex items-center justify-center gap-1'>
                        <X size={18} />
                        <span>Cancel</span>
                    </div>
                </button>
                <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={user?.price < price}
                    className={`flex items-center gap-2 text-base font-semibold border ${user?.price < price ? "opacity-80" : " "} border-slate-600 bg-slate-600 hover:opacity-80 text-white py-1 px-4 rounded-md`}
                >
                    {
                        user?.price >= price ?
                            <div className='flex items-center justify-center gap-1'>
                                <><Send size={18} /><span>{form === "Rent" ? "Rent" : "Donate"}</span></>
                            </div>
                            :
                            <div className='flex items-center justify-center gap-1'>
                                <><Wallet size={18} /><span>Insufficient balance</span></>
                            </div>
                    }
                </button>
            </div>
        </div>

    </Modal>
}

export default RentForm;
