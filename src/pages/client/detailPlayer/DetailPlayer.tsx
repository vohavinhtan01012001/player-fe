import { useLocation, useParams } from "react-router-dom";
import { PlayerService } from "../../../services/playerService";
import { useEffect, useState } from "react";
import { PlayerType } from "../../admin/player/Player";
import RentForm from "./components/RentForm";
import dayjs from "dayjs";
import { UserService } from "../../../services/userService";
import { RentalRequestService } from '../../../services/rentalRequestService';
import ChatWindow from "./components/ChatWindow";
import ShowRating from "./components/ShowRating";
import { CommentService } from "../../../services/commentService";
import Avatar from "../../../components/Avatar";
import { Rate } from "antd";
import { Heart } from "lucide-react";
import { toast } from "react-toastify";
import { FollowerService } from "../../../services/followerService";

const DetailPlayer = () => {
    const { id } = useParams();
    const [showRentForm, setShowRentForm] = useState(false);
    const [player, setPlayer] = useState<PlayerType>();
    const [showChat, setShowChat] = useState(false);
    const [user, setUser] = useState<any>();
    const [showChatWindow, setShowChatWindow] = useState(false);
    const location = useLocation();
    const [showRating, setShowRating] = useState(false);
    const [rental, setRental] = useState<any>();
    const queryParams = new URLSearchParams(location.search);
    const rentalRequestId = queryParams.get('rentalRequestId');
    const [comments, setComments] = useState<any[]>([]);
    const [followers, setFollowers] = useState<any[]>([]);
    const [showFollower, setShowFollower] = useState(false);
    const [numberFollowers, setNumberFollowers] = useState(0)
    const [typeRentForm, setTypeRentForm] = useState<"Rent" | "Donate">("Rent");

    const fetchRentalRequest = async () => {
        if (rentalRequestId) {
            const idRequestId = parseInt(rentalRequestId, 10);
            let idValue;
            if (id) {
                idValue = parseInt(id, 10);
                const rentals = await RentalRequestService.getRentalRequestByIdPlayerAll(idValue);
                const rental = rentals.data.data.find((rental: any) => rental.id === idRequestId && rental.rating === true)
                console.log(rental)
                if (
                    rental
                ) {
                    setShowRating(true);
                    setRental(rental);
                }
            }
        }
    };

    useEffect(() => {
        fetchRentalRequest();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [rentalRequestId, id]);


    useEffect(() => {
        getPlayerDetail();
    }, [id]);

    const getPlayerDetail = async () => {
        try {
            let idValue;
            if (id) {
                idValue = parseInt(id, 10);
            }
            const res = await PlayerService.getPlayerById(idValue);
            setPlayer(res.data.data);
        } catch (error: any) {
            console.log(error);
        }
    };

    const getUser = async () => {
        try {
            const user = await UserService.getUser();
            setUser(user.data.data);
            let idValue;
            if (id) {
                idValue = parseInt(id, 10);
                if (isNaN(idValue)) {
                    throw new Error("Invalid ID");
                }
            }

            const rentalRequest = idValue ? await RentalRequestService.getRentalRequestByIdPlayerAll(idValue) : null;

            if (rentalRequest && rentalRequest.data.data && rentalRequest.data.data.length > 0) {
                const checkChat = rentalRequest.data.data.some((data: any) => (user.data.data.id === data.userId && data.status === 1))
                setShowChat(checkChat);
            } else {
                setShowChat(false);
            }
        } catch (error: any) {
            console.log(error)
        }
    };

    useEffect(() => {
        if (localStorage.getItem('isPlayer') === "false") {
            getUser();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);


    const getComments = async () => {
        try {
            let idValue;
            if (id) {
                idValue = parseInt(id, 10);
                const res = await CommentService.getComments(idValue);
                setComments(res.data.data)
                console.log(res.data.data);
            }
        } catch (error) {
            console.log(error);
        }
    }


    const getFollowers = async () => {
        try {
            let idValue;
            if (id) {
                idValue = parseInt(id, 10);
            }
            const res = await FollowerService.getFollowers();
            const player = await PlayerService.getPlayerById(idValue);
            setFollowers(res.data.data);
            const user = await UserService.getUser();
            const userId = user.data.data.id;
            const playerId = player.data.data.id;
            setNumberFollowers(res.data.data.filter((f: any) => f.playerId === playerId).length)
            const checkFoll = res.data.data.some((f: any) =>
                f.userId === userId && f.playerId === playerId
            );
            setShowFollower(checkFoll);
        } catch (error) {
            console.log("Error in getFollowers:", error);
        }
    };


    useEffect(() => {
        getComments();
        getFollowers();
    }, [id])


    const handleUpdatePlayer = async (title: 'des' | 'inc') => {
        try {
            if (player) {
                if (title === "des" && user && player) {
                    const follower = followers.find((follower: any) => follower.playerId === player.id && follower.userId === user.id);
                    await FollowerService.deleteFollower(follower.id);
                }
                else {
                    const user = await UserService.getUser();
                    await FollowerService.createFollower({
                        userId: user.data.data.id,
                        playerId: player?.id,
                    })
                }
                getFollowers()
                toast.success("Follower successfully")
            }
        } catch {
            toast.error("Follower failed")
        }
    }



    const handleShowRent = () => {
        setShowRentForm(true);
        setTypeRentForm("Rent")
    }

    const handleShowDonate = () => {
        setTypeRentForm("Donate")
        setShowRentForm(true);
    }

    const handleShowChat = () => {
        setShowChatWindow(true);
    }

    const handleCloseChat = () => {
        setShowChatWindow(false);
    }

    const isPlayer = localStorage.getItem('isPlayer') === "true" || !localStorage.getItem('isPlayer');
    const isStatusDisabled = player?.status === 2 || player?.status === 3;
    const isDisabled = isPlayer || isStatusDisabled;


    return (
        <div className="min-h-screen py-5 px-5 max-w-[1200px] mx-auto">
            <div className="flex flex-col gap-6">
                <div className="flex flex-col items-start justify-start">
                    <div className="mx-auto flex flex-col gap-2">
                        <img src={player?.avatar} alt={player?.name} className="w-[260px] h-[260px] rounded-lg" />
                        <div className="text-center">
                            <h1 className="text-[#333] font-bold text-3xl">{player?.name}</h1>
                        </div>
                    </div>
                    <div className="px-3 py-2 w-full">
                        {
                            player?.status === 1 ?
                                <p className="text-xl text-green-600 font-semibold text-center">Ready</p>
                                :
                                player?.status === 2 ?
                                    <p className="text-xl text-slate-600 font-semibold text-center">Not ready yet</p>
                                    :
                                    <p className="text-xl text-red-600 font-semibold text-center">Busy</p>
                        }
                        <p className="font-semibold text-sm py-2 text-center"><span className="text-slate-500">Join date</span>: {dayjs(player?.created_at).format('DD/MM/YYYY')}</p>
                        <p className="font-semibold text-sm py-2 text-center"><span className="text-slate-500">Number of followers</span>: {numberFollowers}</p>
                        <p className="font-bold text-base  text-center text-red-600"><span className="text-slate-500">Price ({'USD/h'})</span>: {new Intl.NumberFormat('USD').format(player?.price as any)} USD</p>
                        {
                            localStorage.getItem('isPlayer') === "false" ?
                                showFollower ?
                                    <button className="flex items-center mx-auto my-4 gap-2 px-3 py-2 bg-red-500 rounded-full" onClick={() => handleUpdatePlayer('des')}>
                                        <p className="text-base font-semibold text-white">Following </p><Heart fill="white" color="white" />
                                    </button> :
                                    <button className="flex items-center mx-auto my-4 gap-2 px-3 py-2 bg-green-500 rounded-full" onClick={() => handleUpdatePlayer('inc')}>
                                        <p className="text-base font-semibold text-white">Follow </p><Heart fill="white" color="white" />
                                    </button>
                                :
                                ""
                        }
                    </div>
                </div>
                <div className="">
                    <div className="flex flex-col items-center justify-between border-b ">
                        <div className="flex items-center justify-center w-full my-6 gap-8">
                            <button
                                disabled={isDisabled}
                                onClick={handleShowRent}
                                className={`${isDisabled ? "opacity-50" : "hover:bg-blue-800 hover:scale-105"} duration-300 w-[300px] py-3 font-semibold text-white bg-blue-700 rounded-lg`}>
                                Rent
                            </button>
                            <button
                                disabled={isPlayer}
                                onClick={handleShowDonate}
                                className={`${isPlayer ? "opacity-50" : "hover:bg-green-800 hover:scale-105"} duration-300 w-[300px] py-3 font-semibold text-white bg-green-700 rounded-lg`}>
                                Donate
                            </button>
                        </div>
                        {<div className="flex items-center justify-center w-full my-6">
                            {/* // showChat && <div className="flex items-center justify-center w-full my-6"> */}
                            <button
                                disabled={isPlayer}
                                onClick={handleShowChat}
                                className={`w-[300px] py-3 font-semibold text-[#333] border bg-white rounded-lg`}>
                                Chat
                            </button>
                        </div>
                        }
                    </div>
                    <div className="grid grid-cols-4 gap-4 w-full pt-6 pb-8 border-t border-b">
                        <div className="col-span-4 text-center pb-3">
                            <h1 className="text-3xl font-semibold text-[#333]">Game</h1>
                        </div>
                        {
                            player?.Games && player?.Games.length > 0 && player?.Games.map((game, index) => {
                                return (
                                    <div
                                        key={index}
                                        className=" h-[60px] bg-cover bg-center rounded-lg"
                                        style={{ backgroundImage: `url(${game.image})` }}
                                    >
                                        <p className="text-white font-bold p-2 bg-black bg-opacity-70 h-full rounded-lg text-center flex items-center justify-center">
                                            {game.title}
                                        </p>
                                    </div>
                                )
                            })
                        }
                    </div>
                    <div className="grid grid-cols-4 gap-4 w-full pt-6 pb-8 border-t border-b">
                        <div className="col-span-4 text-center pb-3">
                            <h1 className="text-3xl font-semibold text-[#333]">Comments</h1>
                        </div>
                        <div className="grid grid-cols-3 gap-12  col-span-4">
                            {
                                comments.length > 0 && comments.map((comment, index) => {
                                    return (
                                        <div key={index} className="mx-auto flex items-start gap-4  px-4">
                                            <div>
                                                <Avatar user={comment.User} />
                                            </div>
                                            <div>
                                                <Rate
                                                    allowHalf
                                                    disabled
                                                    defaultValue={comment.rating || 0}
                                                />
                                                <p className="break-words max-w-xs">
                                                    {comment.message}
                                                </p>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                    <div className="flex items-start flex-col gap-4 w-full py-8 border-b overflow-hidden">
                        <div className="col-span-4 text-center pb-3 mx-auto">
                            <h1 className="text-3xl font-semibold text-[#333]">Player Information
                            </h1>
                        </div>
                        <div className="flex items-center py-3 gap-2 px-4 ">
                            {
                                player?.images && player?.images.length > 0 && player.images.map((image, index) => {
                                    return (
                                        <div key={index} className="">
                                            <img src={image} alt={'image'} className="w-[100px] h-[100px] " />
                                        </div>
                                    )
                                })
                            }
                        </div>
                        <div>
                            <textarea className="w-[1200px] px-4 h-[800px] outline-none" value={player?.description} />
                        </div>
                    </div>
                </div>
            </div>
            <RentForm
                open={showRentForm}
                setOpen={setShowRentForm}
                player={player}
                form={typeRentForm}
            />
            {
                showChatWindow &&
                <div className="fixed bottom-0 right-[50px]">
                    <ChatWindow
                        player={player}
                        user={user}
                        handleCloseChat={handleCloseChat}
                        showChat={showChat}
                    />
                </div>
            }
            <ShowRating
                open={showRating}
                setOpen={setShowRating}
                player={player}
                user={user}
                rental={rental}
                fetchRentalRequest={fetchRentalRequest}
            />
        </div>
    )
}
export default DetailPlayer;