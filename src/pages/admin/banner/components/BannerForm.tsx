import React, { useEffect, useState } from 'react';
import { Modal } from 'antd';
import { BadgePlus, Edit, Edit2, Send, X } from 'lucide-react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import Label from '../../../../components/Label';
import Input from '../../../../components/Input';
import SingleImageUploadField from '../../../../components/SingleImageUploadField';
import { BannerService } from '../../../../services/bannerService';  // Assuming you have a BannerService
import { toast } from 'react-toastify';
import { BannerType } from '../Banner';  // Assuming you have a BannerType definition

const validationSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    image: Yup.mixed().required('Image is required')
});

type BannerFormType = {
    open: boolean;
    setOpen: (value: boolean) => void;
    banner: BannerType | null;
    setBanner: (banner: BannerType | null) => void;
    getBannerList: () => Promise<void>;
};

type FormData = {
    title: string;
    image: any;
};

const BannerForm: React.FC<BannerFormType> = ({ open, setOpen, banner, setBanner, getBannerList }: BannerFormType) => {
    const { register, setValue, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
        resolver: yupResolver(validationSchema),
    });
    const [image, setImage] = useState<File | string | null>(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (image) {
            setValue('image', image);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [image])

    useEffect(() => {
        if (open && banner) {
            setValue("title", banner.title);
            setImage(banner.image);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, banner])

    const handleClose = () => {
        setOpen(false);
        setImage(null);
        setBanner(null);
        reset();
    };

    const onSubmit: SubmitHandler<FormData> = async (data) => {
        try {
            setLoading(true);
            const res = banner ? 
                await BannerService.updateBanner(banner.id, data) :
                await BannerService.createBanner(data);
            toast.success(res.data.msg)
            getBannerList();
            handleClose();
        } catch (error: any) {
            toast.error(error?.response?.data?.msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title={
                <div className='flex items-center gap-2 text-xl font-bold justify-center text-[#333]'>
                    {
                        banner ? 
                            <>
                                <Edit strokeWidth={3} />
                                <p>Update Banner</p>
                            </>
                            :
                            <>
                                <BadgePlus strokeWidth={3} />
                                <p>Create Banner</p>
                            </>
                    }
                </div>
            }
            open={open}
            onCancel={handleClose}
            footer={null}
        >
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className='border-t my-[20px] py-[15px] relative'>
                    <div className='w-full px-2 flex flex-col gap-2'>
                        <Label className='text-base font-semibold' required>
                            Title
                        </Label>
                        <Input
                            className='border h-[35px] rounded outline-none p-3 w-full'
                            type='text'
                            {...register('title')}
                            errorMessage={errors.title && errors.title.message}
                        />
                    </div>
                    <div className='w-full px-2 flex flex-col gap-2 mt-[20px]'>
                        <Label className='text-base font-semibold' required>
                            Image
                        </Label>
                        <SingleImageUploadField setImage={setImage} image={image} />
                        {errors.image && <p className='text-red-600'>{errors?.image?.message as string}</p>}
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
                        className={`${loading ? 'cursor-wait': ''} flex items-center gap-2 text-base font-semibold border border-slate-600 bg-slate-600 hover:opacity-80 text-white py-1 px-4 rounded-md`}
                    >
                        <div className='flex items-center justify-center gap-1'>
                            {
                                banner ? 
                                    <>
                                        <Edit2 size={18} />
                                        <span>{loading ? 'Updating...' : 'Update'}</span>
                                    </>
                                    :
                                    <>
                                        <Send size={18} />
                                        <span>{loading ? 'Creating...' : 'Create'}</span>
                                    </>
                            }
                        </div>
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default BannerForm;
