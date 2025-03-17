import { SearchX } from 'lucide-react';
import logo from '@/app/_public/logo1.png';

const UnknownChat = () => {
    return (
        <main className='h-screen w-screen flex items-center justify-center'>
            <div className="text-center flex flex-col gap-2 items-center">
                <div className="flex justify-center">
                    <SearchX className='w-24 h-24'/>
                    <img src={logo.src} alt="Logo" width={75} height={75} />
                </div>
                <div className='text-[2rem] font-light'>
                    <h1 className='text-light'>Unknown Chat</h1>
                </div>
            </div>
        </main>
    )
}

export default UnknownChat;
