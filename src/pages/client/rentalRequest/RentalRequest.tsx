import { useEffect, useState } from 'react';
import Label from '../../../components/Label';
import { RentalRequestService } from '../../../services/rentalRequestService';
import { UserService } from '../../../services/userService';
import { toast } from 'react-toastify';
import { PlayerService } from '../../../services/playerService';
import { Send, X } from 'lucide-react';

const RentalRequestList = () => {
    const [rentalRequestList, setRentalRequestList] = useState<any[]>([]);
    const [player, setPlayer] = useState<any>(null);

    const getPlayer = async () => {
        try {
            const user = await UserService.getUser();
            if (user.data.data) {
                const res = await PlayerService.getPlayers();
                setPlayer(res.data.data.find((item: any) => user.data.data.id === item.userId))
            }
        } catch (error: any) {
            console.log(error?.response?.data?.message || 'Failed to fetch user data');
        }
    };

    useEffect(() => {
        getPlayer();
    }, []);

    useEffect(() => {
        if (player) {
            getRentalRequestList();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [player]);

    const getRentalRequestList = async () => {
        try {
            const res = await RentalRequestService.getRentalRequestByIdPlayer(player?.id);
            setRentalRequestList(res.data.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleClose = async (id: number) => {
        try {
            await RentalRequestService.deleteRentalRequest(id)
            toast.success("Rental request cancel successfully")
            getRentalRequestList();
        } catch (error: any) {
            toast.error(error?.response?.data?.message);
        }
    }


    return (
        <div className="min-h-screen w-[1200px] p-6 shadow-lg rounded-lg mx-auto my-4 border">
            <div>
                <h2 className='text-3xl text-center font-bold uppercase tracking-wider'>Rental Request</h2>
            </div>
            {
                rentalRequestList.map((rentalRequest) => {
                    return (
                        <div className='flex items-center w-full border rounded-lg shadow-md py-3 px-5 justify-between my-6 text-base font-semibold'>
                            <div className='flex items-center gap-3'>
                                <Label>User: </Label>
                                <p>{rentalRequest.User.fullName}</p>
                            </div>
                            <div className='flex gap-10 items-center justify-start w-[50%]'>
                                <p>hours: {rentalRequest.hours}</p>
                                <p>sumPrice: {new Intl.NumberFormat('vi-VN').format(rentalRequest.totalPrice)} VNĐ</p>
                            </div>
                            <div className="flex justify-center items-center gap-3">
                                <button
                                    type="button"
                                    className='flex items-center gap-2 text-base font-semibold border bg-white hover:opacity-80 text-[#333] py-1 px-4 rounded-md'
                                    onClick={() => handleClose(rentalRequest.id)}
                                >
                                    <div className='flex items-center justify-center gap-1'>
                                        <X size={18} />
                                        <span>No</span>
                                    </div>
                                </button>
                                <button
                                    type="button"
                                    // onClick={handleSubmit}
                                    className={` flex items-center gap-2 text-base font-semibold border border-slate-600 bg-slate-600 hover:opacity-80 text-white py-1 px-4 rounded-md`}
                                >
                                    <div className='flex items-center justify-center gap-1'>
                                        <><Send size={18} /><span>Yes</span></>
                                    </div>
                                </button>
                            </div>
                        </div>
                    )
                })
            }
        </div>
    );
};

export default RentalRequestList;
