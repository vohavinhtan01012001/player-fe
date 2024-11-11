import { Edit, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { BannerService } from "../../../services/bannerService";
import Table, { Column } from "../../../components/Table";
import ConfirmDelete from "../../../components/ConfirmDelete";
import BannerForm from "./components/BannerForm";
import SwitchStatus from "../../../components/SwitchStatus";
import { toast } from "react-toastify";

export type BannerType = {
    id: number;
    title: string;
    image: string;
}

const Banner = () => {
    const [isOpenForm, setIsOpenForm] = useState(false);
    const [banners, setBanners] = useState<BannerType[]>([]);
    const [banner, setBanner] = useState<BannerType | null>(null);
    const [isOpenConfirm, setIsOpenConfirm] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        getBannerList();
    }, []);

    const getBannerList = async () => {
        try {
            const res = await BannerService.getBanners();
            setBanners(res.data.data);
        } catch (error: any) {
            console.log(error);
        }
    };

    const handleActions = (action: string, banner: any) => {
        switch (action) {
            case 'edit':
                setIsOpenForm(true);
                setBanner(banner);
                break;
            case 'delete':
                setIsOpenConfirm(true);
                setBanner(banner);
                break;
            default:
                break;
        }
    };

    const handleCloseDelete = () => {
        setIsOpenConfirm(false);
        setBanner(null);
    };

    const handleDelete = async () => {
        if (banner) {
            try {
                await BannerService.deleteBanner(banner.id);
                setIsOpenConfirm(false);
                getBannerList();
                handleCloseDelete();
            } catch (error: any) {
                console.log(error);
            }
        }
    };
    const handleUpdateStatus = async (checked: boolean, row: any) => {
        try {
            const valueCheck = checked ? 1 : 0;
            const res = await BannerService.updateBanner(row.id, {
                status: valueCheck,
            });
            toast.success(res.data.msg);
            getBannerList();
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
            field: 'title',
            headerName: 'Title',
        },
        {
            field: 'image',
            headerName: 'Image',
            render: (row) => {
                return (
                    <div>
                        <img
                            src={row.image}
                            alt={row.title}
                            className="w-10 h-10"
                        />
                    </div>
                );
            }
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
                        <button className="w-10 h-10" onClick={() => handleActions('edit', row)}>
                            <Edit size={20} className="mx-auto" />
                        </button>
                        <button className="pb-[2px] w-10 h-10" onClick={() => handleActions('delete', row)}>
                            <Trash2 size={20} className="mx-auto" />
                        </button>
                    </div>
                );
            }
        },
    ];

    return (
        <div className="max-w-[1500px] px-6 pt-36 flex flex-col mx-auto gap-4 h-full">
            <div className="flex">
                <button
                    onClick={() => setIsOpenForm(true)}
                    className="shadow-lg flex items-center gap-1 px-4 bg-slate-600 py-2 rounded-full text-white hover:opacity-80 duration-300"
                >
                    <Plus size={22} />
                    <span>Create Banner</span>
                </button>
            </div>
            <div className="w-full">
                <Table columns={columns} data={banners} setCurrentPage={setCurrentPage} currentPage={currentPage} />
            </div>
            <BannerForm
                open={isOpenForm}
                setOpen={setIsOpenForm}
                banner={banner}
                setBanner={setBanner}
                getBannerList={getBannerList}
            />
            <ConfirmDelete
                open={isOpenConfirm}
                handleClose={handleCloseDelete}
                onDelete={handleDelete}
                title={`Are you sure you want to delete the banner "${banner?.title}"?`}
            />
        </div>
    );
};

export default Banner;
