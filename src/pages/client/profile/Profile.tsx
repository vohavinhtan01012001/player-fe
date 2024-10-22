import { useEffect, useState } from "react";
import { UserService } from "../../../services/userService";
import { PlayerService } from "../../../services/playerService";
import AvatarUploadField from "../../../components/AvatarUploadField";
import Label from "../../../components/Label";
import Input from "../../../components/Input";
import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitHandler, useForm } from "react-hook-form";
import { InputNumber, Select } from "antd";
import * as yup from 'yup';
import ImagesUploadField from "../../../components/ImagesUploadField";
import { Send, X } from "lucide-react";
import { GameType } from "../../admin/game/Game";
const { Option } = Select;

const validationSchema = yup.object().shape({
    avatar: yup
        .mixed<File>()
        .required('Avatar is required'),
    // .test('fileType', 'Unsupported File Format', (value) => {
    //     return value && ['image/jpeg', 'image/png', 'image/gif'].includes(value.type);
    // }),
    name: yup.string().required('Name is required'),
    email: yup.string().email('Invalid email format').required('Email is required'),
    password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
    description: yup.string(),
    games: yup.array()
        .of(yup.number().required('Game ID is required'))
        .min(1, 'At least one game is required')
        .required('Games are required'),
    images: yup.array().nullable()
    // .of(
    //     yup
    //         .mixed<File>()
    //         .required('Image is required')
    //         .test('fileType', 'Unsupported File Format', (value) => {
    //             return value && ['image/jpeg', 'image/png', 'image/gif'].includes(value.type);
    //         })
    // ),
    ,
    gender: yup.string().oneOf(['male', 'female'], 'Invalid gender').required('Gender is required'),
    price: yup.number().min(0, 'Price must be a positive number').required('Price is required'),
});


type FormData = {
    avatar: File;
    name: string;
    email: string;
    password: string;
    description?: string;
    games: number[];
    images?: File[] | null;
    gender: 'male' | 'female';
    price: number;
};

const Profile = () => {
    const { register, setValue, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
        resolver: yupResolver(validationSchema),
    });
    const [user, setUser] = useState<any>(null);
    const [player, setPlayer] = useState<any>(null);
    const [images, setImages] = useState<File[]>([]);
    const [loading, setLoading] = useState(false);
    const [games, setGames] = useState<GameType[]>([])
    const [selectedGames, setSelectedGames] = useState<number[]>([]);
    const [image, setImage] = useState<any>()
    const [price, setPrice] = useState<number>(0);
    const [description, setDescription] = useState<string>('')
    const getUser = async () => {
        try {
            let res: any;
            if (localStorage.getItem('accessToken')) {
                    res = await UserService.getUser()
                    setUser(res.data.data);
            }
        } catch (error: any) {
            console.log(error);
        }
    };

    useEffect(() => {
        getUser();
    }, []);

    const handleGamesChange = (value: number[]) => {
        setSelectedGames(value);
    };

    const handleClose = () => {

    }

    const onSubmit: SubmitHandler<any> = async (data) => { }

    return (
        <div className="border shadow-lg max-w-[1200px] min-h-screen mx-auto my-[20px] rounded-lg">
            <div className="p-4">
                {user && (
                    <div className="profile-container py-3 px-6">
                        <h1 className="text-3xl font-bold mb-4 text-center uppercase tracking-widest">Profile</h1>
                        <div className="flex flex-col gap-10 text-xl py-3">
                            <p className=""><strong>Name:</strong> {user.fullName}</p>
                            <p><strong>Email:</strong> {user.email}</p>
                            <p><strong>Price:</strong> {new Intl.NumberFormat('vi-VN').format(user.price)} VNĐ</p>
                        </div>
                    </div>
                )}
                {player && (
                    <div className="profile-container py-3 px-6">
                        <h1 className="text-3xl font-bold mb-4 text-center uppercase tracking-widest">Profile</h1>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className='border-t my-[20px] py-[15px] relative grid grid-cols-3 grid-rows-2 gap-4'>
                                <div className='px-2 flex flex-col gap-2 row-span-2 col-span-3 justify-center '>
                                    <AvatarUploadField setImage={setImage} image={player ? player.avatar : image} className="mx-auto w-52 h-52" />
                                    {errors.avatar && <p className='text-red-600'>{errors.avatar.message}</p>}
                                </div>
                                <div className='w-full px-2 flex flex-col gap-2'>
                                    <Label className='text-base font-semibold' required>Name</Label>
                                    {
                                        <Input
                                            className='border h-[35px] rounded outline-none p-3 w-full'
                                            type='text'
                                            {...register('name')}
                                            defaultValue={player.name}
                                            errorMessage={errors.name?.message}
                                        />
                                    }
                                </div>
                                <div className='w-full px-2 flex flex-col gap-2'>
                                    <Label className='text-base font-semibold' required>Email</Label>
                                    {
                                        <Input
                                            className='border h-[35px] rounded outline-none p-3 w-full'
                                            type='text'
                                            {...register('email')}
                                            defaultValue={player.email}
                                            errorMessage={errors.email?.message}
                                        />
                                    }
                                </div>
                                <div className='w-full px-2 flex flex-col gap-2'>
                                    <Label className='text-base font-semibold' required>Games</Label>
                                    <Select
                                        mode="multiple"
                                        style={{ width: '100%' }}
                                        placeholder="Select games"
                                        value={player.Games.map(item => item.id)}
                                        onChange={handleGamesChange}
                                    >
                                        {player.Games?.map((game) => (
                                            <Option key={game.id} value={game.id}>
                                                {game.title}
                                            </Option>
                                        ))}
                                    </Select>
                                    {errors.games && <p className='text-red-600 -mt-2'>{errors.games.message}</p>}
                                </div>
                                <div className='w-full px-2 flex flex-col gap-2'>
                                    <div className='flex items-center'>
                                        <Label className='text-base font-semibold' required>Price</Label>
                                        <p className='font-semibold pl-5'>({new Intl.NumberFormat('vi-VN').format(price)}VNĐ/h)</p>
                                    </div>
                                    <InputNumber
                                        // onChange={(value) => setPrice(value || 0)}
                                        value={player.price}
                                        type='number'
                                        addonAfter="VNĐ"
                                        defaultValue={0}
                                    />
                                </div>
                                <div className='w-full px-2 flex flex-col gap-2 '>
                                    <Label className='text-base font-semibold' required>Images</Label>
                                    <ImagesUploadField setImages={setImages} images={player ? player.images : images} hiddenEdit={player ? true : false} />
                                    {errors.images && <p className='text-red-600'>{errors.images.message}</p>}
                                </div>
                                <div className='w-full px-2 flex flex-col gap-2 col-span-3'>
                                    <Label className='text-base font-semibold' >Description</Label>
                                    <textarea
                                        className="border rounded outline-none p-3 w-full h-[600px]"
                                        value={player.description}
                                        onChange={(e: any) => setDescription(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                setDescription(description + '\n');
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                            <div className='mb-4 mt-8 flex items-center justify-center gap-3'>
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
                                    type="submit"
                                    disabled={loading}
                                    className={`${loading ? 'cursor-wait' : ''} flex items-center gap-2 text-base font-semibold border border-slate-600 bg-slate-600 hover:opacity-80 text-white py-1 px-4 rounded-md`}
                                >
                                    <div className='flex items-center justify-center gap-1'>
                                        <><Send size={18} /><span>{loading ? 'Update...' : 'Update'}</span></>
                                    </div>
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;
