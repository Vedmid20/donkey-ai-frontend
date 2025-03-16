import { SearchX } from 'lucide-react';

const UnknownChat = () => {
    return (
        <main className='h-screen w-screen flex items-center justify-center'>
            <div className="text-center flex flex-col gap-2 items-center">
                <div className="flex justify-center">
                    <SearchX className='w-24 h-24'/>
                </div>
                <div className='text-[2rem] font-light'>
                    <h1 className='text-light'>Unknown Chat</h1>
                </div>
            </div>
        </main>
    )
}

export default UnknownChat;
