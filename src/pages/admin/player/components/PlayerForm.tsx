import React, { useEffect, useState } from 'react';
import { Modal, Select } from 'antd';
import { BadgePlus, Plus, ReceiptText, Send, X } from 'lucide-react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Label from '../../../../components/Label';
import Input from '../../../../components/Input';
import ImagesUploadField from '../../../../components/ImagesUploadField';
import { PlayerService } from '../../../../services/playerService';
import { toast } from 'react-toastify';
import { PlayerType } from '../Player';
import AvatarUploadField from '../../../../components/AvatarUploadField';
import { GameService } from '../../../../services/gameService';
import { GameType } from '../../game/Game';
import AchievementForm from './AchievementForm';

const { Option } = Select;
const validationSchema = yup.object().shape({
    avatar: yup
        .mixed<File>()
        .required('Avatar is required')
        .test('fileType', 'Unsupported File Format', (value) => {
            return value && ['image/jpeg', 'image/png', 'image/gif'].includes(value.type);
        }),
    name: yup.string().required('Name is required'),
    email: yup.string().email('Invalid email format').required('Email is required'),
    password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
    description: yup.string(),
    games: yup.array()
        .of(yup.number().required('Game ID is required'))
        .min(1, 'At least one game is required')
        .required('Games are required'),
    images: yup.array()
        .of(
            yup
                .mixed<File>()
                .required('Image is required')
                .test('fileType', 'Unsupported File Format', (value) => {
                    return value && ['image/jpeg', 'image/png', 'image/gif'].includes(value.type);
                })
        )
});

type FormData = {
    avatar: File;
    name: string;
    email: string;
    password: string;
    description?: string;
    games: number[];
    images?: File[];
};

type PlayerFormType = {
    open: boolean;
    setOpen: (value: boolean) => void;
    getPlayerList: () => Promise<void>;
    player: PlayerType | null;
    setPlayer: (player: PlayerType | null) => void;
};

export type AchievementProps = {
    id: number;
    title: string;
    dateAchieved: Date;
}

