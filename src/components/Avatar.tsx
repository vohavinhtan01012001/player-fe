import { Avatar as AvatarD } from "antd";
import { User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {useNavigate } from "react-router-dom";
import { AuthService } from "../services/AuthService";


const AvatarDialog = ({
    setShow
}: {
    setShow: (value: boolean) => void;
}) => {
    const navigate = useNavigate();
    const handleLogout = () => {
        AuthService.logout();
        window.location.reload();
        navigate('/');
        setShow(false);
    }

    const handleProfile = () => {
        navigate('/profile');
        setShow(false);
    }

    return (
        <div className="bg-white w-[100px] h-[80px] shadow-lg rounded-lg *:text-[#333] py-2 px-3">
            <div className="flex flex-col gap-3 cursor-pointer font-semibold">
                <div onClick={handleProfile}>Profile</div >
                <div onClick={handleLogout}>Logout</div>
            </div>
        </div>
    )
}


const Avatar = () => {

    const [show, setShow] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setShow(false);
            }
        };

        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);
    return (
        <div className="relative">
            <div className="" onClick={() => setShow(!show)}>
                <AvatarD style={{ backgroundColor: '#87d068' }} icon={<User />} />
            </div>
            {
                show &&
                <div
                    ref={dropdownRef}
                    className="absolute top-full mt-2 right-0">
                    <AvatarDialog
                        setShow={setShow}
                    />
                </div>
            }
        </div>
    )
}

export default Avatar;