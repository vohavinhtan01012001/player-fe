import { Input, Modal } from 'antd';
import { useState } from 'react'
import { toast } from 'react-toastify';
import { UserService } from '../../../../services/userService';

export default function ChangeNewPassword() {
    const [isOpen, setIsOpen] = useState(false);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const handleCancel = () => {
        setIsOpen(false);
        setOldPassword('')
        setNewPassword('');
        setConfirmPassword('');
    };

    const handleSubmit = async () => {
        try {
            if (oldPassword === '' || newPassword === '' || confirmPassword === '') {
                toast.error("Please enter a password or confirm password or old password");
                return;
            }
            if (newPassword.length < 6 || confirmPassword.length < 6) {
                toast.error("Password must be at least 6 characters");
                return;
            }
            if (newPassword !== confirmPassword) {
                toast.error("Password does not match");
                return;
            }
            await UserService.changePassword({ newPassword: newPassword, oldPassword: oldPassword });
            toast.success("Password updated successfully");
            handleCancel();
        } catch (error: any) {
            toast.error(error?.response?.data?.message);
        }
    };

    return (
        <>
            <button type="button" onClick={() => setIsOpen(true)} className="bg-yellow-500 hover:bg-yellow-600 duration-300 px-2 py-1 rounded text-white  font-semibold">
                Change Password
            </button>
            <Modal
                title={
                    <div>
                        <p className='text-center font-bold text-2xl uppercase tracking-widest'>Change password</p>
                    </div>
                }
                open={isOpen}
                onCancel={handleCancel}
                footer={null}
            >
                <div className='grid grid-cols-1 gap-2'>
                    <div>
                        <label htmlFor="">Old password</label>
                        <Input type='password' value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
                    </div>
                    <div>
                        <label htmlFor="">New password</label>
                        <Input type='password' value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                    </div>
                    <div>
                        <label htmlFor="">Confirm new password</label>
                        <Input type='password' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                    </div>
                    <div className=''>
                        <button type="button" onClick={handleSubmit} className="w-full text-base bg-slate-700 text-white font-bold py-2 rounded-lg">
                            Submit
                        </button>
                    </div>
                </div>
            </Modal>
        </>
    )
}
