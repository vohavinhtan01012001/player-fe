import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css'
import { GameType } from '../../../../pages/admin/game/Game';
import { GameService } from '../../../../services/gameService';
const Navbar: React.FC = () => {
    const [games, setGames] = useState<GameType[]>([])
    const navigate = useNavigate()

    useEffect(() => {
        getGameList();
    }, [])

    const getGameList = async () => {
        try {
            const res = await GameService.getGames();
            setGames(res.data.data)
        } catch (error: any) {
            console.log(error)
        }
    }

    return (
        <nav className="navbar px-7">
            <div className="navbar-brand">
                <Link to="/" className="logo">ConnectPlay</Link>
            </div>
            <ul className=" flex items-center gap-16 ">
                <li className='hover:text-[#f0564a] duration-300'>
                    <Link to="/">Home</Link>
                </li>
                <li className='relative cursor-pointer group hover:text-[#f0564a] duration-300'>
                    <div>
                        <p className='hover'>Games</p>
                        <div className='w-[200px] bg-white absolute z-50 rounded-lg hidden group-hover:block px-1 py-2'>
                            {
                                games.map((item, index) => {
                                    return <p onClick={() => navigate('/collection/' + item.id)} key={index} className='text-[#333] px-2 py-2 font-semibold hover:text-red-500'>{item.title}</p>
                                })
                            }
                        </div>
                    </div>
                </li>
                <li className='hover:text-[#f0564a] duration-300'>
                    <Link to="/Products">KOLS</Link>
                </li>
                <li className='hover:text-[#f0564a] duration-300'>
                    <Link to="/Policy">Policy</Link>
                </li>
            </ul>
            <div className="navbar-icons">
                <Link to="/notifications">🔔</Link>
                <Link to="/wallet">💰</Link>
                <Link to="/login">Login</Link>
            </div>
        </nav>
    );
};

export default Navbar;