const PlayerForm: React.FC<PlayerFormType> = ({ open, setOpen, getPlayerList, player, setPlayer }) => {
    const { register, setValue, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
        resolver: yupResolver(validationSchema),
    });
    const [images, setImages] = useState<File[]>([]);
    const [loading, setLoading] = useState(false);
    const [games, setGames] = useState<GameType[]>([])
    const [selectedGames, setSelectedGames] = useState<number[]>([]);
    const [image, setImage] = useState<any>()
    const [isOpenAchievementForm, setIsOpenAchievementForm] = useState(false);
    const [achievements, setAchievements] = useState<AchievementProps[]>([])
    const [description, setDescription] = useState<string>('')

    useEffect(() => {
        setValue('images', images);
    }, [images, setValue]);

    useEffect(() => {
        setValue('avatar', image);
    }, [image, setValue]);

    useEffect(() => {
        setValue('description', description);
    }, [description, setValue])

    useEffect(() => {
        if (open) {
            getGameList();
        }
    }, [open])

    useEffect(() => {
        setValue("games", selectedGames)
    }, [selectedGames, setValue])



    const getGameList = async () => {
        try {
            const res = await GameService.getGames();
            setGames(res.data.data)
        } catch (error: any) {
            console.log(error)
        }
    }
    const handleGamesChange = (value: number[]) => {
        setSelectedGames(value);
    };



    const handleClose = () => {
        setOpen(false);
        reset();
        setImages([]);
        setSelectedGames([]);
        setImage(null);
        setGames([]);
        setDescription('')
        setPlayer(null);
    };



    const onSubmit: SubmitHandler<FormData> = async (data) => {
        try {
            setLoading(true);
            const playerData = { ...data, games: selectedGames, achievements: achievements };
            const res = await PlayerService.createPlayer(playerData);
            toast.success(res.data.msg);
            getPlayerList();
            handleClose();
        } catch (error: any) {
            toast.error(error?.response?.data?.msg || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleAchievement = () => {
        setIsOpenAchievementForm(true)
    }


    return (
        <Modal
            title={
                <div className='flex items-center gap-2 text-xl font-bold justify-center text-[#333]'>
                    {
                        player ?
                            <>
                                <ReceiptText strokeWidth={3} /><p>Player id: {player.id}</p>
                            </> :
                            <>
                                <BadgePlus strokeWidth={3} /><p>Create Player</p>
                            </>
                    }
                </div>
            }
            open={open}
            onCancel={handleClose}
            width={800}
            footer={null}
        >
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className='border-t my-[20px] py-[15px] relative grid grid-cols-2 grid-rows-2 gap-2'>
                    <div className='w-full px-2 flex flex-col gap-2 row-span-2'>
                        <AvatarUploadField setImage={setImage} image={player ? player.avatar : image} hiddenEdit={player ? true : false} />
                        {errors.avatar && <p className='text-red-600'>{errors.avatar.message}</p>}
                    </div>
                    <div className='w-full px-2 flex flex-col gap-2'>
                        <Label className='text-base font-semibold' required>Name</Label>
                        {
                            player ? <Input
                                className='border h-[35px] rounded outline-none p-3 w-full'
                                type='text'
                                {...register('name')}
                                disabled
                                defaultValue={player.name}
                                errorMessage={errors.name?.message}
                            /> :
                                <Input
                                    className='border h-[35px] rounded outline-none p-3 w-full'
                                    type='text'
                                    {...register('name')}
                                    errorMessage={errors.name?.message}
                                />
                        }
                    </div>
                    <div className='w-full px-2 flex flex-col gap-2'>
                        <Label className='text-base font-semibold' required>Email</Label>
                        {
                            player ? <Input
                                className='border h-[35px] rounded outline-none p-3 w-full'
                                type='text'
                                {...register('email')}
                                disabled={player ? true : false}
                                defaultValue={player ? player.email : undefined}
                                errorMessage={errors.email?.message}
                            /> :
                                <Input
                                    className='border h-[35px] rounded outline-none p-3 w-full'
                                    type='text'
                                    {...register('email')}
                                    errorMessage={errors.email?.message}
                                />
                        }
                    </div>
                    <div className='w-full px-2 flex flex-col gap-2'>
                        {
                            player ?
                                "" :
                                <>
                                    <Label className='text-base font-semibold' required>Password</Label>
                                    <Input
                                        className='border h-[35px] rounded outline-none p-3 w-full'
                                        type='password'
                                        {...register('password')}
                                        errorMessage={errors.password?.message}
                                    />
                                </>
                        }
                    </div>
                    <div className='w-full px-2 flex flex-col gap-2'>
                        <Label className='text-base font-semibold' required>Games</Label>
                        <Select
                            mode="multiple"
                            style={{ width: '100%' }}
                            placeholder="Select games"
                            value={player ? player.Games.map(item => item.id) : selectedGames}
                            disabled={player ? true : false}
                            onChange={handleGamesChange}
                        >
                            {games.map((game) => (
                                <Option key={game.id} value={game.id}>
                                    {game.title}
                                </Option>
                            ))}
                        </Select>
                        {errors.games && <p className='text-red-600 -mt-2'>{errors.games.message}</p>}
                    </div>
                    <div className='w-full px-2 flex flex-col gap-2 col-span-2'>
                        <Label className='text-base font-semibold' >Description</Label>
                        <textarea
                            className="border h-[200px] rounded outline-none p-3 w-full"
                            value={player ? player.description : description}
                            disabled={player ? true : false}
                            onChange={(e: any) => setDescription(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    setDescription(description + '\n');
                                }
                            }}
                        />
                    </div>
                    <div className='mx-2 col-span-2'>
                        <button className='flex items-center px-2 border rounded-lg py-1' type='button' onClick={handleAchievement}>
                            <Plus size={20} /> <span>Achievement</span>
                        </button>
                    </div>
                    <div className='w-full px-2 flex flex-col gap-2 mt-[20px]'>
                        <Label className='text-base font-semibold' required>Images</Label>
                        <ImagesUploadField setImages={setImages} images={player ? player.images : images} hiddenEdit={player ? true : false} />
                        {errors.images && <p className='text-red-600'>{errors.images.message}</p>}
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
                    {
                        player ? "" :
                            <button
                                type="submit"
                                disabled={loading}
                                className={`${loading ? 'cursor-wait' : ''} flex items-center gap-2 text-base font-semibold border border-slate-600 bg-slate-600 hover:opacity-80 text-white py-1 px-4 rounded-md`}
                            >
                                <div className='flex items-center justify-center gap-1'>
                                    <><Send size={18} /><span>{loading ? 'Creating...' : 'Create'}</span></>
                                </div>
                            </button>
                    }
                </div>
            </form>
            <AchievementForm
                open={isOpenAchievementForm}
                setOpen={setIsOpenAchievementForm}
                setAchievements={setAchievements}
                achievements={achievements}
                player={player}
            />
        </Modal>
    );
};

export default PlayerForm;
