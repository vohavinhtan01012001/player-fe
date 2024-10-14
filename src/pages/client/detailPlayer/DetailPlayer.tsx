import { useParams } from "react-router-dom";
import { PlayerService } from "../../../services/playerService";
import { useEffect, useState } from "react";
import { PlayerType } from "../../admin/player/Player";
import { Heart } from "lucide-react";

const DetailPlayer = () => {
    const { id } = useParams();
    const [player, setPlayer] = useState<PlayerType>();
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


    return (
        <div className="min-h-screen py-5 px-5 max-w-[1200px] mx-auto">
            <div className="grid grid-cols-4 gap-6">
                <div className="flex flex-col items-start justify-start">
                    <img src={player?.avatar} alt={player?.name} className="w-[260px] h-[260px] rounded-lg" />
                    <div className="px-3 py-2 w-full">
                        {
                            player?.status !== 1 ?
                                <p className="text-xl text-slate-600 font-semibold text-center">Chưa sẵn sàng</p>
                                :
                                <p className="text-xl text-green-600 font-semibold text-center">Đang sẵn sàng</p>
                        }
                        <p className="font-semibold text-sm py-2 text-center"><span className="text-slate-500">Ngày tham gia</span>: 26/10/2018</p>
                    </div>
                </div>
                <div className="col-span-2 ">
                    <div className="flex items-start justify-between w-full">
                        <div >
                            <h1 className="text-[#333] font-bold text-3xl">{player?.name}</h1>
                        </div>
                        <button className="flex items-center gap-1 px-3 py-1 bg-[#f0564a] rounded-full text-white">
                            <Heart size={15} />
                            <p className="font-semibold">Theo dõi</p>
                        </button>
                    </div>
                    <div className="flex items-start w-full py-5 border-b">
                        <div>
                            <p>Số người theo dõi</p>
                            <p className="text-[#f0564a]">450 người</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-4 gap-4 w-full py-5 border-b">
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
                    <div className="flex items-start flex-col gap-4 w-full py-5 border-b overflow-hidden">
                        <h2 className="text-3xl text-[#333] font-semibold">Thông tin</h2>
                        <div className="flex items-center py-3 gap-2">
                            {
                                player?.images && player?.images.length > 0 && player.images.map((image,index)=> {
                                    return (
                                        <div key={index} className="">
                                            <img src={image} alt={'image'} className="w-[100px] h-[100px] " />
                                        </div>
                                    )
                                })
                            }
                        </div>
                        <div>
                            <textarea className="w-[1200px] h-[800px] outline-none" value={player?.description} />
                        </div>
                    </div>
                </div>
                <div className="border w-[260px] h-[260px] rounded-xl p-3 flex flex-col justify-around">
                    <div>
                        <p className="text-[#f0564a] text-2xl font-semibold text-center">80.000đ/h</p>
                    </div>
                    <div className="flex flex-col gap-3 ">
                        <button className="w-full px-2 py-2 bg-[#f0564a] text-xl text-white font-semibold rounded-lg">Thuê</button>
                        <button className="w-full px-2 py-2 bg-white border text-xl font-semibold rounded-lg">Donate</button>
                        <button className="w-full px-2 py-2 bg-white border text-xl font-semibold rounded-lg">Chat</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default DetailPlayer;