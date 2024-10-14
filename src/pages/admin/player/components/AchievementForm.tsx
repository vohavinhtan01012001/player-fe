import { DatePicker, Modal } from "antd";
import { Award, Plus, Trash2, X } from "lucide-react";
import Input from "../../../../components/Input";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import { AchievementProps } from "./PlayerForm";
import { PlayerType } from "../Player";

type AchievementFormProps = {
    open: boolean;
    setOpen: (value: boolean) => void;
    achievements: AchievementProps[];
    setAchievements: (value: AchievementProps[]) => void;
    player: PlayerType | null;
};

const AchievementForm = ({ open, setOpen, achievements, setAchievements, player }: AchievementFormProps) => {
    const {
        control,
        handleSubmit,
        // eslint-disable-next-line no-empty-pattern
        formState: { },
    } = useForm({
        defaultValues: {
            achievements: player ? [...player.achievements] : achievements.length > 0 ? [...achievements] : [{ id: 1, title: "", dateAchieved: new Date() }],
        },
    });
    const { fields, append, remove } = useFieldArray({
        control,
        name: "achievements",
    });

    const handleClose = () => {
        setOpen(false);
    };

    const addAchievement = () => {
        append({ id: fields.length + 1, title: "", dateAchieved: new Date() });
    };

    const onSubmit = (data: any) => {
        const invalidAchievements = data.achievements.filter(
            (achievement: any) => !achievement.title || !achievement.dateAchieved
        );
        if (invalidAchievements.length > 0) {
            invalidAchievements.forEach(() => {
                toast.error("Title or Date cannot be empty.");
            });
            return;
        }
        setAchievements(data.achievements);
        handleClose();
    };

    return (
        <Modal
            title={
                <div className="flex items-center gap-2 text-xl font-bold justify-center text-[#333]">
                    <Award strokeWidth={3} /> <p>Achievement</p>
                </div>
            }
            open={open}
            onCancel={handleClose}
            width={500}
            footer={null}
            className="mt-6"
        >
            <form className="flex flex-col w-full gap-3 py-3" onSubmit={handleSubmit(onSubmit)}>
                {
                    player ? "" : <div className="">
                        <button type="button" className="w-8 h-8 border rounded-full bg-[#333]" onClick={addAchievement}>
                            <Plus size={20} strokeWidth={3} className="mx-auto" color="white" />
                        </button>
                    </div>
                }

                {fields.map((field, index) => (
                    <div key={field.id} className="flex items-center gap-5">
                        <div className="flex-1">
                            <Controller
                                control={control}
                                name={`achievements.${index}.title`}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        disabled={player ? true : false}
                                        placeholder={`Achievement ${index + 1}`}
                                    />
                                )}
                            />
                        </div>
                        <div>
                            <Controller
                                control={control}
                                name={`achievements.${index}.dateAchieved`}
                                render={({ field }) => (
                                    <DatePicker
                                        disabled={player ? true : false}
                                        className="h-[40px] w-full"
                                        value={field.value ? dayjs(field.value) : dayjs()}
                                        onChange={(date) => field.onChange(date)}
                                    />
                                )}
                            />
                        </div>
                        <div className="h-full w-5">
                            <button type="button"
                                disabled={player ? true : false}
                                onClick={() => !player && remove(index)}>
                                <Trash2 size={18} color="#494949" />
                            </button>
                        </div>
                    </div>
                ))}

                <div className="flex  justify-center gap-2 pt-6 items-center">
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
                                className={`flex items-center gap-2 text-base font-semibold border border-slate-600 bg-slate-600 hover:opacity-80 text-white py-1 px-4 rounded-md`}
                            >
                                <div className='flex items-center justify-center gap-1'>
                                    <span>Submit</span>
                                </div>
                            </button>
                    }
                </div>
            </form>
        </Modal>
    );
};

export default AchievementForm;
