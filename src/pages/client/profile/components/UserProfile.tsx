import { useEffect, useState } from "react";
import Input from "../../../../components/Input";
import Label from "../../../../components/Label";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ChangeNewPassword from "./ChangeNewPassword";
import { UserService } from "../../../../services/userService";

const UserProfile = ({ user }: { user: any }) => {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [price, setPrice] = useState(0);
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");

    useEffect(() => {
        if (user) {
            setFullName(user.fullName || "");
            setEmail(user.email || "");
            setPrice(user.price || 0);
            setPhone(user.phone || "");
            setAddress(user.address || "");
        }
    }, [user]);

    const validateFields = () => {
        let valid = true;

        if (!fullName) {
            toast.error("Name is required.");
            valid = false;
        }
        if (!email) {
            toast.error("Email is required.");
            valid = false;
        }
        if (!phone) {
            toast.error("Phone is required.");
            valid = false;
        }
        if (!address) {
            toast.error("Address is required.");
            valid = false;
        }

        return valid;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (validateFields()) {
            const payload = { fullName, phone, address }
            await UserService.updateUser(payload);
            toast.success("User updated successfully")
        }
    };

    return (
        <div className="profile-container py-3 px-6">
            <h1 className="text-3xl font-bold mb-4 text-center uppercase tracking-widest">Profile</h1>
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-3 gap-4 py-4">
                    <div className="col-span-3 sm:col-span-1">
                        <Label className="text-base font-semibold" required>
                            Name
                        </Label>
                        <Input
                            className="border rounded px-3 py-1 w-full"
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                        />
                    </div>

                    <div className="col-span-3 sm:col-span-1">
                        <Label className="text-base font-semibold" required>
                            Email
                        </Label>
                        <Input
                            className="border rounded px-3 py-1 w-full"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled
                        />
                    </div>

                    <div className="col-span-3 sm:col-span-1">
                        <Label className="text-base font-semibold">Price</Label>
                        <p className="text-red-600 font-bold">
                            {`${new Intl.NumberFormat("USD").format(price)} USD`}
                        </p>
                    </div>

                    <div className="col-span-3 sm:col-span-1">
                        <Label className="text-base font-semibold">Phone</Label>
                        <Input
                            className="border rounded px-3 py-1 w-full"
                            type="text"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                    </div>

                    <div className="col-span-3 sm:col-span-1">
                        <Label className="text-base font-semibold">Address</Label>
                        <Input
                            className="border rounded px-3 py-1 w-full"
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        />
                    </div>
                    <div className="col-span-3 sm:col-span-1">
                        <div className="flex items-end h-full">
                        <ChangeNewPassword />
                        </div>
                    </div>
                </div>

                <div className="text-center mt-4">
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-500 text-white rounded"
                    >
                        Save Profile
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UserProfile;
