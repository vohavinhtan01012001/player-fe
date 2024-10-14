import { BookUser, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { PlayerService } from "../../../services/playerService";
import Table, { Column } from "../../../components/Table";
import ConfirmDelete from "../../../components/ConfirmDelete";
import PlayerForm from "./components/PlayerForm";
import SwitchStatus from "../../../components/SwitchStatus";
import { toast } from "react-toastify";

export type PlayerType = {
    id: number;
    avatar: string;
    name: string;
    email: string;
    Games: any[];
    images: string[];
    description: string;
    achievements: any[];
    status:number;
};

const Player = () => {
    const [isOpenForm, setIsOpenForm] = useState(false);
    const [players, setPlayers] = useState<PlayerType[]>([]);
    const [player, setPlayer] = useState<PlayerType | null>(null);
    const [isOpenConfirm, setIsOpenConfirm] = useState(false);


    useEffect(() => {
        getPlayerList();
    }, []);

    const getPlayerList = async () => {
        try {
            const res = await PlayerService.getPlayers();
            setPlayers(res.data.data);
        } catch (error: any) {
            console.log(error);
        }
    };

    const handleActions = (action: string, player: any) => {
        switch (action) {
            case 'detail':
                setIsOpenForm(true);
                setPlayer(player);
                break;
            case 'delete':
                setIsOpenConfirm(true);
                setPlayer(player);
                break;
            default:
                break;
        }
    };

    const handleCloseDelete = () => {
        setIsOpenConfirm(false);
        setPlayer(null);
    };

    const handleDelete = async () => {
        if (player) {
            try {
                await PlayerService.deletePlayer(player.id);
                setIsOpenConfirm(false);
                getPlayerList();
                handleCloseDelete();
            } catch (error: any) {
                console.log(error);
            }
        }
    };

    const handleUpdateStatus = async (checked: boolean, row: any) => {
        try {
            const valueCheck = checked ? 1 : 0;
            const res = await PlayerService.updatePlayer(row.id, {
                status: valueCheck,
            });
            toast.success(res.data.msg);
            getPlayerList();
        } catch (error: any) {
            toast.error(error?.response?.data?.message);
        }
    };

    const columns: Column[] = [
        {
            field: 'id',
            headerName: 'Id',
        },
        {
            field: 'name',
            headerName: 'Name',
        },
        {
            field: 'email',
            headerName: 'Email',
        },
        {
            field: 'status',
            headerName: 'Status',
            render: (row) => {
                return <SwitchStatus row={row} handleUpdate={handleUpdateStatus} />
            }
        },
        {
            field: 'actions',
            headerName: <div className="text-center">Actions</div>,
            render: (row) => {
                return (
                    <div className="flex items-center gap-4 justify-center text-[#333]">
                        <button className="w-10 h-10" onClick={() => handleActions('detail', row)}>
                            <BookUser size={20} className="mx-auto" />
                        </button>
                        <button className="pb-[2px] w-10 h-10" onClick={() => handleActions('delete', row)}>
                            <Trash2 size={20} className="mx-auto" />
                        </button>
                    </div>
                );
            },
        },
    ];

    return (
        <div className="w-[1500px] px-6 pt-36 flex flex-col mx-auto gap-4 h-full">
            <div className="flex ">
                <button
                    onClick={() => setIsOpenForm(true)}
                    className="shadow-lg flex items-center gap-1 px-4 bg-slate-600 py-2 rounded-full text-white hover:opacity-80 duration-300">
                    <Plus size={22} />
                    <span>Create Player</span>
                </button>
            </div>
            <div className="w-full ">
                <Table columns={columns} data={players} />
            </div>
            <ConfirmDelete
                open={isOpenConfirm}
                handleClose={handleCloseDelete}
                onDelete={handleDelete}
                title={`Are you sure you want to delete the player "${player?.email}"?`}
            />
            <PlayerForm
                open={isOpenForm}
                setOpen={setIsOpenForm}
                getPlayerList={getPlayerList}
                player={player}
                setPlayer={setPlayer}
            />
        </div>
    );
};

export default Player;
