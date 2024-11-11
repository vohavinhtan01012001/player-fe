import { Input, Rate } from "antd";
import { Star, X } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";
import { CommentService } from "../../../../services/commentService";
import { RentalRequestService } from "../../../../services/rentalRequestService";

type ShowRatingProps = {
    open: boolean;
    setOpen: (value: boolean) => void;
    player: any;
    user: any;
    rental: any;
    fetchRentalRequest: () => void;
};

const ShowRating = ({ open, setOpen, player, user, rental, fetchRentalRequest }: ShowRatingProps) => {
    const [rating, setRating] = useState(2.5);
    const [comment, setComment] = useState("");

    const handleClose = () => {
        setOpen(false);
        setRating(2.5);
        setComment("");
    };

    const handleCancel = async () => {
        try {
            const payload = { rating: false };
            await RentalRequestService.updateRentalRequest(rental.id, payload);
            toast.success("Rating has been canceled!");
            handleClose();
        } catch {
            toast.error("An error occurred, please try again later.");
        }
    }

    const handleSubmit = async () => {
        try {
            const payload = { rating, message: comment, playerId: player.id, userId: user.id, rental };
            await CommentService.createComment(payload);
            toast.success("Rating submitted successfully!");
            fetchRentalRequest();
            handleClose();
        } catch {
            toast.error("An error occurred, please try again later.");
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg w-full max-w-md mx-4 p-6 relative shadow-lg">
                <div className="flex justify-between items-center pb-4 border-b text-center">
                    <h1 className="text-xl font-bold text-[#333] mx-auto">Rate</h1>
                </div>
                <div className="flex flex-col gap-3 pt-6">
                    <div className="mx-auto">
                        <Rate
                            allowHalf
                            defaultValue={2.5}
                            onChange={(value) => setRating(value)}
                        />
                    </div>
                    <div className="flex items-center justify-between gap-2">
                        <Input
                            type="text"
                            className="h-[40px]"
                            placeholder="Write your review"
                            onChange={(e) => setComment(e.target.value)}
                        />
                    </div>
                    <div className="pt-5 flex justify-center gap-4">
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="border py-2 px-4 rounded-lg bg-white text-gray-700 flex items-center gap-2"
                        >
                            <X size={20} />
                            Cancel Rating
                        </button>
                        <button
                            type="button"
                            onClick={handleSubmit}
                            className="border py-2 px-4 rounded-lg bg-blue-600 text-white flex items-center gap-2"
                        >
                            <Star size={20} />
                            Submit Rating
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShowRating;
