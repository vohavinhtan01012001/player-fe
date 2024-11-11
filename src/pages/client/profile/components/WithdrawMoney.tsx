import { Modal, Form, Input, InputNumber } from "antd";
import { useState } from "react";
import { PaymentService } from "../../../../services/paymentService";
import { toast } from "react-toastify";

const WithdrawMoney = ({ user, getUser }: { user: any, getUser: () => Promise<void> }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [form] = Form.useForm();
    const [price, setPrice] = useState(0)

    const handleCancel = () => {
        setIsOpen(false);
        form.resetFields();
        setPrice(0);
    };

    const handleSubmit = async (values: any) => {
        console.log(values)
        try {
            await PaymentService.withdrawMoney(values, user)
            toast.success("Withdrawal successful!");
            getUser();
        } catch {
            toast.error("Withdrawal failed!")
        }
        handleCancel();
    };

    return (
        <>
            <button type="button" onClick={() => setIsOpen(true)} className="hover:text-red-700 font-semibold">
                Withdraw Money
            </button>
            <Modal
                title={
                    <div>
                        <p className='text-center font-bold text-2xl uppercase tracking-widest'>Withdraw Money</p>
                    </div>
                }
                open={isOpen}
                onCancel={handleCancel}
                footer={null}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                >
                    <Form.Item
                        label="Account Number"
                        name="accountNumber"
                        rules={[{ required: true, message: 'Please enter the account number!' }]}
                    >
                        <Input placeholder="Enter account number" />
                    </Form.Item>

                    <Form.Item
                        label="Bank Name"
                        name="bankName"
                        rules={[{ required: true, message: 'Please enter the bank name!' }]}
                    >
                        <Input placeholder="Enter bank name" />
                    </Form.Item>

                    <Form.Item
                        label="Full Name"
                        name="fullName"
                        rules={[{ required: true, message: 'Please enter your full name!' }]}
                    >
                        <Input placeholder="Enter full name" />
                    </Form.Item>

                    <Form.Item
                        label={`Amount to Withdraw (maximum ${new Intl.NumberFormat('USD').format(user?.price)} USD)`}
                        name="amount"
                        rules={[{ required: true, message: 'Please enter the amount!' }]}
                    >
                        <div className="flex items-center gap-5">
                            <InputNumber
                                className="flex-1"
                                type='number'
                                min={0}
                                max={user?.price}
                                addonAfter="USD"
                                onChange={(value) => {
                                    form.setFieldValue('amount', value)
                                    setPrice(value)
                                }}
                                placeholder="Enter amount"
                            />
                            <span className="font-semibold ">{new Intl.NumberFormat('USD').format(price)} USD</span>
                        </div>
                    </Form.Item>

                    <Form.Item>
                        <button type="submit" className="w-full text-base bg-slate-700 text-white font-bold py-2 rounded-lg">
                            Submit 
                        </button>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default WithdrawMoney;
